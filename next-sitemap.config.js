/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indianrestaurantsinusa.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/', '/search', '/near-me', '/saved', '/compare'] },
    ],
  },
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/search', '/near-me', '/saved', '/compare'],
};
