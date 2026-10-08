import { PortfolioExperience } from '@/components/portfolio-experience';
import { StaticPortfolio } from '@/components/static-portfolio';
import { MinecraftLoader } from '@/components/minecraft-loader';
import { Suspense } from 'react';
import { projects } from '@/content/projects';
import { getPublicPosts } from '@/lib/journal-store';
import { journalSummary } from '@/lib/journal-editorial';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { alternates: { canonical: '/' } };

async function Portfolio() {
  const posts = await getPublicPosts();
  const summaries = posts.map(journalSummary);
  return (
    <PortfolioExperience projects={projects} posts={summaries}>
      <StaticPortfolio projects={projects} posts={summaries} />
    </PortfolioExperience>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main id="main">
          <MinecraftLoader />
        </main>
      }
    >
      <Portfolio />
    </Suspense>
  );
}
