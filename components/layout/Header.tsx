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
    <header className="bg-maroon text-cream sticky top-0 z-40 border-b border-spice/30">
      <nav className="container mx-auto px-4 h-14 flex items-center justify-between gap-6">
        {/* Wordmark */}
        <Link href="/" className="shrink-0 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-saffron flex-shrink-0" />
          <span className="font-bold text-sm tracking-tight leading-none">
            Indian Restaurants <span className="text-saffron">in USA</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 text-sm">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-cream/75 hover:text-saffron transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop search */}
        <form
          action="/search"
          className="hidden lg:flex items-center gap-2 bg-white/10 hover:bg-white/15 rounded-full px-4 py-1.5 transition-colors"
        >
          <label htmlFor="header-search" className="sr-only">Search</label>
          <svg className="w-3.5 h-3.5 text-cream/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="header-search"
            name="q"
            type="search"
            placeholder="Search restaurants…"
            className="bg-transparent text-sm text-cream placeholder-cream/40 focus:outline-none w-36"
          />
        </form>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`block w-5 h-[1.5px] bg-cream transition-all origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-cream mt-1.5 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-cream mt-1.5 transition-all origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-maroon border-t border-spice/30 px-5 pb-5 pt-3 flex flex-col gap-3">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-cream/75 hover:text-saffron transition-colors text-sm font-medium py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <form action="/search" className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2.5 mt-2">
            <label htmlFor="mobile-search" className="sr-only">Search</label>
            <svg className="w-3.5 h-3.5 text-cream/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="mobile-search"
              name="q"
              type="search"
              placeholder="Search restaurants…"
              className="flex-1 bg-transparent text-sm text-cream placeholder-cream/40 focus:outline-none"
            />
            <button type="submit" className="text-saffron text-sm font-bold ml-1">Go</button>
          </form>
        </div>
      )}
    </header>
  );
}
