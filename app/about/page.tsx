import type { Metadata } from 'next';
import Link from 'next/link';
import {
  profile,
  portfolioExperience,
  portfolioRecognition,
} from '@/content/profile';
import { SocialLinks } from '@/components/academic/social-links';
export const metadata: Metadata = {
  title: 'About',
  description: profile.heroIntro,
  alternates: { canonical: '/about' },
};
export default function About() {
  return (
    <main id="main" className="academic-content">
      <h1 className="page-title">about</h1>
      <p className="page-introduction">
        P S Mithul Sourav · Mechanical Engineering · NITK Surathkal
      </p>
      {profile.about.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <section className="academic-section">
        <h2>education</h2>
        <h3>{profile.education.institution}</h3>
        <p>
          {profile.education.degree}
          <br />
          {profile.education.period}
          <br />
          CGPA: {profile.education.cgpa}
        </p>
      </section>
      <section className="academic-section">
        <h2>experience</h2>
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
                <Link href={item.href}>Internship case study →</Link>
              )}
            </article>
          ))}
      </section>
      <section className="academic-section">
        <h2>skills &amp; interests</h2>
        <dl className="academic-skill-list">
          {profile.skills.map((skill) => (
            <div className="academic-skill" key={skill.title}>
              <dt>{skill.title}</dt>
              <dd>{skill.detail}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="academic-section">
        <h2>recognition</h2>
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
        <p>
          <Link href="/activities">Student leadership &amp; activities →</Link>
        </p>
      </section>
      <section className="academic-contact">
        <SocialLinks />
        <p>
          <a href="/Mithul-Sourav-CV.pdf" target="_blank" rel="noreferrer">
            Download my résumé
          </a>
        </p>
      </section>
    </main>
  );
}
