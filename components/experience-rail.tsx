import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ArchiveReveal } from '@/components/archive-reveal';
import { portfolioExperience } from '@/content/profile';

export function ExperienceRail({
  staticLayout = false,
}: {
  staticLayout?: boolean;
}) {
  return (
    <ArchiveReveal
      id="experience"
      title="Experience"
      eyebrow="03 — Work & leadership"
      description="Internships and student leadership, from 2024 to the present."
      image="/images/archive/tool-case.svg"
      kind="toolbox"
      staticLayout={staticLayout}
    >
      {portfolioExperience.map(
        (
          { company, role, period, category, highlights, href, link },
          index,
        ) => (
          <article
            key={company}
            className="archive-card archive-experience-card"
            data-archive-card
            style={
              {
                '--fan-x': `${(index - 2) * 17.8}vw`,
                '--fan-y': `${(0.65 - Math.sqrt(0.65 ** 2 - ((index - 2) * 0.178) ** 2)) * 100}vw`,
                '--fan-angle': `${(index - 2) * 1}deg`,
                '--card-order': 5 - Math.abs(index - 2),
                '--burst-delay': `${Math.abs(index - 2) * 65}ms`,
              } as CSSProperties
            }
          >
            <p className="eyebrow">{category}</p>
            <h3>{company}</h3>
            <p className="archive-role">{role}</p>
            <p className="archive-card-period">{period}</p>
            <ul className="archive-highlights">
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <Link href={href ?? '/about'}>
              {link ?? 'Full background'}
              <ArrowUpRight className="link-arrow" aria-hidden="true" />
            </Link>
          </article>
        ),
      )}
    </ArchiveReveal>
  );
}
