'use client';

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
  const onHomepage = path === '/';
  const fragment = useSyncExternalStore(
    subscribeToFragment,
    getFragment,
    getServerFragment,
  );
  return (
    <div className="academic-site">
      <header className="academic-header">
        <nav className="academic-header-inner" aria-label="Main navigation">
          {sections.map(({ id, label, detail }) => {
            const isHome = id === 'top';
            const content = isHome ? 'Mithul Sourav' : label;
            const brand = isHome
              ? { className: 'academic-brand', 'aria-label': 'Home' }
              : {};
            const current = onHomepage
              ? fragment === id
              : detail && path.startsWith(detail);
            return (
              <a
                key={id}
                href={`${onHomepage ? '' : '/'}#${id}`}
                aria-current={current ? 'location' : undefined}
                {...brand}
              >
                {content}
              </a>
            );
          })}
          <a
            className="academic-resume"
            href="/Mithul-Sourav-CV.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Résumé <span aria-hidden="true">↗</span>
          </a>
        </nav>
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
