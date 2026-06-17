import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — Indian Restaurants in USA',
  description: 'Get in touch with the Indian Restaurants in USA team — report errors, claim a listing, or reach out for press enquiries.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold text-maroon mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-10">
        Report incorrect data, claim your restaurant listing, or reach out for press and partnership enquiries.
      </p>

      <div className="space-y-6">
        {[
          { title: 'Report Incorrect Data', desc: 'If a restaurant listing has wrong hours, is permanently closed, or has incorrect information, please let us know. We correct errors within 48 hours.' },
          { title: 'Claim Your Listing', desc: 'Restaurant owners can claim their listing to update hours, photos, and descriptions.' },
          { title: 'Press & Media', desc: 'For press enquiries, data partnerships, or media requests, visit the Press page.' },
        ].map(item => (
          <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-1">{item.title}</h2>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-cream rounded-xl border border-saffron/30 p-6">
        <h2 className="font-bold text-maroon mb-3">Send a Message</h2>
        <ContactForm />
      </div>
    </div>
  );
}
