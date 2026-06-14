'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface Props {
  posts: string[];
}

export function InstagramFeed({ posts }: Props) {
  useEffect(() => {
    // Re-process if embed.js already loaded (e.g. client-side navigation back to page)
    if (typeof window !== 'undefined' && (window as { instgrm?: { Embeds: { process: () => void } } }).instgrm) {
      (window as { instgrm?: { Embeds: { process: () => void } } }).instgrm!.Embeds.process();
    }
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
        {posts.map(url => (
          <blockquote
            key={url}
            className="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{
              background: '#FFF',
              border: 0,
              borderRadius: '3px',
              boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
              margin: '1px',
              maxWidth: '540px',
              minWidth: '326px',
              padding: 0,
              width: '99.375%',
            }}
          >
            <div style={{ padding: '16px' }}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#000', fontFamily: 'Arial,sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: 'normal', lineHeight: '17px', textDecoration: 'none', wordWrap: 'break-word' }}
              >
                View this post on Instagram
              </a>
            </div>
          </blockquote>
        ))}
      </div>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          const w = window as { instgrm?: { Embeds: { process: () => void } } };
          w.instgrm?.Embeds.process();
        }}
      />
    </>
  );
}
