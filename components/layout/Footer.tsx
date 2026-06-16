import Link from 'next/link';

const CUISINE_LINKS = [
  { label: 'North Indian', href: '/indian-food/north-indian' },
  { label: 'South Indian', href: '/indian-food/south-indian' },
  { label: 'Hyderabadi Biryani', href: '/indian-food/hyderabadi' },
  { label: 'Gujarati', href: '/indian-food/gujarati' },
  { label: 'Indo-Chinese', href: '/indian-food/indo-chinese' },
  { label: 'Chaat & Street Food', href: '/indian-food/chaat' },
];

const DIETARY_LINKS = [
  { label: 'Jain Restaurants', href: '/indian-restaurants/jain' },
  { label: 'Pure Vegetarian', href: '/indian-restaurants/pure-veg' },
  { label: 'Vegan Indian', href: '/indian-restaurants/vegan' },
  { label: 'Halal Indian', href: '/indian-restaurants/halal' },
  { label: 'Gluten-Free', href: '/indian-restaurants/gluten-free' },
];

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Our Data', href: '/about/our-data' },
  { label: 'Guides', href: '/guides' },
  { label: 'Best Restaurants', href: '/best-indian-restaurants' },
  { label: 'Instagram', href: '/instagram' },
  { label: 'YouTube', href: 'https://www.youtube.com/@indianrestaurentsinusa/shorts' },
  { label: 'Contact', href: '/contact' },
  { label: 'Press', href: '/press' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-white font-bold text-lg hover:text-saffron transition-colors">
              Indian Restaurants in USA
            </Link>
            <p className="text-sm leading-relaxed mt-3">
              The most complete directory of Indian restaurants in the United States. Regional cuisine and dietary filtering you won&apos;t find anywhere else.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">By Cuisine</h3>
            <ul className="space-y-1.5 text-sm">
              {CUISINE_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-saffron transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Dietary</h3>
            <ul className="space-y-1.5 text-sm">
              {DIETARY_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-saffron transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Company</h3>
            <ul className="space-y-1.5 text-sm">
              {COMPANY_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-saffron transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 Indian Restaurants in USA. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/indianrestaurentsinusa/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-pink-400 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@indianrestaurentsinusa/shorts"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="hover:text-red-500 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <Link href="/privacy" className="hover:text-cream transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-cream transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
