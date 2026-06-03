import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Indian Restaurant Map — USA',
  description: 'Interactive map of Indian restaurants across the United States. Find Indian food near you.',
};

export default async function MapPage() {
  let count = 0;
  try {
    count = await prisma.restaurant.count({ where: { is_published: true, latitude: { not: null } } });
  } catch { /* DB not ready */ }

  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-maroon mb-2">Indian Restaurant Map</h1>
      <p className="text-gray-600 mb-6">
        {count > 0 ? `${count} restaurants plotted across the USA.` : 'Interactive map of Indian restaurants across the USA.'}
      </p>

      {!mapsKey ? (
        <div className="bg-saffron/10 border border-saffron rounded-xl p-8 text-center max-w-lg mx-auto">
          <h2 className="font-bold text-maroon mb-2">Google Maps API Key Required</h2>
          <p className="text-sm text-gray-700">
            Add <code className="bg-white px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> to your{' '}
            <code className="bg-white px-1 rounded">.env.local</code> to enable the interactive map.
          </p>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-xl h-[70vh] flex items-center justify-center text-gray-500">
          {/* Google Maps integration goes here — add @vis.gl/react-google-maps component */}
          Map loading…
        </div>
      )}
    </div>
  );
}
