import { prisma } from '@/lib/prisma';
import { RestaurantGrid } from '@/components/restaurant/RestaurantGrid';
import { SearchBar } from '@/components/filters/SearchBar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Indian Restaurants',
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? '').trim();

  let restaurants: {
    slug: string; name: string; city: string; state: string;
    rating: number | null; reviews: number | null; photo: string | null;
    cuisine_tags: string | null; dietary_tags: string | null;
    is_hidden_gem: boolean; description: string | null;
  }[] = [];

  if (q) {
    try {
      restaurants = await prisma.restaurant.findMany({
        where: {
          is_published: true,
          OR: [
            { name: { contains: q } },
            { city: { contains: q } },
            { state: { contains: q } },
            { cuisine_tags: { contains: q } },
            { description: { contains: q } },
          ],
        },
        orderBy: { publish_priority: 'desc' },
        take: 60,
        select: {
          slug: true, name: true, city: true, state: true,
          rating: true, reviews: true, photo: true,
          cuisine_tags: true, dietary_tags: true,
          is_hidden_gem: true, description: true,
        },
      });
    } catch { /* DB not ready */ }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-maroon mb-6">Search Indian Restaurants</h1>

      <div className="max-w-xl mb-8">
        <SearchBar defaultValue={q} />
      </div>

      {q && (
        <p className="text-gray-600 mb-6">
          {restaurants.length > 0
            ? `${restaurants.length} results for "${q}"`
            : `No results for "${q}"`}
        </p>
      )}

      {q && (
        <RestaurantGrid
          restaurants={restaurants}
          emptyMessage={`No Indian restaurants found matching "${q}". Try a different search.`}
        />
      )}
    </div>
  );
}
