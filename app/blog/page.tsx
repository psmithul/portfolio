import { JournalCover } from '@/components/journal-cover';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getPublicPosts } from '@/lib/journal-store';
import { dateLabel } from '@/lib/journal-model';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Mika’s Life — A personal journal',
  description:
    'Essays on science, attention, books, and making things. A personal journal by Mika, also known as Mithul Sourav.',
};

export default async function Blog() {
  const posts = await getPublicPosts();
  return (
    <main id="main" className="journal-page">
      <header className="journal-masthead shell">
        <div className="journal-edition">
          <span>A PERSONAL JOURNAL</span>
          <span>BY MIKA / MITHUL SOURAV</span>
        </div>
        <h1>
          Mika’s <em>Life.</em>
        </h1>
        <p>Notes on science, books, and the questions I come back to.</p>
        <div className="journal-rule">
          <span>ESSAYS & OCCASIONAL NOTES</span>
          <span>
            {String(posts.length).padStart(2, '0')}{' '}
            {posts.length === 1 ? 'ENTRY' : 'ENTRIES'}
          </span>
        </div>
      </header>
      <div className="journal-layout shell">
        <aside className="journal-sidebar">
          <span className="journal-symbol" aria-hidden="true">
            m.
          </span>
          <h2>
            What caught
            <br />
            my attention.
          </h2>
          <p>
            I’m Mika. I study mechanical engineering. This is where I write
            about science, books, and the ideas that stay with me.
          </p>
          <p>
            Sometimes there’s a connection to something I’m building. Sometimes
            it’s just a question I haven’t quite worked out.
          </p>
          <div className="journal-subjects">
            <h3>In these pages</h3>
            <span>Science & observation</span>
            <span>Art & attention</span>
            <span>Learning & making</span>
          </div>
          <Link href="/about" className="text-link">
            A little about me <ArrowUpRight size={16} />
          </Link>
        </aside>
        <section className="journal-entries" aria-label="Journal entries">
          {posts.length === 0 && (
            <div className="journal-empty">
              <h2>More writing soon.</h2>
              <p>There are no published entries at the moment.</p>
            </div>
          )}
          {posts.map((post, i) => (
            <article
              key={post.slug}
              className={
                i === 0 ? 'journal-entry featured-entry' : 'journal-entry'
              }
            >
              <div className="entry-meta">
                <time dateTime={post.date}>{dateLabel(post.date)}</time>
                <span>{post.readingMinutes} MIN READ</span>
              </div>
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.description}</p>
              <JournalCover
                body={post.body}
                slug={post.slug}
                title={post.title}
              />
              <div className="entry-footer">
                <span>{post.tags.join(' · ')}</span>
                <Link className="text-link" href={`/blog/${post.slug}`}>
                  Read the essay <ArrowUpRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
