'use client';

import { useState, useRef, useEffect } from 'react';

interface Props {
  name: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
}

const hasCoords = (lat?: number | null, lng?: number | null) =>
  typeof lat === 'number' && typeof lng === 'number' && lat !== 0 && lng !== 0;

function buildUrls(name: string, address: string, lat?: number | null, lng?: number | null) {
  const coords = hasCoords(lat, lng);
  const q = encodeURIComponent(`${name}, ${address}`);
  const latLng = coords ? `${lat},${lng}` : null;

  return [
    {
      id: 'google',
      label: 'Google Maps',
      color: '#4285F4',
      href: coords
        ? `https://www.google.com/maps/dir/?api=1&destination=${latLng}`
        : `https://www.google.com/maps/search/?api=1&query=${q}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
          <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle fill="#fff" cx="12" cy="9" r="2.5"/>
        </svg>
      ),
    },
    {
      id: 'apple',
      label: 'Apple Maps',
      color: '#000000',
      href: coords
        ? `https://maps.apple.com/?daddr=${latLng}&dirflg=d`
        : `https://maps.apple.com/?q=${q}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
          <path fill="#555" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
        </svg>
      ),
    },
    {
      id: 'waze',
      label: 'Waze',
      color: '#33CCFF',
      href: coords
        ? `https://waze.com/ul?ll=${latLng}&navigate=yes`
        : `https://waze.com/ul?q=${q}&navigate=yes`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
          <circle fill="#33CCFF" cx="12" cy="11" r="9"/>
          <circle fill="#fff" cx="9" cy="10" r="1.5"/>
          <circle fill="#fff" cx="15" cy="10" r="1.5"/>
          <path fill="#fff" d="M9 13.5c.5 1.5 5.5 1.5 6 0" strokeWidth="0"/>
          <circle fill="#fff" cx="16.5" cy="6.5" r="1"/>
        </svg>
      ),
    },
    {
      id: 'bing',
      label: 'Bing Maps',
      color: '#008373',
      href: coords
        ? `https://www.bing.com/maps?rtp=~pos.${lat}_${lng}`
        : `https://www.bing.com/maps?q=${q}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
          <path fill="#008373" d="M5 3l4 1.5v13L5 19V3zm4 1.5l6 3.5-2 1.5-4-2.5V4.5zm6 3.5l2 5-2 1-2-1.5 2-4.5zm2 5l-8 4.5V15l6-3 2 1z"/>
        </svg>
      ),
    },
    {
      id: 'osm',
      label: 'OpenStreetMap',
      color: '#7EBC6F',
      href: coords
        ? `https://www.openstreetmap.org/directions?to=${latLng}`
        : `https://www.openstreetmap.org/search?query=${q}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
          <path fill="#7EBC6F" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>
          <path fill="#4CAF50" d="M12 6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
        </svg>
      ),
    },
  ];
}

export function GetDirectionsButton({ name, address, lat, lng }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, [open]);

  const maps = buildUrls(name, address, lat, lng);

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-spice hover:bg-maroon text-white rounded-lg text-sm font-semibold transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
          <path d="M21.71 11.29l-9-9a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42l9 9a1 1 0 0 0 1.42 0l9-9a1 1 0 0 0 0-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>
        </svg>
        Get Directions
        <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 fill-white transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
          <p className="text-xs text-gray-400 px-4 pt-3 pb-1 font-medium uppercase tracking-wide">
            Open in…
          </p>
          {maps.map(map => (
            <a
              key={map.id}
              href={map.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-800 border-t border-gray-100 first-of-type:border-t-0"
            >
              {map.icon}
              {map.label}
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-gray-400 ml-auto" aria-hidden="true">
                <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
