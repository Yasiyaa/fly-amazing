// Seeds (or re-syncs) the Supabase catalogue from the bundled data in src/data/seed.
// Usage: node --env-file=.env.local scripts/seed.mjs
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. Safe to re-run: rows are upserted.
import { createClient } from "@supabase/supabase-js";
import { DESTINATIONS } from "../src/data/seed/destinations.ts";
import { HOTELS } from "../src/data/seed/hotels.ts";
import { TOURS } from "../src/data/seed/tours.ts";
import { DEFAULT_SETTINGS } from "../src/lib/site.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (e.g. in .env.local).");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

async function upsert(table, rows, onConflict) {
  const { error } = await db.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`  ${table}: ${rows.length} rows`);
}

console.log("Seeding catalogue…");

await upsert(
  "destinations",
  DESTINATIONS.map((d) => ({
    id: d.id,
    name: d.name,
    region: d.region,
    tagline: d.tagline,
    description: d.description,
    recommended_nights: d.recommendedNights,
    banner_image: d.bannerImage,
    thumbnail: d.thumbnail,
    video: d.video ?? null,
    highlights: d.highlights,
    travel_tips: d.travelTips,
    sort_order: d.sortOrder,
    published: true,
  })),
  "id"
);

await upsert(
  "hotels",
  HOTELS.map((h, i) => ({
    id: h.id,
    name: h.name,
    destination_id: h.destinationId,
    tier: h.tier,
    category: h.category,
    stars: h.stars,
    price_per_night_usd: h.pricePerNightUSD,
    image: h.image,
    amenities: h.amenities,
    room_type: h.roomType,
    distance_to_highlight: h.distanceToHighlight,
    description: h.description,
    badge: h.badge ?? null,
    sort_order: i,
    published: true,
  })),
  "id"
);

await upsert(
  "tours",
  TOURS.map((t) => ({
    slug: t.slug,
    title: t.title,
    tagline: t.tagline,
    summary: t.summary,
    kind: t.kind,
    duration_days: t.durationDays,
    themes: t.themes,
    route: t.route,
    destination_ids: t.destinationIds,
    best_season: t.bestSeason,
    season_months: t.seasonMonths,
    price_comfort_usd: t.prices.comfort,
    price_superior_usd: t.prices.superior,
    price_luxury_usd: t.prices.luxury,
    highlights: t.highlights,
    inclusions: t.inclusions,
    exclusions: t.exclusions,
    hero_image: t.heroImage,
    gallery: t.gallery,
    video: t.video ?? null,
    badge: t.badge ?? null,
    featured: t.featured,
    published: true,
    sort_order: t.sortOrder,
  })),
  "slug"
);

for (const t of TOURS) {
  const { error } = await db.from("tour_days").delete().eq("tour_slug", t.slug);
  if (error) throw new Error(`tour_days delete: ${error.message}`);
}
await upsert(
  "tour_days",
  TOURS.flatMap((t) =>
    t.days.map((d) => ({
      tour_slug: t.slug,
      day: d.day,
      title: d.title,
      destination_id: d.destinationId || null,
      description: d.description,
      drive_time: d.driveTime ?? null,
      overnight: d.overnight,
      meals: d.meals,
    }))
  ),
  "tour_slug,day"
);

await upsert(
  "site_settings",
  [
    {
      key: "contact",
      value: {
        phone: DEFAULT_SETTINGS.phone,
        whatsapp: DEFAULT_SETTINGS.whatsapp,
        email: DEFAULT_SETTINGS.email,
        address: DEFAULT_SETTINGS.address,
        sltdaLicence: DEFAULT_SETTINGS.sltdaLicence,
      },
    },
    { key: "hero_videos", value: DEFAULT_SETTINGS.heroVideos },
  ],
  "key"
);

console.log("Done.");
