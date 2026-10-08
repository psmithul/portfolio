import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Award } from 'lucide-react';
import { ArchiveReveal } from '@/components/archive-reveal';

const accolades = [
  {
    title: 'Incubate X Prosthetic Challenge',
    result: 'Top 5 of 70',
    period: 'September 2026',
    scope: 'National selection',
    detail:
      'Our KneeAssist team was selected among the top five teams nationwide.',
    href: '/work/kneeassist',
    link: 'Knee assistance project',
  },
  {
    title: 'Global Case Competition at Harvard',
    result: 'Top 50 globally',
    period: 'February — March 2026',
    scope: 'Team competition',
    detail: 'A four-member team analysing the European defence landscape.',
    href: '/Mithul-Sourav-CV.pdf',
    link: 'Read the résumé',
  },
];

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
      {accolades.map(
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
