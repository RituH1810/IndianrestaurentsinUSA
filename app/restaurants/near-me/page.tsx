import { prisma } from '@/lib/prisma';
import { NearMeClient } from '@/components/restaurant/NearMeClient';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { FilterableRestaurant } from '@/components/restaurant/FilterableGrid';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Indian Restaurants Near Me — Within 25 Miles',
  robots: { index: false, follow: true },
};

type NearbyRow = {
  slug: string; name: string; city: string; state: string;
  rating: number | null; reviews: number | null; photo: string | null;
  cuisine_tags: string | null; dietary_tags: string | null;
  is_hidden_gem: boolean; description: string | null;
  distance_miles: number;
};

async function getLocationName(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'User-Agent': 'IndianRestaurantsInUSA/1.0' }, next: { revalidate: 3600 } },
    );
    const data = await res.json();
    const addr = data.address ?? {};
    const city = addr.city || addr.town || addr.village;
    const state = addr.state;
    if (city && state) return `${city}, ${state}`;
    if (state) return state;
  } catch {}
  return 'your location';
}

export default async function NearMePage({
  searchParams,
}: {
  searchParams: { lat?: string; lng?: string };
}) {
  const lat = parseFloat(searchParams.lat ?? '');
  const lng = parseFloat(searchParams.lng ?? '');

  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-5xl text-center">
        <p className="text-2xl mb-4">📍</p>
        <p className="text-gray-500 mb-4">No location provided.</p>
        <Link href="/" className="px-5 py-2.5 bg-spice text-white rounded-full text-sm font-semibold hover:bg-maroon transition-colors">
          Go home
        </Link>
      </div>
    );
  }

  const [rows, locationName] = await Promise.all([
    prisma.$queryRaw<NearbyRow[]>`
      SELECT
        slug, name, city, state, rating, reviews, photo,
        cuisine_tags, dietary_tags, is_hidden_gem, description,
        ROUND(
          (3959 * acos(
            LEAST(1.0,
              cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng}))
              + sin(radians(${lat})) * sin(radians(latitude))
            )
          ))::numeric, 1
        ) AS distance_miles
      FROM "Restaurant"
      WHERE
        is_published = true
        AND latitude IS NOT NULL AND longitude IS NOT NULL
        AND latitude != 0 AND longitude != 0
        AND (3959 * acos(LEAST(1.0,
          cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng}))
          + sin(radians(${lat})) * sin(radians(latitude))
        ))) <= 25
      ORDER BY distance_miles
      LIMIT 300
    `,
    getLocationName(lat, lng),
  ]);

  const restaurants: FilterableRestaurant[] = rows.map(r => ({
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
  }));

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-maroon">Indian Restaurants Near You</h1>
        <p className="text-sm text-gray-500 mt-1">
          {rows.length > 0
            ? `${rows.length} restaurant${rows.length !== 1 ? 's' : ''} within 25 miles of ${locationName}`
            : `No Indian restaurants found within 25 miles of ${locationName}`}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-16 border border-gray-100 rounded-xl bg-gray-50">
          <p className="text-4xl mb-4">🍛</p>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            No restaurants in our directory are within 25 miles. Try browsing by state or searching by city name.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/usa" className="px-5 py-2.5 bg-spice text-white rounded-full text-sm font-semibold hover:bg-maroon transition-colors">
              Browse by state
            </Link>
            <Link href="/search" className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
              Search by city
            </Link>
          </div>
        </div>
      ) : (
        <NearMeClient restaurants={restaurants} />
      )}
    </div>
  );
}
