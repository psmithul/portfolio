import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  Building2,
  Plane,
  Users,
  Landmark,
  Trophy,
} from 'lucide-react';
import { ScrollRail } from '@/components/scroll-rail';

const experience = [
  {
    company: 'Vayu Aerospace',
    role: 'Product Intern · UAV Vibration Analysis & Isolation',
    period: 'Jun — Jul 2026',
    category: 'Engineering internship',
    icon: Plane,
    detail:
      'Compared three flight-controller mounting architectures with ANSYS. Supported manufacturing, integration, and ground motor-run tests, then analysed IMU logs in MATLAB.',
    result:
      'Contributed to the selection of an elastomer-isolated modular tray.',
    href: '/work/uav-vibration-integration',
    link: 'Internship case study',
  },
  {
    company: 'Thinkify Labs',
    role: 'Product & Strategy Intern · Workflow Automation',
    period: 'May — Aug 2025',
    category: 'Product internship',
    icon: Building2,
    detail:
      'Built an AI-based lead-qualification workflow using profile and email data. Routed qualified prospects to sales representatives and organised follow-up.',
    result:
      'Contributed to a reported 25% improvement in operational efficiency.',
  },
  {
    company: 'ILO Consulting',
    role: 'Investment Banking Intern',
    period: 'May — Jul 2024',
    category: 'Finance internship',
    icon: Landmark,
    detail:
      'Built DCF, LBO, and three-statement financial models for M&A due diligence. Contributed to an Ireland market-entry assessment.',
    result: 'Financial modelling, transaction analysis, and market research.',
  },
  {
    company: 'ISTE NITK',
    role: 'Secretary',
    period: 'Sep 2024 — Present',
    category: 'Student leadership',
    icon: Users,
    detail:
      'Led sponsor outreach, budgeting, vendor coordination, and event logistics. Worked with the team to organise a technical event for 500+ participants.',
    result: 'Secured three sponsors for the event.',
  },
  {
    company: 'NH66 Fund · P&L Club',
    role: 'Fund Manager',
    period: 'Jan 2025 — Apr 2026',
    category: 'Student leadership',
    icon: Landmark,
    detail:
      'Directed strategy for a ₹150K student-run fund and mentored three junior analysts. Organised two recruitment drives and one training workshop.',
    result: 'Fund strategy, analyst onboarding, and mentoring.',
  },
  {
    company: 'Global Case Competition',
    role: 'Harvard · team of four',
    period: 'Feb — Mar 2026',
    category: 'Recognition',
    icon: Trophy,
    detail:
      'Analysed the European defence landscape and developed recommendations with a four-member team for the 2026 competition.',
    result: 'Top 50 globally.',
  },
];

export function ExperienceRail() {
  return (
    <ScrollRail
      id="experience"
      className="flow-experience-rail"
      title="Experience"
      eyebrow="03 — Work & leadership"
      description="Engineering, product, and finance internships, alongside student leadership at NITK."
      itemLabel="experience"
      count={experience.length}
      aside={
        <Image
          className="experience-toolbox"
          src="/images/experience-toolbox.webp"
          alt=""
          width={800}
          height={800}
          unoptimized
        />
      }
    >
      {experience.map(
        (
          {
            company,
            role,
            period,
            category,
            icon: Icon,
            detail,
            result,
            href,
            link,
          },
          index,
        ) => (
          <article
            key={company}
            className="quest-card experience-card"
            data-rail-card
          >
            <div className="experience-card-top">
              <span className="eyebrow">{category}</span>
              <Icon size={32} strokeWidth={1.4} aria-hidden="true" />
            </div>
            <div className="experience-card-body">
              <div>
                <span className="experience-period">{period}</span>
                <h3>{company}</h3>
                <p className="experience-role">{role}</p>
              </div>
              <div>
                <p className="experience-description">{detail}</p>
                <p className="experience-result">{result}</p>
              </div>
            </div>
            <div className="experience-card-bottom">
              <span aria-hidden="true">0{index + 1}</span>
              <Link href={href ?? '/about'}>
                {link ?? 'Full background'}
                <ArrowUpRight className="link-arrow" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ),
      )}
    </ScrollRail>
  );
}
