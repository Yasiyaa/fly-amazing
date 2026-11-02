# Amazing World Travel

Website for **Amazing World Travel**, a Colombo-based operator of private, tailor-made Sri Lanka tours for travellers worldwide. Unit 94D, 75 Galle Road, Colombo 03 · info@amazingworldtravel.com

**Features:** 10-tour catalogue with day-by-day itineraries, USD pricing with a currency switcher, booking requests with `AWT-XXXXX` references, a Tour Architect for custom routes, an AI trip planner (Claude) grounded in the catalogue, and an admin area for bookings, tours, media uploads and site settings.

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind, Supabase (Postgres, Auth, Storage), Anthropic SDK, Nodemailer. Hosted on Vercel.

## Run, build, deploy

1. `npm install`, then copy `.env.example` to `.env.local` and fill it in (everything is optional for a first look).
2. `npm run dev` → http://localhost:3000 (runs on bundled data until Supabase is configured).
3. Database: apply `supabase/migrations/0001_init.sql` in the Supabase SQL editor, then `node --env-file=.env.local scripts/seed.mjs`.
4. First admin: create a user in Supabase Auth, then `insert into staff (user_id, email, role) values ('<user id>', '<email>', 'owner');`. Sign in at `/admin`.
5. `npm run build` checks types, lint and builds. `npm run start` serves the build.
6. Deploy: push to GitHub; Vercel builds automatically. Set the same environment variables in Vercel. `vercel.json` schedules the daily exchange-rate refresh.

Private & proprietary. All rights reserved by Amazing World Travel.
