'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-5xl mb-4">🍛</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
      <p className="text-gray-500 text-sm mb-6 max-w-md">
        We&apos;re having trouble connecting to our restaurant database right now.
        Please try again in a moment.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-spice text-white rounded-full text-sm font-semibold hover:bg-maroon transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
