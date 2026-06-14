export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { slugToLabel } from '@/lib/utils';
import { ListingClient } from '@/components/listing/ListingClient';
import { BreadcrumbJsonLd, ItemListJsonLd, FaqJsonLd } from '@/components/seo/JsonLd';
import { cityMeta } from '@/lib/seo';
import type { RestaurantListData } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indianrestaurantsinusa.com';

export async function generateMetadata({ params }: { params: { state: string; city: string } }) {
  const cityName = slugToLabel(params.city);
  const stateName = slugToLabel(params.state);
  return cityMeta(cityName, stateName, 0);
}


export default async function CityHubPage({ params }: { params: { state: string; city: string } }) {
  const stateName = slugToLabel(params.state);
  const cityName = slugToLabel(params.city);

  let restaurants: RestaurantListData[] = [];
  let total = 0;

  try {
    // Try exact match first; fall back to case-insensitive contains for slugs
    // that don't perfectly round-trip (e.g. "new-york-city" → "New York City" vs "New York")
    const exactWhere = { state: stateName, city: cityName, is_published: true };
    const exactCount = await prisma.restaurant.count({ where: exactWhere });
    const where = exactCount > 0
      ? exactWhere
      : {
          state: { equals: stateName, mode: 'insensitive' as const },
          city: { contains: cityName.split(',')[0], mode: 'insensitive' as const },
          is_published: true,
        };

    const rows = await prisma.restaurant.findMany({
      where,
      orderBy: { publish_priority: 'desc' },
      take: 200,
      select: {
        slug: true, name: true, city: true, state: true,
        rating: true, reviews: true, photo: true,
        cuisine_tags: true, dietary_tags: true,
        is_hidden_gem: true, description: true,
        phone: true, website: true, business_status: true,
      },
    });

    total = await prisma.restaurant.count({ where });

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

  const faqs = [
    {
      question: `How many Indian restaurants are in ${cityName}, ${stateName}?`,
      answer: `There are ${total} Indian restaurants listed in ${cityName}, ${stateName} on Indian Restaurants in USA.`,
    },
    {
      question: `Are there Jain-friendly Indian restaurants in ${cityName}?`,
      answer: `Use the Jain filter above to find Jain-friendly Indian restaurants in ${cityName} with no onion, garlic, or root vegetables.`,
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-5 flex gap-1.5 flex-wrap items-center">
          <Link href="/" className="hover:text-spice transition-colors">Home</Link>
          <span>/</span>
          <Link href="/usa" className="hover:text-spice transition-colors">States</Link>
          <span>/</span>
          <Link href={`/usa/${params.state}/indian-restaurants`} className="hover:text-spice transition-colors">{stateName}</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{cityName}</span>
        </nav>

        {/* Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-maroon">
            Indian Restaurants in {cityName}, {stateName}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {total > 0 ? `${total} restaurants` : 'No listings yet'}
            {total > 200 ? ' · Showing top 200' : ''}
            {' · '}Use filters below to narrow by cuisine or dietary preference
          </p>
        </div>

        {/* Interactive listing */}
        <ListingClient restaurants={restaurants} total={total} />

        {/* FAQ */}
        {faqs.length > 0 && (
          <div className="mt-16 max-w-2xl border-t border-gray-100 pt-10">
            <h2 className="text-xl font-bold text-maroon mb-5">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {faqs.map(faq => (
                <div key={faq.question}>
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
