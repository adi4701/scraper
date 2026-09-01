# PainPoint AI

PainPoint AI is a premium dark-mode startup signal engine that continuously monitors public conversations to uncover high-intent complaints and turn them into validated opportunity clusters.

## Stack
- Next.js 15 App Router
- Tailwind CSS 4
- Framer Motion
- Supabase Postgres + Auth
- Python scraping workers via GitHub Actions
- Upstash Redis job queue
- Gemini or Groq for idea validation
- Stripe + Resend for monetization and alerts

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000

## Supabase setup

1. Create a Supabase project and copy the project URL + publishable/anon key into `.env.local`.
2. Apply the schema in `supabase/schema.sql`.
3. Add the service-role key, Upstash REST credentials, Gemini key, and a `CRON_SECRET` to server environments only.
4. Add an admin email/password user via Supabase Auth for the protected `/admin` route.

## Key routes
- `/` — premium landing page
- `/dashboard` — live pain-point dashboard prototype
- `/admin` — protected admin access gate with Supabase auth flow

## Supporting files
- `supabase/schema.sql` — profile + idea cluster schema
- `scripts/scrape_reddit.py` — Python base for scraping Reddit/X content
- `.github/workflows/scrape.yml` — four-hour scraper schedule
- `scripts/enqueue_upstash.py` — pushes normalized posts into the `raw_posts` Redis list
- `app/api/process-queue/route.ts` — pops one post, processes it with Gemini, persists it, and sends matching Pro alerts

## Free-tier architecture notes
- Vercel hosts the UI
- Supabase manages auth and data
- GitHub Actions schedules Python ingestion workers
- Upstash handles async queue orchestration
- AI processing runs as a post-scrape enrichment stage rather than a real-time bottleneck
- QStash can call `POST /api/process-queue` with `Authorization: Bearer $CRON_SECRET`; each request processes one queue item.
