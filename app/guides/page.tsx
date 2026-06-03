import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Indian Food Guides — Regional Cuisine, Jain Dining & More',
  description: 'Expert guides to Indian cuisine in America: where to find the best biryani, Jain-friendly restaurants, South Indian dosa, and more.',
};

const GUIDES = [
  {
    slug: 'best-biryani-usa',
    title: 'Where to Find the Best Biryani in America',
    description: 'A city-by-city guide to Hyderabadi dum biryani, Lucknowi biryani, and other regional styles across the USA.',
  },
  {
    slug: 'jain-restaurants-usa-guide',
    title: 'Jain Restaurants in the USA — A Complete Guide',
    description: 'The definitive guide to finding Jain-friendly Indian restaurants (no onion, garlic, or root vegetables) across America.',
  },
  {
    slug: 'south-indian-dosa-guide-usa',
    title: 'South Indian Dosa & Idli — Where to Eat Across the USA',
    description: 'From masala dosa to ghee roast, find the best South Indian restaurants in America.',
  },
  {
    slug: 'little-india-neighborhoods-usa',
    title: 'Little India Neighborhoods in the USA',
    description: "A guide to America's most vibrant Indian food corridors: Edison's Oak Tree Road, Chicago's Devon Avenue, Houston's Hillcroft, and more.",
  },
  {
    slug: 'vegetarian-indian-restaurants-usa',
    title: 'Best Vegetarian Indian Restaurants in the USA',
    description: 'Pure vegetarian and vegan Indian restaurants across America — from upscale thali to casual dosa spots.',
  },
  {
    slug: 'indian-restaurant-regional-cuisine-explained',
    title: 'Regional Indian Cuisines Explained',
    description: 'What makes North Indian, South Indian, Hyderabadi, Gujarati, and other regional cuisines different — and how to find them near you.',
  },
  {
    slug: 'halal-indian-restaurants-usa',
    title: 'Halal Indian Restaurants in the USA',
    description: 'Find halal-certified Indian restaurants across major US cities.',
  },
  {
    slug: 'indo-chinese-food-usa-guide',
    title: 'Indo-Chinese Food in the USA — A Guide',
    description: 'Manchurian, hakka noodles, and schezwan dishes: the Indo-Chinese restaurants worth visiting in America.',
  },
];

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-maroon mb-2">Indian Food Guides</h1>
      <p className="text-gray-600 mb-10">
        Expert, data-backed guides to Indian food in America — from regional cuisine to dietary needs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GUIDES.map(guide => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-saffron hover:shadow-md transition-all group"
          >
            <h2 className="font-bold text-gray-900 group-hover:text-spice transition-colors leading-snug">
              {guide.title}
            </h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{guide.description}</p>
            <span className="text-xs text-spice mt-3 inline-block font-medium">Read guide →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
