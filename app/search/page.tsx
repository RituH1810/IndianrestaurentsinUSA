export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { RestaurantGrid } from '@/components/restaurant/RestaurantGrid';
import { SearchBar } from '@/components/filters/SearchBar';
import { NearMeButton } from '@/components/filters/NearMeButton';
import Link from 'next/link';
import type { Metadata } from 'next';

const PAGE_SIZE = 30;
const ZIP_RE = /^\d{5}$/;

export const metadata: Metadata = {
  title: 'Search Indian Restaurants',
  robots: { index: false, follow: true },
};

type RestaurantRow = {
  slug: string; name: string; city: string; state: string;
  rating: number | null; reviews: number | null; photo: string | null;
  cuisine_tags: string | null; dietary_tags: string | null;
  is_hidden_gem: boolean; description: string | null;
};

type NearbyRow = RestaurantRow & { distance_miles: number };

function buildPageRange(current: number, total: number): (number | 'gap')[] {
  if (total <= 1) return [];
  if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);
  const visible = new Set<number>([1, total]);
  for (let p = Math.max(1, current - 2); p <= Math.min(total, current + 2); p++) {
    visible.add(p);
  }
  const sorted = Array.from(visible).sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('gap');
    result.push(sorted[i]);
  }
  return result;
}

async function geocodeZip(zip: string): Promise<{ lat: number; lng: number; label: string } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=US&format=json&limit=1`,
      {
        headers: { 'User-Agent': 'IndianRestaurantsInUSA/1.0' },
        next: { revalidate: 86400 },
      },
    );
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const parts = (data[0].display_name as string).split(',').map((s: string) => s.trim());
      const label = parts.slice(0, 3).join(', ');
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), label };
    }
  } catch {}
  return null;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const q = (searchParams.q ?? '').trim();
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));

  let restaurants: RestaurantRow[] = [];
  let total = 0;
  let isZipSearch = false;
  let zipLabel = '';

  if (q) {
    // --- Zip code path ---
    if (ZIP_RE.test(q)) {
      const coords = await geocodeZip(q);
      if (coords) {
        const { lat, lng, label } = coords;
        isZipSearch = true;
        zipLabel = label;
        try {
          const rows = await prisma.$queryRaw<NearbyRow[]>`
            SELECT
              slug, name, city, state, rating, reviews, photo,
              cuisine_tags, dietary_tags, is_hidden_gem, description,
              ROUND(
                (3959 * acos(
                  LEAST(1.0,
                    cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng}))
                    + sin(radians(${lat})) * sin(radians(latitude))
                  )
                ))::numeric, 1
              ) AS distance_miles
            FROM "Restaurant"
            WHERE
              is_published = true
              AND latitude IS NOT NULL AND longitude IS NOT NULL
              AND latitude != 0 AND longitude != 0
              AND (3959 * acos(LEAST(1.0,
                cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng}))
                + sin(radians(${lat})) * sin(radians(latitude))
              ))) <= 25
            ORDER BY distance_miles
            LIMIT 300
          `;
          restaurants = rows.map(r => ({
            slug: r.slug, name: r.name, city: r.city, state: r.state,
            rating: r.rating, reviews: r.reviews, photo: r.photo,
            cuisine_tags: r.cuisine_tags, dietary_tags: r.dietary_tags,
            is_hidden_gem: r.is_hidden_gem, description: r.description,
          }));
          total = restaurants.length;
        } catch { /* DB not ready */ }
      }
    }

    // --- Text search path (also runs when zip geocoding fails) ---
    if (!isZipSearch) {
      const where = {
        is_published: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { city: { contains: q, mode: 'insensitive' as const } },
          { state: { contains: q, mode: 'insensitive' as const } },
          { zip: { contains: q, mode: 'insensitive' as const } },
          { cuisine_tags: { contains: q, mode: 'insensitive' as const } },
          { description: { contains: q, mode: 'insensitive' as const } },
        ],
      };
      try {
        const [count, rows] = await Promise.all([
          prisma.restaurant.count({ where }),
          prisma.restaurant.findMany({
            where,
            orderBy: { publish_priority: 'desc' },
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            select: {
              slug: true, name: true, city: true, state: true,
              rating: true, reviews: true, photo: true,
              cuisine_tags: true, dietary_tags: true,
              is_hidden_gem: true, description: true,
            },
          }),
        ]);
        total = count;
        restaurants = rows;
      } catch { /* DB not ready */ }
    }
  }

  const totalPages = !isZipSearch && total > 0 ? Math.ceil(total / PAGE_SIZE) : 0;
  const pageRange = buildPageRange(page, totalPages);

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-2xl font-bold text-maroon mb-6">Search Indian Restaurants</h1>

      <div className="max-w-2xl mb-8">
        <SearchBar defaultValue={q} />
        <div className="mt-2">
          <NearMeButton variant="default" />
        </div>
      </div>

      {!q && (
        <p className="text-gray-400 text-sm">
          Search by restaurant name, city, zip code, state, or cuisine type.
        </p>
      )}

      {q && (
        <p className="text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
          {isZipSearch ? (
            total > 0
              ? `${total} Indian restaurant${total !== 1 ? 's' : ''} within 25 miles of ZIP ${q}${zipLabel ? ` (${zipLabel})` : ''}`
              : `No Indian restaurants found within 25 miles of ZIP ${q}${zipLabel ? ` (${zipLabel})` : ''}`
          ) : (
            total > 0
              ? `${total} result${total !== 1 ? 's' : ''} for "${q}"${totalPages > 1 ? ` · Page ${page} of ${totalPages}` : ''}`
              : `No results for "${q}" — try a different search term`
          )}
        </p>
      )}

      {isZipSearch && total === 0 && q && (
        <div className="text-center py-16 border border-gray-100 rounded-xl bg-gray-50">
          <p className="text-4xl mb-4">🍛</p>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            No restaurants in our directory are within 25 miles of this zip code. Try browsing by state or searching by city name.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/usa" className="px-5 py-2.5 bg-spice text-white rounded-full text-sm font-semibold hover:bg-maroon transition-colors">
              Browse by state
            </Link>
          </div>
        </div>
      )}

      {restaurants.length > 0 && (
        <>
          {isZipSearch && (
            <div className="flex items-center gap-2 text-sm text-spice mb-5">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Sorted by distance from ZIP {q}
            </div>
          )}

          <RestaurantGrid restaurants={restaurants} />

          {/* Pagination — text search only */}
          {!isZipSearch && totalPages > 1 && (
            <nav
              className="flex justify-center items-center gap-1.5 mt-12 flex-wrap"
              aria-label="Search results pages"
            >
              {page > 1 && (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
                  className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-spice hover:text-spice transition-colors"
                >
                  ← Prev
                </Link>
              )}
              {pageRange.map((p, idx) =>
                p === 'gap' ? (
                  <span key={`gap-${idx}`} className="w-8 text-center text-gray-400 text-sm select-none">…</span>
                ) : (
                  <Link
                    key={p}
                    href={`/search?q=${encodeURIComponent(q)}&page=${p}`}
                    aria-current={p === page ? 'page' : undefined}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-spice text-white pointer-events-none'
                        : 'border border-gray-200 text-gray-600 hover:border-spice hover:text-spice'
                    }`}
                  >
                    {p}
                  </Link>
                ),
              )}
              {page < totalPages && (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}
                  className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-spice hover:text-spice transition-colors"
                >
                  Next →
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
