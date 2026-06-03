import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editorial Standards — Indian Restaurants in USA',
  description: 'Our editorial principles for accuracy, fairness, and transparency in the Indian Restaurants in USA directory.',
};

export default function EditorialStandardsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <nav className="text-sm text-gray-500 mb-6 flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-spice">Home</Link>
        <span>/</span>
        <Link href="/about" className="hover:text-spice">About</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Editorial Standards</span>
      </nav>

      <h1 className="text-3xl font-bold text-maroon mb-8">Editorial Standards</h1>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-maroon mb-2">Accuracy First</h2>
          <p>We do not fabricate or embellish restaurant information. All ratings, review counts, hours, and contact details are sourced from Google Places and displayed as-is. We link back to the original Google Maps listing for every restaurant so users can verify information independently.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-maroon mb-2">Conservative Classification</h2>
          <p>Cuisine and dietary tags are assigned conservatively. We only tag a restaurant with &quot;Jain&quot; or &quot;halal&quot; when there is explicit, unambiguous evidence in the restaurant name or description. A missing tag is never worse than a wrong one — especially for dietary needs that affect health or religious practice.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-maroon mb-2">No Pay-to-Play</h2>
          <p>Restaurants cannot pay to appear in our directory, improve their ranking, or receive a &quot;hidden gem&quot; designation. All rankings are determined algorithmically based on objective data signals (rating, review count, data completeness).</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-maroon mb-2">Transparency About AI</h2>
          <p>We use AI (Claude by Anthropic) to classify regional cuisine and dietary tags, and to generate restaurant descriptions where none exist. We disclose this on our <Link href="/about/our-data" className="text-spice hover:underline">Our Data</Link> page. AI-generated descriptions are factual summaries, not reviews or endorsements.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-maroon mb-2">Corrections Policy</h2>
          <p>We correct factual errors within 48 hours of receiving a credible report. Restaurant owners can <Link href="/contact" className="text-spice hover:underline">contact us</Link> to request corrections, claim their listing, or report closure.</p>
        </section>
      </div>
    </div>
  );
}
