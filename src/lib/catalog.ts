import "server-only";
import { cache } from "react";
import { getPublicClient } from "./supabase/clients";
import { DESTINATIONS } from "@/data/seed/destinations";
import { HOTELS } from "@/data/seed/hotels";
import { TOURS } from "@/data/seed/tours";
import { DEFAULT_SETTINGS } from "./site";
import type { Destination, Hotel, SiteSettings, Tour, TourDay, TourTheme, HotelTier } from "./types";

// Catalogue access. Reads published rows from Supabase when it is configured; otherwise (local
// dev, preview builds, or a database error) falls back to the bundled seed data so the public site
// always renders. An empty result is respected (e.g. staff unpublished everything): once the
// database is configured, seed it with scripts/seed.mjs.

type Row = Record<string, any>;

function mapDestination(r: Row): Destination {
  return {
    id: r.id,
    name: r.name,
    region: r.region,
    tagline: r.tagline,
    description: r.description,
    recommendedNights: r.recommended_nights,
    bannerImage: r.banner_image,
    thumbnail: r.thumbnail || r.banner_image,
    video: r.video ?? undefined,
    highlights: r.highlights ?? [],
    travelTips: r.travel_tips,
    sortOrder: r.sort_order,
  };
}

function mapHotel(r: Row): Hotel {
  return {
    id: r.id,
    name: r.name,
    destinationId: r.destination_id,
    tier: r.tier as HotelTier,
    category: r.category,
    stars: r.stars,
    pricePerNightUSD: r.price_per_night_usd,
    image: r.image,
    amenities: r.amenities ?? [],
    roomType: r.room_type,
    distanceToHighlight: r.distance_to_highlight,
    description: r.description,
    badge: r.badge ?? undefined,
  };
}

function mapDay(r: Row): TourDay {
  return {
    day: r.day,
    title: r.title,
    destinationId: r.destination_id ?? "",
    description: r.description,
    driveTime: r.drive_time ?? undefined,
    overnight: r.overnight,
    meals: r.meals,
  };
}

function mapTour(r: Row): Tour {
  const days: Row[] = r.tour_days ?? [];
  return {
    slug: r.slug,
    title: r.title,
    tagline: r.tagline,
    summary: r.summary,
    kind: r.kind,
    durationDays: r.duration_days,
    themes: (r.themes ?? []) as TourTheme[],
    route: r.route ?? [],
    destinationIds: r.destination_ids ?? [],
    bestSeason: r.best_season,
    seasonMonths: r.season_months ?? [],
    prices: { comfort: r.price_comfort_usd, superior: r.price_superior_usd, luxury: r.price_luxury_usd },
    highlights: r.highlights ?? [],
    inclusions: r.inclusions ?? [],
    exclusions: r.exclusions ?? [],
    heroImage: r.hero_image,
    gallery: r.gallery ?? [],
    video: r.video ?? undefined,
    badge: r.badge ?? undefined,
    featured: r.featured,
    sortOrder: r.sort_order,
    days: days.map(mapDay).sort((a, b) => a.day - b.day),
  };
}

async function fromDb<T>(label: string, run: () => Promise<T | null>, fallback: T): Promise<T> {
  try {
    const result = await run();
    return result ?? fallback;
  } catch (error) {
    console.error(`[catalog] ${label} failed, using bundled data:`, error);
    return fallback;
  }
}

export const getTours = cache(async (): Promise<Tour[]> => {
  const db = getPublicClient();
  const seed = [...TOURS].sort((a, b) => a.sortOrder - b.sortOrder);
  if (!db) return seed;
  return fromDb(
    "getTours",
    async () => {
      const { data, error } = await db.from("tours").select("*, tour_days(*)").eq("published", true).order("sort_order");
      if (error) throw error;
      return (data ?? []).map(mapTour);
    },
    seed
  );
});

export const getTour = cache(async (slug: string): Promise<Tour | null> => {
  const tours = await getTours();
  return tours.find((t) => t.slug === slug) ?? null;
});

export const getDestinations = cache(async (): Promise<Destination[]> => {
  const db = getPublicClient();
  const seed = [...DESTINATIONS].sort((a, b) => a.sortOrder - b.sortOrder);
  if (!db) return seed;
  return fromDb(
    "getDestinations",
    async () => {
      const { data, error } = await db.from("destinations").select("*").eq("published", true).order("sort_order");
      if (error) throw error;
      return (data ?? []).map(mapDestination);
    },
    seed
  );
});

export const getHotels = cache(async (): Promise<Hotel[]> => {
  const db = getPublicClient();
  if (!db) return HOTELS;
  return fromDb(
    "getHotels",
    async () => {
      const { data, error } = await db.from("hotels").select("*").eq("published", true).order("sort_order");
      if (error) throw error;
      return (data ?? []).map(mapHotel);
    },
    HOTELS
  );
});

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const db = getPublicClient();
  if (!db) return DEFAULT_SETTINGS;
  return fromDb(
    "getSiteSettings",
    async () => {
      const { data, error } = await db.from("site_settings").select("key, value");
      if (error) throw error;
      const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
      return { ...DEFAULT_SETTINGS, ...(map.contact ?? {}), heroVideos: map.hero_videos ?? DEFAULT_SETTINGS.heroVideos };
    },
    DEFAULT_SETTINGS
  );
});

/** USD → currency rates. Static fallbacks are rough and only used until the daily refresh has run. */
export const FALLBACK_RATES: Record<string, number> = { USD: 1, GBP: 0.78, EUR: 0.92, AUD: 1.52, INR: 86 };

export const getFxRates = cache(async (): Promise<Record<string, number>> => {
  const db = getPublicClient();
  if (!db) return FALLBACK_RATES;
  return fromDb(
    "getFxRates",
    async () => {
      const { data, error } = await db.from("fx_rates").select("currency, rate");
      if (error) throw error;
      if (!data || data.length === 0) return null;
      return { ...FALLBACK_RATES, ...Object.fromEntries(data.map((r) => [r.currency, Number(r.rate)])) };
    },
    FALLBACK_RATES
  );
});
