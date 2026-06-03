export const revalidate = 3600;

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { stateNameToSlug } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Indian Restaurants by State — Browse All 50 States',
  description: 'Find Indian restaurants in every US state. Explore listings by regional cuisine and dietary need.',
};

export default async function StatesPage() {
  let states: { state: string; _count: { state: number } }[] = [];
  try {
    const raw = await prisma.restaurant.groupBy({
      by: ['state'],
      where: { is_published: true },
      _count: { state: true },
      orderBy: { state: 'asc' },
    });
    states = raw;
  } catch { /* no DB yet */ }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-maroon mb-2">Indian Restaurants by State</h1>
      <p className="text-gray-600 mb-10">
        Browse {states.length > 0 ? states.reduce((s, r) => s + r._count.state, 0) : '10,000+'} Indian restaurants across the United States.
      </p>

      {states.length === 0 ? (
        <p className="text-gray-400">Run the data pipeline to populate restaurant listings.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {states.map(({ state, _count }) => (
            <Link
              key={state}
              href={`/usa/${stateNameToSlug(state)}/indian-restaurants`}
              className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-saffron hover:shadow-sm transition-all"
            >
              <div className="font-semibold text-gray-900 text-sm">{state}</div>
              <div className="text-xs text-gray-500 mt-0.5">{_count.state} restaurants</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
