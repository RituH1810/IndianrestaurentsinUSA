import Link from 'next/link';
import { CUISINES } from '@/lib/taxonomy';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Indian Cuisines — Browse by Regional Style',
  description: 'Explore Indian restaurants by regional cuisine: North Indian, South Indian, Hyderabadi Biryani, Gujarati, Indo-Chinese, and more.',
};

export default function CuisinesIndexPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-maroon mb-2">Browse by Regional Indian Cuisine</h1>
      <p className="text-gray-600 mb-10 max-w-2xl">
        Indian cuisine is one of the world&apos;s most diverse. We classify every restaurant by its regional style —
        data you won&apos;t find on Yelp or Google.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {CUISINES.map(cuisine => (
          <Link
            key={cuisine.tag}
            href={`/indian-food/${cuisine.tag}`}
            className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-saffron hover:shadow-md transition-all group"
          >
            <h2 className="font-bold text-gray-900 group-hover:text-spice transition-colors">
              {cuisine.label}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {cuisine.keywords.slice(0, 3).join(', ')}…
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
