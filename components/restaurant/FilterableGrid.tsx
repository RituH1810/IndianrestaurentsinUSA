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

const RATINGS = [4.0, 4.5] as const;

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

  // Re-sort by distance whenever the restaurant list changes (includes initial mount)
  useEffect(() => {
    setBaseList(restaurants);
    setLocationActive(false);

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

  const hasActive = cuisineFilter !== null || dietaryFilter !== null || minRating !== null;

  const clearAll = () => {
    setCuisineFilter(null);
    setDietaryFilter(null);
    setMinRating(null);
  };

  const showFilterBar = availableCuisines.length > 0 || availableDietary.length > 0;

  return (
    <div>
      {/* Sticky filter bar */}
      {showFilterBar && (
        <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 -mx-4 px-4 py-3 mb-4 shadow-sm">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Rating */}
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

            {/* Cuisine pills */}
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

            {/* Dietary pills */}
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

            {/* Clear all */}
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

      {/* Count + location indicator */}
      <div className="flex flex-wrap items-center gap-3 mb-5 text-sm">
        <span className={hasActive ? 'font-semibold text-spice' : 'text-gray-500'}>
          {hasActive
            ? `${filtered.length} of ${restaurants.length} restaurants`
            : `${restaurants.length} restaurants`}
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

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-gray-500 mb-4">No restaurants match your filters.</p>
          <button
            onClick={clearAll}
            className="text-sm bg-spice text-white px-5 py-2 rounded-full font-semibold hover:bg-maroon transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <RestaurantGrid restaurants={filtered} emptyMessage={emptyMessage} />
      )}
    </div>
  );
}
