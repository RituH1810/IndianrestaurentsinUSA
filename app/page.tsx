import Link from 'next/link';
import { CUISINES, DIETARY } from '@/lib/taxonomy';

const FEATURED_METROS = [
  { label: 'Edison, NJ', href: '/usa/new-jersey/edison/indian-restaurants', sub: 'New Jersey' },
  { label: 'Bay Area, CA', href: '/usa/california/fremont/indian-restaurants', sub: 'California' },
  { label: 'Chicago', href: '/usa/illinois/chicago/indian-restaurants', sub: 'Illinois' },
  { label: 'Houston', href: '/usa/texas/houston/indian-restaurants', sub: 'Texas' },
  { label: 'New York', href: '/usa/new-york/new-york-city/indian-restaurants', sub: 'New York' },
  { label: 'Dallas', href: '/usa/texas/dallas/indian-restaurants', sub: 'Texas' },
  { label: 'Charlotte', href: '/usa/north-carolina/charlotte/indian-restaurants', sub: 'North Carolina' },
  { label: 'Atlanta', href: '/usa/georgia/atlanta/indian-restaurants', sub: 'Georgia' },
];

const DIETARY_STYLES: Record<string, string> = {
  'pure-veg':    'bg-emerald-600 hover:bg-emerald-700 text-white',
  'vegan':       'bg-teal-600 hover:bg-teal-700 text-white',
  'jain':        'bg-violet-600 hover:bg-violet-700 text-white',
  'halal':       'bg-green-700 hover:bg-green-800 text-white',
  'gluten-free': 'bg-amber-600 hover:bg-amber-700 text-white',
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-maroon text-cream py-20 md:py-28 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <p className="text-saffron text-xs font-semibold tracking-[0.18em] uppercase mb-7">
            4,974 Restaurants &middot; 12 Regional Cuisines &middot; 50 States
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] text-balance">
            Find Indian Food<br />
            <em className="text-saffron not-italic">Anywhere in America</em>
          </h1>
          <p className="mt-6 text-base md:text-lg text-cream/70 max-w-lg mx-auto leading-relaxed text-balance">
            Regional cuisine classification and Jain filtering you won&apos;t find on Yelp or Google.
          </p>
          <form action="/search" role="search" className="mt-10 flex max-w-2xl mx-auto rounded-full overflow-hidden shadow-xl ring-1 ring-white/10">
            <label htmlFor="hero-search" className="sr-only">Search Indian restaurants</label>
            <input
              id="hero-search"
              name="q"
              type="search"
              placeholder="Search by cuisine, city, or restaurant name…"
              className="flex-1 px-6 py-4 text-gray-900 text-sm focus:outline-none bg-white min-w-0"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-saffron hover:bg-turmeric text-maroon font-bold text-sm transition-colors shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Browse by cuisine — grid cards */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-maroon">Browse by Regional Cuisine</h2>
            <p className="text-gray-400 text-sm mt-2">
              We classify every listing by regional Indian cuisine — something Yelp and Google don&apos;t do.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CUISINES.map(c => (
              <Link
                key={c.tag}
                href={`/indian-food/${c.tag}`}
                className="group p-4 rounded-xl border-2 border-gray-100 hover:border-saffron hover:bg-saffron/5 transition-all"
              >
                <div className="font-semibold text-gray-800 group-hover:text-spice transition-colors text-sm">
                  {c.label}
                </div>
                <div className="text-xs text-gray-400 mt-1 truncate">
                  {(c.keywords as readonly string[]).slice(0, 2).join(' · ')}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dietary filters — filled chips */}
      <section className="py-14 px-4 bg-cream">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-maroon">Filter by Dietary Need</h2>
            <p className="text-gray-400 text-sm mt-2">
              The only national Indian restaurant directory with dedicated Jain filtering.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {DIETARY.map(d => (
              <Link
                key={d.tag}
                href={`/indian-restaurants/${d.tag}`}
                className={`px-7 py-3 rounded-full font-semibold text-sm transition-colors shadow-sm ${DIETARY_STYLES[d.tag] ?? 'bg-gray-600 text-white hover:bg-gray-700'}`}
                title={d.description}
              >
                {d.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top cities */}
      <section className="py-14 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-maroon">Top Indian Food Cities</h2>
            <p className="text-gray-400 text-sm mt-2">
              Explore the cities with the highest density of Indian restaurants in America.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {FEATURED_METROS.map(metro => (
              <Link
                key={metro.href}
                href={metro.href}
                className="group p-4 rounded-xl bg-cream border border-gray-200 hover:border-spice hover:bg-spice/5 text-center transition-all"
              >
                <div className="font-bold text-gray-900 group-hover:text-spice transition-colors text-sm">
                  {metro.label}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{metro.sub}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us — dark section */}
      <section className="py-16 px-4 bg-maroon text-cream">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-10">
            Why <span className="text-saffron">Indian Restaurants in USA</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
              <div key={card.title} className="border border-spice/40 rounded-xl p-6 hover:border-saffron/60 transition-colors">
                <div className="w-7 h-0.5 bg-saffron mb-4" />
                <h3 className="font-bold text-cream mb-3 text-sm">{card.title}</h3>
                <p className="text-sm text-cream/65 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
