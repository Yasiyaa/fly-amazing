# Amazing World Travel: relaunch spec

Status: **draft for Gate 1 (owner approval)**. Branch: `global-relaunch`. Research: `docs/research/recon-2026-11.md`.

## 1. Goal

Turn the Australia-only "Fly Amazing" site into the global website of **Amazing World Travel**, a Colombo-based tour operator selling Sri Lanka tours to travellers worldwide. Five new capabilities on top of the polished front end:

1. A global audience: multi-currency pricing, world-wide contact details, no Australia-only flight booking.
2. A tour catalogue we design, stored in a database the client can edit.
3. A real booking system (pick a tour and date, price it, submit, track status).
4. An AI trip-planner chat that answers questions about our tours and drafts itineraries.
5. An admin area to upload images and videos and manage tours and bookings.

Photo and video appear across the whole site, not just the home hero.

**Contact details (from the client):** Amazing World Travel, Unit 94D, 75 Galle Road, Colombo 03, Sri Lanka · info@amazingworldtravel.com · www.amazingworldtravel.com

## 2. What changes on the current site

| Area | Today | After |
|---|---|---|
| Audience copy | "Australia to Sri Lanka", AUD, en-AU, 1300 number | Global copy, `en` locale, Colombo address, WhatsApp/phone TBC |
| Pricing | AUD, flights bundled | Land-only tour prices in **USD**, with a currency switcher (GBP, EUR, AUD, INR) using daily exchange rates. India is the largest source market (27% of 2025 arrivals), then the UK, Russia and Germany |
| Flights page | Australian departures + flight quote form | Retired. Replaced by a "Getting to Sri Lanka" section (airport transfer included, visa/ETA notes) |
| Tour Architect | Adds an Australian airfare | Prices the land tour only; can save as a booking request |
| Content source | Static TypeScript files in `src/data/` | Supabase database, seeded from today's data, editable in admin |
| Enquiry form | Email only | Booking requests and enquiries stored in the database **and** emailed |
| Media | Client's 4 videos in the hero, Unsplash elsewhere | Admin-managed media library; video sections throughout; every asset shows Sri Lanka and matches its caption |

## 3. Features

### 3.1 Tour catalogue
- Tours have: title, slug, theme(s), duration, route, day-by-day itinerary, inclusions/exclusions, hotel tier options (Comfort / Superior / Luxury) with per-person prices for 2, 4 and 6 travellers, gallery and video, season, status (draft/published).
- Destinations and hotels keep today's fields and gain media galleries.
- 8 to 10 tours, designed from the research (see section 6).

### 3.2 Booking system
Flow: tour page → choose start date, travellers, hotel tier, optional add-ons → live price summary → traveller details → submit.
- Every booking gets a reference (format to confirm, see decision 7), a confirmation email to the traveller and a notification to the team.
- Statuses: `requested → confirmed → deposit_paid → paid → completed`, or `cancelled`. Status changes email the traveller.
- Tours run as private tours on any date; admins can block dates (e.g. fully booked guides).
- Custom tours from the Tour Architect and itineraries drafted by the AI planner become booking requests too.
- **Payments:** phase 1 takes no card payments on the site. The team confirms each request and sends a payment link or bank details. Phase 2 adds online deposits through a payment gateway the client opens (see decision 2).

### 3.3 AI trip planner
- A chat bubble on every page plus a full-page planner at `/plan`. Streams responses.
- Built on the Claude API with tool use. The model only quotes tours and prices returned by tools, never invented ones.
- Tools: `search_tours`, `get_tour`, `list_destinations`, `check_availability`, `estimate_price`, `draft_itinerary` (returns a structured itinerary rendered as a card with "Request to book" / "Open in Tour Architect"), `create_booking_request` (only after the traveller confirms and gives contact details).
- Catalogue summary sits in a cached system prompt, so repeat turns are cheap.
- Guardrails: per-visitor rate limit, maximum turns and tokens per conversation, monthly spend cap set in the Anthropic console, stays on topic (travel in Sri Lanka), declines anything else politely.
- Conversations are stored for admin review, with a short privacy notice in the chat.
- Hands off to a human on WhatsApp at any point, and offers "Request to book" when an itinerary is ready.
- Model: `claude-opus-5-5` at low effort, with automatic refusal fallback enabled. Cheaper models are an option for you to choose (decision 4).
- **Rough cost per conversation** (estimate, ~10 turns with tool calls and a cached ~8k-token catalogue): Opus 5.5 about US$0.30–0.50; Sonnet 5.5 about US$0.15–0.25; Haiku 5.5 about US$0.01–0.03. The real figure gets measured in M5 before launch.

### 3.4 Admin area (`/admin`)
- Sign-in with Supabase Auth; only allow-listed staff accounts.
- **Media library:** upload images (auto-resized by `next/image`) and videos (size limit, poster image), tag them, and pick which media appears in the home hero, section backgrounds, tours and destinations.
- **Tours:** create, edit, publish/unpublish, reorder; edit itinerary days and prices.
- **Bookings and enquiries:** inbox with filters, status changes, internal notes, resend emails.
- **AI planner:** read conversations; see which tours people ask about.
- **Site settings:** contact details, WhatsApp number, hero media.

### 3.5 Media throughout
- Home: client's hero video cycle (current behaviour), video reel wall, video section breaks.
- Tours and destinations: hero video or photo, galleries with a lightbox.
- Performance rules: videos compressed to 1080p H.264 under ~8 MB with a poster image, lazy-loaded below the fold, paused when off-screen, replaced by the poster with reduced motion or Save-Data.
- Every stock asset must show Sri Lanka and match its caption (lesson from the polish pass). Client uploads take priority over stock.

## 4. Stack (existing stack kept)

- **Next.js 14 App Router, TypeScript, Tailwind** with the design system from the polish pass. No framework change.
- **Supabase** (new): Postgres for catalogue and bookings, Auth for admin sign-in, Storage for uploaded media. One service covers all three backend needs. Free tier is enough to start.
- **Anthropic TypeScript SDK** (new) for the planner, called only from server route handlers.
- **Email:** keep Nodemailer over SMTP (the existing "log instead of fail" fallback stays).
- **Exchange rates:** a free daily rates API, cached in the database; USD stays the base.
- **Hosting:** Vercel (see decision 5).

## 5. Data model (Supabase)

`destinations`, `hotels`, `tours`, `tour_days`, `tour_prices` (tour × hotel tier × group size), `media_assets`, `media_links` (asset ↔ tour/destination/slot), `availability_blocks`, `bookings`, `booking_travellers`, `enquiries`, `chat_sessions`, `chat_messages`, `fx_rates`, `site_settings`, `staff` (allow-list linked to Supabase Auth users).

Security: row-level security on every table. The public can read published catalogue rows and media only. All writes go through server route handlers or signed-in staff. The media bucket is public-read and staff-write. Booking, enquiry and chat endpoints are rate-limited and have bot protection on forms.

## 6. Tour catalogue

The research found every major operator sells the same themes, most trips run 9–14 nights, and the coasts have opposite seasons (west/south Dec–Apr, east May–Sep). Ten tours, prices in USD per person, twin share, Superior (4★) tier. Comfort and Luxury tiers are priced per tour. These prices are derived from competitor benchmarks, so the client must confirm them against real hotel and guide costs before launch.

| # | Tour | Days | From (USD pp) | Route / focus | Best season |
|---|---|---|---|---|---|
| 1 | The Grand Tour of Sri Lanka | 14 | 2,550 | Negombo, Sigiriya, Kandy, Nuwara Eliya, Ella, Yala, Galle, Colombo | Dec–Apr |
| 2 | Sri Lanka Highlights in a Week | 7 | 1,250 | Sigiriya, Kandy, Nuwara Eliya, Ella, Colombo | Year-round |
| 3 | Cultural Triangle & Hill Country | 10 | 1,850 | Anuradhapura, Polonnaruwa, Sigiriya, Dambulla, Kandy, Ella | Year-round |
| 4 | Leopards & Elephants Safari | 8 | 1,700 | Minneriya, Wilpattu, Udawalawe, Yala | Feb–Jul, Sep–Nov |
| 5 | Tea Country & Scenic Rail | 6 | 1,050 | Kandy, Nuwara Eliya, Ella by the blue train | Jan–Apr |
| 6 | Honeymoon: Hills & South Coast | 10 | 2,400 | Kandy, tea estate bungalow, Ella, Galle, Tangalle | Dec–Apr |
| 7 | Family Adventure | 10 | 1,750 | Sigiriya, elephant orphanage, Kandy, Ella, Yala, turtle hatchery | Year-round |
| 8 | Ayurveda & Wellness Retreat | 7 | 1,300 | Bentota or Kandy Ayurveda resort, yoga, temple visits | Year-round |
| 9 | East Coast Summer | 9 | 1,600 | Sigiriya, Trincomalee, Pasikudah, Arugam Bay | May–Sep |
| 10 | Colombo & Galle day tours | 1 | 120 | Colombo city, Galle Fort, Bentota river (for cruise and stopover visitors) | Year-round |

The five tours on the current site are retired or folded into these (e.g. "Emerald Highland & Ceylon Tea Odyssey" becomes tour 5, "Grand Celestial Panorama" becomes tour 1). Every tour gets a day-by-day itinerary with real drive times, hotels per tier, inclusions and exclusions, a gallery and a video.

### Booking rules (from research norms)
- **Deposit:** 25% to confirm, balance due 60 days before arrival (bookings inside 60 days pay in full).
- **Cancellation ladder:** 91+ days: deposit kept; 61–90 days: 30%; 31–60: 60%; 15–30: 90%; 0–14: 100%. The client must approve these terms.
- Day tours are paid in full.

### Payments
Stripe can't be used by a Sri Lanka-registered business. Payments sit behind a provider interface so the gateway can change without touching the booking flow:
- **Phase 1 (launch):** no card payments on the site. The team confirms the booking and sends a payment link or bank (SWIFT) details. Status updates in admin.
- **Phase 2:** online 25% deposit through a Sri Lankan card gateway the client opens: ComBank IPG or Sampath IPG (preferred, no per-payment cap), or PayHere Premium (3.69%, capped at US$5,000 per payment). PayPal is an alternative once confirmed for business checkout.

### Trust and differentiators
- **"No commission stops" pledge** plus short video profiles of the chauffeur-guides (the most common traveller complaint about Sri Lanka tours).
- **Trust block** in the footer and booking pages: SLTDA licence number, SLAITO membership (if a member), review widget once reviews exist, secure-booking note.
- **Season-aware planner:** the AI planner warns about monsoon timing and suggests the east-coast tour for May–Sep travel.
- Clear USD prices on every tour. The large local operators hide theirs.

## 7. Milestones

| # | Milestone | Done when |
|---|---|---|
| M0 | Rebrand and globalise | New name and contact details everywhere, USD + currency switcher, flights page retired, copy rewritten for a global audience |
| M1 | Database | Supabase schema + RLS, current data seeded, site reads catalogue from the database |
| M2 | Catalogue | 8 to 10 new tours with itineraries, prices and media |
| M3 | Booking | Booking flow, emails, references, admin bookings inbox |
| M4 | Admin | Staff sign-in, media library uploads, tour editor, site settings |
| M5 | AI planner | Chat widget + `/plan`, tools wired to the database, guardrails, transcripts in admin |
| M6 | Media and performance | Video sections throughout, compression, Lighthouse performance ≥ 85 on mobile |
| M7 | QA, security, launch | Tests and checks pass, security review, deploy (Gate 2) |

## 8. Decisions needed from you (Gate 1)

1. **Brand name on the site:** "Amazing World Travel" (recommended: matches the domain and email) or keep "Fly Amazing". A new logo is needed if the name changes.
2. **Payments:** phase 1 request-to-book with the team sending payment links (recommended), or online deposits from day one (the client must open a gateway account).
3. **Supabase project owner:** create it in your Supabase account now and transfer it to the client later, or the client creates the account and invites you.
4. **AI planner model and key:** the client's Anthropic API key with a monthly spend cap. Default model `claude-opus-5-5`; `claude-sonnet-5-5` or `claude-haiku-5-5` cost less per conversation.
5. **Hosting plan:** Vercel's Hobby plan doesn't allow commercial sites. Vercel Pro ($20/month) is recommended and also removes the co-author deploy block.
6. **Phone / WhatsApp number** for the contact page and chat hand-off.
7. **Booking reference format:** keep `FA-SL-XXXX` or switch to e.g. `AWT-XXXXX`.
8. **Tour prices and booking terms:** the prices in section 6 and the deposit/cancellation rules are research-based starting points. The client confirms or replaces them.
9. **SLTDA licence number** (and SLAITO membership, if any) for the trust block.

## 9. Found during research (fix before launch)

- `www.amazingworldtravel.com` fails HTTPS: the certificate only covers `amazingworldtravel.com`. The bare domain currently shows a page titled "FlyAmazing". This gets fixed when the domain moves to the new site (M7).
- The company has no reviews online yet. Plan to collect TripAdvisor and Google reviews from the first travellers; the site shows them once they exist.

## 10. Notes since the last merge

- The client changed the home hero on `main` to auto-cycle four of their videos (coconut palms, beach, elephant, rainforest). That reverses the earlier "no slideshow" request; the relaunch keeps their current behaviour.
- Pipeline stages: recon done (this brief); architect = this spec; atelier is folded into the build because the design system from the polish pass already exists; forge builds M0–M6; gauntlet and sentinel run before M7; launch needs your Gate 2 approval.
