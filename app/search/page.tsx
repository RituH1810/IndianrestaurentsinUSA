export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { RestaurantGrid } from '@/components/restaurant/RestaurantGrid';
import { SearchBar } from '@/components/filters/SearchBar';
import { NearMeButton } from '@/components/filters/NearMeButton';
import Link from 'next/link';
import type { Metadata } from 'next';

const PAGE_SIZE = 30; // 10 rows × 3 columns

export const metadata: Metadata = {
  title: 'Search Indian Restaurants',
  robots: { index: false, follow: true },
};

// Returns page numbers and 'gap' markers for ellipsis
function buildPageRange(current: number, total: number): (number | 'gap')[] {
  if (total <= 1) return [];
  if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);

  const visible = new Set<number>([1, total]);
  for (let p = Math.max(1, current - 2); p <= Math.min(total, current + 2); p++) {
    visible.add(p);
  }

  const sorted = [...visible].sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('gap');
    result.push(sorted[i]);
  }
  return result;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const q = (searchParams.q ?? '').trim();
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));

  let restaurants: {
    slug: string; name: string; city: string; state: string;
    rating: number | null; reviews: number | null; photo: string | null;
    cuisine_tags: string | null; dietary_tags: string | null;
    is_hidden_gem: boolean; description: string | null;
  }[] = [];
  let total = 0;

  if (q) {
    const where = {
      is_published: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' as const } },
        { city: { contains: q, mode: 'insensitive' as const } },
        { state: { contains: q, mode: 'insensitive' as const } },
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

  const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 0;
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
          Search by restaurant name, city, state, or cuisine type.
        </p>
      )}

      {q && (
        <p className="text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
          {total > 0
            ? `${total} result${total !== 1 ? 's' : ''} for "${q}"${totalPages > 1 ? ` · Page ${page} of ${totalPages}` : ''}`
            : `No results for "${q}" — try a different search term`}
        </p>
      )}

      {restaurants.length > 0 && (
        <>
          <RestaurantGrid restaurants={restaurants} />

          {/* Pagination — only when there is more than one page */}
          {totalPages > 1 && (
            <nav
              className="flex justify-center items-center gap-1.5 mt-12 flex-wrap"
              aria-label="Search results pages"
            >
              {/* Prev */}
              {page > 1 && (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
                  className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-spice hover:text-spice transition-colors"
                >
                  ← Prev
                </Link>
              )}

              {/* Page number buttons + gap markers */}
              {pageRange.map((p, idx) =>
                p === 'gap' ? (
                  <span key={`gap-${idx}`} className="w-8 text-center text-gray-400 text-sm select-none">
                    …
                  </span>
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

              {/* Next */}
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
