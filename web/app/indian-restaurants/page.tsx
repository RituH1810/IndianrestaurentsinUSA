import Link from 'next/link';
import { DIETARY } from '@/lib/taxonomy';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Indian Restaurants by Dietary Need — Jain, Vegan, Halal & More',
  description: 'Find Indian restaurants that match your dietary needs. Filter by Jain, pure vegetarian, vegan, halal, and gluten-free options across the USA.',
};

export default function DietaryIndexPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-maroon mb-2">Filter Indian Restaurants by Dietary Need</h1>
      <p className="text-gray-600 mb-10 max-w-2xl">
        The only Indian restaurant directory with dedicated Jain filtering.
        Find restaurants that match your dietary requirements — from Jain (no onion/garlic) to halal to vegan.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {DIETARY.map(diet => (
          <Link
            key={diet.tag}
            href={`/indian-restaurants/${diet.tag}`}
            className="block bg-white rounded-xl border-2 border-green-200 p-6 hover:border-green-400 hover:shadow-md transition-all group"
          >
            <h2 className="font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors">
              {diet.label}
            </h2>
            <p className="text-sm text-gray-500 mt-2">{diet.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-14 bg-cream rounded-xl p-7 max-w-2xl">
        <h2 className="font-bold text-maroon mb-2">Why Jain Filtering Matters</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Jain dietary requirements (no onion, garlic, or root vegetables) are almost impossible to search for on mainstream platforms.
          Millions of Jain Americans struggle to find compliant restaurants when eating out.
          Indian Restaurants in USA is the first national directory to offer dedicated Jain restaurant filtering.
        </p>
      </div>
    </div>
  );
}
