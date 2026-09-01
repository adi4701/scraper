# PainPoint AI plan

## Current status
- Premium landing page concept has been rebuilt to take inspiration from Stalkr.ai's dark, minimal SaaS aesthetic.
- Admin route at `/admin` is available for operational review and cluster management workflows.
- Product dashboard route at `/dashboard` remains the live signal board for market intelligence exploration.
- Supabase foundation has been prepared with a browser/server client setup and an admin auth gate for protected access.
- Local Supabase project configuration is now wired through `.env.local`, with support for both publishable-key and legacy anon-key variable names.
- Local Upstash Redis REST configuration is now wired through `.env.local`; credentials remain ignored and are not committed.
- The scraper has been updated to use public fallback sources because Reddit and Nitter are blocked from this runtime.

## Backend architecture to implement next
- Ingestion layer: GitHub Actions + Python cron timing every 4 hours; fetch complaint-like items from public sources and normalize to a minimal `{id, text, url}` payload.
- Buffer layer: Upstash Redis / QStash queue to decouple scraping from AI processing and absorb bursts without overwhelming the app.
- Processing layer: Next.js API route at `/api/process-queue` to pop queued posts, call Gemini or Groq with a strict JSON schema, and validate urgency plus competitor/problem extraction.
- Storage layer: Supabase Postgres for profiles, idea_clusters, and tracked_keywords with RLS policies that differentiate hobby and pro access.
- Serving layer: Supabase Realtime + client-side queries to push fresh idea updates to the dashboard without a polling-heavy UX.

## Next steps
1. Replace the remaining direct social-source assumptions with a resilient queue of public data feeds and fallback parsing.
2. Implement the Python scraper script and GitHub Actions cron schedule for recurring ingestion.
3. Complete the Gemini/Groq structured-response worker and persist validated clusters to Supabase with idempotent inserts.
4. Harden the admin and dashboard with real Supabase reads, user-tier gating, and search/filtering for live records.
5. Wire Stripe and email alerting for the pro tier once the core ingestion and validation pipeline is stable.

## Notes
- The app is no longer just a static mock; it now includes multiple operational surfaces that feel product-appropriate for a SaaS prototype.
- The visual language is intentionally dark, polished, and conversion-focused without drifting into cluttered or overly noisy UI patterns.
- The environment blocks direct Reddit and Nitter access, so the scraper intentionally uses public, accessible alternatives to keep the ingestion layer alive and operational.
- The backend design follows the event-driven, serverless blueprint from the architecture doc: ingest -> queue -> LLM worker -> Supabase -> realtime dashboard.
- Next production step: create the Supabase schema in the configured project and replace the local demo store with authenticated Supabase reads and writes.
- Next queue step: add the same Upstash values as GitHub Actions secrets before enabling scheduled cloud ingestion.
