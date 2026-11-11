import type { MetadataRoute } from 'next';
import { projects } from '@/content/projects';
import { getPublicPosts } from '@/lib/journal-store';
import { postPath, projectPath, siteOrigin, sitePages } from '@/lib/site-paths';

// Online publication and withdrawal must appear without a source deployment.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublicPosts();
  const paths = [
    ...Object.values(sitePages),
    ...projects.map((project) => projectPath(project.slug)),
    ...posts.map((post) => postPath(post.slug)),
  ];
  return paths.map((path) => ({ url: siteOrigin + path }));
}
