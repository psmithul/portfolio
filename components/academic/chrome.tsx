'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

const sections = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Projects', detail: '/work/' },
  { id: 'journal', label: 'Journal', detail: '/blog/' },
  { id: 'activities', label: 'Activities' },
];

function subscribeToFragment(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

const getFragment = () => window.location.hash.slice(1) || 'top';
const getServerFragment = () => 'top';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const fragment = useSyncExternalStore(
    subscribeToFragment,
    getFragment,
    getServerFragment,
  );
  return (
    <div className="academic-site">
      <header className="academic-header">
        <div className="academic-header-inner">
          <nav aria-label="Main navigation">
            {sections.map(({ id, label, detail }) =>
              path === '/' ? (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-current={fragment === id ? 'location' : undefined}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={id}
                  href={`/#${id}`}
                  aria-current={
                    detail && path.startsWith(detail) ? 'location' : undefined
                  }
                >
                  {label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </header>
      {children}
      <footer className="academic-footer">
        <div>
          <span>© 2024–2026 Mithul Sourav</span>
          <a href="/Mithul-Sourav-CV.pdf" target="_blank" rel="noreferrer">
            Résumé
          </a>
        </div>
      </footer>
    </div>
  );
}
