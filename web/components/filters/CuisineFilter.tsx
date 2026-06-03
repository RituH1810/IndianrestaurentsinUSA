'use client';
import { useRouter } from 'next/navigation';
import { CUISINES } from '@/lib/taxonomy';

interface Props {
  selectedCuisine?: string;
}

export function CuisineFilter({ selectedCuisine }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by cuisine">
      {CUISINES.map(cuisine => (
        <button
          key={cuisine.tag}
          onClick={() => router.push(`/indian-food/${cuisine.tag}`)}
          aria-pressed={selectedCuisine === cuisine.tag}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
            selectedCuisine === cuisine.tag
              ? 'bg-spice text-white border-spice'
              : 'bg-white text-gray-700 border-gray-300 hover:border-spice hover:text-spice'
          }`}
        >
          {cuisine.label}
        </button>
      ))}
    </div>
  );
}
