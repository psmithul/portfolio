import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/write', '/api/', '/health'],
    },
    sitemap: 'https://psmithul.com/sitemap.xml',
  };
}
