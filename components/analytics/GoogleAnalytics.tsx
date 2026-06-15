'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check existing consent on mount
    const check = () => {
      try {
        setHasConsent(localStorage.getItem('cookie_consent') === 'all');
      } catch {}
    };
    check();

    // Re-check when user makes a choice in the cookie banner (same tab)
    const onConsent = (e: Event) => {
      setHasConsent((e as CustomEvent).detail === 'all');
    };
    window.addEventListener('cookieConsentUpdate', onConsent);
    return () => window.removeEventListener('cookieConsentUpdate', onConsent);
  }, []);

  if (!GA_ID || !hasConsent) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  );
}
