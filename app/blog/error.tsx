'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function JournalError({ retry }: { retry: () => void }) {
  return (
    <main id="main" className="journal-index journal-error shell">
      <p className="eyebrow">Mika’s Life</p>
      <h1>This page couldn’t load.</h1>
      <p>Please try again in a moment.</p>
      <button className="button primary" onClick={() => retry()}>
        Try again
      </button>
      <Link href="/" className="text-link">
        <ArrowLeft size={16} aria-hidden="true" /> Back to the portfolio
      </Link>
    </main>
  );
}
