# AGENTS.md - Fly Amazing Architecture & Agent Guardrails

## ✈️ Project Overview
**Fly Amazing** is a modern Next.js 14 travel and tour booking web application tailored for Australian travelers booking flights and bespoke holiday packages in Sri Lanka.

---

## 🛠️ Tech Stack & Tooling

| Component | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Runtime / UI | React 18, TypeScript 5.6 |
| Styling | Tailwind CSS 3.4, PostCSS, Autoprefixer |
| Animation / Effects | Framer Motion, Lenis (Smooth Scroll) |
| Icons | Lucide React |
| Backend / API | Next.js Route Handlers (`src/app/api/`) & Nodemailer |
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
   - `src/app/`: App router routes (`/flights`, `/destinations`, `/packages`, `/tour-architect`, `/contact`, `/api/inquiry`).
   - `src/components/architect/`: Tour Architect customizer studio and review drawers.
   - `src/components/home/`: Landing page sections (hero, booking island, showcase, testimonials).
   - `src/components/inquiry/`: Booking confirmation and finalization modals.
   - `src/components/layout/`: Shared layout elements (Navbar, Footer, SmoothScrollProvider).
   - `src/components/transition/`: Animated flight route transition overlays.
   - `src/data/`: Centralized domain datasets (`packages.ts`, `hotels.ts`, `destinations.ts`, `australianAirports.ts`).
   - `src/lib/`: Utilities and shared services (`emailService.ts`, `utils.ts`).

3. **Data Integrity & Pricing**:
   - Currency convention is Australian Dollars (AUD).
   - All booking inquiry payloads generate a unique tracking token matching the format `FA-SL-XXXX`.
   - Dynamic hotel and package pricing calculation formulas must preserve baseline and season multiplier rules.

4. **Environment Variables**:
   - Configuration is mirrored in `.env.example` and applied locally in `.env.local`.
   - Never commit `.env` or `.env*.local` files.
   - If SMTP credentials are not configured, inquiry workflows must fallback gracefully by logging inquiries safely without failing requests.
