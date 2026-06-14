export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { RestaurantGrid } from '@/components/restaurant/RestaurantGrid';
import { ItemListJsonLd } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indianrestaurantsinusa.com';

export const metadata: Metadata = {
  title: 'Best Indian Restaurants in the USA — Hidden Gems',
  description: 'Discover hidden gem Indian restaurants across the USA: top-rated with under 200 reviews. Authentic, neighbourhood spots that chains and food blogs overlook.',
};

export default async function BestRestaurantsPage() {
  let restaurants: {
    slug: string; name: string; city: string; state: string;
    rating: number | null; reviews: number | null; photo: string | null;
    cuisine_tags: string | null; dietary_tags: string | null;
    is_hidden_gem: boolean; description: string | null;
  }[] = [];

  try {
    restaurants = await prisma.restaurant.findMany({
      where: { is_hidden_gem: true, is_published: true },
      orderBy: [{ rating: 'desc' }, { publish_priority: 'desc' }],
      select: {
        slug: true, name: true, city: true, state: true,
        rating: true, reviews: true, photo: true,
        cuisine_tags: true, dietary_tags: true,
        is_hidden_gem: true, description: true,
      },
    });
  } catch { /* DB not ready */ }

  return (
    <>
      <ItemListJsonLd
        name="Best Hidden Gem Indian Restaurants in the USA"
        description="Top-rated Indian restaurants with under 200 reviews — authentic neighbourhood spots."
        items={restaurants.map(r => ({ name: r.name, url: `${BASE}/restaurants/${r.slug}` }))}
      />

      <div className="container mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-4 flex gap-1.5">
          <Link href="/" className="hover:text-spice">Home</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Hidden Gems</span>
        </nav>

        <h1 className="text-3xl font-bold text-maroon">
          Best Indian Restaurants in the USA — Hidden Gems
        </h1>
        <p className="text-gray-600 mt-2 mb-4 max-w-2xl">
          These restaurants are rated 4.5+ stars but have fewer than 200 reviews —
          the authentic neighbourhood spots that chains and food blogs consistently overlook.
          Data updated weekly.
        </p>
        <p className="text-sm text-gray-400 mb-8">{restaurants.length} hidden gems found.</p>

        <div className="bg-turmeric/20 border border-turmeric rounded-xl p-5 mb-8 max-w-xl">
          <h2 className="font-bold text-maroon text-sm mb-1">How We Define Hidden Gems</h2>
          <p className="text-xs text-gray-700">
            Rating ≥ 4.5 stars · Under 200 Google reviews · Currently operational.
            This combination surfaces genuinely exceptional restaurants that haven&apos;t been discovered by the crowds yet.
          </p>
        </div>

        <RestaurantGrid
          restaurants={restaurants}
          emptyMessage="Run the data pipeline (scripts 7 and 10) to discover hidden gems."
        />
      </div>
    </>
  );
}
