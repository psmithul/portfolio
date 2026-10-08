import { PortfolioExperience } from '@/components/portfolio-experience';
import { ClassicPortfolio } from '@/components/classic-portfolio';
import { MinecraftLoader } from '@/components/minecraft-loader';
import { Suspense } from 'react';
import { projects } from '@/content/projects';
import { getPublicPosts } from '@/lib/journal-store';
import { journalSummary } from '@/lib/journal-editorial';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import {
  portfolioModeForDevice,
  type PortfolioMode,
} from '@/lib/portfolio-display';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { alternates: { canonical: '/' } };

async function Portfolio({ mode }: { mode: PortfolioMode }) {
  const posts = await getPublicPosts();
  const summaries = posts.map(journalSummary);
  return (
    <PortfolioExperience
      projects={projects}
      posts={summaries}
      initialMode={mode}
    >
      <ClassicPortfolio projects={projects} posts={posts} />
    </PortfolioExperience>
  );
}

export default async function Home() {
  const request = await headers();
  const mode = portfolioModeForDevice({
    userAgent: request.get('user-agent') ?? '',
  });
  return (
    <Suspense
      fallback={
        <main id="main">
          {mode === 'static' ? (
            <output className="classic-loading">
              Loading Mithul’s portfolio…
            </output>
          ) : (
            <MinecraftLoader />
          )}
        </main>
      }
    >
      <Portfolio mode={mode} />
    </Suspense>
  );
}
