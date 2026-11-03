# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`AGENTS.md` is the canonical guardrails file (stack, directory map, invariants). Read it first; this file adds what it doesn't cover. The relaunch spec and market research live in `docs/spec.md` and `docs/research/`.

## Commands

On Windows PowerShell use `npm.cmd` / `npx.cmd` (execution policy blocks the `.ps1` shims).

- `npm.cmd run dev` – dev server on http://localhost:3000
- `npm.cmd run build` – production build (also the strictest type/lint gate)
- `npm.cmd run lint` – `next lint` (eslint-config-next)
- `npx.cmd tsc --noEmit` – type check
- `node --env-file=.env.local scripts/seed.mjs` – upsert the bundled catalogue into Supabase (Node's type stripping loads the `.ts` seed files directly, so seed files may only use `import type` and relative paths)

There is no test framework. Verify changes by building and by driving the page in the browser.

## Commits

Do not add a `Co-Authored-By` trailer (Claude or anyone else) to commits in this repo. The Vercel project is on the Hobby plan, which blocks deploys of co-authored commits from a private repo.

## Architecture

- **Data layer with fallback.** `src/lib/catalog.ts` reads published tours, destinations, hotels, site settings and FX rates from Supabase (anon key, row-level security). If Supabase isn't configured or a query fails it returns the bundled data in `src/data/seed/`, so the public site always renders. Pages are Server Components with `revalidate = 300`; admin actions call `revalidatePath("/", "layout")` after edits.
- **Three Supabase clients** (`src/lib/supabase/`): `getPublicClient` (anon, catalogue reads), `getServiceClient` (service role, server-only inserts for bookings, enquiries and chat logs; bypasses RLS, so only use it with validated input), and `getSessionClient` / `getBrowserClient` (signed-in staff, RLS enforced). Staff are an allow-list table; `is_staff()` backs every staff policy.
- **Pricing is server-authoritative.** `src/lib/pricing.ts` holds every rule: tour prices per person by hotel tier for two sharing, group factors (1 pax ×1.6, 4+ ×0.9, 6+ ×0.85), children at 60%, 25% deposit with the balance 60 days out, and the custom-trip formula (hotel nights × rooms + vehicle per day + 10% service). The browser shows the same maths, but `src/lib/bookings.ts` recomputes on the server and ignores client prices.
- **Bookings and enquiries:** `POST /api/bookings` (tour, custom or planner kinds, discriminated Zod schema in `src/lib/validation.ts`) and `POST /api/enquiries`. Both rate-limit per IP, have a honeypot field, store via the service client when available, and email traveller + team through `src/lib/emailService.ts` (SMTP optional; logs otherwise; all user input goes through `esc()`). `/api/bookings/lookup` returns status only for a matching reference + email.
- **AI planner:** `POST /api/chat` streams NDJSON events (`session`, `text`, `tool`, `itinerary`, `error`, `done`) from a manual tool loop on `claude-opus-5-5` (effort low, `fallbacks: "default"`, cached system prompt built from the catalogue in `src/lib/planner/prompt.ts`). Tools in `src/lib/planner/tools.ts` read the same catalogue and pricing; inputs are Zod-validated because `eager_input_streaming` is on. The model never collects personal details: `draft_itinerary` produces a card whose "Request to book" form posts to `/api/bookings` directly. Limits: 20 messages/10 min per IP in memory, 80/day per hashed IP in the DB, 40 per conversation, 6 tool rounds per turn. Client history is plain text only; thinking and tool blocks are never replayed across turns.
- **Admin** (`/admin`, route group `(panel)`): middleware refreshes the Supabase session and redirects signed-out users; the panel layout and every server action in `src/app/admin/actions.ts` re-check staff. Media uploads go browser → Supabase Storage (`media` bucket, staff-only writes, 50 MB limit) and are then recorded in `media_assets`.
- **Global chrome:** `layout.tsx` loads fonts via `next/font`, fetches site settings and FX rates, and wraps the app in `SiteSettingsProvider`, `CurrencyProvider` (display-only conversion, `≈` prefix) and Lenis. `ChatWidget` floats on public pages (hidden on `/plan`, `/admin`, `/book`). `template.tsx` plays the intro curtain once per session.
- **Old URLs** (`/packages/*`, `/flights`) redirect permanently in `next.config.mjs`.

## Styling and media

- Use the design-system classes in `globals.css` (`container-page`, `section`, `eyebrow`, `heading-section`, `btn-*`, `card`, `panel`, `chip`, `filter-pill-*`, `field-*`) and the building blocks in `src/components/ui/` (`PageHero` with optional video, `SectionHeader`, `TourCard`, `Field`, `LazyVideo`).
- Layout gotchas: give every CSS grid a base `grid-cols-1`, keep `position: fixed` panels outside elements with `backdrop-filter`, and don't name a React prop `children` unless it is children.
- Brand: `fly-navy`, `fly-cyan`, `fly-orange` palettes in `tailwind.config.ts`; Outfit for headings, Plus Jakarta Sans for text. The logo is an interim text wordmark (`src/components/layout/Logo.tsx`) until the client supplies one.
- **Every photo and video must show Sri Lanka and match its caption.** Hotel cards use the destination photo until staff upload real property photos; never pair a real hotel's name with a stock photo of another hotel, and never invent reviews or ratings. The client's `public/videos/wildlife-elephant.mp4` appears to show an African elephant, so the site uses verified Sri Lankan elephant footage instead.
- Videos: serve the compressed copies in `public/videos/web/` (1080p H.264, no audio, faststart; posters in `public/images/posters/`), not the large originals in `public/videos/`. Use `LazyVideo` below the fold; it respects reduced motion and Save-Data.
- Customer-facing copy must never show the admin notification email.
