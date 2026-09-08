import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { TensegrityDiagram } from '@/components/engineering-diagrams';
import { MethodDiagram } from '@/components/method-diagram';
import { projects } from '@/content/projects';
import { getPublicPosts } from '@/lib/journal-store';

export const dynamic = 'force-dynamic';
export default async function Home() {
  const posts = await getPublicPosts();
  const latestPost = posts[0];
  return (
    <main id="main">
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> Mechanical engineering · NITK
            Surathkal
          </p>
          <h1>
            Mithul
            <br />
            <em>Sourav.</em>
          </h1>
          <p className="hero-intro">
            I study mechanical engineering at NITK Surathkal. My work is in
            robotics: how a mechanism moves, what its sensors can tell us, and
            how to control it.
          </p>
          <a className="button primary" href="#work">
            Selected projects <ArrowDown size={17} />
          </a>
          <div className="hero-footnote">
            <span>Mechanisms & mechatronics</span>
            <span>Robotics & autonomy</span>
          </div>
        </div>
        <figure className="hero-figure">
          <div className="figure-heading">
            <span>MECHANISM STUDY / 01</span>
            <span>TENSEGRITY</span>
          </div>
          <TensegrityDiagram />
          <figcaption>
            <span>
              Cables in tension. Struts in compression.
              <br />
              <strong>The starting point for my joint research.</strong>
            </span>
            <span className="diagram-note">
              Tensegrity principle
              <br />
              Conceptual schematic
            </span>
          </figcaption>
        </figure>
      </section>
      <section id="work" className="work-section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / SELECTED WORK</p>
            <h2>
              Problems I’m
              <br />
              <em>working on.</em>
            </h2>
          </div>
          <p>
            Mechanisms, simulation, and robot navigation.
            <br />
            Five projects, with their methods and current status.
          </p>
        </div>
        <div className="featured-projects">
          {projects.slice(0, 2).map((project, i) => (
            <Link
              className="project-card"
              href={`/work/${project.slug}`}
              key={project.slug}
            >
              <MethodDiagram kind={i === 0 ? 'structure' : 'navigation'} />
              <div className="project-card-meta">
                <span className="eyebrow">
                  {project.number} / {project.discipline}
                </span>
                <span
                  className={`status-badge ${project.status.toLowerCase()}`}
                >
                  {project.status}
                </span>
              </div>
              <h3>
                {project.title}
                <ArrowUpRight size={25} aria-hidden="true" />
              </h3>
              <p>{project.summary}</p>
              <div className="project-card-tools">
                {project.tools.slice(0, 3).map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
        <div className="project-list">
          {projects.slice(2).map((project) => (
            <Link
              className="project-row"
              key={project.slug}
              href={`/work/${project.slug}`}
            >
              <span className="project-number">{project.number}</span>
              <div>
                <p className="eyebrow">{project.discipline}</p>
                <h3>{project.title}</h3>
                <p className="project-row-summary">{project.summary}</p>
              </div>
              <div className="project-row-end">
                <span
                  className={`status-badge ${project.status.toLowerCase()}`}
                >
                  {project.status}
                </span>
                <ArrowUpRight size={23} aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="about-teaser shell">
        <div>
          <p className="eyebrow">02 / ABOUT ME</p>
          <h2>
            Mechanical by
            <br />
            <em>training.</em>
          </h2>
        </div>
        <div>
          <p>
            I’m a final-year Mechanical Engineering student at NITK Surathkal.
            I’m interested in compliant mechanisms, vibration, and the decisions
            a robot makes when its measurements are imperfect.
          </p>
          <p>
            At Vayu Aerospace, I worked on UAV avionics integration: modeling
            measured hardware, checking fit and cable routing, and helping bring
            the electronics up.
          </p>
          <Link href="/about" className="text-link">
            A little more about me <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="journal-teaser shell">
        <div>
          <p className="eyebrow">03 / A PERSONAL JOURNAL</p>
          <h2>
            Mika’s <em>Life.</em>
          </h2>
          <Link href="/blog" className="text-link">
            Read the journal <ArrowUpRight size={19} />
          </Link>
        </div>
        <div className="journal-teaser-aside">
          <span className="journal-teaser-letter" aria-hidden="true">
            m.
          </span>
          {latestPost ? (
            <>
              <span className="eyebrow">LATEST ENTRY</span>
              <Link
                href={`/blog/${latestPost.slug}`}
                className="latest-post-link"
              >
                {latestPost.title} <ArrowUpRight size={17} />
              </Link>
            </>
          ) : (
            <>
              <p>Science, books, and the things I keep thinking about.</p>
              <span className="eyebrow">MORE WRITING SOON.</span>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
