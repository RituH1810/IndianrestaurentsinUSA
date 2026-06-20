export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { parseTags, parseHours, DAYS_OF_WEEK, formatReviews } from '@/lib/utils';
import { getCuisineLabel, getDietaryLabel } from '@/lib/taxonomy';
import { Badge } from '@/components/ui/Badge';
import { HiddenGemBadge } from '@/components/ui/HiddenGemBadge';
import { StarRating } from '@/components/ui/StarRating';
import { RestaurantJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { restaurantMeta } from '@/lib/seo';
import { GetDirectionsButton } from '@/components/restaurant/GetDirectionsButton';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indianrestaurantsinusa.com';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const r = await prisma.restaurant.findUnique({ where: { slug: params.slug } });
    if (!r) return {};
    return restaurantMeta(r.name, r.city, r.state, r.description);
  } catch { return {}; }
}


export default async function RestaurantPage({ params }: { params: { slug: string } }) {
  let restaurant;
  try {
    restaurant = await prisma.restaurant.findUnique({ where: { slug: params.slug } });
  } catch { notFound(); }
  if (!restaurant) notFound();

  const cuisineTags = parseTags(restaurant.cuisine_tags);
  const dietaryTags = parseTags(restaurant.dietary_tags);
  const hours = parseHours(restaurant.working_hours);
  const stateSlug = restaurant.state.toLowerCase().replace(/\s+/g, '-');
  const citySlug = restaurant.city.toLowerCase().replace(/\s+/g, '-');

  return (
    <>
      <RestaurantJsonLd
        name={restaurant.name}
        address={restaurant.address}
        city={restaurant.city}
        state={restaurant.state}
        zip={restaurant.zip}
        phone={restaurant.phone}
        website={restaurant.website}
        rating={restaurant.rating}
        reviews={restaurant.reviews}
        photo={restaurant.photo}
        description={restaurant.description}
        latitude={restaurant.latitude}
        longitude={restaurant.longitude}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: BASE },
        { name: restaurant.state, url: `${BASE}/usa/${stateSlug}/indian-restaurants` },
        { name: restaurant.city, url: `${BASE}/usa/${stateSlug}/${citySlug}/indian-restaurants` },
        { name: restaurant.name, url: `${BASE}/restaurants/${restaurant.slug}` },
      ]} />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex flex-wrap items-center gap-1.5">
          <Link href="/" className="hover:text-spice transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/usa/${stateSlug}/indian-restaurants`} className="hover:text-spice transition-colors">{restaurant.state}</Link>
          <span>/</span>
          <Link href={`/usa/${stateSlug}/${citySlug}/indian-restaurants`} className="hover:text-spice transition-colors">{restaurant.city}</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{restaurant.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            {restaurant.photo && (
              <div className="relative h-72 md:h-96 rounded-xl overflow-hidden mb-6 bg-gray-100">
                <Image
                  src={restaurant.photo}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
                {restaurant.is_hidden_gem && (
                  <div className="absolute top-4 right-4"><HiddenGemBadge /></div>
                )}
              </div>
            )}

            <h1 className="text-3xl font-bold text-maroon">{restaurant.name}</h1>
            <p className="text-gray-600 mt-1 text-sm">{restaurant.address}</p>

            {(restaurant.rating != null || restaurant.reviews != null) && (
              <div className="flex items-center gap-3 mt-3">
                {restaurant.rating != null && <StarRating rating={restaurant.rating} />}
                {restaurant.reviews != null && (
                  <span className="text-sm text-gray-500">{formatReviews(restaurant.reviews)} reviews</span>
                )}
              </div>
            )}

            {restaurant.description && (
              <p className="mt-5 text-gray-700 leading-relaxed">{restaurant.description}</p>
            )}

            {cuisineTags.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Regional Cuisine</h2>
                <div className="flex flex-wrap gap-2">
                  {cuisineTags.map(tag => (
                    <Link key={tag} href={`/indian-food/${tag}`}>
                      <Badge variant="cuisine">{getCuisineLabel(tag)}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {dietaryTags.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Dietary Options</h2>
                <div className="flex flex-wrap gap-2">
                  {dietaryTags.map(tag => (
                    <Link key={tag} href={`/indian-restaurants/${tag}`}>
                      <Badge variant="dietary">{getDietaryLabel(tag)}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {hours && (
              <div className="mt-7">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Opening Hours</h2>
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                  {DAYS_OF_WEEK.map(day =>
                    hours[day] ? (
                      <div key={day} className="flex justify-between px-4 py-2.5 text-sm">
                        <span className="font-medium text-gray-700 w-28">{day}</span>
                        <span className="text-gray-600">{Array.isArray(hours[day]) ? hours[day].join(', ') : hours[day]}</span>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
              <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Contact & Info</h2>

              {/* Directions */}
              <GetDirectionsButton
                name={restaurant.name}
                address={`${restaurant.address}, ${restaurant.city}, ${restaurant.state}`}
                lat={restaurant.latitude}
                lng={restaurant.longitude}
              />

              {restaurant.phone && (
                <div className="text-sm">
                  <span className="text-gray-500">Phone: </span>
                  <a href={`tel:${restaurant.phone}`} className="text-spice hover:underline">{restaurant.phone}</a>
                </div>
              )}
              {restaurant.website && (
                <div className="text-sm">
                  <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-spice hover:underline font-medium">
                    Visit Website →
                  </a>
                </div>
              )}
              {restaurant.business_status === 'CLOSED_PERMANENTLY' && (
                <div className="text-sm">
                  <span className="text-gray-500">Status: </span>
                  <span className="text-red-500 font-semibold">Permanently Closed</span>
                </div>
              )}
              {restaurant.business_status === 'CLOSED_TEMPORARILY' && (
                <div className="text-sm">
                  <span className="text-gray-500">Status: </span>
                  <span className="text-amber-600 font-semibold">Temporarily Closed</span>
                </div>
              )}
              {restaurant.metro && (
                <div className="text-sm text-gray-500">Metro: {restaurant.metro}</div>
              )}
              {restaurant.located_in && (
                <div className="text-sm text-gray-500">Located in: {restaurant.located_in}</div>
              )}
            </div>

            <div className="bg-cream rounded-xl border border-saffron/20 p-5">
              <h2 className="font-semibold text-maroon mb-3 text-sm">More in {restaurant.city}</h2>
              <Link
                href={`/usa/${stateSlug}/${citySlug}/indian-restaurants`}
                className="text-sm text-spice hover:underline"
              >
                All Indian restaurants in {restaurant.city} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
