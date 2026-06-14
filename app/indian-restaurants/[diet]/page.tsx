export const revalidate = 3600;

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { DIETARY, getDietaryLabel } from '@/lib/taxonomy';
import { FilterableGrid } from '@/components/restaurant/FilterableGrid';
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd';
import { dietaryMeta } from '@/lib/seo';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indianrestaurantsinusa.com';

export async function generateMetadata({ params }: { params: { diet: string } }) {
  const label = getDietaryLabel(params.diet);
  return dietaryMeta(label, 0);
}


function whereHasTag(field: 'dietary_tags', tag: string) {
  return {
    OR: [
      { [field]: tag },
      { [field]: { startsWith: `${tag}|` } },
      { [field]: { endsWith: `|${tag}` } },
      { [field]: { contains: `|${tag}|` } },
    ],
  };
}

export default async function DietaryHubPage({ params }: { params: { diet: string } }) {
  const dietInfo = DIETARY.find(d => d.tag === params.diet);
  if (!dietInfo) notFound();

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
      where: { ...whereHasTag('dietary_tags', params.diet), is_published: true },
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
        { name: 'Dietary', url: `${BASE}/indian-restaurants` },
        { name: dietInfo.label, url: `${BASE}/indian-restaurants/${params.diet}` },
      ]} />
      <ItemListJsonLd
        name={`${dietInfo.label} Indian Restaurants in the USA`}
        description={dietInfo.description}
        items={restaurants.map(r => ({ name: r.name, url: `${BASE}/restaurants/${r.slug}` }))}
      />

      <div className="container mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-4 flex gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-spice">Home</Link>
          <span>/</span>
          <Link href="/indian-restaurants" className="hover:text-spice">Dietary</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{dietInfo.label}</span>
        </nav>

        <h1 className="text-3xl font-bold text-maroon">{dietInfo.label} Indian Restaurants in the USA</h1>
        <p className="text-gray-600 mt-1 mb-4">{dietInfo.description}</p>
        <p className="text-sm text-gray-500 mb-8">{restaurants.length} restaurants found.</p>

        {/* Other dietary links */}
        <div className="flex flex-wrap gap-2 mb-8">
          {DIETARY.filter(d => d.tag !== params.diet).map(d => (
            <Link
              key={d.tag}
              href={`/indian-restaurants/${d.tag}`}
              className="px-3 py-1.5 rounded-full border-2 border-green-200 text-sm text-green-700 hover:border-green-400 transition-colors"
            >
              {d.label}
            </Link>
          ))}
        </div>

        <FilterableGrid
          restaurants={restaurants}
          emptyMessage={`No ${dietInfo.label} restaurants found yet. Run classify-dietary.ts to tag restaurants.`}
        />
      </div>
    </>
  );
}
