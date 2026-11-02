import type { HotelTier, Tour } from "./types";

// Pricing rules (USD). Tour prices are per person, twin share, for two travellers.
// Larger groups share the vehicle and guide, so the per-person price drops; a solo traveller pays
// a single supplement. Children (2–11) pay a share of the adult price; infants travel free.
export const GROUP_FACTORS: { minAdults: number; factor: number }[] = [
  { minAdults: 6, factor: 0.85 },
  { minAdults: 4, factor: 0.9 },
  { minAdults: 2, factor: 1 },
  { minAdults: 1, factor: 1.6 },
];
export const CHILD_SHARE = 0.6;

export const DEPOSIT_RATE = 0.25;
/** Balance is due this many days before arrival; bookings closer than this pay in full. */
export const BALANCE_DUE_DAYS = 60;

export interface Quote {
  perAdultUSD: number;
  perChildUSD: number;
  totalUSD: number;
  depositUSD: number;
  payInFull: boolean;
}

export function groupFactor(adults: number) {
  return GROUP_FACTORS.find((g) => adults >= g.minAdults)?.factor ?? 1;
}

function round(n: number) {
  return Math.round(n);
}

export function quoteTour(
  tour: Pick<Tour, "prices" | "kind">,
  { tier, adults, children, startDate }: { tier: HotelTier; adults: number; children: number; startDate?: string | null }
): Quote {
  const base = tour.prices[tier];
  // Day tours are priced per person regardless of group size.
  const factor = tour.kind === "day" ? 1 : groupFactor(adults);
  const perAdultUSD = round(base * factor);
  const perChildUSD = round(perAdultUSD * CHILD_SHARE);
  const totalUSD = perAdultUSD * adults + perChildUSD * children;

  const daysUntil = startDate ? (new Date(startDate).getTime() - Date.now()) / 86_400_000 : Infinity;
  const payInFull = tour.kind === "day" || daysUntil < BALANCE_DUE_DAYS;
  const depositUSD = payInFull ? totalUSD : round(totalUSD * DEPOSIT_RATE);

  return { perAdultUSD, perChildUSD, totalUSD, depositUSD, payInFull };
}

// Custom trips (Tour Architect and AI planner). Land-only, USD, for the whole group.
export const VEHICLES = [
  { id: "car", label: "Private car", seats: "1–3 travellers", maxTravellers: 3, perDayUSD: 95 },
  { id: "suv", label: "4x4 SUV", seats: "1–4 travellers", maxTravellers: 4, perDayUSD: 125 },
  { id: "minivan", label: "Minivan", seats: "4–6 travellers", maxTravellers: 6, perDayUSD: 130 },
  { id: "van", label: "Large van", seats: "7–12 travellers", maxTravellers: 12, perDayUSD: 175 },
] as const;
export type VehicleId = (typeof VEHICLES)[number]["id"];

/** Used when a stop has no hotel selected yet (we propose one with the quote). */
export const FALLBACK_NIGHTLY_USD = 120;
/** Planning, entrance-fee handling and 24/7 support, as a share of the subtotal. */
export const SERVICE_RATE = 0.1;

export function defaultVehicle(travellers: number): VehicleId {
  return (VEHICLES.find((v) => travellers <= v.maxTravellers) ?? VEHICLES[VEHICLES.length - 1]).id;
}

export interface CustomEstimate {
  days: number;
  nights: number;
  rooms: number;
  accommodationUSD: number;
  transportUSD: number;
  serviceUSD: number;
  totalUSD: number;
  perPersonUSD: number;
  depositUSD: number;
}

export function estimateCustomTrip({
  stops,
  adults,
  children,
  vehicle,
}: {
  stops: { nights: number; nightlyUSD?: number | null }[];
  adults: number;
  children: number;
  vehicle: VehicleId;
}): CustomEstimate {
  const nights = stops.reduce((n, s) => n + s.nights, 0);
  const days = nights + 1;
  const rooms = Math.max(1, Math.ceil(adults / 2));
  const accommodationUSD = stops.reduce((sum, s) => sum + (s.nightlyUSD ?? FALLBACK_NIGHTLY_USD) * s.nights * rooms, 0);
  const vehicleRate = VEHICLES.find((v) => v.id === vehicle)?.perDayUSD ?? VEHICLES[0].perDayUSD;
  const transportUSD = vehicleRate * days;
  const serviceUSD = Math.round((accommodationUSD + transportUSD) * SERVICE_RATE);
  const totalUSD = accommodationUSD + transportUSD + serviceUSD;
  const payingTravellers = adults + children * CHILD_SHARE;
  return {
    days,
    nights,
    rooms,
    accommodationUSD,
    transportUSD,
    serviceUSD,
    totalUSD,
    perPersonUSD: Math.round(totalUSD / payingTravellers),
    depositUSD: Math.round(totalUSD * DEPOSIT_RATE),
  };
}

/** Lowest per-person price shown as "from" on cards. */
export function fromPrice(tour: Pick<Tour, "prices">) {
  return Math.min(tour.prices.comfort, tour.prices.superior, tour.prices.luxury);
}
