"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSessionClient, getStaffUser } from "@/lib/supabase/session";
import { sendStatusEmail } from "@/lib/emailService";
import { BOOKING_STATUS_LABELS, type BookingStatus } from "@/lib/types";
import { rateLimit } from "@/lib/rateLimit";

// Every action re-checks that the caller is signed-in staff. Row-level security on the session
// client is a second layer: a non-staff session can't read or write these tables anyway.

export type ActionState = { ok?: boolean; error?: string; message?: string };

async function requireStaff() {
  const staff = await getStaffUser();
  const db = getSessionClient();
  if (!staff || !db) throw new Error("Not authorised");
  return { staff, db };
}

function fail(error: unknown): ActionState {
  console.error("[admin action]", error);
  return { error: error instanceof Error ? error.message : "Something went wrong." };
}

/**
 * Media links saved from admin must be our own files (`/images/...`, `/videos/...`) or https URLs
 * on hosts the site can serve. Anything else would break pages (next/image rejects unknown hosts)
 * or smuggle in javascript:/data: URLs.
 */
const MEDIA_HOSTS = new Set(["images.unsplash.com", "plus.unsplash.com", "images.pexels.com", "assets.mixkit.co"]);
function supabaseHost() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").host;
  } catch {
    return "";
  }
}
function isAllowedMediaUrl(value: string) {
  if (/^\/(?![/\\])[\w\-./]+$/.test(value) && !value.includes("..")) return true;
  try {
    const u = new URL(value);
    return u.protocol === "https:" && (MEDIA_HOSTS.has(u.host) || (u.host === supabaseHost() && u.pathname.startsWith("/storage/v1/object/public/media/")));
  } catch {
    return false;
  }
}
const mediaUrl = (label: string) =>
  z.string().trim().max(1000).refine((v) => v === "" || isAllowedMediaUrl(v), `${label} must be a Media library link or an Unsplash/Pexels/Mixkit https link.`);

/** Public pages read the catalogue with a 5-minute cache; refresh them after edits. */
function refreshSite() {
  revalidatePath("/", "layout");
}

// --- Auth -------------------------------------------------------------------

export async function signIn(_: ActionState, formData: FormData): Promise<ActionState> {
  const db = getSessionClient();
  if (!db) return { error: "The database isn't configured yet." };
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 254);
  const password = String(formData.get("password") ?? "").slice(0, 200);
  // Sign-in runs on the server, so Supabase only sees our server's IP: throttle here per visitor and per account.
  const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`signin-ip:${ip}`, 10, 15 * 60_000) || !rateLimit(`signin-email:${email}`, 5, 15 * 60_000)) {
    return { error: "Too many sign-in attempts. Please wait 15 minutes and try again." };
  }
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email or password is incorrect." };
  const staff = await getStaffUser();
  if (!staff) {
    await db.auth.signOut();
    return { error: "This account doesn't have admin access." };
  }
  redirect("/admin");
}

export async function signOut() {
  await getSessionClient()?.auth.signOut();
  redirect("/admin/login");
}

// --- Bookings ---------------------------------------------------------------

const statusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["requested", "confirmed", "deposit_paid", "paid", "completed", "cancelled"]),
  adminNotes: z.string().max(4000).optional().default(""),
  notify: z.coerce.boolean().optional().default(false),
  message: z.string().max(2000).optional().default(""),
});

export async function updateBooking(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { db } = await requireStaff();
    const input = statusSchema.parse({
      id: formData.get("id"),
      status: formData.get("status"),
      adminNotes: formData.get("adminNotes") ?? "",
      notify: formData.get("notify") === "on",
      message: formData.get("message") ?? "",
    });
    const { data: booking, error } = await db
      .from("bookings")
      .update({ status: input.status, admin_notes: input.adminNotes })
      .eq("id", input.id)
      .select("reference, email, lead_name, tour_title")
      .single();
    if (error) throw error;
    if (input.notify) {
      await sendStatusEmail({
        reference: booking.reference,
        email: booking.email,
        leadName: booking.lead_name,
        tourTitle: booking.tour_title,
        statusLabel: BOOKING_STATUS_LABELS[input.status as BookingStatus],
        message: input.message || undefined,
      });
    }
    revalidatePath("/admin/bookings");
    return { ok: true, message: input.notify ? "Saved and emailed the traveller." : "Saved." };
  } catch (error) {
    return fail(error);
  }
}

export async function updateEnquiryStatus(formData: FormData) {
  const { db } = await requireStaff();
  const id = z.string().uuid().parse(formData.get("id"));
  const status = z.enum(["new", "replied", "closed"]).parse(formData.get("status"));
  await db.from("enquiries").update({ status }).eq("id", id);
  revalidatePath("/admin/enquiries");
}

// --- Tours ------------------------------------------------------------------

const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const daySchema = z.object({
  day: z.number().int().min(1),
  title: z.string().min(1).max(200),
  destination_id: z.string().max(60).nullable(),
  description: z.string().max(2000),
  drive_time: z.string().max(80).nullable(),
  overnight: z.string().max(120),
  meals: z.string().max(120),
});

export async function saveTour(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { db } = await requireStaff();
    const slug = z.string().regex(/^[a-z0-9-]+$/).parse(formData.get("slug"));
    const int = (k: string) => z.coerce.number().int().min(0).max(100000).parse(formData.get(k));
    const update = {
      title: z.string().min(3).max(160).parse(formData.get("title")),
      tagline: z.string().max(300).parse(formData.get("tagline") ?? ""),
      summary: z.string().max(3000).parse(formData.get("summary") ?? ""),
      best_season: z.string().max(80).parse(formData.get("bestSeason") ?? ""),
      badge: String(formData.get("badge") ?? "").trim() || null,
      price_comfort_usd: int("priceComfort"),
      price_superior_usd: int("priceSuperior"),
      price_luxury_usd: int("priceLuxury"),
      hero_image: mediaUrl("Main photo").parse(formData.get("heroImage") ?? ""),
      gallery: z.array(mediaUrl("Gallery link")).max(30).parse(lines(formData.get("gallery"))),
      video: mediaUrl("Video").parse(formData.get("video") ?? "") || null,
      highlights: lines(formData.get("highlights")),
      inclusions: lines(formData.get("inclusions")),
      exclusions: lines(formData.get("exclusions")),
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
    };
    const days = z.array(daySchema).max(30).parse(JSON.parse(String(formData.get("days") ?? "[]")));

    const { error } = await db.from("tours").update({ ...update, duration_days: Math.max(1, days.length) }).eq("slug", slug);
    if (error) throw error;
    const { error: delError } = await db.from("tour_days").delete().eq("tour_slug", slug);
    if (delError) throw delError;
    if (days.length) {
      const { error: dayError } = await db.from("tour_days").insert(days.map((d, i) => ({ ...d, day: i + 1, tour_slug: slug })));
      if (dayError) throw dayError;
    }
    refreshSite();
    return { ok: true, message: "Tour saved. The website updates within a few minutes." };
  } catch (error) {
    return fail(error);
  }
}

// --- Media ------------------------------------------------------------------

const mediaSchema = z.object({
  kind: z.enum(["image", "video"]),
  storagePath: z.string().regex(/^(images|videos)\/[a-z0-9][a-z0-9.-]{0,120}$/),
  url: z.string().url().max(1000),
  alt: z.string().max(300).default(""),
  tags: z.array(z.string().max(40)).max(20).default([]),
  bytes: z.number().int().nonnegative().optional(),
});

export async function recordMedia(input: z.input<typeof mediaSchema>): Promise<ActionState> {
  try {
    const { db, staff } = await requireStaff();
    const m = mediaSchema.parse(input);
    const { data: pub } = db.storage.from("media").getPublicUrl(m.storagePath);
    if (m.url !== pub.publicUrl) throw new Error("Unexpected media URL.");
    if ((m.kind === "video") !== m.storagePath.startsWith("videos/")) throw new Error("Unexpected media type.");
    const { error } = await db.from("media_assets").insert({
      kind: m.kind,
      storage_path: m.storagePath,
      url: m.url,
      alt: m.alt,
      tags: m.tags,
      bytes: m.bytes ?? null,
      created_by: staff.id,
    });
    if (error) throw error;
    revalidatePath("/admin/media");
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function updateMedia(formData: FormData) {
  const { db } = await requireStaff();
  const id = z.string().uuid().parse(formData.get("id"));
  await db
    .from("media_assets")
    .update({ alt: String(formData.get("alt") ?? "").slice(0, 300), tags: lines(String(formData.get("tags") ?? "").replace(/,/g, "\n")) })
    .eq("id", id);
  revalidatePath("/admin/media");
}

export async function deleteMedia(formData: FormData) {
  const { db } = await requireStaff();
  const id = z.string().uuid().parse(formData.get("id"));
  const { data } = await db.from("media_assets").select("storage_path").eq("id", id).single();
  if (data?.storage_path) {
    const { error } = await db.storage.from("media").remove([data.storage_path]);
    if (error) throw new Error(`Couldn't delete the file: ${error.message}`);
  }
  await db.from("media_assets").delete().eq("id", id);
  revalidatePath("/admin/media");
}

// --- Site settings ------------------------------------------------------------

export async function saveSettings(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { db } = await requireStaff();
    const contact = {
      phone: z.string().max(40).parse(formData.get("phone") ?? ""),
      whatsapp: z.string().max(40).parse(formData.get("whatsapp") ?? ""),
      email: z.string().email().parse(formData.get("email")),
      address: lines(formData.get("address")).slice(0, 5),
      sltdaLicence: z.string().max(60).parse(formData.get("sltdaLicence") ?? ""),
    };
    const heroVideos = z
      .array(z.object({ url: mediaUrl("Video link"), poster: mediaUrl("Poster image"), label: z.string().max(120) }))
      .max(8)
      .parse(JSON.parse(String(formData.get("heroVideos") ?? "[]")))
      .filter((v) => v.url);
    const { error } = await db.from("site_settings").upsert(
      [
        { key: "contact", value: contact },
        { key: "hero_videos", value: heroVideos },
      ],
      { onConflict: "key" }
    );
    if (error) throw error;
    refreshSite();
    return { ok: true, message: "Settings saved." };
  } catch (error) {
    return fail(error);
  }
}
