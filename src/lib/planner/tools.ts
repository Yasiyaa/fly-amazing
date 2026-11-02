import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { getDestinations, getHotels, getTours } from "@/lib/catalog";
import { getPublicClient } from "@/lib/supabase/clients";
import { quoteTour, estimateCustomTrip, defaultVehicle, VEHICLES, type VehicleId } from "@/lib/pricing";
import { THEME_LABELS, type TourTheme } from "@/lib/types";

// Tools the AI planner can call. Every price, hotel and tour it mentions must come from these,
// which read the same catalogue and pricing rules as the website.

const THEMES = Object.keys(THEME_LABELS) as TourTheme[];
const VEHICLE_IDS = VEHICLES.map((v) => v.id) as [VehicleId, ...VehicleId[]];

export const PLANNER_TOOLS: Anthropic.Beta.BetaTool[] = [
  {
    name: "search_tours",
    description:
      "Search our published Sri Lanka tours. Returns title, slug, length, themes, route, best season and per-person prices by hotel tier (USD, two travellers sharing). Use it before recommending any tour.",
    input_schema: {
      type: "object",
      properties: {
        theme: { type: "string", enum: THEMES, description: "Optional theme filter." },
        min_days: { type: "integer", minimum: 1, maximum: 30 },
        max_days: { type: "integer", minimum: 1, maximum: 30 },
        month: { type: "integer", minimum: 1, maximum: 12, description: "Travel month (1-12). Returns only tours at their best that month." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_tour",
    description: "Get one tour's full day-by-day itinerary, drive times, inclusions and prices by slug.",
    input_schema: {
      type: "object",
      properties: { slug: { type: "string" } },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "list_destinations",
    description:
      "List destinations with region, recommended nights, highlights, local tips and the example hotels we use there (id, name, tier, indicative nightly room rate in USD). Use it to build custom routes.",
    input_schema: {
      type: "object",
      properties: { region: { type: "string", description: "Optional region name, e.g. 'Hill Country' or 'South Coast'." } },
      additionalProperties: false,
    },
  },
  {
    name: "check_dates",
    description:
      "Check a start date or month: returns any dates we have blocked and which regions are in season. Use it whenever the traveller gives dates.",
    input_schema: {
      type: "object",
      properties: {
        start_date: { type: "string", description: "YYYY-MM-DD, optional." },
        month: { type: "integer", minimum: 1, maximum: 12 },
        tour_slug: { type: "string" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "price_tour",
    description: "Price one of our published tours for a group. Returns per-adult, per-child, total and deposit in USD.",
    input_schema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        tier: { type: "string", enum: ["comfort", "superior", "luxury"] },
        adults: { type: "integer", minimum: 1, maximum: 30 },
        children: { type: "integer", minimum: 0, maximum: 30 },
        start_date: { type: "string", description: "YYYY-MM-DD, optional." },
      },
      required: ["slug", "tier", "adults"],
      additionalProperties: false,
    },
  },
  {
    name: "draft_itinerary",
    description:
      "Create a priced custom itinerary from destinations, nights and optional hotels. The traveller sees it as a card with a 'Request to book' button. Call it once the route is agreed. Stops are visited in order; the trip starts and ends at Colombo airport.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Short name, e.g. '10 days: culture, tea and beaches'." },
        summary: { type: "string", description: "One or two sentences on why this route suits them." },
        stops: {
          type: "array",
          minItems: 1,
          maxItems: 15,
          items: {
            type: "object",
            properties: {
              destination_id: { type: "string" },
              nights: { type: "integer", minimum: 1, maximum: 14 },
              hotel_id: { type: "string", description: "Optional hotel id from list_destinations." },
              plan: { type: "string", description: "One line on what they'll do there." },
            },
            required: ["destination_id", "nights"],
            additionalProperties: false,
          },
        },
        adults: { type: "integer", minimum: 1, maximum: 30 },
        children: { type: "integer", minimum: 0, maximum: 30 },
        vehicle: { type: "string", enum: VEHICLE_IDS },
        start_date: { type: "string", description: "YYYY-MM-DD, optional." },
      },
      required: ["title", "stops", "adults"],
      additionalProperties: false,
    },
  },
];

const searchToursInput = z.object({
  theme: z.enum(THEMES as [TourTheme, ...TourTheme[]]).optional(),
  min_days: z.number().int().optional(),
  max_days: z.number().int().optional(),
  month: z.number().int().min(1).max(12).optional(),
});
const getTourInput = z.object({ slug: z.string().max(120) });
const listDestinationsInput = z.object({ region: z.string().max(60).optional() });
const checkDatesInput = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  month: z.number().int().min(1).max(12).optional(),
  tour_slug: z.string().max(120).optional(),
});
const priceTourInput = z.object({
  slug: z.string().max(120),
  tier: z.enum(["comfort", "superior", "luxury"]),
  adults: z.number().int().min(1).max(30),
  children: z.number().int().min(0).max(30).optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
const draftInput = z.object({
  title: z.string().max(120),
  summary: z.string().max(600).optional(),
  stops: z
    .array(
      z.object({
        destination_id: z.string().max(60),
        nights: z.number().int().min(1).max(14),
        hotel_id: z.string().max(80).optional(),
        plan: z.string().max(300).optional(),
      })
    )
    .min(1)
    .max(15),
  adults: z.number().int().min(1).max(30),
  children: z.number().int().min(0).max(30).optional(),
  vehicle: z.enum(VEHICLE_IDS).optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export interface DraftItinerary {
  title: string;
  summary: string;
  adults: number;
  children: number;
  vehicle: VehicleId;
  startDate: string | null;
  stops: { destinationId: string; destinationName: string; nights: number; hotelId: string | null; hotelName: string | null; plan: string }[];
  estimate: ReturnType<typeof estimateCustomTrip>;
}

export type ToolOutcome = { content: string; isError?: boolean; itinerary?: DraftItinerary };

const SEASON_NOTES: Record<string, string> = {
  "west-south": "West and south coasts (Colombo, Galle, Mirissa, Bentota, Tangalle) are best December to April; May to September brings the south-west monsoon.",
  east: "East coast (Trincomalee, Pasikudah, Arugam Bay) is best May to September; October to January is its rainy season.",
  hills: "Hill country (Kandy, Nuwara Eliya, Ella) can be visited all year; January to April is driest, with afternoon showers likely May to September and October to December.",
  culture: "The Cultural Triangle (Sigiriya, Anuradhapura, Polonnaruwa) is good most of the year; driest January to September.",
  yala: "Yala National Park usually closes for part of September and early October.",
};

function err(message: string): ToolOutcome {
  return { content: JSON.stringify({ error: message }), isError: true };
}

export async function runPlannerTool(name: string, rawInput: unknown): Promise<ToolOutcome> {
  switch (name) {
    case "search_tours": {
      const p = searchToursInput.safeParse(rawInput);
      if (!p.success) return err("Invalid input for search_tours.");
      const tours = (await getTours()).filter(
        (t) =>
          (!p.data.theme || t.themes.includes(p.data.theme)) &&
          (!p.data.min_days || t.durationDays >= p.data.min_days) &&
          (!p.data.max_days || t.durationDays <= p.data.max_days) &&
          (!p.data.month || t.seasonMonths.includes(p.data.month))
      );
      return {
        content: JSON.stringify(
          tours.map((t) => ({
            slug: t.slug,
            title: t.title,
            days: t.durationDays,
            kind: t.kind,
            themes: t.themes,
            route: t.route,
            best_season: t.bestSeason,
            price_per_person_usd: t.prices,
            tagline: t.tagline,
            url: `/tours/${t.slug}`,
          }))
        ),
      };
    }
    case "get_tour": {
      const p = getTourInput.safeParse(rawInput);
      if (!p.success) return err("Invalid input for get_tour.");
      const tour = (await getTours()).find((t) => t.slug === p.data.slug);
      if (!tour) return err(`No published tour with slug "${p.data.slug}". Use search_tours to find valid slugs.`);
      return {
        content: JSON.stringify({
          ...tour,
          gallery: undefined,
          heroImage: undefined,
          video: undefined,
          url: `/tours/${tour.slug}`,
        }),
      };
    }
    case "list_destinations": {
      const p = listDestinationsInput.safeParse(rawInput);
      if (!p.success) return err("Invalid input for list_destinations.");
      const [destinations, hotels] = await Promise.all([getDestinations(), getHotels()]);
      const region = p.data.region?.toLowerCase();
      return {
        content: JSON.stringify(
          destinations
            .filter((d) => !region || d.region.toLowerCase().includes(region))
            .map((d) => ({
              id: d.id,
              name: d.name,
              region: d.region,
              recommended_nights: d.recommendedNights,
              highlights: d.highlights,
              tip: d.travelTips,
              hotels: hotels
                .filter((h) => h.destinationId === d.id)
                .map((h) => ({ id: h.id, name: h.name, tier: h.tier, stars: h.stars, nightly_room_usd: h.pricePerNightUSD })),
            }))
        ),
      };
    }
    case "check_dates": {
      const p = checkDatesInput.safeParse(rawInput);
      if (!p.success) return err("Invalid input for check_dates.");
      const month = p.data.month ?? (p.data.start_date ? Number(p.data.start_date.slice(5, 7)) : undefined);
      let blocked: { starts_on: string; ends_on: string; reason: string; tour_slug: string | null }[] = [];
      const db = getPublicClient();
      if (db) {
        const { data } = await db.from("availability_blocks").select("starts_on, ends_on, reason, tour_slug").gte("ends_on", new Date().toISOString().slice(0, 10));
        blocked = (data ?? []).filter((b) => !p.data.tour_slug || !b.tour_slug || b.tour_slug === p.data.tour_slug);
      }
      const today = new Date().toISOString().slice(0, 10);
      return {
        content: JSON.stringify({
          today,
          start_date_in_past: p.data.start_date ? p.data.start_date < today : undefined,
          blocked_periods: blocked,
          month,
          seasons: SEASON_NOTES,
          note: "Tours are private and can start any day not listed as blocked. A specialist confirms hotels and guides.",
        }),
      };
    }
    case "price_tour": {
      const p = priceTourInput.safeParse(rawInput);
      if (!p.success) return err("Invalid input for price_tour.");
      const tour = (await getTours()).find((t) => t.slug === p.data.slug);
      if (!tour) return err(`No published tour with slug "${p.data.slug}".`);
      const quote = quoteTour(tour, { tier: p.data.tier, adults: p.data.adults, children: p.data.children ?? 0, startDate: p.data.start_date });
      return {
        content: JSON.stringify({
          tour: tour.title,
          tier: p.data.tier,
          per_adult_usd: quote.perAdultUSD,
          per_child_usd: quote.perChildUSD,
          total_usd: quote.totalUSD,
          deposit_usd: quote.depositUSD,
          pay_in_full: quote.payInFull,
          book_url: `/book/${tour.slug}?tier=${p.data.tier}&adults=${p.data.adults}&children=${p.data.children ?? 0}`,
        }),
      };
    }
    case "draft_itinerary": {
      const p = draftInput.safeParse(rawInput);
      if (!p.success) return err("Invalid input for draft_itinerary. Use destination ids and hotel ids from list_destinations.");
      const [destinations, hotels] = await Promise.all([getDestinations(), getHotels()]);
      const stops: DraftItinerary["stops"] = [];
      for (const s of p.data.stops) {
        const d = destinations.find((x) => x.id === s.destination_id);
        if (!d) return err(`Unknown destination_id "${s.destination_id}". Call list_destinations for valid ids.`);
        const h = s.hotel_id ? hotels.find((x) => x.id === s.hotel_id && x.destinationId === d.id) : undefined;
        if (s.hotel_id && !h) return err(`Hotel "${s.hotel_id}" isn't one of our options in ${d.name}.`);
        stops.push({ destinationId: d.id, destinationName: d.name, nights: s.nights, hotelId: h?.id ?? null, hotelName: h?.name ?? null, plan: s.plan ?? "" });
      }
      const adults = p.data.adults;
      const children = p.data.children ?? 0;
      const vehicle = p.data.vehicle && VEHICLES.find((v) => v.id === p.data.vehicle)!.maxTravellers >= adults + children ? p.data.vehicle : defaultVehicle(adults + children);
      const estimate = estimateCustomTrip({
        stops: stops.map((s) => ({ nights: s.nights, nightlyUSD: s.hotelId ? hotels.find((h) => h.id === s.hotelId)?.pricePerNightUSD : null })),
        adults,
        children,
        vehicle,
      });
      const itinerary: DraftItinerary = {
        title: p.data.title,
        summary: p.data.summary ?? "",
        adults,
        children,
        vehicle,
        startDate: p.data.start_date ?? null,
        stops,
        estimate,
      };
      return {
        content: JSON.stringify({
          shown_to_traveller: true,
          days: estimate.days,
          nights: estimate.nights,
          total_usd: estimate.totalUSD,
          per_person_usd: estimate.perPersonUSD,
          deposit_usd: estimate.depositUSD,
          note: "The traveller now sees this itinerary as a card with a 'Request to book' button. Summarise it briefly; don't repeat every line.",
        }),
        itinerary,
      };
    }
    default:
      return err(`Unknown tool ${name}.`);
  }
}
