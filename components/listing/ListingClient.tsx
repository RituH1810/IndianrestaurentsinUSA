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
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100 -mx-4 px-4 py-3 mb-2">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortKey)}
            className="text-sm border border-gray-200 rounded-full px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-saffron cursor-pointer"
          >
            <option value="recommended">Best Match</option>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="name">A to Z</option>
          </select>

          <div className="w-px h-5 bg-gray-200" />

          {/* Rating */}
          {([4.0, 4.5] as number[]).map(r => (
            <button
              key={r}
              onClick={() => setMinRating(minRating === r ? null : r)}
              className={`text-xs rounded-full px-3 py-1.5 border font-medium transition-colors ${
                minRating === r
                  ? 'bg-maroon text-white border-maroon'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-saffron hover:text-spice'
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
              className={`text-xs rounded-full px-3 py-1.5 border font-medium transition-colors ${
                cuisineFilter === c.tag
                  ? 'bg-spice text-white border-spice'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-saffron hover:text-spice'
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
              className={`text-xs rounded-full px-3 py-1.5 border font-medium transition-colors ${
                dietaryFilter === d.tag
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-emerald-700'
              }`}
            >
              {d.label}
            </button>
          ))}

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-spice font-semibold hover:underline ml-1"
            >
              Clear filters ✕
            </button>
          )}
        </div>
      </div>

      {/* Count row */}
      <div className="flex items-center justify-between py-3 text-sm text-gray-500">
        <span>
          {hasActiveFilters
            ? `${filtered.length} of ${restaurants.length} restaurants`
            : `${total ?? restaurants.length} restaurants`}
        </span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-3">No restaurants match your filters.</p>
          <button onClick={clearAll} className="text-spice font-semibold text-sm hover:underline">
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
