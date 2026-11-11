import type { ReactNode } from 'react';
import { SiteNav } from './site-nav';

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="academic-site">
      <header className="academic-header">
        <SiteNav />
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
