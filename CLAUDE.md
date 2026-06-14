# Indian Restaurants in USA — Project Guide

## What this is
Programmatic SEO directory of Indian restaurants across the USA at **indianrestaurantsinusa.com**. The proprietary moat is regional cuisine classification (North Indian, South Indian, Hyderabadi, etc.) and Jain/dietary filtering — data that Yelp and Google don't provide.

## Tech stack
- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Database:** Prisma 5 + Supabase Postgres (production)
- **Deployment:** GitHub → Vercel (auto-deploy on push to `main`)
- **Data source:** Outscraper Excel exports → `data/` directory
- **Map:** Leaflet + OpenStreetMap (free, no API key needed)

## Project root
The Next.js app lives at the **repo root**, not in a subdirectory. The `web/` folder is an empty artifact — ignore it.

## Color palette
| Token | Hex | Usage |
|-------|-----|-------|
| `maroon` | `#1E3A8A` | Footer, dark sections, headings (deep indigo-navy) |
| `spice` | `#2563EB` | Buttons, active states, links (royal blue) |
| `saffron` | `#E08A1E` | Highlights, star ratings, search button (gold) |
| `turmeric` | `#F4B942` | Badges, secondary accents (amber) |
| `cream` | `#FFFFFF` | Page background (pure white) |

**Theme: light.** White header, white/gray-50 body sections, vibrant blue gradient hero (`from-blue-600 via-blue-500 to-indigo-600`), dark gray-900 footer. Gold (`saffron`) pops as the accent against blue.

## Logo
- File: `public/logo.png` — mandala/rangoli design on dark background
- Used in Header (34×34 circle) and hero section (150×150 with gold ring)

## Typography
- **Body:** DM Sans (`--font-dm-sans`) — used everywhere
- **Display:** Fraunces (`--font-fraunces`) — serif, used only for hero h1 (`font-display` Tailwind class)

## URL structure
```
/                                    Homepage
/restaurants/[slug]                  Individual restaurant
/restaurants/near-me                 25-mile radius search by geolocation
/usa/[state]/indian-restaurants      State listing
/usa/[state]/[city]/indian-restaurants  City listing (TripAdvisor-style with filter bar)
/indian-food/[cuisine]               Cuisine filter
/indian-restaurants/[diet]           Dietary filter
/best-indian-restaurants             Top picks
/guides/[slug]                       Editorial guides
/map                                 Interactive Leaflet map
/search                              Search (dynamic)
/instagram                           Instagram page with embedded reels
```

## Key components
| Component | Location | Purpose |
|-----------|----------|---------|
| `FilterableGrid` | `components/restaurant/FilterableGrid.tsx` | **`'use client'`** — unified listing component used on ALL listing pages. Sticky filter bar (rating ★, cuisine pills, dietary pills, Clear all ✕), client-side pagination (30/page = 10 rows × 3 cols), silent location sort. Exports `FilterableRestaurant` type. |
| `NearMeClient` | `components/restaurant/NearMeClient.tsx` | **`'use client'`** — same filter bar + pagination as `FilterableGrid` but no location re-sort (SQL already ordered by distance). Used on `/restaurants/near-me`. |
| `RestaurantCard` | `components/restaurant/RestaurantCard.tsx` | Grid card with photo overlay — used inside `FilterableGrid` and `NearMeClient` |
| `RestaurantListCard` | `components/restaurant/RestaurantListCard.tsx` | **`'use client'`** — horizontal ranked card, optional `distanceMiles` prop. Must stay a client component (has onClick handlers). No longer used on listing pages. |
| `ListingClient` | `components/listing/ListingClient.tsx` | Legacy filter bar + ranked list — kept for reference but not used on any page |
| `MapClient` | `components/map/MapClient.tsx` | Leaflet map, dynamic-imported with `ssr: false` |
| `Header` | `components/layout/Header.tsx` | **White** sticky header with logo + gray nav links + blue hover |
| `Footer` | `components/layout/Footer.tsx` | Dark gray-900 footer with cuisine/dietary/company/Instagram links |
| `Badge` | `components/ui/Badge.tsx` | Rounded-full pills — cuisine (saffron/30 + maroon text), dietary (emerald-100) |
| `CookieBanner` | `components/ui/CookieBanner.tsx` | **`'use client'`** — fixed bottom bar on first visit. "Accept all" sets `cookie_consent='all'`, "Essential only" sets `cookie_consent='essential'` in localStorage. Never shows again after choice. |
| `NearMeButton` | `components/filters/NearMeButton.tsx` | **`'use client'`** — pill button, requests geolocation → redirects to `/restaurants/near-me`. Two variants: `hero` (white border) and `default` (gray border). |
| `InstagramFeed` | `components/instagram/InstagramFeed.tsx` | **`'use client'`** — renders Instagram blockquote embeds + loads embed.js via `next/script lazyOnload`. |
| `InstagramHomeBanner` | `components/instagram/InstagramHomeBanner.tsx` | Homepage Instagram section with profile header + 3 embedded reels. |

## Error handling
- `app/error.tsx` — global error boundary; shows friendly "try again" page instead of Next.js crash screen
- `app/not-found.tsx` — custom 404 with search/home links
- All Prisma calls are wrapped in `try/catch` so DB being paused degrades gracefully (empty lists, not crashes)

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
ANTHROPIC_API_KEY   For AI cuisine/dietary classification scripts
NEXT_PUBLIC_SITE_URL=https://www.indianrestaurantsinusa.com
```

**Note:** `NEXT_PUBLIC_GOOGLE_MAPS_KEY` is no longer needed — map uses free Leaflet/OpenStreetMap.

**Key Vercel setting:** Use port `5432` (session mode) — NOT port `6543` (transaction mode). Transaction mode causes prepared statement conflicts during SSG builds.

## Data pipeline
Run scripts in order from the project root using `npx tsx scripts/<name>.ts`:

| # | Script | Purpose |
|---|--------|---------|
| 1 | `ingest.ts [file.xlsx]` | Read Outscraper Excel → upsert to DB |
| 2 | `deduplicate.ts` | Merge duplicate restaurants |
| 3 | `geo-enrich.ts` | Fill state_abbr, metro fields |
| 3b | `keyword-tag.ts` | Keyword-based cuisine/dietary tagging (no API key, fast) |
| 4 | `classify-cuisine.ts` | AI cuisine tagging — more accurate (needs ANTHROPIC_API_KEY) |
| 5 | `classify-dietary.ts` | AI dietary tagging — more accurate (needs ANTHROPIC_API_KEY) |
| 6 | `ai-enrich.ts` | AI descriptions (needs ANTHROPIC_API_KEY) |
| 7 | `generate-slugs.ts` | Create URL slugs |
| 8 | `build-search-index.ts` | Postgres full-text search |
| 9 | `score-publish-priority.ts` | Score restaurants by quality signals |
| 10 | `initial-publish.ts [N]` | Mark top N as published (omit N = publish all) |

To load a specific Excel file: `npx tsx scripts/ingest.ts ./data/filename.xlsx`

Run `keyword-tag.ts` first (no API key) for instant tagging, then AI scripts later for accuracy.

## Current data
- **4,974 restaurants** in Supabase, all published
- **1,063** restaurants have cuisine tags (keyword-based)
- **167** restaurants have dietary tags (keyword-based)
- Cities: nationwide coverage from Outscraper export
- AI enrichment (better cuisine/dietary tags + descriptions) pending — add ANTHROPIC_API_KEY and run scripts 4–6

## Rendering strategy — force-dynamic on all DB pages
**All pages that query the DB use `export const dynamic = 'force-dynamic'`.**

Pages: `app/usa/page.tsx`, `restaurants/[slug]`, `usa/[state]/indian-restaurants`, `usa/[state]/[city]/indian-restaurants`, `indian-food/[cuisine]`, `indian-restaurants/[diet]`, `best-indian-restaurants`, `restaurants/near-me`, `search`.

Why `force-dynamic` instead of `revalidate = 3600`: ISR with revalidate caches the **first response** at the Vercel edge for up to 1 hour. If Supabase is paused when that first request lands, the empty result is frozen for the full hour — users see blank pages even after Supabase resumes. `force-dynamic` bypasses the edge cache entirely and always reads live from Supabase.

**Do NOT add `generateStaticParams` or `revalidate` back to these pages.**

## "Use my location" / Near Me search
- `NearMeButton` (`components/filters/NearMeButton.tsx`) — browser Geolocation API → redirects to `/restaurants/near-me?lat=X&lng=Y`
- `/restaurants/near-me` server page runs a **Haversine SQL query** via `prisma.$queryRaw` (up to 300 results within **25 miles**, ordered by distance). Maps rows to `FilterableRestaurant[]` and passes to `NearMeClient`.
- `NearMeClient` — 3×3 grid + sticky filter bar + pagination (30/page). Does **not** re-sort by location (SQL already ordered by distance). Always shows "Sorted by distance" indicator.
- Reverse-geocode for display heading done server-side via Nominatim (OpenStreetMap, free, no API key)
- Requires `latitude`/`longitude` fields populated in DB (Outscraper exports include these)

## Listing pages — FilterableGrid
All listing pages (cuisine, dietary, state, city, best restaurants) use `FilterableGrid`:
- **Layout:** 3×3 `RestaurantCard` grid, 30 results per page (10 rows × 3 cols)
- **Sticky filter bar:** rating (★4.0+, ★4.5+), cuisine pills, dietary pills — each active chip shows `×` to deselect. "Clear all ✕" appears when any filter is active.
- **Pagination:** client-side, numbered buttons + ellipsis collapse + Prev/Next. `goToPage()` scrolls to top.
- **Location sort:** silent `navigator.geolocation.getCurrentPosition()` on mount (4 sec timeout, 5 min cache). If granted, re-sorts by Haversine distance and shows "Sorted by distance" indicator. Filters reset to page 1 when changed.
- **Data fetched server-side**, passed as props — no artificial `take` cap on any listing page.

## Search page
- **3×3 grid** (RestaurantGrid), **30 per page** (10 rows × 3 cols)
- **Server-side pagination** via `?page=` URL param — count and results fetched in parallel with `Promise.all`
- `export const dynamic = 'force-dynamic'` — never cached; each `?q=&page=` combo always re-fetches
- Pagination controls: numbered buttons + ellipsis + Prev/Next, only shown when `totalPages > 1`

## Cookie consent
- `CookieBanner` (`components/ui/CookieBanner.tsx`) — fixed bottom bar, shown on first visit
- "Accept all" → `localStorage.setItem('cookie_consent', 'all')`, hides banner permanently
- "Essential only" → `localStorage.setItem('cookie_consent', 'essential')`, hides banner permanently
- Gracefully handles private/incognito mode (localStorage access failure caught silently)
- To test: DevTools → Application → Local Storage → delete `cookie_consent` → refresh

## Instagram integration
- `/instagram` page — gradient hero, 3 embedded reels, follow CTA
- `InstagramFeed` — client component; uses `<blockquote data-instgrm-permalink>` + `embed.js` via `next/script strategy="lazyOnload"`. Calls `window.instgrm.Embeds.process()` on load and on mount (handles client-side navigation).
- `InstagramHomeBanner` — homepage section (between Top Cities and Why Us) with profile header + `InstagramFeed` + "See all posts" link
- Mobile floating button — fixed bottom-right Instagram icon in `app/layout.tsx`, `lg:hidden` (only on mobile/tablet), links to Instagram profile
- Footer — Instagram link in Company column + Instagram icon in bottom bar
- To add more posts: update `POSTS` array in `app/instagram/page.tsx` and `components/instagram/InstagramHomeBanner.tsx`
- Instagram handle: `@indianrestaurentsinusa` (note: "restaurents" not "restaurants" — intentional, matches the registered handle)

## business_status field
`OPERATIONAL` means the business is not permanently/temporarily closed — it does NOT mean open right now (no real-time hours data from Outscraper). Never display "Open" for `OPERATIONAL` status.

Only show status pills for:
- `CLOSED_PERMANENTLY` → red "Permanently Closed"
- `CLOSED_TEMPORARILY` → amber "Temporarily Closed"

This applies to both `RestaurantListCard` and the restaurant detail page sidebar.

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

### "Application error: a server-side exception" on live site
Most likely cause: **Supabase is paused** (free tier pauses after ~1 week of inactivity).
Fix:
1. Go to supabase.com → resume the project (takes ~30 sec)
2. Trigger a redeploy: `git commit --allow-empty -m "chore: redeploy" && git push origin main`
3. If it persists, check Vercel → Functions → Logs for the actual error

### Prisma "prepared statement already exists" during Vercel build
Cause: Using pgBouncer transaction mode (port 6543).
Fix: Change `DATABASE_URL` in Vercel to port `5432` (session mode), remove `?pgbouncer=true`.

### Site shows empty pages / no restaurant data
1. Check Supabase isn't paused — run `SELECT 1;` in SQL Editor
2. Check `SELECT COUNT(*) FROM "Restaurant" WHERE is_published = true;`
3. If 0, run `UPDATE "Restaurant" SET is_published = true;` then redeploy

### Any listing page shows 0 restaurants
All DB pages use `force-dynamic` — there is no edge cache to bust. If a page shows empty:
1. Verify Supabase is not paused — run `SELECT COUNT(*) FROM "Restaurant" WHERE is_published = true;` → should be ~4,974
2. Check cuisine tags exist: `SELECT COUNT(*) FROM "Restaurant" WHERE cuisine_tags IS NOT NULL;` → should be ~1,063
3. If Supabase was just resumed, trigger a redeploy: `git commit --allow-empty -m "chore: redeploy" && git push origin main`

### Search page shows "Something went wrong" (error.tsx) instead of results
Cause: `RestaurantListCard` has `onClick` handlers and MUST be a `'use client'` component. If rendered from a server context without this directive, Next.js throws during React rendering (outside any try/catch). This error only appears when search actually returns results — 0 results hides the bug.
Fix: ensure `'use client'` is the first line of `components/restaurant/RestaurantListCard.tsx`. Do not remove it.

### Search returns no results (case mismatch)
The search query uses `mode: 'insensitive'` (PostgreSQL `ILIKE`) on all `contains` filters so "chicago" matches "Chicago", "north indian" matches the `north-indian` tag, etc. Do not revert to plain `contains` — it is case-sensitive and breaks search for most real-world queries.

### City page shows 0 results (slug mismatch)
The city page tries an exact match first, then falls back to case-insensitive `contains`. If a hardcoded link uses the wrong slug (e.g. `new-york-city` when DB has `New York`), the fallback query handles it. If adding new featured city links to the homepage, verify the actual city name in the DB first.

### 404 on Vercel deployment URL
Check Vercel → Settings → General → Framework Preset = **Next.js** (not "Other").

### Local `npm run dev` shows no data
The local `.env` needs real Supabase credentials. The schema is `postgresql` — SQLite is not supported.

### Map page shows error
Map uses Leaflet/OpenStreetMap — no API key required. If it shows blank, check that `leaflet` and `react-leaflet@4` are installed (`npm install leaflet react-leaflet@4 @types/leaflet`). Note: `react-leaflet@5` requires React 19; this project uses React 18 so pin to v4.

### Mobile search bar overflow
Hero search: placeholder is intentionally short ("City, cuisine, or name…"), button uses `px-5 md:px-8`, and decorative blur orbs are `hidden md:block`. Do not revert these — they prevent horizontal overflow on narrow screens.

### "Near me" returns 0 results
Cause: restaurants in DB have NULL or 0 latitude/longitude. The Haversine query skips rows where `latitude IS NULL OR longitude IS NULL OR latitude = 0 OR longitude = 0`. Verify with: `SELECT COUNT(*) FROM "Restaurant" WHERE latitude IS NOT NULL AND latitude != 0;`

## What's next
- Add `ANTHROPIC_API_KEY` and run `classify-cuisine.ts`, `classify-dietary.ts`, `ai-enrich.ts` for accurate AI tagging on all 4,974 restaurants
- Add more Outscraper city/state Excel files and re-run the full pipeline
- Add more Instagram posts: update `POSTS` array in `app/instagram/page.tsx` and `components/instagram/InstagramHomeBanner.tsx`
- Add a Privacy Policy page (`/privacy`) linked from the cookie banner
