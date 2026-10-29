'use client';
import Link from 'next/link';
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" className="academic-content">
      <h1>Something didn’t load.</h1>
      <p>Please try opening this page again.</p>
      <button onClick={reset}>Try again</button>
      <p>
        <Link href="/">Back to the homepage</Link>
      </p>
    </main>
  );
}
