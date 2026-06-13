import { prisma } from '@/lib/prisma';
import { RestaurantListCard } from '@/components/restaurant/RestaurantListCard';
import { SearchBar } from '@/components/filters/SearchBar';
import type { Metadata } from 'next';
import type { RestaurantListData } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Search Indian Restaurants',
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? '').trim();

  let restaurants: RestaurantListData[] = [];

  if (q) {
    try {
      const rows = await prisma.restaurant.findMany({
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
          phone: true, website: true, business_status: true,
        },
      });

      restaurants = rows.map(r => ({
        slug: r.slug,
        name: r.name,
        city: r.city,
        state: r.state,
        rating: r.rating,
        reviews: r.reviews,
        photo: r.photo,
        cuisine_tags: r.cuisine_tags,
        dietary_tags: r.dietary_tags,
        is_hidden_gem: r.is_hidden_gem,
        description: r.description,
        phone: r.phone,
        website: r.website,
        business_status: r.business_status,
      }));
    } catch { /* DB not ready */ }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-maroon mb-6">Search Indian Restaurants</h1>

      <div className="max-w-2xl mb-8">
        <SearchBar defaultValue={q} />
      </div>

      {q && (
        <p className="text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
          {restaurants.length > 0
            ? `${restaurants.length} result${restaurants.length !== 1 ? 's' : ''} for "${q}"`
            : `No results for "${q}" — try a different search term`}
        </p>
      )}

      {!q && (
        <p className="text-gray-400 text-sm">
          Search by restaurant name, city, state, or cuisine type.
        </p>
      )}

      {q && restaurants.length > 0 && (
        <div className="divide-y divide-gray-100">
          {restaurants.map((r, i) => (
            <RestaurantListCard key={r.slug} restaurant={r} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
