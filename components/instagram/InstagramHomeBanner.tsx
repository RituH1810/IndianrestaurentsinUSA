import Link from 'next/link';

const POSTS = [
  { url: 'https://www.instagram.com/p/DZixxTeu6dj/', label: 'Post 1' },
  { url: 'https://www.instagram.com/p/DZipIZcuytU/', label: 'Post 2' },
  { url: 'https://www.instagram.com/p/DZihn4fOzBJ/', label: 'Post 3' },
];

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

export function InstagramHomeBanner() {
  return (
    <section className="py-14 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-t border-pink-100">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-md flex-shrink-0">
              <InstagramIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Follow us</p>
              <p className="font-bold text-gray-800 text-sm leading-tight">@indianrestaurentsinusa</p>
            </div>
          </div>
          <a
            href="https://www.instagram.com/indianrestaurentsinusa/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold rounded-full text-sm hover:opacity-90 transition-opacity shadow-md self-start sm:self-auto"
          >
            <InstagramIcon className="w-4 h-4" />
            Follow
          </a>
        </div>

        {/* Post cards — horizontal scroll on mobile, grid on md+ */}
        <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible snap-x snap-mandatory scrollbar-hide">
          {POSTS.map((post, i) => (
            <a
              key={post.url}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-shrink-0 w-64 md:w-auto snap-start"
              aria-label={`View Instagram post ${i + 1}`}
            >
              <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-[1.02]">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 w-16 h-16 rounded-full border-4 border-white/60" />
                  <div className="absolute bottom-8 right-6 w-24 h-24 rounded-full border-4 border-white/40" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-white/30" />
                </div>

                {/* Center icon */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center">
                    <InstagramIcon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-white/90 text-xs font-semibold mt-1">View on Instagram</span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end p-4">
                  <span className="text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-transform">
                    Open post →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            href="/instagram"
            className="text-sm text-pink-600 font-semibold hover:underline"
          >
            See all posts on our Instagram page →
          </Link>
        </div>
      </div>
    </section>
  );
}
