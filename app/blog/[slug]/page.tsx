/* oxlint-disable next/no-img-element -- Author-supplied Markdown images have arbitrary dimensions and use native lazy loading. */
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Wide article tables need keyboard access to their scroll container. */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { posts, isDraftPreview } from '@/lib/posts.generated';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return post
    ? {
        title: post.title,
        description: post.description,
        robots: isDraftPreview ? { index: false, follow: false } : undefined,
      }
    : { title: 'Entry not found' };
}
export default async function Article({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <main id="main" className="article-page shell">
      <Link href="/blog" className="back-link">
        <ArrowLeft size={16} /> The Margins
      </Link>
      {isDraftPreview && (
        <p className="draft-banner">
          Local draft preview — not part of the public journal.
        </p>
      )}
      <header className="article-header">
        <p className="eyebrow">{post.tags.join(' / ')}</p>
        <h1>{post.title}</h1>
        <p className="article-description">{post.description}</p>
        <div className="article-byline">
          <span>
            By <Link href="/about">Mithul Sourav</Link>
          </span>
          <time dateTime={post.date}>
            {new Date(post.date + 'T00:00:00Z').toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: 'UTC',
            })}
          </time>
          <span>{post.readingMinutes} min read</span>
        </div>
      </header>
      <article className="article-prose">
        <Markdown
          remarkPlugins={[remarkGfm]}
          skipHtml
          components={{
            h1: ({ children }) => <h2>{children}</h2>,
            img: ({ src, alt }) => (
              <img src={src} alt={alt || ''} loading="lazy" decoding="async" />
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                rel={href?.startsWith('http') ? 'noreferrer' : undefined}
              >
                {children}
              </a>
            ),
            table: ({ children }) => (
              <section
                className="table-scroll"
                tabIndex={0}
                aria-label="Article table"
              >
                <table>{children}</table>
              </section>
            ),
          }}
        >
          {post.body}
        </Markdown>
      </article>
      <footer className="article-end">
        <span aria-hidden="true">∴</span>
        <p>Words by Mithul Sourav.</p>
        <Link href="/blog" className="text-link">
          <ArrowLeft size={16} /> Back to the journal
        </Link>
      </footer>
    </main>
  );
}
