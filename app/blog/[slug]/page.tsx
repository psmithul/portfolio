import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleBody } from '@/components/article-body';
import { ReadingContents } from '@/components/reading-contents';
import { getPublicPost, getPublicPosts } from '@/lib/journal-store';
import { dateLabel } from '@/lib/journal-model';
import { nextJournalPost } from '@/lib/journal-highlights';
import { postPath, sitePages } from '@/lib/site-paths';

type Props = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublicPost((await params).slug);
  return post
    ? {
        title: `${post.title} — Mika’s Life`,
        description: post.description,
        alternates: { canonical: postPath(post.slug) },
        openGraph: {
          type: 'article',
          title: post.title,
          description: post.description,
          url: postPath(post.slug),
          publishedTime: post.date,
          authors: ['Mithul Sourav'],
        },
      }
    : { title: 'Entry not found' };
}
export default async function Article({ params }: Props) {
  const { slug } = await params;
  const post = await getPublicPost(slug);
  if (!post) notFound();
  const next = nextJournalPost(await getPublicPosts(), slug);
  return (
    <main id="main" className="academic-content academic-case">
      <Link className="academic-back" href={sitePages.buildLog}>
        ← All notes · <span className="academic-handwritten">Mika’s Life</span>
      </Link>
      <header>
        <p className="academic-kicker">{post.tags.join(' / ')}</p>
        <h1>{post.title}</h1>
        <p className="academic-deck">{post.description}</p>
        <div className="academic-article-byline">
          <span>
            By <Link href={sitePages.about}>Mithul Sourav</Link>
          </span>
          <time dateTime={post.date}>{dateLabel(post.date)}</time>
          <span>{post.readingMinutes} min read</span>
        </div>
      </header>
      <ReadingContents body={post.body} />
      <ArticleBody body={post.body} />
      <footer className="academic-next">
        {next && (
          <>
            <p>Next post</p>
            <Link href={postPath(next.slug)}>{next.title} →</Link>
          </>
        )}
        <div className="academic-inline-links">
          <Link href={sitePages.buildLog}>All updates</Link>
        </div>
      </footer>
    </main>
  );
}
