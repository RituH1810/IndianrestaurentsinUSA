import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Indian Restaurants in USA',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-maroon mb-8">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none text-gray-700 space-y-6">
        <p className="text-sm text-gray-400">Last updated: 2025</p>

        <section>
          <h2 className="text-lg font-bold text-maroon">Information We Collect</h2>
          <p>We collect minimal data necessary to operate this directory. This includes: search queries (anonymised), pages viewed (via analytics), and contact form submissions.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-maroon">Restaurant Data</h2>
          <p>Restaurant information (name, address, hours, ratings) is sourced from publicly available data via Google Places. We do not collect or store personal data about restaurant customers.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-maroon">Cookies</h2>
          <p>We use minimal first-party cookies for site functionality. We do not use advertising cookies or cross-site tracking.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-maroon">Contact</h2>
          <p>For privacy-related enquiries, use the contact form on our <a href="/contact" className="text-spice hover:underline">Contact page</a>.</p>
        </section>
      </div>
    </div>
  );
}
