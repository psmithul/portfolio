import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublicPosts } from '@/lib/journal-store';
import { dateLabel } from '@/lib/journal-model';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Mika’s Life — Journal',
  description:
    'Notes by Mithul on robotics, control, AI, and learning by building.',
  alternates: { canonical: '/blog' },
};
export default async function Blog() {
  const posts = await getPublicPosts();
  return (
    <main id="main" className="academic-content">
      <header>
        <h1 className="page-title">Mika’s Life.</h1>
        <p className="page-introduction">
          Notes on robots, AI, and the ideas I’m trying to understand.
        </p>
      </header>
      <p>
        I use this space to work through questions that come up while reading,
        studying, or building something. These are personal notes from a student
        still learning.
      </p>
      <section
        className="academic-section"
        aria-label="Published journal entries"
      >
        <ul className="academic-note-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <time dateTime={post.date}>{dateLabel(post.date)}</time>
              <div>
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.description}</p>
                <p className="academic-note-meta">
                  {post.tags.join(' · ')} · {post.readingMinutes} min read
                </p>
              </div>
            </li>
          ))}
        </ul>
        {posts.length === 0 && <p>New notes are on the way.</p>}
      </section>
      <p>
        <Link href="/about">A little about me →</Link>
      </p>
    </main>
  );
}
