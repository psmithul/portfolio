import type { Metadata } from 'next';
import { MinecraftLink as Link } from '@/components/minecraft-link';
import { ArrowUpRight } from 'lucide-react';
import { JournalShelf } from '@/components/journal-shelf';
import { getPublicPosts } from '@/lib/journal-store';
import { journalSummary } from '@/lib/journal-editorial';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Mika’s Life — Notes on learning and building',
  alternates: { canonical: '/blog' },
  description:
    'A personal journal by Mithul. Notes on AI, control systems, space, and the things he is learning as a mechanical engineering student.',
};

export default async function Blog() {
  const posts = await getPublicPosts();
  return (
    <main id="main" className="journal-page shell">
      <header className="journal-page-head">
        <div>
          <p className="eyebrow">Notes by Mithul</p>
          <h1>
            Mika’s <em>Life.</em>
          </h1>
          <p className="journal-page-subtitle">
            AI, robots, and whatever else I’m learning.
          </p>
        </div>
        <div className="journal-letter">
          <span className="journal-letter-label">Why I write</span>
          <p>
            Usually this starts with a question I can’t leave alone. Writing
            helps me figure out what I’ve actually understood.
          </p>
        </div>
      </header>
      <JournalShelf posts={posts.map(journalSummary)} />
      <div className="journal-page-foot">
        <p>I’m still figuring these things out. That’s part of why I write.</p>
        <Link href="/about">
          A little about me <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
