'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

export function SectionLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const destination = new URL(href, window.location.href);
        if (
          destination.origin !== window.location.origin ||
          destination.pathname !== window.location.pathname ||
          destination.search !== window.location.search
        )
          return;
        const target = document.getElementById(destination.hash.slice(1));
        if (!target) return;
        event.preventDefault();
        if (destination.hash !== window.location.hash)
          window.history.pushState(null, '', destination.href);
        if (target.id === 'top')
          window.scrollTo({ top: 0, behavior: 'instant' });
        else target.scrollIntoView({ block: 'start', behavior: 'instant' });
      }}
    >
      {children}
    </Link>
  );
}
