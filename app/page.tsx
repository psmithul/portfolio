import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';
import { selectedProjectSlugs } from '@/content/academic';
import { ProjectList } from '@/components/academic/project-list';
import { SocialLinks } from '@/components/academic/social-links';
import { getPublicPosts } from '@/lib/journal-store';
import { dateLabel } from '@/lib/journal-model';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { alternates: { canonical: '/' } };

export default async function Home() {
  const posts = (await getPublicPosts()).slice(0, 3);
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
            <Link href="#research">Selected projects ↓</Link>
            <a href="mailto:psmithul@gmail.com">Get in touch</a>
          </div>
        </div>
        <Image
          className="academic-home-photo"
          src="/images/mithul-profile-photo.webp"
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
        <p>
          I enjoy writing the algorithms behind these systems and building the
          hardware that brings them to life. My current work includes a{' '}
          <Link href="/work/adaptive-suspension-rover">
            rough-terrain rover
          </Link>
          , a{' '}
          <Link href="/work/off-road-leaf-robot">leaf-collection robot</Link>,
          and a <Link href="/work/tensegrity-joint">tensegrity knee joint</Link>
          .
        </p>
        <p>
          <Link href="/about">More about my background and experience →</Link>
        </p>
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
        <p className="section-more">
          <Link href="/work">All projects →</Link>
        </p>
      </section>
      <section
        className="academic-section academic-journal-preview"
        id="journal"
        aria-labelledby="journal-heading"
      >
        <h2 id="journal-heading">Journal</h2>
        <p>Notes on robots, AI, and the ideas I’m trying to understand.</p>
        <ul className="academic-note-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <time dateTime={post.date}>{dateLabel(post.date)}</time>
              <div>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                <p>{post.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="section-more">
          <Link href="/blog">Read Mika’s Life →</Link>
        </p>
      </section>
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
