import Link from 'next/link';
import { sitePages } from '@/lib/site-paths';
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
        <Link href={sitePages.projects}>Browse projects</Link> ·{' '}
        <Link href={sitePages.buildLog}>Read the Build Log</Link>
      </p>
    </main>
  );
}
