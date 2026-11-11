import type { Metadata } from 'next';
import Link from 'next/link';
import { dateLabel } from '@/lib/journal-model';
import { getPublicPosts } from '@/lib/journal-store';
import { postPath, sitePages } from '@/lib/site-paths';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Build Log',
  alternates: { canonical: sitePages.buildLog },
};

export default async function BuildLogPage() {
  const posts = await getPublicPosts();
  return (
    <main id="main" className="academic-content portfolio-page portfolio-index">
      <header className="portfolio-section-heading">
        <h1>Recent Updates</h1>
        <p className="portfolio-affiliation academic-handwritten">
          Mika’s Life
        </p>
      </header>
      <div>
        <p>
          I use this space to write about whatever bullshit I’m curious about.
          Right now that’s mostly robots, AI, and control.
        </p>
        <ul className="academic-note-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={postPath(post.slug)}
                aria-labelledby={`note-${post.slug}`}
              >
                <div>
                  <p className="academic-note-meta">
                    <time dateTime={post.date}>{dateLabel(post.date)}</time>
                    <span> · {post.readingMinutes} min read</span>
                  </p>
                  <h2 id={`note-${post.slug}`}>{post.title}</h2>
                  <p>{post.description}</p>
                </div>
                <span className="portfolio-link-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </li>
          ))}
          {posts.length === 0 && <li>New notes are on the way.</li>}
        </ul>
      </div>
    </main>
  );
}
