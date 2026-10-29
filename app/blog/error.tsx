'use client';
import Link from 'next/link';
export default function JournalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" className="academic-content">
      <h1>The journal couldn’t load.</h1>
      <p>Please try again in a moment.</p>
      <button onClick={reset}>Try again</button>
      <p>
        <Link href="/">Back to the homepage</Link>
      </p>
    </main>
  );
}
