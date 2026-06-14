'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Status = 'idle' | 'loading' | 'error';

interface Props {
  variant?: 'hero' | 'default';
  className?: string;
}

export function NearMeButton({ variant = 'default', className = '' }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  function handleClick() {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation not supported by your browser.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        router.push(`/restaurants/near-me?lat=${latitude}&lng=${longitude}`);
      },
      (err) => {
        if (err.code === 1 /* PERMISSION_DENIED */) {
          setErrorMsg('Location access denied. Please search by city name.');
        } else {
          setErrorMsg('Could not get your location. Please search manually.');
        }
        setStatus('error');
      },
      { timeout: 10000 }
    );
  }

  const heroBase = 'border border-white/40 text-white hover:bg-white/15 hover:border-white';
  const defaultBase = 'border border-gray-200 text-gray-600 hover:border-spice hover:text-spice';
  const base = variant === 'hero' ? heroBase : defaultBase;

  if (status === 'error') {
    return (
      <p className={`text-sm ${variant === 'hero' ? 'text-red-300' : 'text-red-500'} ${className}`}>
        {errorMsg}
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === 'loading'}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all disabled:opacity-60 cursor-pointer ${base} ${className}`}
    >
      {status === 'loading' ? (
        <>
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Detecting location…
        </>
      ) : (
        <>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
          Use my location
        </>
      )}
    </button>
  );
}
