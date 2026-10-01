import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { ArticleBody } from '@/components/article-body';
import { ReadingContents } from '@/components/reading-contents';
import { getPublicPost, getPublicPosts } from '@/lib/journal-store';
import { dateLabel } from '@/lib/journal-model';

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
  const next = (await getPublicPosts()).find((entry) => entry.slug !== slug);
  return (
    <main id="main" className="article-page reading-page shell">
      <Link href="/blog" className="back-link">
        <ArrowLeft size={16} /> Mika’s Life
      </Link>
      <header className="article-header">
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
      </header>
      <div className="reading-layout">
        <ReadingContents body={post.body} />
        <ArticleBody body={post.body} />
      </div>
      <footer className="article-end">
        <p>Written by Mithul · Mika’s Life</p>
        {next && (
          <Link href={`/blog/${next.slug}`} className="next-essay">
            <span className="eyebrow">KEEP READING</span>
            <span>
              {next.title} <ArrowUpRight size={20} />
            </span>
          </Link>
        )}
        <Link href="/blog" className="text-link">
          <ArrowLeft size={16} /> All entries
        </Link>
      </footer>
    </main>
  );
}
