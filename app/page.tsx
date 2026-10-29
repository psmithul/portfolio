import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { projects } from '@/content/projects';
import { news, selectedResearchSlugs } from '@/content/academic';
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
          I’m a final-year Mechanical Engineering student at{' '}
          <a href="https://www.nitk.ac.in/">NITK Surathkal</a>, graduating in
          June 2027.
        </p>
        <p>
          My interests lie in experimental and field robotics: how mechanical
          design, sensing, vibration, and control shape the way robots move and
          interact with the real world. I enjoy connecting modeling and
          mechanism design with physical hardware. My tools include MATLAB,
          SolidWorks, and ANSYS.
        </p>
        <p>
          Right now, I’m designing a variable-stiffness rough-terrain rover, a
          terrain-adaptive leaf-collection robot, and a tensegrity knee joint
          for an exoskeleton. I’ve also worked on{' '}
          <Link href="/work/reaction-wheel-microvibrations">
            spacecraft microvibration
          </Link>{' '}
          and{' '}
          <Link href="/work/uav-vibration-integration">
            UAV vibration isolation
          </Link>
          .
        </p>
        <p>
          For research, collaborations, or a conversation about robots, feel
          free to reach out on <a href="mailto:psmithul@gmail.com">email</a>!
        </p>
      </div>
      <section
        className="academic-section academic-news"
        aria-labelledby="news-heading"
      >
        <h2 id="news-heading">news</h2>
        <div className="news-list">
          {news.map((item) => (
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
        <h2 id="research-heading">selected research &amp; projects</h2>
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
        <p>Notes on things I’m reading, building, and still figuring out.</p>
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
