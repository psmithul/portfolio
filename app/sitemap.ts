import type { MetadataRoute } from 'next';
import { projects } from '@/content/projects';
import { getPublicPosts } from '@/lib/journal-store';

// Online publication and withdrawal must appear without a source deployment.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = [
    '/',
    '/about',
    '/blog',
    ...projects.map((p) => `/work/${p.slug}`),
  ];
  const posts = await getPublicPosts();
  return [
    ...paths.map((path) => ({ url: `https://psmithul.com${path}` })),
    ...posts.map((post) => ({ url: `https://psmithul.com/blog/${post.slug}` })),
  ];
}
