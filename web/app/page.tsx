import Link from 'next/link';
import { CUISINES, DIETARY } from '@/lib/taxonomy';

const FEATURED_METROS = [
  { label: 'Edison, NJ', href: '/usa/new-jersey/edison/indian-restaurants' },
  { label: 'Bay Area, CA', href: '/usa/california/fremont/indian-restaurants' },
  { label: 'Chicago, IL', href: '/usa/illinois/chicago/indian-restaurants' },
  { label: 'Houston, TX', href: '/usa/texas/houston/indian-restaurants' },
  { label: 'New York City', href: '/usa/new-york/new-york-city/indian-restaurants' },
  { label: 'Dallas, TX', href: '/usa/texas/dallas/indian-restaurants' },
  { label: 'Charlotte, NC', href: '/usa/north-carolina/charlotte/indian-restaurants' },
  { label: 'Atlanta, GA', href: '/usa/georgia/atlanta/indian-restaurants' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-maroon to-spice text-cream py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
            Find the Best Indian Restaurants in the USA
          </h1>
          <p className="mt-4 text-lg text-cream/80 text-balance">
            Discover authentic regional cuisines — North Indian, South Indian, Hyderabadi, and more.
            Filter by Jain, vegetarian, vegan, and halal dietary needs.
          </p>
          <form action="/search" role="search" className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <label htmlFor="hero-search" className="sr-only">Search Indian restaurants</label>
            <input
              id="hero-search"
              name="q"
              type="search"
              placeholder="Search by restaurant, cuisine, or city…"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-saffron bg-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-saffron hover:bg-turmeric text-maroon font-bold rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Browse by cuisine */}
      <section className="py-14 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-maroon mb-2 text-center">Browse by Regional Cuisine</h2>
          <p className="text-center text-gray-500 text-sm mb-7">
            We classify every listing by regional Indian cuisine — something Yelp and Google don&apos;t do.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {CUISINES.map(c => (
              <Link
                key={c.tag}
                href={`/indian-food/${c.tag}`}
                className="px-4 py-2 rounded-full border-2 border-saffron text-spice hover:bg-saffron hover:text-white font-medium text-sm transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dietary filters */}
      <section className="py-14 px-4 bg-cream">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-maroon mb-2 text-center">Filter by Dietary Need</h2>
          <p className="text-center text-gray-500 text-sm mb-7">
            The only national Indian restaurant directory with dedicated Jain filtering.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {DIETARY.map(d => (
              <Link
                key={d.tag}
                href={`/indian-restaurants/${d.tag}`}
                className="px-4 py-2.5 rounded-full border-2 border-green-400 text-green-700 hover:bg-green-500 hover:text-white font-medium text-sm transition-colors"
                title={d.description}
              >
                {d.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured metros */}
      <section className="py-14 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-maroon mb-2 text-center">Top Indian Food Cities</h2>
          <p className="text-center text-gray-500 text-sm mb-7">
            Explore the cities with the highest density of Indian restaurants in America.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {FEATURED_METROS.map(metro => (
              <Link
                key={metro.href}
                href={metro.href}
                className="p-4 rounded-xl bg-cream border border-saffron/30 hover:border-saffron hover:bg-saffron/10 text-center font-semibold text-spice transition-colors text-sm"
              >
                {metro.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-14 px-4 bg-cream">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-maroon mb-8 text-center">Why Indian Restaurants in USA?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Regional Cuisine Classification',
                body: "Every listing is classified by regional Indian cuisine — North Indian, South Indian, Hyderabadi, Gujarati, and more. This data doesn't exist anywhere else.",
              },
              {
                title: 'Jain & Dietary Filtering',
                body: 'The only directory that lets you filter for Jain-friendly restaurants (no onion, garlic, or root vegetables). Also covers vegan, pure-veg, halal, and gluten-free.',
              },
              {
                title: 'Hidden Gems',
                body: 'Our algorithm surfaces highly-rated restaurants with fewer than 200 reviews — the authentic neighbourhood spots that chains and food blogs ignore.',
              },
            ].map(card => (
              <div key={card.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-maroon mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
