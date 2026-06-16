'use client';

import { useEffect } from 'react';

declare global {
  interface Window { gtag: (...args: unknown[]) => void; }
}

interface Props {
  eventName: string;
  params?: Record<string, unknown>;
}

export function GaPageEvent({ eventName, params }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
