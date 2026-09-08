import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { TensegrityDiagram } from '@/components/engineering-diagrams';
import { MethodDiagram } from '@/components/method-diagram';
import { projects } from '@/content/projects';
import { posts } from '@/lib/posts.generated';

export default function Home() {
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
            Making sense
            <br />
            of <em>motion.</em>
          </h1>
          <p className="hero-intro">
            I’m Mithul. I explore how mechanisms, sensing, and control come
            together to make physical systems move intelligently.
          </p>
          <a className="button primary" href="#work">
            Explore my work <ArrowDown size={17} />
          </a>
          <div className="hero-footnote">
            <span>Mechanisms & mechatronics</span>
            <span>Robotics & autonomy</span>
          </div>
        </div>
        <figure className="hero-figure">
          <div className="figure-heading">
            <span>FIELD STUDY / 001</span>
            <span>FORM + FORCE</span>
          </div>
          <TensegrityDiagram />
          <figcaption>
            <span>
              Tension, compression.
              <br />
              <strong>A different kind of balance.</strong>
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
              From first principles
              <br />
              to <em>physical systems.</em>
            </h2>
          </div>
          <p>
            Research, simulations, and mechanisms.
            <br />
            An evolving body of engineering work.
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
          <p className="eyebrow">02 / THE ENGINEER BEHIND THE WORK</p>
          <h2>
            Curiosity, with
            <br />
            <em>a method.</em>
          </h2>
        </div>
        <div>
          <p>
            I’m a final-year Mechanical Engineering student at NITK Surathkal.
            My interests sit between compliant mechanisms, system dynamics, and
            autonomous robotics.
          </p>
          <p>
            Alongside research and design projects, I’ve worked on UAV avionics
            integration and hardware bring-up at Vayu Aerospace.
          </p>
          <Link href="/about" className="text-link">
            A little more about me <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="journal-teaser shell">
        <div>
          <p className="eyebrow">03 / THE OTHER SIDE OF THE NOTEBOOK</p>
          <h2>
            Some things need
            <br />
            <em>more than a diagram.</em>
          </h2>
          <Link href="/blog" className="text-link">
            Step into The Margins <ArrowUpRight size={19} />
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
              <p>
                A personal journal on engineering,
                <br />
                curiosity, and everything in between.
              </p>
              <span className="eyebrow">THE FIRST ENTRY IS STILL TO COME.</span>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
