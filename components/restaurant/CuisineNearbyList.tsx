'use client';

import { useState, useEffect } from 'react';
import { RestaurantGrid } from './RestaurantGrid';
import type { RestaurantListData } from '@/lib/types';

type CuisineRestaurant = RestaurantListData & {
  latitude: number | null;
  longitude: number | null;
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

interface Props {
  restaurants: CuisineRestaurant[];
  emptyMessage: string;
}

export function CuisineNearbyList({ restaurants, emptyMessage }: Props) {
  const [display, setDisplay] = useState(restaurants);
  const [locationActive, setLocationActive] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        const ranked = [...restaurants].sort((a, b) => {
          const da = a.latitude && a.longitude ? haversine(lat, lng, a.latitude, a.longitude) : Infinity;
          const db = b.latitude && b.longitude ? haversine(lat, lng, b.latitude, b.longitude) : Infinity;
          return da - db;
        });
        setDisplay(ranked);
        setLocationActive(true);
      },
      () => { /* permission denied — keep default order */ },
      { timeout: 4000, maximumAge: 300_000 },
    );
  }, []);

  return (
    <div>
      {locationActive && (
        <div className="flex items-center gap-1.5 text-sm text-spice mb-5">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          Sorted by distance from your location
        </div>
      )}
      <RestaurantGrid restaurants={display} emptyMessage={emptyMessage} />
    </div>
  );
}
