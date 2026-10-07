'use client';

import Link, { useLinkStatus } from 'next/link';
import type { ComponentProps } from 'react';
import { ChapterLoading } from '@/components/minecraft-link';

function NavigationStatus() {
  const { pending } = useLinkStatus();
  return (
    <>
      <span
        className={`journal-link-indicator${pending ? ' is-pending' : ''}`}
        aria-hidden="true"
      />
      <output className="sr-only" aria-live="polite">
        {pending ? 'Opening…' : ''}
      </output>
      <ChapterLoading />
    </>
  );
}

export function JournalLink({
  children,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link {...props}>
      {children}
      <NavigationStatus />
    </Link>
  );
}
