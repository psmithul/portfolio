'use client';

import { useRef } from 'react';
import { stations } from '@/content/journey';

export function StaticPortfolioMenu() {
  const menu = useRef<HTMLDetailsElement>(null);
  return (
    <details className="static-menu" ref={menu}>
      <summary>
        Explore <span aria-hidden="true">＋</span>
      </summary>
      <nav aria-label="Portfolio sections">
        {stations.map((section, i) => (
          <a
            key={section.id}
            href={'#' + section.id}
            onClick={() => {
              if (menu.current) menu.current.open = false;
            }}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            {section.name}
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </nav>
    </details>
  );
}
