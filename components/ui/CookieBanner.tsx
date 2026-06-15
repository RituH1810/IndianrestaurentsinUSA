'use client';

import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem('cookie_consent')) setVisible(true);
    } catch { /* private browsing — silently skip */ }
  }, []);

  function accept() {
    try {
      localStorage.setItem('cookie_consent', 'all');
      window.dispatchEvent(new CustomEvent('cookieConsentUpdate', { detail: 'all' }));
    } catch { /* ignore */ }
    setVisible(false);
  }

  function essential() {
    try {
      localStorage.setItem('cookie_consent', 'essential');
      window.dispatchEvent(new CustomEvent('cookieConsentUpdate', { detail: 'essential' }));
    } catch { /* ignore */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-2xl"
    >
      <div className="container mx-auto max-w-5xl px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Icon + text */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">🍪</span>
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-900">We use cookies</span> to keep the site working and
            understand how visitors use it. Essential cookies are always on.
            Optional analytics cookies help us improve your experience.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0 sm:pl-4">
          <button
            onClick={essential}
            className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors whitespace-nowrap"
          >
            Essential only
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 rounded-full bg-spice text-white text-sm font-semibold hover:bg-maroon transition-colors whitespace-nowrap"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
