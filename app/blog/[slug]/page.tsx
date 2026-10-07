import type { Metadata } from 'next';
import { MinecraftLink as Link } from '@/components/minecraft-link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { ArticleBody } from '@/components/article-body';
import { ReadingContents } from '@/components/reading-contents';
import { JournalLink } from '@/components/journal-link';
import { JournalArt } from '@/components/journal-art';
import { JournalReader } from '@/components/journal-reader';
import { getPublicPost, getPublicPosts } from '@/lib/journal-store';
import { dateLabel } from '@/lib/journal-model';
import { nextJournalPost } from '@/lib/journal-highlights';
import { journalSummary } from '@/lib/journal-editorial';

type Props = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublicPost((await params).slug);
  return post
    ? { title: `${post.title} — Mika’s Life`, description: post.description }
    : { title: 'Entry not found' };
}
export default async function Article({ params }: Props) {
  const { slug } = await params;
  const post = await getPublicPost(slug);
  if (!post) notFound();
  const next = nextJournalPost(await getPublicPosts(), slug);
  return (
    <main id="main" className="article-page reading-page journal-article shell">
      <JournalLink href="/blog" className="back-link">
        <ArrowLeft size={16} /> All notes · Mika’s Life
      </JournalLink>
      <header className="article-header journal-article-header">
        <div className="journal-story-heading">
          <div>
            <p className="eyebrow">{post.tags.join(' / ')}</p>
            <h1>{post.title}</h1>
            <p className="article-description">{post.description}</p>
            <div className="article-byline">
              <span>
                By <Link href="/about">Mika</Link>
              </span>
              <time dateTime={post.date}>{dateLabel(post.date)}</time>
              <span>{post.readingMinutes} min read</span>
            </div>
          </div>
          <JournalArt post={journalSummary(post)} />
        </div>
      </header>
      <JournalReader>
        <div className="reading-layout">
          <ReadingContents body={post.body} />
          <ArticleBody body={post.body} />
        </div>
      </JournalReader>
      <footer className="article-end">
        <p>Thanks for reading. — Mithul</p>
        {next && (
          <JournalLink
            href={`/blog/${next.slug}`}
            className="next-essay journal-next-card"
          >
            <JournalArt post={journalSummary(next)} />
            <div>
              <span className="eyebrow">KEEP READING</span>
              <span>
                {next.title} <ArrowUpRight size={20} />
              </span>
            </div>
          </JournalLink>
        )}
        <JournalLink href="/blog" className="text-link">
          <ArrowLeft size={16} /> All entries
        </JournalLink>
      </footer>
    </main>
  );
}
