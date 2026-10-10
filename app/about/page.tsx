import type { Metadata } from 'next';
import { MinecraftLink as Link } from '@/components/minecraft-link';
import {
  profile,
  portfolioExperience,
  portfolioRecognition,
} from '@/content/profile';
import { projects } from '@/content/projects';
import { currentProjectSlugs } from '@/content/journey';

export const metadata: Metadata = {
  title: 'About',
  alternates: { canonical: '/about' },
  description:
    'P S Mithul Sourav, Mechanical Engineering at NITK Surathkal. Research in experimental and field robotics, mechatronic systems, dynamics, vibration, and control.',
};
const current = currentProjectSlugs.map((slug) =>
  projects.find((project) => project.slug === slug)!,
);
const selectedWork = portfolioExperience.filter(
  (item) => !item.earlier && item.category !== 'Leadership',
);
const earlierWork = portfolioExperience.filter((item) => item.earlier);
const leadership = portfolioExperience.filter(
  (item) => item.category === 'Leadership',
);

export default function About() {
  return (
    <main id="main" className="about-page">
      <section className="about-hero shell">
        <p className="eyebrow">ABOUT</p>
        <h1>Hi, I’m Mithul.</h1>
        <div className="about-introduction">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">01 / EDUCATION</p>
          <span>Surathkal, India</span>
        </div>
        <div className="about-body">
          <h2>{profile.education.institution}</h2>
          <p className="education-degree">{profile.education.degree}</p>
          <div className="education-meta">
            <span>{profile.education.period}</span>
            <span>
              CGPA <strong>{profile.education.cgpa}</strong>
            </span>
          </div>
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">02 / SELECTED WORK EXPERIENCE</p>
        </div>
        <div className="about-body">
          {selectedWork.map((item) => (
            <article className="resume-experience" key={item.company}>
              <div className="experience-heading">
                <h2>{item.company}</h2>
                <span className="eyebrow">{item.period}</span>
              </div>
              <p className="education-degree">{item.role}</p>
              <p className="body-muted">{item.location}</p>
              <ul className="prose-list">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              {item.href && (
                <Link className="text-link" href={item.href}>
                  {item.link}
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">03 / RESEARCH PROJECTS</p>
        </div>
        <div className="about-body skill-list">
          {current.map((project) => (
            <div key={project.slug}>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <Link className="text-link" href={`/work/${project.slug}`}>
                Read the case study
              </Link>
            </div>
          ))}
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">04 / TECHNICAL SKILLS & INTERESTS</p>
        </div>
        <div className="about-body skill-list">
          {profile.skills.map((skill) => (
            <div key={skill.title}>
              <h3>{skill.title}</h3>
              <p>{skill.detail}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">05 / EARLIER EXPERIENCE</p>
        </div>
        <div className="about-body">
          {earlierWork.map((item) => (
            <div className="compact-experience" key={item.company}>
              <div>
                <h3>{item.company}</h3>
                <p>{item.role}</p>
              </div>
              <span>{item.period}</span>
              <p>{item.highlights.join(' ')}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">06 / LEADERSHIP & RECOGNITION</p>
        </div>
        <div className="about-body recognition-grid">
          {leadership.map((item) => (
            <div key={item.company}>
              <span className="big-figure">{item.metric}</span>
              <h3>
                {item.company} · {item.role}
              </h3>
              <p className="archive-card-period">{item.period}</p>
              <p>{item.highlights.join(' ')}</p>
            </div>
          ))}
          {portfolioRecognition.map((item) => (
            <div key={item.title}>
              <span className="big-figure">{item.result}</span>
              <h3>{item.title}</h3>
              <p className="archive-card-period">{item.period}</p>
              <p>{item.detail}</p>
              <Link className="text-link" href={item.href}>
                {item.link}
              </Link>
            </div>
          ))}
        </div>
      </section>
      <section className="lab-contact shell">
        <p className="eyebrow">GET IN TOUCH</p>
        <a href="mailto:psmithul@gmail.com">
          Let’s talk<span>.</span>
        </a>
        <p>psmithul@gmail.com</p>
        <div className="about-contact-links">
          <a
            href="/Mithul-Sourav-CV.pdf"
            target="_blank"
            rel="noreferrer"
            className="quiet-link"
          >
            Read my CV
          </a>
          <Link href="/#work" className="quiet-link">
            Explore the projects
          </Link>
        </div>
      </section>
    </main>
  );
}
