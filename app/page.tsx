import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';
import { selectedProjectSlugs } from '@/content/academic';
import { ProjectList } from '@/components/academic/project-list';
import { ActivitiesExperience } from '@/components/academic/activities-experience';
import { SocialLinks } from '@/components/academic/social-links';
import { getPublicPosts } from '@/lib/journal-store';
import { dateLabel } from '@/lib/journal-model';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { alternates: { canonical: '/' } };

export default async function Home() {
  const posts = await getPublicPosts();
  const selected = selectedProjectSlugs.flatMap((slug) =>
    projects.filter((project) => project.slug === slug),
  );
  return (
    <main id="main" className="academic-content academic-home">
      <header className="portfolio-hero">
        <div className="portfolio-hero-copy">
          <p className="portfolio-label">
            Mechanical engineering / NITK Surathkal
          </p>
          <h1>{profile.fullName}</h1>
          <p className="academic-lead">
            I’m a fourth-year undergraduate interested in how control, dynamics,
            and mechanics come together in robots that can move and adapt to the
            world around them.
          </p>
          <div className="portfolio-actions">
            <a className="portfolio-primary-action" href="#research">
              Explore projects <span aria-hidden="true">↓</span>
            </a>
            <a className="portfolio-secondary-action" href="#contact">
              Get in touch
            </a>
          </div>
        </div>
        <figure className="portfolio-portrait">
          <span className="portfolio-portrait-grid" aria-hidden="true" />
          <span
            className="portfolio-label portfolio-portrait-tag"
            aria-hidden="true"
          >
            Profile / 01
          </span>
          <Image
            className="academic-home-photo"
            src="/images/mithul-profile-photo-cutout.webp"
            width={1672}
            height={941}
            alt="Portrait of Mithul Sourav"
            preload
          />
        </figure>
      </header>
      <section
        className="portfolio-section portfolio-about"
        id="about"
        aria-labelledby="about-heading"
      >
        <header className="portfolio-section-heading">
          <p className="portfolio-label">01 / Background</p>
          <h2 id="about-heading">About me</h2>
        </header>
        <div className="portfolio-about-copy">
          <p>{profile.about[1]}</p>
          <details className="academic-about-details">
            <summary>Education and skills</summary>
            <dl className="academic-skill-list">
              <div className="academic-skill">
                <dt>Education</dt>
                <dd>
                  {profile.education.degree}, NITK Surathkal
                  <br />
                  {profile.education.period} · CGPA {profile.education.cgpa}
                </dd>
              </div>
              {profile.skills.map(({ title, detail }) => (
                <div className="academic-skill" key={title}>
                  <dt>{title}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
          </details>
        </div>
      </section>
      <section
        className="portfolio-section portfolio-projects"
        id="research"
        aria-labelledby="research-heading"
      >
        <span id="work" className="section-anchor" />
        <span id="publications" className="section-anchor" />
        <header className="portfolio-section-heading">
          <p className="portfolio-label">02 / Engineering</p>
          <h2 id="research-heading">Selected projects</h2>
        </header>
        <ProjectList projects={selected} />
      </section>
      <section
        className="portfolio-section portfolio-journal"
        id="journal"
        aria-labelledby="journal-heading"
      >
        <header className="portfolio-section-heading portfolio-journal-intro">
          <p className="portfolio-label">03 / Mika’s Life</p>
          <h2 id="journal-heading">Journal</h2>
          <p>
            I use this space to write about whatever bullshit I’m curious about.
            Right now that’s mostly robots, AI, and control.
          </p>
        </header>
        <ul className="academic-note-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                aria-labelledby={`note-${post.slug}`}
              >
                <div>
                  <p className="academic-note-meta portfolio-label">
                    <time dateTime={post.date}>{dateLabel(post.date)}</time>
                    <span> · {post.readingMinutes} min read</span>
                  </p>
                  <h3 id={`note-${post.slug}`}>{post.title}</h3>
                  <p>{post.description}</p>
                </div>
                <span className="portfolio-link-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </li>
          ))}
          {posts.length === 0 && <li>New notes are on the way.</li>}
        </ul>
      </section>
      <ActivitiesExperience />
      <section
        className="portfolio-section academic-contact"
        id="contact"
        aria-label="Get in touch"
      >
        <div>
          <p className="portfolio-label">05 / Contact</p>
          <h2>Get in touch</h2>
          <a href="mailto:psmithul@gmail.com">psmithul@gmail.com</a>
        </div>
        <SocialLinks />
      </section>
    </main>
  );
}
