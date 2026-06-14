'use client';

import { useState, useMemo, useEffect } from 'react';
import { RestaurantGrid } from './RestaurantGrid';
import { CUISINES, DIETARY } from '@/lib/taxonomy';
import { parseTags } from '@/lib/utils';

export type FilterableRestaurant = {
  slug: string;
  name: string;
  city: string;
  state: string;
  rating: number | null;
  reviews: number | null;
  photo: string | null;
  cuisine_tags: string | null;
  dietary_tags: string | null;
  is_hidden_gem: boolean;
  description: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

const PAGE_SIZE = 30; // 10 rows × 3 columns
const RATINGS = [4.0, 4.5] as const;

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildPageRange(current: number, total: number): (number | 'gap')[] {
  if (total <= 1) return [];
  if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);
  const visible = new Set<number>([1, total]);
  for (let p = Math.max(1, current - 2); p <= Math.min(total, current + 2); p++) {
    visible.add(p);
  }
  const sorted = Array.from(visible).sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('gap');
    result.push(sorted[i]);
  }
  return result;
}

interface Props {
  restaurants: FilterableRestaurant[];
  emptyMessage?: string;
}

export function FilterableGrid({ restaurants, emptyMessage = 'No restaurants found.' }: Props) {
  const [baseList, setBaseList] = useState(restaurants);
  const [locationActive, setLocationActive] = useState(false);
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null);
  const [dietaryFilter, setDietaryFilter] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // When restaurants prop changes (navigation), reset all state and re-run location sort
  useEffect(() => {
    setBaseList(restaurants);
    setLocationActive(false);
    setCuisineFilter(null);
    setDietaryFilter(null);
    setMinRating(null);
    setCurrentPage(1);

    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        const ranked = [...restaurants].sort((a, b) => {
          const da = a.latitude && a.longitude ? haversine(lat, lng, a.latitude, a.longitude) : Infinity;
          const db = b.latitude && b.longitude ? haversine(lat, lng, b.latitude, b.longitude) : Infinity;
          return da - db;
        });
        setBaseList(ranked);
        setLocationActive(true);
      },
      () => {},
      { timeout: 4000, maximumAge: 300_000 },
    );
  }, [restaurants]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [cuisineFilter, dietaryFilter, minRating]);

  const availableCuisines = useMemo(() => {
    const tags = new Set<string>();
    restaurants.forEach(r => parseTags(r.cuisine_tags).forEach(t => tags.add(t)));
    return CUISINES.filter(c => tags.has(c.tag));
  }, [restaurants]);

  const availableDietary = useMemo(() => {
    const tags = new Set<string>();
    restaurants.forEach(r => parseTags(r.dietary_tags).forEach(t => tags.add(t)));
    return DIETARY.filter(d => tags.has(d.tag));
  }, [restaurants]);

  const filtered = useMemo(() => {
    let list = baseList;
    if (cuisineFilter) list = list.filter(r => parseTags(r.cuisine_tags).includes(cuisineFilter));
    if (dietaryFilter) list = list.filter(r => parseTags(r.dietary_tags).includes(dietaryFilter));
    if (minRating != null) list = list.filter(r => r.rating != null && r.rating >= minRating);
    return list;
  }, [baseList, cuisineFilter, dietaryFilter, minRating]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 0;
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pageRange = buildPageRange(currentPage, totalPages);
  const hasActive = cuisineFilter !== null || dietaryFilter !== null || minRating !== null;

  const clearAll = () => {
    setCuisineFilter(null);
    setDietaryFilter(null);
    setMinRating(null);
  };

  const goToPage = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showFilterBar = availableCuisines.length > 0 || availableDietary.length > 0;

  return (
    <div>
      {/* Sticky filter bar */}
      {showFilterBar && (
        <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 -mx-4 px-4 py-3 mb-4 shadow-sm">
          <div className="flex flex-wrap gap-2 items-center">
            {RATINGS.map(r => (
              <button
                key={r}
                onClick={() => setMinRating(minRating === r ? null : r)}
                className={`text-xs rounded-full px-3 py-1.5 border font-semibold transition-all ${
                  minRating === r
                    ? 'bg-maroon text-white border-maroon'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-spice hover:text-spice'
                }`}
              >
                ★ {r}+{minRating === r ? ' ×' : ''}
              </button>
            ))}

            {(availableCuisines.length > 0 || availableDietary.length > 0) && (
              <div className="w-px h-5 bg-gray-200 mx-0.5" />
            )}

            {availableCuisines.map(c => (
              <button
                key={c.tag}
                onClick={() => setCuisineFilter(cuisineFilter === c.tag ? null : c.tag)}
                className={`text-xs rounded-full px-3 py-1.5 border font-semibold transition-all ${
                  cuisineFilter === c.tag
                    ? 'bg-spice text-white border-spice'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-spice hover:text-spice'
                }`}
              >
                {c.label}{cuisineFilter === c.tag ? ' ×' : ''}
              </button>
            ))}

            {availableDietary.map(d => (
              <button
                key={d.tag}
                onClick={() => setDietaryFilter(dietaryFilter === d.tag ? null : d.tag)}
                className={`text-xs rounded-full px-3 py-1.5 border font-semibold transition-all ${
                  dietaryFilter === d.tag
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-emerald-700'
                }`}
              >
                {d.label}{dietaryFilter === d.tag ? ' ×' : ''}
              </button>
            ))}

            {hasActive && (
              <button
                onClick={clearAll}
                className="text-xs bg-red-50 text-red-600 border border-red-200 rounded-full px-3 py-1.5 font-semibold hover:bg-red-100 transition-colors ml-1"
              >
                Clear all ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Count + page info + location indicator */}
      <div className="flex flex-wrap items-center gap-3 mb-5 text-sm">
        <span className={hasActive ? 'font-semibold text-spice' : 'text-gray-500'}>
          {hasActive
            ? `${filtered.length} of ${restaurants.length} restaurants`
            : `${restaurants.length} restaurants`}
          {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
        </span>
        {locationActive && (
          <span className="flex items-center gap-1 text-spice">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Sorted by distance
          </span>
        )}
      </div>

      {/* Grid */}
      {paginated.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-gray-500 mb-4">
            {hasActive ? 'No restaurants match your filters.' : emptyMessage}
          </p>
          {hasActive && (
            <button
              onClick={clearAll}
              className="text-sm bg-spice text-white px-5 py-2 rounded-full font-semibold hover:bg-maroon transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <RestaurantGrid restaurants={paginated} emptyMessage={emptyMessage} />
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <nav
          className="flex justify-center items-center gap-1.5 mt-10 flex-wrap"
          aria-label="Page navigation"
        >
          {currentPage > 1 && (
            <button
              onClick={() => goToPage(currentPage - 1)}
              className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-spice hover:text-spice transition-colors"
            >
              ← Prev
            </button>
          )}

          {pageRange.map((p, idx) =>
            p === 'gap' ? (
              <span key={`gap-${idx}`} className="w-8 text-center text-gray-400 text-sm select-none">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => goToPage(Number(p))}
                aria-current={p === currentPage ? 'page' : undefined}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  p === currentPage
                    ? 'bg-spice text-white pointer-events-none'
                    : 'border border-gray-200 text-gray-600 hover:border-spice hover:text-spice'
                }`}
              >
                {p}
              </button>
            ),
          )}

          {currentPage < totalPages && (
            <button
              onClick={() => goToPage(currentPage + 1)}
              className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-spice hover:text-spice transition-colors"
            >
              Next →
            </button>
          )}
        </nav>
      )}
    </div>
  );
}
