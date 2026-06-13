'use client';

import { useState, useMemo } from 'react';
import { RestaurantListCard } from '@/components/restaurant/RestaurantListCard';
import { CUISINES, DIETARY } from '@/lib/taxonomy';
import { parseTags } from '@/lib/utils';
import type { RestaurantListData } from '@/lib/types';

type SortKey = 'recommended' | 'rating' | 'reviews' | 'name';

interface Props {
  restaurants: RestaurantListData[];
  total?: number;
}

export function ListingClient({ restaurants, total }: Props) {
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null);
  const [dietaryFilter, setDietaryFilter] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>('recommended');

  const filtered = useMemo(() => {
    let list = [...restaurants];

    if (cuisineFilter) {
      list = list.filter(r => parseTags(r.cuisine_tags).includes(cuisineFilter));
    }
    if (dietaryFilter) {
      list = list.filter(r => parseTags(r.dietary_tags).includes(dietaryFilter));
    }
    if (minRating != null) {
      list = list.filter(r => r.rating != null && r.rating >= minRating);
    }

    if (sortBy === 'rating') list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else if (sortBy === 'reviews') list.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [restaurants, cuisineFilter, dietaryFilter, minRating, sortBy]);

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

  const hasActiveFilters = cuisineFilter || dietaryFilter || minRating != null;

  const clearAll = () => {
    setCuisineFilter(null);
    setDietaryFilter(null);
    setMinRating(null);
  };

  return (
    <div>
      {/* Sticky filter bar */}
      <div className="sticky top-14 z-30 bg-cream/95 backdrop-blur-sm border-b border-blue-200/60 -mx-4 px-4 py-3 mb-2 shadow-sm">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortKey)}
            className="text-sm border border-blue-200 rounded-full px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-spice/30 cursor-pointer shadow-sm"
          >
            <option value="recommended">Best Match</option>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="name">A to Z</option>
          </select>

          <div className="w-px h-5 bg-blue-200" />

          {/* Rating */}
          {([4.0, 4.5] as number[]).map(r => (
            <button
              key={r}
              onClick={() => setMinRating(minRating === r ? null : r)}
              className={`text-xs rounded-full px-3 py-1.5 border font-semibold transition-all shadow-sm ${
                minRating === r
                  ? 'bg-maroon text-white border-maroon shadow-maroon/20 shadow-md'
                  : 'bg-white text-gray-600 border-blue-200 hover:border-spice hover:text-spice hover:bg-blue-50'
              }`}
            >
              ★ {r}+
            </button>
          ))}

          {/* Cuisine pills */}
          {availableCuisines.slice(0, 6).map(c => (
            <button
              key={c.tag}
              onClick={() => setCuisineFilter(cuisineFilter === c.tag ? null : c.tag)}
              className={`text-xs rounded-full px-3 py-1.5 border font-semibold transition-all shadow-sm ${
                cuisineFilter === c.tag
                  ? 'bg-spice text-white border-spice shadow-spice/20 shadow-md'
                  : 'bg-white text-gray-600 border-blue-200 hover:border-spice hover:text-spice hover:bg-blue-50'
              }`}
            >
              {c.label}
            </button>
          ))}

          {/* Dietary pills */}
          {availableDietary.map(d => (
            <button
              key={d.tag}
              onClick={() => setDietaryFilter(dietaryFilter === d.tag ? null : d.tag)}
              className={`text-xs rounded-full px-3 py-1.5 border font-semibold transition-all shadow-sm ${
                dietaryFilter === d.tag
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-200 shadow-md'
                  : 'bg-white text-gray-600 border-blue-200 hover:border-green-400 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {d.label}
            </button>
          ))}

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs bg-red-50 text-red-600 border border-red-200 rounded-full px-3 py-1.5 font-semibold hover:bg-red-100 transition-colors ml-1"
            >
              Clear ✕
            </button>
          )}
        </div>
      </div>

      {/* Count row */}
      <div className="flex items-center justify-between py-3 text-sm">
        <span className={hasActiveFilters ? 'font-semibold text-spice' : 'text-gray-500'}>
          {hasActiveFilters
            ? `${filtered.length} of ${restaurants.length} restaurants`
            : `${total ?? restaurants.length} restaurants`}
        </span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-lg mb-3 text-gray-500 font-medium">No restaurants match your filters.</p>
          <button
            onClick={clearAll}
            className="text-sm bg-spice text-white px-5 py-2 rounded-full font-semibold hover:bg-maroon transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filtered.map((r, i) => (
            <RestaurantListCard key={r.slug} restaurant={r} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
