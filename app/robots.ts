import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/site-paths';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/write', '/api/', '/health'],
    },
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}
