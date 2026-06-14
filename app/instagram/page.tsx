import type { Metadata } from 'next';
import Link from 'next/link';
import { InstagramFeed } from '@/components/instagram/InstagramFeed';

export const metadata: Metadata = {
  title: 'Instagram — Indian Restaurants in USA',
  description: 'Follow @indianrestaurentsinusa on Instagram for Indian food inspiration, restaurant spotlights, and regional cuisine highlights across America.',
};

const POSTS = [
  'https://www.instagram.com/p/DZixxTeu6dj/',
  'https://www.instagram.com/p/DZipIZcuytU/',
  'https://www.instagram.com/p/DZihn4fOzBJ/',
];

export default function InstagramPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white py-16 px-4 text-center">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-xl">
          <svg viewBox="0 0 24 24" className="w-11 h-11 fill-white" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
          </svg>
        </div>

        <p className="text-white/80 text-xs font-semibold tracking-widest uppercase mb-2">Follow us on Instagram</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">@indianrestaurentsinusa</h1>
        <p className="text-white/80 text-base max-w-md mx-auto leading-relaxed mb-8">
          Indian food inspiration, restaurant spotlights, and regional cuisine highlights across America.
        </p>
        <a
          href="https://www.instagram.com/indianrestaurentsinusa/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-7 py-3 bg-white text-pink-600 font-bold rounded-full hover:bg-pink-50 transition-colors shadow-lg text-sm"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
          </svg>
          Follow on Instagram
        </a>
      </div>

      {/* Posts grid */}
      <div className="container mx-auto px-4 py-14 max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-maroon">Latest Posts</h2>
          <p className="text-gray-400 text-sm mt-2">Indian food stories from across America</p>
        </div>

        <InstagramFeed posts={POSTS} />

        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/indianrestaurentsinusa/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-pink-400 text-pink-600 font-semibold rounded-full hover:bg-pink-50 transition-colors text-sm"
          >
            See all posts on Instagram →
          </a>
        </div>
      </div>

      {/* CTA banner */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-t border-pink-100 py-12 px-4 text-center">
        <p className="text-gray-500 text-sm mb-1">Want to see your restaurant featured?</p>
        <p className="text-gray-700 font-semibold text-lg mb-4">Tag us or DM on Instagram</p>
        <a
          href="https://www.instagram.com/indianrestaurentsinusa/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-pink-600 font-bold hover:underline"
        >
          @indianrestaurentsinusa
        </a>
      </div>

      {/* Back link */}
      <div className="text-center py-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-spice transition-colors">
          ← Back to directory
        </Link>
      </div>
    </>
  );
}
