import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Team — Indian Restaurants in USA',
  description: 'The team behind Indian Restaurants in USA.',
};

export default function TeamPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <nav className="text-sm text-gray-500 mb-6 flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-spice">Home</Link>
        <span>/</span>
        <Link href="/about" className="hover:text-spice">About</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Team</span>
      </nav>

      <h1 className="text-3xl font-bold text-maroon mb-8">Our Team</h1>
      <p className="text-gray-600 mb-6">
        Indian Restaurants in USA is built and maintained by people who are passionate about Indian food and frustrated by the lack of good regional and dietary filtering on mainstream platforms.
      </p>
      <p className="text-gray-600">
        To connect with us, visit the <Link href="/contact" className="text-spice hover:underline">Contact</Link> page.
      </p>
    </div>
  );
}
