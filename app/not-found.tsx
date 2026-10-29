import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="academic-content">
      <h1>Page not found</h1>
      <p>
        This page isn’t here. It may have moved, or the link might be incorrect.
      </p>
      <p>
        <Link href="/">Back to the homepage →</Link>
      </p>
      <p>
        <Link href="/work">Browse projects</Link> ·{' '}
        <Link href="/blog">Read the journal</Link>
      </p>
    </main>
  );
}
