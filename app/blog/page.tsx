import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { posts, isDraftPreview } from '@/lib/posts.generated';
export const metadata: Metadata = {
  title: 'The Margins — Journal',
  description:
    'A personal journal by Mithul Sourav. Notes on engineering, curiosity, and the life around them.',
};
function dateLabel(value: string) {
  return new Date(value + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
export default function Blog() {
  return (
    <main id="main" className="journal-page">
      <header className="journal-masthead shell">
        <div className="journal-edition">
          <span>A PERSONAL JOURNAL</span>
          <span>BY MITHUL SOURAV</span>
        </div>
        <h1>
          The <em>Margins.</em>
        </h1>
        <p>
          On engineering, curiosity,
          <br className="mobile-break" /> and the life around them.
        </p>
        <div className="journal-rule">
          <span>IDEAS ARE ALLOWED TO WANDER HERE.</span>
          <span>
            {String(posts.length).padStart(2, '0')}{' '}
            {posts.length === 1 ? 'ENTRY' : 'ENTRIES'}
          </span>
        </div>
      </header>
      {isDraftPreview && (
        <div className="draft-banner shell">
          Local draft preview — unpublished and future-dated entries are visible
          here. Production builds exclude them.
        </div>
      )}
      <div className="journal-layout shell">
        <aside className="journal-sidebar">
          <span className="journal-symbol" aria-hidden="true">
            m.
          </span>
          <h2>
            A notebook
            <br />
            with the edges open.
          </h2>
          <p>
            Some questions don’t fit neatly into a project report. This is a
            place for those questions, and for the ideas found along the way.
          </p>
          <p>Written and maintained by me, Mithul.</p>
          <div className="journal-subjects">
            <h3>Threads of curiosity</h3>
            <span>Engineering & making</span>
            <span>Science & observation</span>
            <span>Learning & reflection</span>
          </div>
          <Link href="/about" className="text-link">
            About the author <ArrowUpRight size={16} />
          </Link>
        </aside>
        <section className="journal-entries" aria-label="Journal entries">
          {posts.length === 0 ? (
            <div className="journal-empty">
              <span className="eyebrow">BEFORE THE FIRST ENTRY</span>
              <span className="empty-ornament" aria-hidden="true">
                “
              </span>
              <h2>
                The first page
                <br />
                is still <em>unwritten.</em>
              </h2>
              <p>
                This notebook is open. Essays, questions, and observations will
                find their way here as I write them.
              </p>
              <span className="journal-signature">Mithul</span>
              <div className="empty-foot">
                <span>No published entries yet.</span>
                <Link href="/#work">
                  In the meantime, explore the work <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            posts.map((post, i) => (
              <article
                key={post.slug}
                className={
                  i === 0 ? 'journal-entry featured-entry' : 'journal-entry'
                }
              >
                <div className="entry-meta">
                  <span>{dateLabel(post.date)}</span>
                  <span>{post.readingMinutes} MIN READ</span>
                  {post.draft && <span>DRAFT</span>}
                </div>
                <h2>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p>{post.description}</p>
                <div className="entry-footer">
                  <span>{post.tags.join(' · ')}</span>
                  <Link className="text-link" href={`/blog/${post.slug}`}>
                    Read the essay <ArrowUpRight size={16} />
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
