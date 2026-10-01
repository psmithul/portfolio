import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { JournalCover } from '@/components/journal-cover';
import { getPublicPosts } from '@/lib/journal-store';
import { dateLabel } from '@/lib/journal-model';
import { journalHighlights, journalTopic } from '@/lib/journal-highlights';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Mika’s Life — Notes on learning and building',
  description:
    'A personal journal by Mithul. Notes on AI, control systems, space, and the things he is learning as a mechanical engineering student.',
};

export default async function Blog() {
  const posts = await getPublicPosts();
  const highlights = journalHighlights(posts);
  const selected = new Set(highlights.map(({ slug }) => slug));
  const others = posts.filter(({ slug }) => !selected.has(slug));
  return (
    <main id="main" className="journal-index shell">
      <header className="journal-index-head">
        <div>
          <p className="eyebrow">A personal journal · By Mithul</p>
          <h1>
            Mika’s <em>Life.</em>
          </h1>
        </div>
        <div className="journal-index-intro">
          <p>
            I write about what I’m learning, what I’d like to try, and the
            questions I haven’t answered yet.
          </p>
          <span>AI, control systems, space, and a few things in between.</span>
        </div>
      </header>
      <div className="journal-index-rule">
        <div>
          <a href="#notes">AI & control notes</a>
          {others.length > 0 && <a href="#more-writing">More writing</a>}
        </div>
        <span>
          {posts.length} {posts.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>
      <section
        id="notes"
        className="journal-notes"
        aria-labelledby="journal-notes-heading"
      >
        <div className="journal-section-label">
          <h2 id="journal-notes-heading">AI & control notes</h2>
          <p>The models I’m following and the ideas I’m working through.</p>
        </div>
        {highlights.length === 0 && (
          <p className="journal-empty-note">
            There are no published entries yet.
          </p>
        )}
        <div className="journal-note-grid">
          {highlights.map((post) => (
            <article className="journal-note" key={post.slug}>
              <p className="eyebrow">{journalTopic(post)}</p>
              <h3>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className="journal-note-description">{post.description}</p>
              <div className="journal-note-footer">
                <span>
                  <time dateTime={post.date}>{dateLabel(post.date)}</time> ·{' '}
                  {post.readingMinutes} min
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  aria-label={`Read ${post.title}`}
                >
                  Read <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      {others.length > 0 && (
        <section
          id="more-writing"
          className="journal-more"
          aria-labelledby="journal-more-heading"
        >
          <div className="journal-section-label">
            <h2 id="journal-more-heading">More from the journal</h2>
            <p>Space, observation, and everyday learning.</p>
          </div>
          {others.map((post) => (
            <article className="journal-archive-entry" key={post.slug}>
              <div>
                <p className="eyebrow">{post.tags.slice(0, 2).join(' / ')}</p>
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.description}</p>
                <div className="journal-note-footer">
                  <span>
                    <time dateTime={post.date}>{dateLabel(post.date)}</time> ·{' '}
                    {post.readingMinutes} min
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    aria-label={`Read ${post.title}`}
                  >
                    Read <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <JournalCover
                body={post.body}
                slug={post.slug}
                title={post.title}
              />
            </article>
          ))}
        </section>
      )}
      <aside className="journal-colophon">
        <p>
          I’m a final-year mechanical engineering student at NITK Surathkal.
          Writing here helps me slow down and make sense of what I’m learning.
        </p>
        <Link href="/about">
          A little about me <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </aside>
    </main>
  );
}
