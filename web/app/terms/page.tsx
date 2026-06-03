import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use — Indian Restaurants in USA',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-maroon mb-8">Terms of Use</h1>
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p className="text-sm text-gray-400">Last updated: 2025</p>

        <section>
          <h2 className="text-lg font-bold text-maroon">Acceptance</h2>
          <p>By using Indian Restaurants in USA, you agree to these terms. If you disagree, please do not use the site.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-maroon">Information Accuracy</h2>
          <p>Restaurant information is provided in good faith but may not always be current or complete. Always confirm hours, availability, and dietary suitability directly with the restaurant before visiting. We are not liable for inaccuracies.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-maroon">Dietary Information</h2>
          <p>Dietary tags (Jain, halal, vegan, etc.) are provided for informational purposes only. They are not a guarantee of compliance. Always confirm dietary requirements directly with the restaurant.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-maroon">Intellectual Property</h2>
          <p>The site design, taxonomy, and written content are owned by Indian Restaurants in USA. Restaurant names, addresses, and Google ratings remain property of their respective owners.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-maroon">Contact</h2>
          <p>Questions about these terms? Use our <a href="/contact" className="text-spice hover:underline">Contact page</a>.</p>
        </section>
      </div>
    </div>
  );
}
