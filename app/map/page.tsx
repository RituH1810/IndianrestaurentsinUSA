import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Indian Restaurant Map — USA',
  description: 'Interactive map of Indian restaurants across the United States. Find Indian food near you.',
};

const MapClient = dynamic(() => import('@/components/map/MapClient'), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: '72vh' }}
      className="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm"
    >
      Loading map…
    </div>
  ),
});

interface RestaurantPoint {
  slug: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  rating: number | null;
}

export default async function MapPage() {
  let restaurants: RestaurantPoint[] = [];

  try {
    const rows = await prisma.restaurant.findMany({
      where: {
        is_published: true,
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        slug: true,
        name: true,
        city: true,
        state: true,
        latitude: true,
        longitude: true,
        rating: true,
      },
      orderBy: { rating: 'desc' },
      take: 3000,
    });

    restaurants = rows
      .filter(r => r.latitude != null && r.longitude != null)
      .map(r => ({
        slug: r.slug,
        name: r.name,
        city: r.city,
        state: r.state,
        latitude: r.latitude as number,
        longitude: r.longitude as number,
        rating: r.rating,
      }));
  } catch { /* DB not ready */ }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-maroon mb-1">Indian Restaurant Map</h1>
      <p className="text-gray-500 text-sm mb-6">
        {restaurants.length > 0
          ? `${restaurants.length.toLocaleString()} restaurants plotted across the USA. Click any dot for details.`
          : 'Interactive map of Indian restaurants across the USA.'}
      </p>

      <MapClient restaurants={restaurants} />

      <p className="text-xs text-gray-400 mt-3 text-center">
        Map data © <a href="https://www.openstreetmap.org/copyright" className="underline">OpenStreetMap</a> contributors
      </p>
    </div>
  );
}
