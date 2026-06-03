export const revalidate = 3600;

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { slugToLabel } from '@/lib/utils';
import { RestaurantGrid } from '@/components/restaurant/RestaurantGrid';
import { BreadcrumbJsonLd, ItemListJsonLd, FaqJsonLd } from '@/components/seo/JsonLd';
import { cityMeta } from '@/lib/seo';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indianrestaurantsinusa.com';

export async function generateMetadata({ params }: { params: { state: string; city: string } }) {
  const cityName = slugToLabel(params.city);
  const stateName = slugToLabel(params.state);
  return cityMeta(cityName, stateName, 0);
}

export async function generateStaticParams() {
  try {
    const rows = await prisma.restaurant.findMany({
      where: { is_published: true },
      select: { state: true, city: true },
      distinct: ['state', 'city'],
    });
    return rows.map(r => ({
      state: r.state.toLowerCase().replace(/\s+/g, '-'),
      city: r.city.toLowerCase().replace(/\s+/g, '-'),
    }));
  } catch { return []; }
}

export default async function CityHubPage({ params }: { params: { state: string; city: string } }) {
  const stateName = slugToLabel(params.state);
  const cityName = slugToLabel(params.city);

  let restaurants: {
    slug: string; name: string; city: string; state: string;
    rating: number | null; reviews: number | null; photo: string | null;
    cuisine_tags: string | null; dietary_tags: string | null;
    is_hidden_gem: boolean; description: string | null;
  }[] = [];

  try {
    restaurants = await prisma.restaurant.findMany({
      where: { state: stateName, city: cityName, is_published: true },
      orderBy: { publish_priority: 'desc' },
      select: {
        slug: true, name: true, city: true, state: true,
        rating: true, reviews: true, photo: true,
        cuisine_tags: true, dietary_tags: true,
        is_hidden_gem: true, description: true,
      },
    });
  } catch { /* DB not ready */ }

  const faqs = [
    {
      question: `How many Indian restaurants are in ${cityName}, ${stateName}?`,
      answer: `There are ${restaurants.length} Indian restaurants listed in ${cityName}, ${stateName} on Indian Restaurants in USA.`,
    },
    {
      question: `Are there Jain-friendly Indian restaurants in ${cityName}?`,
      answer: `Use the Jain filter on our dietary page to find Jain-friendly Indian restaurants in ${cityName} with no onion, garlic, or root vegetables.`,
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: BASE },
        { name: stateName, url: `${BASE}/usa/${params.state}/indian-restaurants` },
        { name: `Indian Restaurants in ${cityName}`, url: `${BASE}/usa/${params.state}/${params.city}/indian-restaurants` },
      ]} />
      <ItemListJsonLd
        name={`Indian Restaurants in ${cityName}, ${stateName}`}
        items={restaurants.map(r => ({ name: r.name, url: `${BASE}/restaurants/${r.slug}` }))}
      />
      <FaqJsonLd faqs={faqs} />

      <div className="container mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-4 flex gap-1.5 flex-wrap items-center">
          <Link href="/" className="hover:text-spice">Home</Link>
          <span>/</span>
          <Link href="/usa" className="hover:text-spice">States</Link>
          <span>/</span>
          <Link href={`/usa/${params.state}/indian-restaurants`} className="hover:text-spice">{stateName}</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{cityName}</span>
        </nav>

        <h1 className="text-3xl font-bold text-maroon">
          Indian Restaurants in {cityName}, {stateName}
        </h1>
        <p className="text-gray-600 mt-1 mb-8">
          {restaurants.length} restaurants · filtered by cuisine and dietary need
        </p>

        <RestaurantGrid
          restaurants={restaurants}
          emptyMessage={`No Indian restaurants found in ${cityName} yet. Run the data pipeline to populate listings.`}
        />

        {/* FAQ section */}
        <div className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold text-maroon mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {faqs.map(faq => (
              <div key={faq.question}>
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                <p className="text-gray-600 text-sm mt-1">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
