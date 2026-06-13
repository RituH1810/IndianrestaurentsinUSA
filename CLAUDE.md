# Indian Restaurants in USA — Project Guide

## What this is
Programmatic SEO directory of Indian restaurants across the USA at **indianrestaurantsinusa.com**. The proprietary moat is regional cuisine classification (North Indian, South Indian, Hyderabadi, etc.) and Jain/dietary filtering — data that Yelp and Google don't provide.

## Tech stack
- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Database:** Prisma 5 + Supabase Postgres (production)
- **Deployment:** GitHub → Vercel (auto-deploy on push to `main`)
- **Data source:** Outscraper Excel exports → `data/` directory

## Project root
The Next.js app lives at the **repo root**, not in a subdirectory. The `web/` folder is an empty artifact — ignore it.

## Color palette
| Token | Hex | Usage |
|-------|-----|-------|
| `maroon` | `#7A1F1F` | Header background, headings |
| `spice` | `#C1440E` | Buttons, accents |
| `saffron` | `#E08A1E` | Links, highlights |
| `turmeric` | `#F4B942` | Badges, secondary accents |
| `cream` | `#FBF6EE` | Page background |

## URL structure
```
/                                    Homepage
/restaurants/[slug]                  Individual restaurant
/usa/[state]/indian-restaurants      State listing
/usa/[state]/[city]/indian-restaurants  City listing
/indian-food/[cuisine]               Cuisine filter
/indian-restaurants/[diet]           Dietary filter
/best-indian-restaurants             Top picks
/guides/[slug]                       Editorial guides
/map                                 Map view
/search                              Search (dynamic)
```

## Database
- **Supabase project ref:** `cumxyszbuyfykqwqgyxo`
- **Region:** `us-east-1`
- **Pooler (runtime):** `aws-1-us-east-1.pooler.supabase.com:5432`
- **Direct URL:** `db.cumxyszbuyfykqwqgyxo.supabase.co:5432`
- Free tier **pauses after ~1 week of inactivity** — resume at supabase.com before deploying

## Environment variables
`.env` at project root (gitignored). Required vars:
```
DATABASE_URL    Supabase session pooler URL (port 5432)
DIRECT_URL      Supabase direct URL (port 5432)
ANTHROPIC_API_KEY   For cuisine/dietary classification scripts
NEXT_PUBLIC_GOOGLE_MAPS_KEY   For /map page
NEXT_PUBLIC_SITE_URL=https://www.indianrestaurantsinusa.com
```

**Key Vercel setting:** Use port `5432` (session mode) — NOT port `6543` (transaction mode). Transaction mode causes prepared statement conflicts during SSG builds.

## Data pipeline
Run scripts in order from the project root using `npx tsx scripts/<name>.ts`:

| # | Script | Purpose |
|---|--------|---------|
| 1 | `ingest.ts [file.xlsx]` | Read Outscraper Excel → upsert to DB |
| 2 | `deduplicate.ts` | Merge duplicate restaurants |
| 3 | `geo-enrich.ts` | Fill state_abbr, metro fields |
| 4 | `classify-cuisine.ts` | AI cuisine tagging (needs ANTHROPIC_API_KEY) |
| 5 | `classify-dietary.ts` | AI dietary tagging (needs ANTHROPIC_API_KEY) |
| 6 | `ai-enrich.ts` | AI descriptions (needs ANTHROPIC_API_KEY) |
| 7 | `generate-slugs.ts` | Create URL slugs |
| 8 | `build-search-index.ts` | Postgres full-text search (skip for SQLite) |
| 9 | `score-publish-priority.ts` | Score restaurants by quality signals |
| 10 | `initial-publish.ts [N]` | Mark top N as published (omit N = publish all) |

To load a specific Excel file: `npx tsx scripts/ingest.ts ./data/filename.xlsx`

## Current data
- **4,974 restaurants** in Supabase, all published
- Cities: nationwide coverage from Outscraper export
- AI enrichment (cuisine/dietary tags, descriptions) pending — needs ANTHROPIC_API_KEY

## Deployment
**Never deploy from the terminal.** Push to `main` → Vercel auto-deploys.

To trigger a redeploy without code changes:
```bash
git commit --allow-empty -m "chore: trigger Vercel redeploy" && git push origin main
```

**Vercel project settings (critical):**
- Framework Preset: **Next.js** (not "Other")
- Root Directory: **blank**
- Build Command: blank (auto-detected)

## Common issues & fixes

### Prisma "prepared statement already exists" during Vercel build
Cause: Using pgBouncer transaction mode (port 6543).
Fix: Change `DATABASE_URL` in Vercel to port `5432` (session mode), remove `?pgbouncer=true`.

### Site shows empty pages / no restaurant data
1. Check Supabase isn't paused — run `SELECT 1;` in SQL Editor
2. Check `SELECT COUNT(*) FROM "Restaurant" WHERE is_published = true;`
3. If 0, run `UPDATE "Restaurant" SET is_published = true;` then redeploy

### 404 on Vercel deployment URL
Check Vercel → Settings → General → Framework Preset = **Next.js** (not "Other").

### Local `npm run dev` shows no data
The local `.env` needs real Supabase credentials. The schema is `postgresql` — SQLite is not supported.

## What's next
- Run AI enrichment scripts once ANTHROPIC_API_KEY is available (adds cuisine tags, dietary tags, descriptions)
- Add more Outscraper city files and re-run the pipeline
- Set up Google Maps API key for the `/map` page
- Apply frontend-design skill for UI refresh
