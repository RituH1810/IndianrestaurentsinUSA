import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-5xl mb-4">🍽️</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 text-sm mb-6 max-w-sm">
        That restaurant or page doesn&apos;t exist. Try searching or browse by cuisine.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          href="/"
          className="px-5 py-2.5 bg-spice text-white rounded-full text-sm font-semibold hover:bg-maroon transition-colors"
        >
          Go home
        </Link>
        <Link
          href="/search"
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Search restaurants
        </Link>
      </div>
    </div>
  );
}
