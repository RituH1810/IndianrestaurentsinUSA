import Link from 'next/link';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Indian Restaurants in USA',
  description: 'Learn about Indian Restaurants in USA — our mission, data methodology, and editorial standards for the most complete Indian restaurant directory in America.',
};

export default function AboutPage() {
  return (
    <>
      <OrganizationJsonLd />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <nav className="text-sm text-gray-500 mb-6 flex gap-1.5">
          <Link href="/" className="hover:text-spice">Home</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">About</span>
        </nav>

        <h1 className="text-3xl font-bold text-maroon mb-2">About Indian Restaurants in USA</h1>
        <p className="text-gray-600 text-lg mb-10">
          The most complete directory of Indian restaurants in the United States, with regional cuisine
          and dietary filtering you won&apos;t find anywhere else.
        </p>

        <section className="prose prose-slate max-w-none mb-10">
          <h2 className="text-xl font-bold text-maroon">Our Mission</h2>
          <p>
            Millions of Indian-Americans and Indian food lovers search for regional, authentic, and
            dietary-specific Indian food every day. No existing directory — not Yelp, not Google, not
            TripAdvisor — classifies Indian restaurants by regional cuisine or offers Jain dietary filtering.
          </p>
          <p>
            Indian Restaurants in USA was built to fix that. Every listing is enriched with regional
            cuisine classification (North Indian, South Indian, Hyderabadi, Gujarati, etc.) and dietary
            tags (Jain, vegan, pure vegetarian, halal, gluten-free) — data assembled through a combination
            of Google Places data and AI classification.
          </p>

          <h2 className="text-xl font-bold text-maroon mt-8">Why This Matters</h2>
          <ul>
            <li><strong>Regional specificity</strong> — &quot;Indian food&quot; spans dozens of distinct regional cuisines. Grouping them together obscures the search experience.</li>
            <li><strong>Jain filtering</strong> — Jain dietary needs (no onion, garlic, or root vegetables) are nearly impossible to search for on mainstream platforms. We are the first national directory to address this.</li>
            <li><strong>Hidden gems</strong> — Our algorithm surfaces highly-rated, under-reviewed restaurants that algorithms on Yelp and Google consistently bury.</li>
          </ul>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Our Data', href: '/about/our-data', desc: 'How we source and classify restaurant data' },
            { label: 'Editorial Standards', href: '/about/editorial-standards', desc: 'Our principles for accuracy and fairness' },
            { label: 'Contact', href: '/contact', desc: 'Get in touch with the team' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-saffron transition-colors"
            >
              <div className="font-semibold text-gray-900 text-sm">{link.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{link.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
