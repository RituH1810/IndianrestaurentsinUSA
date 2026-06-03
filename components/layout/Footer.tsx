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
  { label: 'Contact', href: '/contact' },
  { label: 'Press', href: '/press' },
];

export default function Footer() {
  return (
    <footer className="bg-maroon text-cream/80 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-cream font-bold text-lg hover:text-saffron transition-colors">
              Indian Restaurants in USA
            </Link>
            <p className="text-sm leading-relaxed mt-3">
              The most complete directory of Indian restaurants in the United States. Regional cuisine and dietary filtering you won&apos;t find anywhere else.
            </p>
          </div>

          <div>
            <h3 className="text-cream font-semibold mb-3 text-sm uppercase tracking-wide">By Cuisine</h3>
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
            <h3 className="text-cream font-semibold mb-3 text-sm uppercase tracking-wide">Dietary</h3>
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
            <h3 className="text-cream font-semibold mb-3 text-sm uppercase tracking-wide">Company</h3>
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

        <div className="border-t border-spice mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-cream/60">
          <p>© 2025 Indian Restaurants in USA. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-cream transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-cream transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
