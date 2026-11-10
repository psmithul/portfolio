import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  profile,
  portfolioExperience,
  portfolioRecognition,
} from '@/content/profile';
import { SocialLinks } from '@/components/academic/social-links';
import { SectionNav } from '@/components/academic/section-nav';
export const metadata: Metadata = {
  title: 'About',
  description: profile.heroIntro,
  alternates: { canonical: '/about' },
};
export default function About() {
  return (
    <main id="main" className="academic-content">
      <header>
        <h1>About me</h1>
        <div className="academic-intro academic-about-intro">
          <Image
            className="academic-about-portrait"
            src="/images/mithul-profile-illustration-cutout.webp"
            width={1254}
            height={1254}
            alt="Illustrated portrait of Mithul Sourav"
            loading="eager"
          />
          <div>
            {profile.about.slice(0, 2).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </header>
      <p>{profile.about[2]}</p>
      <SectionNav
        links={[
          { id: 'education', label: 'Education' },
          { id: 'experience', label: 'Experience' },
          { id: 'skills', label: 'Skills & interests' },
          { id: 'recognition', label: 'Recognition' },
        ]}
      />
      <section className="academic-section" id="education">
        <h2>Education</h2>
        <h3>{profile.education.institution}</h3>
        <p>
          {profile.education.degree}
          <br />
          {profile.education.period}
          <br />
          CGPA: {profile.education.cgpa}
        </p>
      </section>
      <section className="academic-section" id="experience">
        <h2>Experience</h2>
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
      <section className="academic-section" id="skills">
        <h2>Skills &amp; interests</h2>
        <dl className="academic-skill-list">
          {profile.skills.map((skill) => (
            <div className="academic-skill" key={skill.title}>
              <dt>{skill.title}</dt>
              <dd>{skill.detail}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="academic-section" id="recognition">
        <h2>Recognition</h2>
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
