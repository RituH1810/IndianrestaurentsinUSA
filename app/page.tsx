import Link from 'next/link';
import Image from 'next/image';
import { CUISINES, DIETARY } from '@/lib/taxonomy';
import { NearMeButton } from '@/components/filters/NearMeButton';
import { InstagramHomeBanner } from '@/components/instagram/InstagramHomeBanner';

const FEATURED_METROS = [
  { label: 'Edison, NJ', href: '/usa/new-jersey/edison/indian-restaurants', sub: 'New Jersey', emoji: '🌆' },
  { label: 'Bay Area, CA', href: '/usa/california/fremont/indian-restaurants', sub: 'California', emoji: '🌉' },
  { label: 'Chicago', href: '/usa/illinois/chicago/indian-restaurants', sub: 'Illinois', emoji: '🏙️' },
  { label: 'Houston', href: '/usa/texas/houston/indian-restaurants', sub: 'Texas', emoji: '🤠' },
  { label: 'New York', href: '/usa/new-york/new-york/indian-restaurants', sub: 'New York', emoji: '🗽' },
  { label: 'Dallas', href: '/usa/texas/dallas/indian-restaurants', sub: 'Texas', emoji: '⭐' },
  { label: 'Charlotte', href: '/usa/north-carolina/charlotte/indian-restaurants', sub: 'North Carolina', emoji: '🌳' },
  { label: 'Atlanta', href: '/usa/georgia/atlanta/indian-restaurants', sub: 'Georgia', emoji: '🍑' },
];

const CUISINE_EMOJI: Record<string, string> = {
  'north-indian': '🍛',
  'south-indian': '🥘',
  'indo-chinese': '🥡',
  'punjabi': '🫓',
  'gujarati': '🌿',
  'bengali': '🐟',
  'hyderabadi': '🍚',
  'mughlai': '🍖',
  'kerala': '🥥',
  'chaat': '🌮',
  'rajasthani': '🏺',
  'maharashtrian': '🫙',
};

const DIETARY_STYLES: Record<string, { pill: string; icon: string }> = {
  'pure-veg':    { pill: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 shadow-md', icon: '🥗' },
  'vegan':       { pill: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-200 shadow-md', icon: '🌱' },
  'jain':        { pill: 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200 shadow-md', icon: '🙏' },
  'halal':       { pill: 'bg-green-700 hover:bg-green-800 text-white shadow-green-200 shadow-md', icon: '☪️' },
  'gluten-free': { pill: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200 shadow-md', icon: '🌾' },
};

const WHY_CARDS = [
  {
    icon: '🗺️',
    title: 'Regional Cuisine Classification',
    body: "Every listing is classified by regional Indian cuisine — North Indian, South Indian, Hyderabadi, Gujarati, and more. This data doesn't exist anywhere else.",
    bg: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    icon: '🙏',
    title: 'Jain & Dietary Filtering',
    body: 'The only directory that lets you filter for Jain-friendly restaurants (no onion, garlic, or root vegetables). Also covers vegan, pure-veg, halal, and gluten-free.',
    bg: 'bg-violet-50 border-violet-100',
    iconBg: 'bg-violet-100',
  },
  {
    icon: '💎',
    title: 'Hidden Gems',
    body: 'Our algorithm surfaces highly-rated restaurants with fewer than 200 reviews — the authentic neighbourhood spots that chains and food blogs ignore.',
    bg: 'bg-amber-50 border-amber-100',
    iconBg: 'bg-amber-100',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — vibrant blue gradient (not pitch-dark) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white py-16 md:py-28 px-4">
        {/* Decorative light orbs — hidden on mobile to prevent overflow issues */}
        <div className="hidden md:block absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="hidden md:block absolute bottom-0 -left-16 w-56 h-56 rounded-full bg-saffron/20 blur-3xl pointer-events-none" />

        <div className="relative container mx-auto text-center max-w-4xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Indian Restaurants in USA"
              width={150}
              height={150}
              className="rounded-full shadow-2xl shadow-black/30 ring-2 ring-saffron/50"
              priority
            />
          </div>

          <p className="text-blue-100 text-xs font-semibold tracking-[0.18em] uppercase mb-5">
            4,974 Restaurants &middot; 12 Regional Cuisines &middot; 50 States
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] text-balance">
            Find Indian Food<br />
            <em className="text-saffron not-italic">Anywhere in America</em>
          </h1>
          <p className="mt-6 text-base md:text-lg text-blue-100 max-w-lg mx-auto leading-relaxed text-balance">
            Regional cuisine classification and Jain filtering you won&apos;t find on Yelp or Google.
          </p>

          <form action="/search" role="search" className="mt-10 flex w-full max-w-2xl mx-auto rounded-full overflow-hidden shadow-xl ring-2 ring-white/20">
            <label htmlFor="hero-search" className="sr-only">Search Indian restaurants</label>
            <input
              id="hero-search"
              name="q"
              type="search"
              placeholder="City, cuisine, or name…"
              className="flex-1 px-4 md:px-6 py-3.5 md:py-4 text-gray-900 text-sm focus:outline-none bg-white min-w-0"
            />
            <button
              type="submit"
              className="px-5 md:px-8 py-3.5 md:py-4 bg-saffron hover:bg-turmeric text-white font-bold text-sm transition-colors shrink-0 whitespace-nowrap"
            >
              Search
            </button>
          </form>

          <div className="mt-3 flex justify-center">
            <NearMeButton variant="hero" />
          </div>

          {/* Quick cuisine chips */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center px-2">
            {['north-indian', 'south-indian', 'hyderabadi', 'chaat'].map(tag => {
              const c = CUISINES.find(x => x.tag === tag);
              if (!c) return null;
              return (
                <Link
                  key={tag}
                  href={`/indian-food/${tag}`}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 hover:border-saffron/60 transition-all whitespace-nowrap"
                >
                  {CUISINE_EMOJI[tag]} {c.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats strip — soft blue */}
      <div className="bg-blue-700 text-white py-4 px-4">
        <div className="container mx-auto flex flex-wrap justify-center gap-8 text-center">
          {[
            { stat: '4,974', label: 'Restaurants Listed' },
            { stat: '12', label: 'Regional Cuisines' },
            { stat: '50', label: 'States Covered' },
            { stat: '5', label: 'Dietary Filters' },
          ].map(item => (
            <div key={item.label}>
              <div className="text-xl font-black text-white">{item.stat}</div>
              <div className="text-xs text-blue-200">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Browse by cuisine */}
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
                className="group p-4 rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/60 hover:from-blue-100 hover:to-sky-100 hover:border-spice/40 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="text-2xl mb-2.5">{CUISINE_EMOJI[c.tag] ?? '🍽️'}</div>
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

      {/* Dietary filters */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-maroon">Filter by Dietary Need</h2>
            <p className="text-gray-500 text-sm mt-2">
              The only national Indian restaurant directory with dedicated Jain filtering.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center max-w-2xl mx-auto">
            {DIETARY.map(d => {
              const style = DIETARY_STYLES[d.tag] ?? { pill: 'bg-gray-600 text-white hover:bg-gray-700', icon: '🍽️' };
              return (
                <Link
                  key={d.tag}
                  href={`/indian-restaurants/${d.tag}`}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105 ${style.pill}`}
                  title={d.description}
                >
                  <span>{style.icon}</span>
                  {d.label}
                </Link>
              );
            })}
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
                className="group relative p-5 rounded-xl overflow-hidden text-center transition-all hover:scale-[1.03] hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="text-2xl mb-1.5">{metro.emoji}</div>
                  <div className="font-bold text-white text-sm leading-tight">{metro.label}</div>
                  <div className="text-xs text-blue-200 mt-0.5">{metro.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <InstagramHomeBanner />

      {/* Why us — light cards on white */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center text-maroon mb-2">
            Why <span className="text-spice">Indian Restaurants in USA</span>?
          </h2>
          <p className="text-center text-gray-400 text-sm mb-10">Data and filters you won&apos;t find on Yelp or Google.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHY_CARDS.map(card => (
              <div
                key={card.title}
                className={`rounded-xl p-6 border ${card.bg} hover:shadow-md transition-shadow`}
              >
                <div className={`w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center mb-4 text-xl`}>
                  {card.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
