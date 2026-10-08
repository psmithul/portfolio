'use client';

import Link from 'next/link';

export default function PageError({ retry }: { retry: () => void }) {
  return (
    <main id="main" className="page-error shell">
      <p className="eyebrow">Mithul Sourav</p>
      <h1>This page couldn’t load.</h1>
      <p>
        Please try again. My background and project write-ups are still
        available.
      </p>
      <button className="button primary" onClick={retry}>
        Try again
      </button>
      <Link href="/about" className="text-link">
        Read about me & my work →
      </Link>
    </main>
  );
}
