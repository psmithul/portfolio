'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { sitePages } from '@/lib/site-paths';

const pages = [
  { href: sitePages.about, label: 'About' },
  { href: sitePages.projects, label: 'Projects', detail: '/work/' },
  { href: sitePages.buildLog, label: 'Build Log', detail: '/blog/' },
];

const legacyFragments = new Map([
  ['#research', sitePages.projects],
  ['#work', sitePages.projects],
  ['#publications', sitePages.projects],
  ['#journal', sitePages.buildLog],
]);

export function SiteNav() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== sitePages.about) return;
    function followLegacyBookmark() {
      const destination = legacyFragments.get(window.location.hash);
      if (destination)
        window.location.replace(destination + window.location.search);
    }
    followLegacyBookmark();
    window.addEventListener('hashchange', followLegacyBookmark);
    return () => window.removeEventListener('hashchange', followLegacyBookmark);
  }, [pathname]);

  return (
    <nav className="academic-header-inner" aria-label="Main navigation">
      {pages.map(({ href, label, detail }) => (
        <Link
          key={href}
          href={href}
          aria-current={
            pathname === href
              ? 'page'
              : detail && pathname.startsWith(detail)
                ? 'location'
                : undefined
          }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
