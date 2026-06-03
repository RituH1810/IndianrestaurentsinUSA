import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Press — Indian Restaurants in USA',
  description: 'Press resources, data partnerships, and media enquiries for Indian Restaurants in USA.',
};

export default function PressPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-maroon mb-2">Press & Media</h1>
      <p className="text-gray-600 mb-10">
        Indian Restaurants in USA is the first national directory to classify Indian restaurants by
        regional cuisine and offer Jain dietary filtering.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-bold text-maroon mb-3">Key Data Points</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { stat: '10,000+', label: 'Indian restaurants catalogued' },
              { stat: '12', label: 'Regional cuisine classifications' },
              { stat: '5', label: 'Dietary filter categories (incl. Jain)' },
              { stat: '50', label: 'US states covered' },
            ].map(item => (
              <div key={item.stat} className="bg-cream rounded-xl border border-saffron/30 p-4 text-center">
                <div className="text-2xl font-bold text-maroon">{item.stat}</div>
                <div className="text-sm text-gray-600 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-maroon mb-3">Story Angles</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2"><span className="text-saffron">→</span> The search gap: why 150,000+ Jain Americans struggle to find compliant restaurants online</li>
            <li className="flex gap-2"><span className="text-saffron">→</span> Regional Indian cuisine in America: the data behind which cuisines dominate which cities</li>
            <li className="flex gap-2"><span className="text-saffron">→</span> Hidden gems: the algorithm finding America&apos;s most underrated Indian restaurants</li>
            <li className="flex gap-2"><span className="text-saffron">→</span> Indian food deserts: mapping where Indian-American communities lack restaurant options</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
