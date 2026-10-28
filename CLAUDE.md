# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`AGENTS.md` is the canonical guardrails file (stack, directory map, invariants). Read it first; this file adds what it doesn't cover.

## Commands

On Windows PowerShell use `npm.cmd` / `npx.cmd` (execution policy blocks the `.ps1` shims).

- `npm.cmd run dev` – dev server on http://localhost:3000
- `npm.cmd run build` – production build (also the strictest type/lint gate)
- `npm.cmd run lint` – `next lint` (eslint-config-next)
- `npx.cmd tsc --noEmit` – type check

There is no test framework. Verify changes by building and by driving the page in the browser.

## Architecture

- **No backend data layer.** All catalog content is static TypeScript in `src/data/` (`CURATED_PACKAGES`, `HOTELS_CATALOG`, `SRI_LANKA_DESTINATIONS`, `AUSTRALIAN_AIRPORTS`). Hotels link to destinations via `Hotel.destinationId`; packages are looked up by `id` from the `/packages/[id]` route. Adding content means editing these arrays.
- **Mostly client pages.** Most `src/app/**/page.tsx` files are `"use client"`, so only `layout.tsx` exports metadata for them. `/packages/[id]` is the exception: a Server Component with `generateStaticParams` + `generateMetadata` and a client island (`PackageEnquireButton`). Follow that split when a page needs its own SEO.
- **Global chrome:** `layout.tsx` loads fonts via `next/font` (CSS vars `--font-outfit` / `--font-jakarta`) and wraps everything in `SmoothScrollProvider` (Lenis, exposed via `useLenis()`). `template.tsx` re-mounts on every navigation and renders `FlightTransitionOverlay`, which plays the full intro once per session (`sessionStorage` key `fa-intro-seen`) and skips it afterwards. `Navbar`/`Footer` are included per page, not in the layout.
- **Overlays:** modals, the hotel drawer and the mobile menu call `useOverlay(isOpen, onClose)` from `src/lib/useOverlay.ts` (Escape to close, locks native + Lenis scroll). Scrollable overlay content needs `data-lenis-prevent`.
- **Tour Architect inputs from outside:** `TourArchitectStudio` takes `requestedDestination={ id, nonce }` (home page "Add to tour") and `/tour-architect?add=<destinationId>` deep links from the destinations page.
- **Single API route:** `POST /api/inquiry` (`src/app/api/inquiry/route.ts`) is the only server code. It is called from `TourFinalizeModal` (packages + Tour Architect), `/flights`, and `/contact`. It validates email/phone, clamps string lengths, whitelists `tourType` (`custom | package | flight | general`), always generates the `FA-SL-XXXX` reference server-side, then calls `sendTourInquiryEmail` in `src/lib/emailService.ts`.
- **Email fallback:** `emailService.ts` sends via Nodemailer only when `SMTP_HOST`, `SMTP_USER` and `SMTP_PASS` are all set; otherwise it logs a simulated dispatch and still returns success. Keep that behaviour. All user input is escaped with `esc()` before going into the email HTML; keep it that way for new fields.
- **Tour Architect pricing** lives inline in `src/components/architect/TourArchitectStudio.tsx`: airport `baseFareAUD` + Σ(hotel `pricePerNightAUD` × nights, or 200/night with no hotel) + 120/day chauffeur + 50/day permits, where days = nights + 1. No season multiplier exists in code yet, despite the AGENTS.md wording; package prices are flat `priceAUD`. Use `formatAUD` from `src/lib/utils.ts` for display.

## Styling and media

- **Use the design-system classes in `globals.css`** (`@layer components`) instead of hand-rolling styles: `container-page`, `section`, `eyebrow`/`eyebrow-light`, `heading-section(-light)`, `btn-primary`/`btn-navy`/`btn-secondary`/`btn-glass` (+ `btn-sm`/`btn-lg`), `card`/`card-interactive`/`panel`, `chip`/`chip-glass`/`badge-accent`, `filter-pill(-active|-idle)`, `field-label`/`field-input`. Shared building blocks live in `src/components/ui/` (`PageHero`, `SectionHeader`, `PackageCard`, `Field`).
- Layout gotchas found in the polish pass: give every CSS grid a base `grid-cols-1` (an implicit auto column sizes to content and widened the mobile layout viewport), and keep `position: fixed` panels outside elements with `backdrop-filter` (it becomes their containing block; that's why the mobile menu is a sibling of `<header>`).
- Brand palette is Tailwind `fly-navy` (#033F7E), `fly-cyan` (#01A4A9), `fly-orange` (#E66017), each with 50–950 scales, in `tailwind.config.ts`. Use brand orange shades for accents, not `amber-*`. Fonts: Outfit (`font-display`, all headings) and Plus Jakarta Sans (`font-sans`).
- The client's own 4K media lives in `public/images/` and `public/videos/` and takes priority over stock; the hero uses only their two videos as one continuous background (no auto-rotating slideshow, by client request). Remaining images are hotlinked from Unsplash and reel-wall videos from `assets.mixkit.co`. Every photo and video must actually show Sri Lanka and match its caption; several stock assets were wrong (Prambanan temple, a subway, a tiger, Thai karsts) and were replaced. `next/image` only allows hosts listed in `next.config.mjs` `images.remotePatterns` (Unsplash, Pexels). `public/logo.png` is the cropped transparent logo used in the UI; `logo.jpeg` is the favicon.
- Customer-facing copy must never show the admin notification email.
- Class merging: `cn()` in `src/lib/utils.ts` (clsx + tailwind-merge).
