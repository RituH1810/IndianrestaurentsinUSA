'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface RestaurantPoint {
  slug: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  rating: number | null;
}

interface Props {
  restaurants: RestaurantPoint[];
}

export default function MapClient({ restaurants }: Props) {
  return (
    <MapContainer
      center={[38.5, -96.0]}
      zoom={4}
      style={{ height: '72vh', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {restaurants.map(r => (
        <CircleMarker
          key={r.slug}
          center={[r.latitude, r.longitude]}
          radius={r.rating ? Math.min(Math.max(r.rating, 3), 7) : 5}
          pathOptions={{
            color: '#7A1F1F',
            fillColor: '#C1440E',
            fillOpacity: 0.75,
            weight: 1,
          }}
        >
          <Popup>
            <div style={{ minWidth: 160, fontFamily: 'system-ui, sans-serif' }}>
              <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 2px', color: '#1a1a1a' }}>
                {r.name}
              </p>
              <p style={{ fontSize: 11, color: '#6b7280', margin: '0 0 4px' }}>
                {r.city}, {r.state}
              </p>
              {r.rating != null && (
                <p style={{ fontSize: 11, color: '#E08A1E', margin: '0 0 6px', fontWeight: 600 }}>
                  ★ {r.rating.toFixed(1)}
                </p>
              )}
              <a
                href={`/restaurants/${r.slug}`}
                style={{ fontSize: 11, color: '#C1440E', fontWeight: 600, textDecoration: 'none' }}
              >
                View details →
              </a>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
