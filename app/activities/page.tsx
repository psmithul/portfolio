import type { Metadata } from 'next';
import Link from 'next/link';
import { portfolioExperience, portfolioRecognition } from '@/content/profile';
import { battleBots } from '@/content/projects';
import { SectionNav } from '@/components/academic/section-nav';
export const metadata: Metadata = {
  title: 'Activities',
  alternates: { canonical: '/activities' },
  description: 'Internships, student leadership, and team achievements.',
};
export default function Activities() {
  return (
    <main id="main" className="academic-content">
      <h1 className="page-title">Activities</h1>
      <p className="page-introduction">
        Internships, student leadership, and team competitions alongside my
        engineering studies.
      </p>
      <SectionNav
        links={[
          { id: 'experience', label: 'Work experience' },
          { id: 'leadership', label: 'Leadership' },
          { id: 'student-teams', label: 'Student teams' },
          { id: 'recognition', label: 'Awards & competitions' },
        ]}
      />
      <section className="academic-section" id="experience">
        <h2>Work experience</h2>
        {portfolioExperience
          .filter((item) => item.category !== 'Leadership')
          .map((item) => (
            <article className="academic-experience" key={item.company}>
              <header>
                <h3>{item.company}</h3>
                <span>{item.period}</span>
              </header>
              <p className="academic-role">
                {item.role}
                {item.location && ` · ${item.location}`}
              </p>
              <ul>
                {item.highlights.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
              {item.href && (
                <Link href={item.href}>
                  {item.link ?? 'Read the case study'} →
                </Link>
              )}
            </article>
          ))}
      </section>
      <section className="academic-section" id="leadership">
        <h2>Leadership</h2>
        {portfolioExperience
          .filter((item) => item.category === 'Leadership')
          .map((item) => (
            <article className="academic-experience" key={item.company}>
              <header>
                <h3>{item.company}</h3>
                <span>{item.period}</span>
              </header>
              <p className="academic-role">{item.role}</p>
              <ul>
                {item.highlights.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </article>
          ))}
      </section>
      <section className="academic-section" id="student-teams">
        <h2>Student teams</h2>
        <article className="academic-experience">
          <h3>
            <Link href={`/work/${battleBots.slug}`}>{battleBots.title}</Link>
          </h3>
          <p>{battleBots.summary}</p>
        </article>
      </section>
      <section className="academic-section" id="recognition">
        <h2>Awards &amp; competitions</h2>
        {portfolioRecognition.map((item) => (
          <div className="academic-recognition" key={item.title}>
            <span>{item.period}</span>
            <div>
              <h3>{item.title}</h3>
              <p>
                <strong>{item.result}</strong>. {item.detail}
              </p>
              <Link href={item.href}>{item.link} →</Link>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
