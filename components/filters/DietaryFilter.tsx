'use client';
import { useRouter } from 'next/navigation';
import { DIETARY } from '@/lib/taxonomy';

const DIET_COLORS: Record<string, string> = {
  'pure-veg': 'border-green-400 text-green-700 hover:bg-green-50',
  vegan: 'border-green-600 text-green-800 hover:bg-green-50',
  jain: 'border-orange-400 text-orange-700 hover:bg-orange-50',
  halal: 'border-teal-500 text-teal-700 hover:bg-teal-50',
  'gluten-free': 'border-blue-400 text-blue-700 hover:bg-blue-50',
};

interface Props {
  selectedDiet?: string;
}

export function DietaryFilter({ selectedDiet }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by dietary preference">
      {DIETARY.map(diet => (
        <button
          key={diet.tag}
          onClick={() => router.push(`/indian-restaurants/${diet.tag}`)}
          title={diet.description}
          aria-pressed={selectedDiet === diet.tag}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border-2 ${
            selectedDiet === diet.tag
              ? 'bg-green-600 text-white border-green-600'
              : `bg-white ${DIET_COLORS[diet.tag] ?? 'border-gray-300 text-gray-700'}`
          }`}
        >
          {diet.label}
        </button>
      ))}
    </div>
  );
}
