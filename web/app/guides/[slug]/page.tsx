import Link from 'next/link';
import type { Metadata } from 'next';

const GUIDES: Record<string, { title: string; description: string; content: string }> = {
  'best-biryani-usa': {
    title: 'Where to Find the Best Biryani in America',
    description: 'A city-by-city guide to Hyderabadi dum biryani, Lucknowi biryani, and other regional styles across the USA.',
    content: `Biryani is one of the most searched Indian dishes in America. From the dum biryani of Hyderabad to the lighter Lucknowi style, here's where to find the best.

**Top Cities for Biryani**

- **Houston, TX** — The Hillcroft corridor has some of the most authentic Hyderabadi biryani outside of India.
- **Edison, NJ** — A dense concentration of biryani specialists on Oak Tree Road.
- **Chicago, IL** — Devon Avenue's restaurants serve both Hyderabadi and North Indian biryani styles.
- **Bay Area, CA** — Fremont and Santa Clara have a strong South Indian biryani tradition.

**Regional Biryani Styles to Know**

| Style | Origin | Key characteristics |
|-------|--------|-------------------|
| Hyderabadi | Hyderabad | Dum-cooked, whole spices, saffron |
| Lucknowi | Lucknow | Fragrant, subtle, cooked separately |
| Kolkata | Kolkata | Potato and egg added, less spicy |
| Dindigul | Tamil Nadu | Seeraga samba rice, tangy |`,
  },
  'jain-restaurants-usa-guide': {
    title: 'Jain Restaurants in the USA — A Complete Guide',
    description: 'The definitive guide to finding Jain-friendly Indian restaurants across America.',
    content: `Finding Jain-friendly food in the United States is one of the most common struggles for the estimated 150,000+ Jains living in America. This guide explains what to look for and where to find it.

**What Makes a Restaurant Jain-Friendly?**

Jain dietary requirements prohibit:
- **Onion and garlic** (alliums are root vegetables)
- **Root vegetables**: potatoes, carrots, beets, radish
- **Underground produce** in general

This rules out most mainstream Indian restaurants, which rely heavily on onion-garlic base for curries.

**How to Find Jain Restaurants**

Use the [Jain filter on this site](/indian-restaurants/jain) to find restaurants that offer Jain options. Many Gujarati and some South Indian restaurants will accommodate Jain requests — always call ahead to confirm.

**Cities with the Best Jain Options**

- **Edison, NJ** — Large Gujarati community; multiple pure-veg and Jain-friendly restaurants
- **Bay Area, CA** — Fremont's Indian community includes a significant Jain population
- **Chicago, IL** — Devon Avenue has several pure-veg establishments that can accommodate Jain needs`,
  },
};

const FALLBACK_SLUGS = [
  'south-indian-dosa-guide-usa', 'little-india-neighborhoods-usa',
  'vegetarian-indian-restaurants-usa', 'indian-restaurant-regional-cuisine-explained',
  'halal-indian-restaurants-usa', 'indo-chinese-food-usa-guide',
];

export async function generateStaticParams() {
  return [...Object.keys(GUIDES), ...FALLBACK_SLUGS].map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const guide = GUIDES[params.slug];
  if (!guide) return {};
  return { title: guide.title, description: guide.description };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = GUIDES[params.slug];

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-maroon mb-3">Guide Coming Soon</h1>
        <p className="text-gray-600 mb-6">This guide is being written. Check back soon.</p>
        <Link href="/guides" className="text-spice hover:underline">← Back to Guides</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <nav className="text-sm text-gray-500 mb-6 flex gap-1.5">
        <Link href="/" className="hover:text-spice">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-spice">Guides</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{guide.title}</span>
      </nav>

      <h1 className="text-3xl font-bold text-maroon leading-tight">{guide.title}</h1>
      <p className="text-gray-600 mt-2 mb-8 text-lg">{guide.description}</p>

      <article className="prose prose-slate max-w-none prose-headings:text-maroon prose-a:text-spice">
        {guide.content.split('\n\n').map((block, i) => {
          if (block.startsWith('**') && block.endsWith('**')) {
            return <h2 key={i} className="text-xl font-bold text-maroon mt-8 mb-3">{block.replace(/\*\*/g, '')}</h2>;
          }
          if (block.startsWith('- ')) {
            return (
              <ul key={i} className="list-disc list-inside space-y-1 text-gray-700">
                {block.split('\n').map((line, j) => (
                  <li key={j}>{line.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>
                ))}
              </ul>
            );
          }
          if (block.includes('|')) {
            return <div key={i} className="overflow-x-auto my-4"><pre className="text-sm text-gray-700">{block}</pre></div>;
          }
          return <p key={i} className="text-gray-700 leading-relaxed">{block}</p>;
        })}
      </article>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link href="/guides" className="text-spice hover:underline text-sm font-medium">
          ← Back to all guides
        </Link>
      </div>
    </div>
  );
}
