# AGENTS.md - Amazing World Travel Architecture & Agent Guardrails

## ✈️ Project Overview
**Amazing World Travel** is a Colombo-based tour operator. This Next.js 14 site sells private, tailor-made Sri Lanka tours to travellers worldwide, with a booking system, an AI trip planner and an admin area.

---

## 🛠️ Tech Stack & Tooling

| Component | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Runtime / UI | React 18, TypeScript 5.6 |
| Styling | Tailwind CSS 3.4, PostCSS, Autoprefixer |
| Animation / Effects | Framer Motion, Lenis (Smooth Scroll) |
| Icons | Lucide React |
| Backend / API | Next.js Route Handlers (`src/app/api/`), Supabase (Postgres, Auth, Storage), Nodemailer |
| AI trip planner | Anthropic TypeScript SDK (Claude, tool use, streaming) |
| Validation | Zod |
| Package Manager | `npm` |

---

## ⚡ Execution Commands & Windows Environments

> [!IMPORTANT]
> When executing Node/npm commands in Windows PowerShell environments where execution policy may block `.ps1` wrappers, always invoke using `npm.cmd` (or `npx.cmd`).

- **Development Server**: `npm.cmd run dev` (starts on `http://localhost:3000`)
- **Production Build**: `npm.cmd run build`
- **Start Production**: `npm.cmd run start`
- **Linting**: `npm.cmd run lint`
- **Type Checking**: `npx.cmd tsc --noEmit`

---

## 🏛️ Architecture Invariants & Standards

1. **App Router & Server/Client Boundary**:
   - Files in `src/app/` are React Server Components by default.
   - Any component utilizing React state/hooks (`useState`, `useEffect`, `useRef`), Framer Motion, Lenis, or browser DOM events must explicitly include the `"use client";` directive at the very top of the file.
   - Keep data-fetching and static metadata generation in Server Components where possible; delegate interactive UI islands to Client Components in `src/components/`.

2. **Directory Structure**:
   - `src/app/`: routes (`/tours`, `/tours/[slug]`, `/book/[slug]`, `/booking`, `/destinations`, `/tour-architect`, `/plan`, `/contact`, `/admin/*`) and API routes (`/api/bookings`, `/api/enquiries`, `/api/chat`, `/api/cron/fx`).
   - `src/components/architect/`: Tour Architect studio, hotel drawer, trip request modal.
   - `src/components/admin/`: admin forms (tours, media uploads, settings, booking status).
   - `src/components/booking/`, `tours/`, `destinations/`, `contact/`: page islands.
   - `src/components/planner/`: AI planner chat and floating widget.
   - `src/components/home/`, `layout/`, `ui/`, `currency/`, `transition/`: home sections, shell, shared UI, currency switcher, intro overlay.
   - `src/data/seed/`: bundled catalogue (tours, destinations, hotels). Seeds Supabase and is the fallback when the database isn't configured.
   - `src/lib/`: data layer (`catalog.ts`), pricing, bookings, email, validation, Supabase clients, planner tools and prompt.
   - `supabase/migrations/`: schema, row-level security and storage policies.

3. **Data Integrity & Pricing**:
   - Prices are stored, quoted and charged in US dollars. Other currencies are display-only conversions.
   - Booking references use the format `AWT-XXXXX` (enquiries `ENQ-XXXXX`) and are always generated on the server.
   - All prices are computed on the server from catalogue data in `src/lib/pricing.ts`; never trust a price sent by the browser or produced by the AI planner.

4. **Environment Variables**:
   - Configuration is mirrored in `.env.example` and applied locally in `.env.local`.
   - Never commit `.env` or `.env*.local` files.
   - If SMTP credentials are not configured, booking and enquiry workflows must fall back gracefully by logging instead of failing requests.
   - Without Supabase keys the public site must still render from `src/data/seed`; without `ANTHROPIC_API_KEY` the planner shows a contact fallback.
