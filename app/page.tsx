import { TrainJourney } from '@/components/train-journey';
import { projects } from '@/content/projects';
import { getPublicPosts } from '@/lib/journal-store';
import { journalSummary } from '@/lib/journal-editorial';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const posts = await getPublicPosts();
  return <TrainJourney projects={projects} posts={posts.map(journalSummary)} />;
}
