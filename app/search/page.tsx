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

function paginationRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const delta = 2;
  const inner: number[] = [];
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    inner.push(i);
  }
  const result: (number | '…')[] = [1];
  if (inner[0] > 2) result.push('…');
  result.push(...inner);
  if (inner[inner.length - 1] < total - 1) result.push('…');
  result.push(total);
  return result;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const q = (searchParams.q ?? '').trim();
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const skip = (page - 1) * PAGE_SIZE;

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
      [total, restaurants] = await Promise.all([
        prisma.restaurant.count({ where }),
        prisma.restaurant.findMany({
          where,
          orderBy: { publish_priority: 'desc' },
          skip,
          take: PAGE_SIZE,
          select: {
            slug: true, name: true, city: true, state: true,
            rating: true, reviews: true, photo: true,
            cuisine_tags: true, dietary_tags: true,
            is_hidden_gem: true, description: true,
          },
        }),
      ]);
    } catch { /* DB not ready */ }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pageRange = paginationRange(page, totalPages);

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

      {q && restaurants.length > 0 && (
        <>
          <RestaurantGrid restaurants={restaurants} />

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex justify-center items-center gap-1.5 mt-12" aria-label="Pagination">
              {page > 1 && (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
                  className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-spice hover:text-spice transition-colors"
                >
                  ← Prev
                </Link>
              )}

              {pageRange.map((p, idx) =>
                p === '…' ? (
                  <span key={`ellipsis-${idx}`} className="w-9 text-center text-gray-400 text-sm">
                    …
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={`/search?q=${encodeURIComponent(q)}&page=${p}`}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-spice text-white'
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
