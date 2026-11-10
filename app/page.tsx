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
      <header className="academic-intro academic-home-intro">
        <div>
          <p className="academic-kicker">
            Mechanical Engineering · NITK Surathkal
          </p>
          <h1>{profile.fullName}</h1>
          <p className="academic-lead">
            I’m a fourth-year undergraduate interested in how control, dynamics,
            and mechanics come together in robots that can move and adapt to the
            world around them.
          </p>
          <div className="academic-inline-links">
            <a href="#research">Selected projects ↓</a>
            <a href="mailto:psmithul@gmail.com">Get in touch</a>
          </div>
        </div>
        <Image
          className="academic-home-photo"
          src="/images/mithul-profile-photo-cutout.webp"
          width={1672}
          height={941}
          alt="Portrait of Mithul Sourav"
          preload
        />
      </header>
      <section
        className="academic-section"
        id="about"
        aria-labelledby="about-heading"
      >
        <h2 id="about-heading">About me</h2>
        <div className="academic-intro academic-about-intro">
          <Image
            className="academic-about-portrait"
            src="/images/mithul-profile-illustration-cutout.webp"
            width={1254}
            height={1254}
            alt="Illustrated portrait of Mithul Sourav"
          />
          <div>
            <p>{profile.about[1]}</p>
          </div>
        </div>
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
      </section>
      <section
        className="academic-section"
        id="research"
        aria-labelledby="research-heading"
      >
        <span id="work" className="section-anchor" />
        <span id="publications" className="section-anchor" />
        <h2 id="research-heading">Selected projects</h2>
        <ProjectList projects={selected} />
      </section>
      <section
        className="academic-section academic-journal-preview"
        id="journal"
        aria-labelledby="journal-heading"
      >
        <h2 id="journal-heading">Journal</h2>
        <p className="academic-kicker">Mika’s Life</p>
        <p>
          I use this space to write about whatever bullshit I’m curious about.
          Right now that’s mostly robots, AI, and control.
        </p>
        <ul className="academic-note-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <time dateTime={post.date}>{dateLabel(post.date)}</time>
              <div>
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.description}</p>
                <p className="academic-note-meta">
                  {post.readingMinutes} min read
                </p>
              </div>
            </li>
          ))}
        </ul>
        {posts.length === 0 && <p>New notes are on the way.</p>}
      </section>
      <ActivitiesExperience />
      <section
        className="academic-contact"
        id="contact"
        aria-label="Get in touch"
      >
        <SocialLinks />
        <p>
          <a href="mailto:psmithul@gmail.com">psmithul@gmail.com</a>
        </p>
      </section>
    </main>
  );
}
