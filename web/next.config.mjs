/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },
  async redirects() {
    if (process.env.NODE_ENV !== 'production') return [];
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'indianrestaurantsinusa.com' }],
        destination: 'https://www.indianrestaurantsinusa.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
