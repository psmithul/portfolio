'use client';
/* oxlint-disable next/no-html-link-for-pages -- Version switches require a full document load to isolate the archived styles and scroll controller. */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path === '/v1' || path.startsWith('/v1/')) return children;
  return (
    <div className="academic-site">
      <header className="academic-header">
        <div className="academic-header-inner">
          <nav aria-label="Main navigation">
            <Link
              href="/#about"
              aria-current={
                path === '/' || path === '/about' ? 'page' : undefined
              }
            >
              about
            </Link>
            <Link
              href="/#research"
              aria-current={path.startsWith('/work') ? 'page' : undefined}
            >
              research
            </Link>
            <Link
              href="/activities"
              aria-current={path === '/activities' ? 'page' : undefined}
            >
              activities
            </Link>
            <a href="/Mithul-Sourav-CV.pdf" target="_blank" rel="noreferrer">
              vitae
            </a>
          </nav>
        </div>
      </header>
      {children}
      <footer className="academic-footer">
        <div>
          © {new Date().getFullYear()} Mithul Sourav.{' '}
          <Link href="/blog">Journal</Link> ·{' '}
          <a href="/v1">Minecraft portfolio (v1)</a> ·{' '}
          <Link href="/write">Writing desk</Link>
        </div>
      </footer>
    </div>
  );
}
