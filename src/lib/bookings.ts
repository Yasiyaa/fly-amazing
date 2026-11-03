import "server-only";
import { randomInt } from "crypto";
import { getServiceClient } from "./supabase/clients";
import { getDestinations, getHotels, getTour } from "./catalog";
import { quoteTour, estimateCustomTrip, defaultVehicle, VEHICLES, type VehicleId } from "./pricing";
import { sendBookingEmails, sendEnquiryEmails } from "./emailService";
import { TIER_LABELS, type HotelTier } from "./types";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I/L

export function newReference(prefix = "AWT") {
  let code = "";
  for (let i = 0; i < 5; i++) code += ALPHABET[randomInt(ALPHABET.length)];
  return `${prefix}-${code}`;
}

type Contact = { name: string; email: string; phone: string; country?: string };

export type BookingInput =
  | (Contact & {
      kind: "tour";
      tourSlug: string;
      tier: HotelTier;
      adults: number;
      children: number;
      startDate: string;
      notes?: string;
      source?: string;
    })
  | (Contact & {
      kind: "custom" | "planner";
      title?: string;
      stops: { destinationId: string; nights: number; hotelId?: string }[];
      adults: number;
      children: number;
      vehicle?: string;
      startDate?: string | null;
      notes?: string;
      source?: string;
    });

export class BookingError extends Error {}

/**
 * Prices the request on the server from catalogue data (never from client-sent prices), stores it
 * when the database is configured, and emails the traveller and the team.
 */
export async function createBooking(input: BookingInput) {
  let row: Record<string, unknown>;
  let itineraryLines: string[] = [];
  let emailExtras: { tierLabel: string | null; totalUSD: number; depositUSD: number; payInFull: boolean };

  if (input.kind === "tour") {
    const tour = await getTour(input.tourSlug);
    if (!tour) throw new BookingError("That tour is no longer available.");
    const start = new Date(input.startDate);
    if (Number.isNaN(start.getTime()) || start.getTime() < Date.now() - 86_400_000) {
      throw new BookingError("Please choose a start date in the future.");
    }
    const quote = quoteTour(tour, { tier: input.tier, adults: input.adults, children: input.children, startDate: input.startDate });
    itineraryLines = tour.days.map((d) => `Day ${d.day}: ${d.title}`);
    emailExtras = { tierLabel: tour.kind === "day" ? null : TIER_LABELS[input.tier], totalUSD: quote.totalUSD, depositUSD: quote.depositUSD, payInFull: quote.payInFull };
    row = {
      kind: "tour",
      tour_slug: tour.slug,
      tour_title: tour.title,
      start_date: input.startDate,
      tier: input.tier,
      itinerary: null,
      price_total_usd: quote.totalUSD,
      deposit_usd: quote.depositUSD,
    };
  } else {
    const [destinations, hotels] = await Promise.all([getDestinations(), getHotels()]);
    const stops = input.stops.map((s) => {
      const destination = destinations.find((d) => d.id === s.destinationId);
      if (!destination) throw new BookingError("One of the destinations isn't available.");
      const hotel = s.hotelId ? hotels.find((h) => h.id === s.hotelId && h.destinationId === destination.id) : undefined;
      return { destination, hotel, nights: s.nights };
    });
    const vehicle: VehicleId = VEHICLES.some((v) => v.id === input.vehicle)
      ? (input.vehicle as VehicleId)
      : defaultVehicle(input.adults + input.children);
    const estimate = estimateCustomTrip({
      stops: stops.map((s) => ({ nights: s.nights, nightlyUSD: s.hotel?.pricePerNightUSD })),
      adults: input.adults,
      children: input.children,
      vehicle,
    });
    itineraryLines = stops.map(
      (s) => `${s.destination.name}: ${s.nights} night${s.nights === 1 ? "" : "s"}${s.hotel ? ` at ${s.hotel.name} (or similar)` : ""}`
    );
    const title = input.title?.trim() || `Custom tour: ${stops.map((s) => s.destination.name).join(", ")}`;
    emailExtras = { tierLabel: null, totalUSD: estimate.totalUSD, depositUSD: estimate.depositUSD, payInFull: false };
    row = {
      kind: input.kind,
      tour_slug: null,
      tour_title: title.slice(0, 200),
      start_date: input.startDate || null,
      tier: null,
      itinerary: {
        vehicle,
        stops: stops.map((s) => ({ destinationId: s.destination.id, destination: s.destination.name, nights: s.nights, hotelId: s.hotel?.id ?? null, hotel: s.hotel?.name ?? null })),
        estimate,
      },
      price_total_usd: estimate.totalUSD,
      deposit_usd: estimate.depositUSD,
    };
  }

  const base = {
    ...row,
    adults: input.adults,
    children: input.children,
    lead_name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone,
    country: input.country ?? "",
    notes: input.notes ?? "",
    source: input.source ?? "website",
  };

  const db = getServiceClient();
  let reference = newReference();
  let stored = false;
  if (db) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const { error } = await db.from("bookings").insert({ ...base, reference });
      if (!error) {
        stored = true;
        break;
      }
      if (error.code !== "23505") throw new Error(`Booking insert failed: ${error.message}`);
      reference = newReference();
    }
  } else {
    console.log(`[bookings] Database not configured. Booking ${reference} was emailed only.`);
  }

  await sendBookingEmails({
    reference,
    tourTitle: String(row.tour_title),
    tourSlug: (row.tour_slug as string | null) ?? null,
    leadName: input.name,
    email: input.email,
    phone: input.phone,
    country: input.country ?? "",
    startDate: (row.start_date as string | null) ?? null,
    adults: input.adults,
    children: input.children,
    notes: input.notes ?? "",
    itineraryLines,
    ...emailExtras,
  }).catch((e) => console.error("[bookings] email failed:", e));

  return { reference, stored, totalUSD: emailExtras.totalUSD, depositUSD: emailExtras.depositUSD };
}

export async function createEnquiry(input: { name: string; email: string; phone: string; message: string; source?: string }) {
  const db = getServiceClient();
  let reference = newReference("ENQ");
  if (db) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const { error } = await db.from("enquiries").insert({ ...input, email: input.email.toLowerCase(), source: input.source ?? "contact", reference });
      if (!error) break;
      if (error.code !== "23505") throw new Error(`Enquiry insert failed: ${error.message}`);
      reference = newReference("ENQ");
    }
  }
  await sendEnquiryEmails({ ...input, reference }).catch((e) => console.error("[enquiries] email failed:", e));
  return { reference };
}
