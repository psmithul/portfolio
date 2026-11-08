import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { projects } from '@/content/projects';
import { recentUpdates, selectedResearchSlugs } from '@/content/academic';
import { ResearchList } from '@/components/academic/research-list';
import { SocialLinks } from '@/components/academic/social-links';
import { getPublicPosts } from '@/lib/journal-store';
import { dateLabel } from '@/lib/journal-model';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { alternates: { canonical: '/' } };

export default async function Home() {
  const posts = (await getPublicPosts()).slice(0, 3);
  const selected = selectedResearchSlugs.flatMap((slug) =>
    projects.filter((project) => project.slug === slug),
  );
  return (
    <main id="main" className="academic-content academic-home">
      <header className="academic-post-header" id="about">
        <h1>
          <strong>P S Mithul</strong> Sourav
        </h1>
        <p className="academic-subtitle">
          Mechanical Engineering | NITK Surathkal
        </p>
      </header>
      <div className="academic-biography">
        <figure className="academic-portrait">
          <div className="academic-portrait-frame">
            <Image
              src="/images/mithul-courtyard.webp"
              width={200}
              height={238}
              alt="Mithul Sourav, wearing glasses and a black shirt, outdoors"
              priority
            />
          </div>
        </figure>
        <p>
          Hey, I’m Mithul. I’m a fourth-year Mechanical Engineering
          undergraduate at <a href="https://www.nitk.ac.in/">NITK Surathkal</a>,
          graduating in June 2027.
        </p>
        <p>
          I’m interested in building intelligent physical systems that can move,
          adapt, and interact with the world in new ways. What excites me is
          exploring how control, dynamics, mechanics, and computation can come
          together to make things possible.
        </p>
        <p>
          I enjoy developing the algorithms behind these systems as much as
          designing and building their hardware, especially when a problem takes
          me into unfamiliar territory. My current work includes a{' '}
          <Link href="/work/adaptive-suspension-rover">
            rough-terrain rover
          </Link>
          , a{' '}
          <Link href="/work/off-road-leaf-robot">leaf-collection robot</Link>,
          and a <Link href="/work/tensegrity-joint">tensegrity knee joint</Link>
          .
        </p>
        <p>
          You can read about my projects below, find my{' '}
          <Link href="/about">background and experience</Link>, or{' '}
          <a href="mailto:psmithul@gmail.com">get in touch</a>.
        </p>
      </div>
      <section
        className="academic-section academic-news"
        aria-labelledby="updates-heading"
      >
        <h2 id="updates-heading">recent updates</h2>
        <div className="news-list">
          {recentUpdates.map((item) => (
            <div className="news-row" key={item.href}>
              <span>{item.date}</span>
              <p>
                <Link href={item.href}>{item.text}</Link>
              </p>
            </div>
          ))}
        </div>
      </section>
      <section
        className="academic-section"
        id="research"
        aria-labelledby="research-heading"
      >
        <span id="work" className="section-anchor" />
        <span id="publications" className="section-anchor" />
        <h2 id="research-heading">selected projects</h2>
        <ResearchList projects={selected} />
        <p className="section-more">
          <Link href="/work">All projects →</Link>
        </p>
      </section>
      <section
        className="academic-section academic-journal-preview"
        id="journal"
        aria-labelledby="journal-heading"
      >
        <h2 id="journal-heading">journal</h2>
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
