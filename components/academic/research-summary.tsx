'use client';
import { useId, useState } from 'react';
import Link from 'next/link';

export function ResearchSummary({
  summary,
  slug,
}: {
  summary: string;
  slug: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <div className="research-actions">
        <button
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
        >
          [Overview]
        </button>{' '}
        <Link href={`/work/${slug}`}>[Case study]</Link>
      </div>
      <div id={id} hidden={!open} className="research-abstract">
        <p>{summary}</p>
      </div>
    </>
  );
}
