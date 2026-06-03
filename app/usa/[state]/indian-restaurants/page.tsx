import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { slugToLabel, cityNameToSlug } from '@/lib/utils';
import { RestaurantGrid } from '@/components/restaurant/RestaurantGrid';
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd';
import { stateMeta } from '@/lib/seo';
import { CUISINES } from '@/lib/taxonomy';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indianrestaurantsinusa.com';

export async function generateMetadata({ params }: { params: { state: string } }) {
  const stateName = slugToLabel(params.state);
  return stateMeta(stateName, 0);
}

export async function generateStaticParams() {
  try {
    const rows = await prisma.restaurant.groupBy({
      by: ['state'],
      where: { is_published: true },
    });
    return rows.map(r => ({ state: r.state.toLowerCase().replace(/\s+/g, '-') }));
  } catch { return []; }
}

export default async function StateHubPage({ params }: { params: { state: string } }) {
  const stateName = slugToLabel(params.state);

  let restaurants: {
    slug: string; name: string; city: string; state: string;
    rating: number | null; reviews: number | null; photo: string | null;
    cuisine_tags: string | null; dietary_tags: string | null;
    is_hidden_gem: boolean; description: string | null;
  }[] = [];

  let cities: { city: string; _count: { city: number } }[] = [];

  try {
    [restaurants, cities] = await Promise.all([
      prisma.restaurant.findMany({
        where: { state: stateName, is_published: true },
        orderBy: { publish_priority: 'desc' },
        take: 24,
        select: {
          slug: true, name: true, city: true, state: true,
          rating: true, reviews: true, photo: true,
          cuisine_tags: true, dietary_tags: true,
          is_hidden_gem: true, description: true,
        },
      }),
      prisma.restaurant.groupBy({
        by: ['city'],
        where: { state: stateName, is_published: true },
        _count: { city: true },
        orderBy: { _count: { city: 'desc' } },
      }),
    ]);
  } catch { /* DB not ready */ }

  if (restaurants.length === 0 && cities.length === 0) {
    // Don't 404 — state may exist after pipeline runs
  }

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: BASE },
        { name: `Indian Restaurants in ${stateName}`, url: `${BASE}/usa/${params.state}/indian-restaurants` },
      ]} />
      <ItemListJsonLd
        name={`Indian Restaurants in ${stateName}`}
        items={restaurants.map(r => ({ name: r.name, url: `${BASE}/restaurants/${r.slug}` }))}
      />

      <div className="container mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-4 flex gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-spice">Home</Link>
          <span>/</span>
          <Link href="/usa" className="hover:text-spice">States</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{stateName}</span>
        </nav>

        <h1 className="text-3xl font-bold text-maroon">
          Indian Restaurants in {stateName}
        </h1>
        <p className="text-gray-600 mt-1 mb-8">
          {restaurants.length > 0 ? `Showing top listings — ` : ''}{cities.length} cities
        </p>

        {/* City grid */}
        {cities.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Browse by City</h2>
            <div className="flex flex-wrap gap-3">
              {cities.slice(0, 20).map(({ city, _count }) => (
                <Link
                  key={city}
                  href={`/usa/${params.state}/${cityNameToSlug(city)}/indian-restaurants`}
                  className="px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-saffron text-sm text-gray-700 hover:text-spice transition-colors"
                >
                  {city} <span className="text-gray-400">({_count.city})</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Cuisine filter row */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Filter by Cuisine</h2>
          <div className="flex flex-wrap gap-2">
            {CUISINES.map(c => (
              <Link
                key={c.tag}
                href={`/indian-food/${c.tag}`}
                className="px-3 py-1.5 rounded-full border border-saffron/50 text-spice text-sm hover:bg-saffron hover:text-white transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Top Indian Restaurants in {stateName}
        </h2>
        <RestaurantGrid
          restaurants={restaurants}
          emptyMessage={`Run the data pipeline to see Indian restaurants in ${stateName}.`}
        />
      </div>
    </>
  );
}
