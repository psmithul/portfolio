import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ArchiveReveal } from '@/components/archive-reveal';

const experience = [
  {
    company: 'Vayu Aerospace',
    role: 'Product Intern',
    period: 'Jun — Jul 2026',
    category: 'Engineering',
    highlights: [
      'Compared three flight-controller mounts in ANSYS.',
      'Integrated the mounts, ran ground tests, and analysed IMU logs in MATLAB.',
    ],
    href: '/work/uav-vibration-integration',
    link: 'Internship case study',
  },
  {
    company: 'Thinkify Labs',
    role: 'Product & Strategy Intern',
    period: 'May — Aug 2025',
    category: 'Product',
    highlights: [
      'Built a lead-qualification and follow-up workflow.',
      'Contributed to a reported 25% gain in operational efficiency.',
    ],
  },
  {
    company: 'ILO Consulting',
    role: 'Investment Banking Intern',
    period: 'May — Jul 2024',
    category: 'Finance',
    highlights: [
      'Built DCF, LBO, and three-statement financial models.',
      'Supported M&A due diligence and an Ireland market-entry assessment.',
    ],
  },
  {
    company: 'ISTE NITK',
    role: 'Secretary',
    period: 'Sep 2024 — Present',
    category: 'Leadership',
    highlights: [
      'Organised a technical event for 500+ participants.',
      'Led sponsor outreach and logistics; secured three sponsors.',
    ],
  },
  {
    company: 'NH66 Fund · P&L Club',
    role: 'Fund Manager',
    period: 'Jan 2025 — Apr 2026',
    category: 'Leadership',
    highlights: [
      'Directed strategy for a ₹150K student-run fund.',
      'Mentored three analysts; organised recruitment and training.',
    ],
  },
];

export function ExperienceRail() {
  return (
    <ArchiveReveal
      id="experience"
      title="Experience"
      eyebrow="03 — Work & leadership"
      description="Internships and student leadership, from 2024 to the present."
      image="/images/archive/tool-case.svg"
      kind="toolbox"
    >
      {experience.map(
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
                '--fan-x': `${(index - 2) * 17}vw`,
                '--fan-y': `${Math.abs(index - 2) * 18}px`,
                '--fan-angle': `${(index - 2) * 1.2}deg`,
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
