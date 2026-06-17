'use client';

import { useState, useRef } from 'react';

const TO = 'indianrestaurentsinusa@gmail.com';

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const name = nameRef.current?.value.trim() ?? '';
    const email = emailRef.current?.value.trim() ?? '';
    const message = messageRef.current?.value.trim() ?? '';

    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Message from ${name} — Indian Restaurants in USA`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );

    window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">✉️</div>
        <p className="font-semibold text-gray-900">Your email client should have opened.</p>
        <p className="text-sm text-gray-500 mt-1">
          If it didn&apos;t, email us directly at{' '}
          <a href={`mailto:${TO}`} className="text-spice underline">{TO}</a>
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-5 text-sm text-spice underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          ref={nameRef}
          required
          autoComplete="name"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-spice"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          ref={emailRef}
          required
          autoComplete="email"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-spice"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={4}
          ref={messageRef}
          required
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-spice"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-2.5 bg-spice hover:bg-maroon text-white rounded-lg text-sm font-semibold transition-colors"
      >
        Send Message
      </button>
    </form>
  );
}
