import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/write',
        '/api/',
        '/health',
        '/v1/write',
        '/v1/api/',
        '/v1/health',
      ],
    },
    sitemap: 'https://psmithul.com/sitemap.xml',
  };
}
