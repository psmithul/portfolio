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
      <header className="portfolio-hero" id="about">
        <h1 className="sr-only">About me</h1>
        <figure className="portfolio-portrait">
          <Image
            className="academic-home-photo"
            src="/images/mithul-profile-photo-cutout.webp"
            fill
            sizes="(max-width: 462px) calc(100vw - 32px), (max-width: 820px) 430px, 330px"
            alt="Portrait of Mithul Sourav"
            preload
          />
        </figure>
        <div className="portfolio-intro-copy">
          <p className="academic-lead">{profile.bio}</p>
          <p className="academic-lead">{profile.interests}</p>
        </div>
        <div className="portfolio-actions">
          <a href="#research">
            Selected projects <span aria-hidden="true">↓</span>
          </a>
          <a href="#contact">Get in touch</a>
        </div>
      </header>
      <section
        className="portfolio-section portfolio-projects"
        id="research"
        aria-labelledby="research-heading"
      >
        <span id="work" className="section-anchor" />
        <span id="publications" className="section-anchor" />
        <header className="portfolio-section-heading">
          <h2 id="research-heading">Selected projects</h2>
        </header>
        <ProjectList projects={selected} />
      </section>
      <section
        className="portfolio-section portfolio-journal"
        id="journal"
        aria-labelledby="journal-heading"
      >
        <header className="portfolio-section-heading">
          <h2 id="journal-heading">Journal</h2>
          <p className="portfolio-affiliation academic-handwritten">
            Mika’s Life
          </p>
        </header>
        <div className="portfolio-journal-content">
          <p>
            I use this space to write about whatever bullshit I’m curious about.
            Right now that’s mostly robots, AI, and control.
          </p>
          <ul className="academic-note-list">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  aria-labelledby={`note-${post.slug}`}
                >
                  <div>
                    <p className="academic-note-meta">
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
        </div>
      </section>
      <ActivitiesExperience />
      <section
        className="portfolio-section academic-contact"
        id="contact"
        aria-label="Get in touch"
      >
        <header className="portfolio-section-heading">
          <h2>Get in touch</h2>
        </header>
        <div className="portfolio-contact-links">
          <a href="mailto:psmithul@gmail.com">psmithul@gmail.com</a>
          <SocialLinks />
        </div>
      </section>
    </main>
  );
}
