import type { Metadata } from 'next';
import Link from 'next/link';
import { portfolioExperience, portfolioRecognition } from '@/content/profile';
export const metadata: Metadata = {
  title: 'Activities',
  alternates: { canonical: '/activities' },
  description: 'Internships, student leadership, and team achievements.',
};
export default function Activities() {
  return (
    <main id="main" className="academic-content">
      <h1 className="page-title">activities</h1>
      <p className="page-introduction">
        Work, student leadership, and a few things I’ve learned with other
        people.
      </p>
      <section className="academic-section" id="experience">
        <h2>work experience</h2>
        {portfolioExperience
          .filter((item) => item.category !== 'Leadership')
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
              {item.href && <Link href={item.href}>Case study →</Link>}
            </article>
          ))}
      </section>
      <section className="academic-section">
        <h2>leadership</h2>
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
      <section className="academic-section">
        <h2>awards &amp; competitions</h2>
        {portfolioRecognition.map((item) => (
          <div className="academic-recognition" key={item.title}>
            <span>{item.period}</span>
            <div>
              <h3>{item.title}</h3>
              <p>
                <strong>{item.result}</strong>. {item.detail}
              </p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
