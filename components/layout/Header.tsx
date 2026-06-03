'use client';
import { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Cuisines', href: '/indian-food' },
  { label: 'Cities', href: '/usa' },
  { label: 'Dietary', href: '/indian-restaurants' },
  { label: 'Map', href: '/map' },
  { label: 'Guides', href: '/guides' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-maroon text-cream shadow-md sticky top-0 z-40">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-bold text-lg text-saffron hover:text-turmeric transition-colors shrink-0"
        >
          Indian Restaurants in USA
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-5 text-sm font-medium">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} className="hover:text-saffron transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop search */}
        <form action="/search" className="hidden lg:flex gap-2 items-center">
          <label htmlFor="header-search" className="sr-only">Search</label>
          <input
            id="header-search"
            name="q"
            type="search"
            placeholder="Search restaurants…"
            className="px-3 py-1.5 rounded text-sm text-gray-900 bg-cream border-0 focus:outline-none focus:ring-2 focus:ring-saffron w-44"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-spice hover:bg-saffron text-cream rounded text-sm font-medium transition-colors"
          >
            Search
          </button>
        </form>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded hover:bg-spice transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="block w-5 h-0.5 bg-cream mb-1 transition-all" />
          <span className="block w-5 h-0.5 bg-cream mb-1 transition-all" />
          <span className="block w-5 h-0.5 bg-cream transition-all" />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-maroon border-t border-spice px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-saffron transition-colors py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <form action="/search" className="flex gap-2 mt-1">
            <label htmlFor="mobile-search" className="sr-only">Search</label>
            <input
              id="mobile-search"
              name="q"
              type="search"
              placeholder="Search restaurants…"
              className="flex-1 px-3 py-2 rounded text-sm text-gray-900 bg-cream border-0 focus:outline-none focus:ring-2 focus:ring-saffron"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-spice text-cream rounded text-sm font-medium"
            >
              Go
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
