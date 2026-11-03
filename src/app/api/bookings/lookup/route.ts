import { NextResponse } from "next/server";
import { firstError, lookupSchema } from "@/lib/validation";
import { getServiceClient } from "@/lib/supabase/clients";
import { clientIp, isSameOriginJson, rateLimit } from "@/lib/rateLimit";
import { BOOKING_STATUS_LABELS, type BookingStatus } from "@/lib/types";

export async function POST(request: Request) {
  if (!isSameOriginJson(request)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!rateLimit(`lookup:${clientIp(request)}`, 10, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  const parsed = lookupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });

  const db = getServiceClient();
  if (!db) {
    return NextResponse.json({ error: "Online booking lookup isn't available yet. Please email us your reference." }, { status: 503 });
  }

  const { data, error } = await db
    .from("bookings")
    .select("reference, tour_title, start_date, adults, children, status, price_total_usd, deposit_usd, created_at")
    .eq("reference", parsed.data.reference)
    .eq("email", parsed.data.email.toLowerCase())
    .maybeSingle();

  if (error) {
    console.error("[api/bookings/lookup]", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  // Same message whether the reference or the email is wrong, so lookups can't probe references.
  if (!data) return NextResponse.json({ error: "We couldn't find a booking with that reference and email." }, { status: 404 });

  return NextResponse.json({
    reference: data.reference,
    tourTitle: data.tour_title,
    startDate: data.start_date,
    adults: data.adults,
    children: data.children,
    status: data.status,
    statusLabel: BOOKING_STATUS_LABELS[data.status as BookingStatus] ?? data.status,
    totalUSD: Number(data.price_total_usd),
    depositUSD: Number(data.deposit_usd),
    createdAt: data.created_at,
  });
}
