import { RestaurantCard } from './RestaurantCard';
import type { RestaurantCardData } from '@/lib/types';

interface Props {
  restaurants: RestaurantCardData[];
  emptyMessage?: string;
}

export function RestaurantGrid({ restaurants, emptyMessage = 'No restaurants found.' }: Props) {
  if (restaurants.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map(r => (
        <RestaurantCard key={r.slug} restaurant={r} />
      ))}
    </div>
  );
}
