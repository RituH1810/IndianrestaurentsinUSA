export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CUISINES, getCuisineLabel } from '@/lib/taxonomy';
import { FilterableGrid } from '@/components/restaurant/FilterableGrid';
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd';
import { cuisineMeta } from '@/lib/seo';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indianrestaurantsinusa.com';

export async function generateMetadata({ params }: { params: { cuisine: string } }) {
  const label = getCuisineLabel(params.cuisine);
  return cuisineMeta(label, 0);
}


function whereHasTag(field: 'cuisine_tags', tag: string) {
  return {
    OR: [
      { [field]: tag },
      { [field]: { startsWith: `${tag}|` } },
      { [field]: { endsWith: `|${tag}` } },
      { [field]: { contains: `|${tag}|` } },
    ],
  };
}

export default async function CuisineHubPage({ params }: { params: { cuisine: string } }) {
  const cuisineInfo = CUISINES.find(c => c.tag === params.cuisine);
  if (!cuisineInfo) notFound();

  let restaurants: {
    slug: string; name: string; city: string; state: string;
    rating: number | null; reviews: number | null; photo: string | null;
    cuisine_tags: string | null; dietary_tags: string | null;
    is_hidden_gem: boolean; description: string | null;
    phone: string | null; website: string | null; business_status: string | null;
    latitude: number | null; longitude: number | null;
  }[] = [];

  try {
    restaurants = await prisma.restaurant.findMany({
      where: { ...whereHasTag('cuisine_tags', params.cuisine), is_published: true },
      orderBy: { publish_priority: 'desc' },
      select: {
        slug: true, name: true, city: true, state: true,
        rating: true, reviews: true, photo: true,
        cuisine_tags: true, dietary_tags: true,
        is_hidden_gem: true, description: true,
        phone: true, website: true, business_status: true,
        latitude: true, longitude: true,
      },
    });
  } catch { /* DB not ready */ }

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: BASE },
        { name: 'Cuisines', url: `${BASE}/indian-food` },
        { name: cuisineInfo.label, url: `${BASE}/indian-food/${params.cuisine}` },
      ]} />
      <ItemListJsonLd
        name={`${cuisineInfo.label} Restaurants in the USA`}
        description={`Browse ${restaurants.length} ${cuisineInfo.label} restaurants across the United States.`}
        items={restaurants.map(r => ({ name: r.name, url: `${BASE}/restaurants/${r.slug}` }))}
      />

      <div className="container mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-4 flex gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-spice">Home</Link>
          <span>/</span>
          <Link href="/indian-food" className="hover:text-spice">Cuisines</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{cuisineInfo.label}</span>
        </nav>

        <h1 className="text-3xl font-bold text-maroon">{cuisineInfo.label} Restaurants in the USA</h1>
        <p className="text-gray-600 mt-1 mb-4">
          Discover authentic {cuisineInfo.label} cuisine at restaurants across America.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Key dishes: {cuisineInfo.keywords.join(', ')}
        </p>

        {/* Other cuisine links */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CUISINES.filter(c => c.tag !== params.cuisine).map(c => (
            <Link
              key={c.tag}
              href={`/indian-food/${c.tag}`}
              className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-saffron hover:text-spice transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </div>

        <FilterableGrid
          restaurants={restaurants}
          emptyMessage={`No ${cuisineInfo.label} restaurants found yet. Run classify-cuisine.ts to tag restaurants.`}
        />
      </div>
    </>
  );
}
