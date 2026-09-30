import Link from 'next/link';
import Image from 'next/image';
import { PortraitStory } from '@/components/portrait-story';
import { MotionDirector } from '@/components/motion-director';
import { projects } from '@/content/projects';
import { getPublicPosts } from '@/lib/journal-store';

export const dynamic = 'force-dynamic';

const visualStudies = [
  {
    src: '/images/projects/tensegrity-joint-cad.webp',
    title: 'Joint geometry',
    caption: 'CAD reconstruction based on Mortensen et al. (2025).',
    slug: 'tensegrity-joint',
  },
  {
    src: '/images/projects/reaction-wheel-cutaway.webp',
    title: 'Inside the reaction wheel',
    caption: 'Section view of the project reference assembly.',
    slug: 'reaction-wheel-microvibrations',
  },
  {
    src: '/images/projects/tensegrity-leg-cad.webp',
    title: 'The complete mechanism',
    caption: 'Paper-based CAD reconstruction, not tested hardware.',
    slug: 'tensegrity-joint',
  },
  {
    src: '/images/projects/reaction-wheel-reference-cad.webp',
    title: 'Wheel, structure, camera',
    caption: 'Reference CAD used in the reaction-wheel study.',
    slug: 'reaction-wheel-microvibrations',
  },
];

export default async function Home() {
  const posts = await getPublicPosts();
  return (
    <main id="main" className="flow-home">
      <MotionDirector />
      <PortraitStory />
      <section id="work" className="flow-work flow-section shell">
        <div className="flow-section-heading">
          <h2>Selected projects</h2>
          <p>Robotics, mechanisms, and the questions behind them.</p>
        </div>
        <div className="flow-project-list">
          {projects.slice(0, 4).map((project) => (
            <Link
              href={`/work/${project.slug}`}
              className={`flow-project-card${project.image ? ' has-project-image' : ''}`}
              key={project.slug}
            >
              {project.image && (
                <figure className="flow-project-image">
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    width={project.image.width}
                    height={project.image.height}
                    unoptimized
                  />
                  <figcaption>{project.image.caption}</figcaption>
                </figure>
              )}
              <div className="flow-project-details">
                <span className="flow-project-date">{project.period}</span>
                <div className="flow-project-description">
                  <div className="flow-project-title">
                    <h3>{project.title}</h3>
                    <span className="flow-status">{project.status}</span>
                  </div>
                  <div className="flow-tags">
                    <span>{project.discipline}</span>
                    {project.tools.slice(0, 2).map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>
                  <p>{project.summary}</p>
                  <ul className="flow-project-facts">
                    {project.evidence.slice(0, 2).map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                  <span className="flow-read-project">Read project</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="flow-other flow-section shell">
        <div className="flow-section-heading">
          <h2>Other builds</h2>
          <p>
            Smaller mechanisms, navigation studies, and earlier experiments.
          </p>
        </div>
        <div className="flow-other-grid">
          {projects.slice(4).map((project) => (
            <Link href={`/work/${project.slug}`} key={project.slug}>
              <span className="flow-project-date">{project.period}</span>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <span className="flow-other-discipline">
                {project.discipline}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="flow-visuals flow-section shell">
        <div className="flow-section-heading">
          <h2>A closer look</h2>
          <p>Geometry and assemblies from my CAD studies.</p>
        </div>
        <div className="flow-visual-grid">
          {visualStudies.map((study) => (
            <Link href={`/work/${study.slug}`} key={study.src}>
              <figure>
                <Image
                  src={study.src}
                  alt={study.title}
                  width={1200}
                  height={1200}
                  unoptimized
                />
                <figcaption>
                  <strong>{study.title}</strong>
                  <span>{study.caption}</span>
                </figcaption>
              </figure>
            </Link>
          ))}
        </div>
      </section>
      <section className="flow-experience flow-section shell">
        <div className="flow-section-heading">
          <h2>Experience</h2>
        </div>
        <div className="flow-experience-list">
          <div>
            <span className="flow-project-date">Jun — Jul 2026</span>
            <div>
              <h3>Vayu Aerospace</h3>
              <p className="flow-role">
                Product Intern · UAV Vibration Analysis & Isolation
              </p>
              <p>
                Compared flight-controller mounting concepts, supported ground
                motor-run testing, and analyzed IMU logs to help choose an
                isolation direction.
              </p>
            </div>
          </div>
          <div>
            <span className="flow-project-date">May — Aug 2025</span>
            <div>
              <h3>Thinkify Labs</h3>
              <p className="flow-role">
                Product and Strategy Intern · Workflow Automation
              </p>
              <p>
                Built a lead-qualification workflow and helped improve how
                qualified prospects reached sales representatives.
              </p>
            </div>
          </div>
          <div>
            <span className="flow-project-date">May — Jul 2024</span>
            <div>
              <h3>ILO Consulting</h3>
              <p className="flow-role">Investment Banking Intern</p>
              <p>
                Built financial models for due diligence and contributed to a
                market-entry assessment.
              </p>
            </div>
          </div>
        </div>
        <Link href="/about" className="flow-text-link">
          More about my background
        </Link>
      </section>
      <section className="flow-tools flow-section shell">
        <div className="flow-section-heading">
          <h2>Tools I work with</h2>
        </div>
        <ul>
          {[
            'SolidWorks',
            'ANSYS Mechanical',
            'MATLAB',
            'Python',
            'C',
            'C++',
          ].map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </section>
      <section className="flow-journal flow-section shell">
        <div className="flow-section-heading">
          <h2>Mika’s Life</h2>
          <p>Notes on science, books, and the things I keep thinking about.</p>
        </div>
        <div className="flow-journal-entries">
          {posts.slice(0, 3).map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <span className="eyebrow">
                {post.tags.slice(0, 2).join(' / ')}
              </span>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </Link>
          ))}
        </div>
        <Link href="/blog" className="flow-text-link">
          Visit the journal
        </Link>
      </section>
      <section className="flow-contact flow-section shell">
        <h2>
          Let’s build
          <br />
          <span> something.</span>
        </h2>
        <div>
          <a href="mailto:psmithul@gmail.com">psmithul@gmail.com</a>
          <a
            href="https://www.linkedin.com/in/psmithulsourav"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </main>
  );
}
