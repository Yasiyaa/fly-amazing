// Domain types shared by the seed data, the Supabase data layer and the UI.

export type HotelTier = "comfort" | "superior" | "luxury";

export const HOTEL_TIERS: HotelTier[] = ["comfort", "superior", "luxury"];

export const TIER_LABELS: Record<HotelTier, string> = {
  comfort: "Comfort (3★)",
  superior: "Superior (4★)",
  luxury: "Luxury (5★ & boutique)",
};

export type TourTheme =
  | "culture"
  | "hill-country"
  | "wildlife"
  | "beach"
  | "wellness"
  | "honeymoon"
  | "family"
  | "adventure"
  | "day-tour";

export const THEME_LABELS: Record<TourTheme, string> = {
  culture: "Culture & heritage",
  "hill-country": "Hill country & tea",
  wildlife: "Wildlife & safari",
  beach: "Beaches",
  wellness: "Ayurveda & wellness",
  honeymoon: "Honeymoon",
  family: "Family",
  adventure: "Adventure",
  "day-tour": "Day tours",
};

export interface Destination {
  id: string;
  name: string;
  region: string;
  tagline: string;
  description: string;
  recommendedNights: number;
  bannerImage: string;
  thumbnail: string;
  video?: string;
  highlights: string[];
  travelTips: string;
  sortOrder: number;
}

export interface Hotel {
  id: string;
  name: string;
  destinationId: string;
  tier: HotelTier;
  category: string;
  stars: number;
  /** Indicative double-room rate. Confirmed with each quote. */
  pricePerNightUSD: number;
  /** Real property photo uploaded by staff; empty falls back to the destination photo. */
  image: string;
  amenities: string[];
  roomType: string;
  distanceToHighlight: string;
  description: string;
  badge?: string;
}

export interface TourDay {
  day: number;
  title: string;
  destinationId: string;
  description: string;
  driveTime?: string;
  overnight: string;
  meals: string;
}

export interface Tour {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  kind: "tour" | "day";
  durationDays: number;
  themes: TourTheme[];
  route: string[];
  destinationIds: string[];
  bestSeason: string;
  /** Months (1–12) when the route is at its best; drives season hints in the UI and planner. */
  seasonMonths: number[];
  /** Per person, twin share, for two travellers, by hotel tier (USD). */
  prices: Record<HotelTier, number>;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  heroImage: string;
  gallery: string[];
  video?: string;
  badge?: string;
  featured: boolean;
  sortOrder: number;
  days: TourDay[];
}

export type BookingStatus = "requested" | "confirmed" | "deposit_paid" | "paid" | "completed" | "cancelled";

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  deposit_paid: "Deposit paid",
  paid: "Paid in full",
  completed: "Completed",
  cancelled: "Cancelled",
};

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string[];
  sltdaLicence: string;
  heroVideos: { url: string; poster: string; label: string }[];
}
