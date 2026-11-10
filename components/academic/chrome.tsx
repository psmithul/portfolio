'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pages = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Projects' },
  { href: '/activities', label: 'Activities' },
  { href: '/blog', label: 'Journal' },
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="academic-site">
      <header className="academic-header">
        <div className="academic-header-inner">
          <nav aria-label="Main navigation">
            {pages.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={
                  path === href
                    ? 'page'
                    : path.startsWith(`${href}/`)
                      ? 'location'
                      : undefined
                }
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
      <footer className="academic-footer">
        <div>
          <span>© 2024–2026 Alsara</span>
          <a href="/Mithul-Sourav-CV.pdf" target="_blank" rel="noreferrer">
            Résumé
          </a>
        </div>
      </footer>
    </div>
  );
}
