import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Award } from 'lucide-react';
import { ArchiveReveal } from '@/components/archive-reveal';
import { portfolioRecognition } from '@/content/profile';

export function Accolades({
  staticLayout = false,
}: {
  staticLayout?: boolean;
}) {
  return (
    <ArchiveReveal
      id="accolades"
      title="Accolades"
      eyebrow="04 — Recognition"
      description="Two team achievements from my résumé."
      image="/images/archive/folder-open.svg"
      kind="folder"
      staticLayout={staticLayout}
    >
      {portfolioRecognition.map(
        ({ title, result, period, scope, detail, href, link }, index) => (
          <article
            key={title}
            className="archive-card archive-certificate"
            data-archive-card
            style={
              {
                '--fan-x': `${(index - 0.5) * 44}vw`,
                '--fan-y': '16px',
                '--fan-angle': `${(index - 0.5) * 5}deg`,
                '--card-order': index + 2,
                '--burst-delay': `${index * 65}ms`,
              } as CSSProperties
            }
          >
            <div className="certificate-header">
              <p className="eyebrow">{scope}</p>
              <Award aria-hidden="true" />
            </div>
            <p className="certificate-result">{result}</p>
            <h3>{title}</h3>
            <p className="archive-card-period">{period}</p>
            <p className="certificate-detail">{detail}</p>
            <Link href={href}>
              {link}
              <ArrowUpRight className="link-arrow" aria-hidden="true" />
            </Link>
          </article>
        ),
      )}
    </ArchiveReveal>
  );
}
