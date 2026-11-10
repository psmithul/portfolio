import Link from 'next/link';
import { HomeSectionLink } from '@/components/academic/home-section-link';
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
        <HomeSectionLink section="research">Browse projects</HomeSectionLink> ·{' '}
        <HomeSectionLink section="journal">Read the journal</HomeSectionLink>
      </p>
    </main>
  );
}
