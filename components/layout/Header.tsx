'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    <header className="bg-white text-gray-900 sticky top-0 z-40 border-b border-gray-100 shadow-sm">
      <nav className="container mx-auto px-4 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt="Indian Restaurants in USA"
            width={34}
            height={34}
            className="rounded-full object-cover"
            priority
          />
          <span className="font-bold text-sm tracking-tight leading-none text-gray-900">
            Indian Restaurants <span className="text-spice">in USA</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 text-sm">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-500 hover:text-spice transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop social icons */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="https://www.instagram.com/indianrestaurentsinusa/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:opacity-80 transition-opacity"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
              <defs>
                <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
                  <stop offset="0%" stopColor="#fdf497"/>
                  <stop offset="5%" stopColor="#fdf497"/>
                  <stop offset="45%" stopColor="#fd5949"/>
                  <stop offset="60%" stopColor="#d6249f"/>
                  <stop offset="90%" stopColor="#285AEB"/>
                </radialGradient>
              </defs>
              <path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
          </a>
          <a
            href="https://www.youtube.com/@indianrestaurentsinusa/shorts"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:opacity-80 transition-opacity"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-red-600" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>

        {/* Desktop search */}
        <form
          action="/search"
          className="hidden lg:flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full px-4 py-1.5 transition-colors"
        >
          <label htmlFor="header-search" className="sr-only">Search</label>
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="header-search"
            name="q"
            type="search"
            placeholder="Search restaurants…"
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none w-36"
          />
        </form>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`block w-5 h-[1.5px] bg-gray-600 transition-all origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-gray-600 mt-1.5 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-gray-600 mt-1.5 transition-all origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-5 pb-5 pt-3 flex flex-col gap-3 shadow-md">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-spice transition-colors text-sm font-medium py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <form action="/search" className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 mt-2">
            <label htmlFor="mobile-search" className="sr-only">Search</label>
            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="mobile-search"
              name="q"
              type="search"
              placeholder="Search restaurants…"
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            <button type="submit" className="text-spice text-sm font-bold ml-1">Go</button>
          </form>
        </div>
      )}
    </header>
  );
}
