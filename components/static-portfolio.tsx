import Image from 'next/image';
import { MinecraftLink as Link } from '@/components/minecraft-link';
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Mail,
  Monitor,
  TrainFront,
} from 'lucide-react';
import {
  currentProjectSlugs,
  journeyExperience,
  shortProjectNames,
} from '@/content/journey';
import type { Project } from '@/content/projects';
import type { JournalSummary } from '@/lib/journal-editorial';
import { RailwayArt } from '@/components/railway-art';
import { StaticPortfolioMenu } from '@/components/static-portfolio-menu';

export function StaticPortfolio({
  projects,
  posts,
}: {
  projects: Project[];
  posts: JournalSummary[];
}) {
  const current = currentProjectSlugs.flatMap((slug) =>
    projects.filter((project) => project.slug === slug),
  );
  const archive = projects.filter((project) => project.status === 'Completed');
  return (
    <main id="main" className="static-portfolio">
      <header className="static-header">
        <a className="static-brand" href="#home">
          <TrainFront size={20} aria-hidden="true" />
          <span>Mithul Sourav</span>
        </a>
        <StaticPortfolioMenu />
      </header>

      <section id="home" className="static-hero">
        <div className="static-hero-copy">
          <p className="static-eyebrow">
            MECHANICAL ENGINEERING · NITK SURATHKAL
          </p>
          <h1>Hi, I’m Mithul.</h1>
          <p className="static-statement">
            Building and learning along the way, driven by an endless curiosity.
          </p>
          <figure className="static-world">
            <RailwayArt />
          </figure>
          <p>
            I’m a final-year mechanical engineering student at NITK Surathkal. I
            like learning new technologies and using them to build things. I’m
            especially interested in robotics, control systems, and space.
          </p>
          <a className="static-button" href="#work">
            Explore my work <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>
        <aside className="static-desktop-tip">
          <Monitor size={22} aria-hidden="true" />
          <p>
            Same work. A different view.
            <span>
              Open psmithul.com on a computer for the full 3D train journey.
            </span>
          </p>
        </aside>
      </section>

      <section
        id="about"
        className="static-section static-about"
        aria-labelledby="static-about-title"
      >
        <p className="static-eyebrow">02 / ABOUT ME</p>
        <h2 id="static-about-title">A little about me.</h2>
        <figure className="static-portrait">
          <div>
            <Image
              src="/images/mithul-cutout.webp"
              alt="Mithul wearing glasses and a black shirt"
              width={1024}
              height={1536}
              unoptimized
            />
          </div>
          <blockquote>
            “Satisfaction of one’s curiosity is one of the greatest sources of
            happiness in life.”
          </blockquote>
        </figure>
        <div className="static-about-copy">
          <p>
            I’m a final-year mechanical engineering student at NITK Surathkal. I
            like learning new things and using what I learn to build something.
            When an idea interests me, I want to understand how it works and how
            people came up with it.
          </p>
          <p>
            Right now, I’m working on a rover and a robot for collecting leaves,
            both meant to move over rough ground. I’m also exploring ways to
            make a mechanical joint more or less flexible.
          </p>
          <p>
            I like working on hard problems, even when I don’t know where to
            start. Building things helps me see what I’ve understood and what I
            still need to learn. I also love space and spend a lot of time
            reading about how we explore it.
          </p>
          <div className="static-inventory" aria-label="Tools">
            {['SolidWorks', 'ANSYS', 'MATLAB', 'Python', 'C / C++'].map(
              (tool) => (
                <span key={tool}>{tool}</span>
              ),
            )}
          </div>
          <Link className="static-text-link" href="/about">
            Background & experience{' '}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section
        id="work"
        className="static-section static-work"
        aria-labelledby="static-work-title"
      >
        <p className="static-eyebrow">03 / THE WORKSHOP</p>
        <h2 id="static-work-title">Ongoing projects</h2>
        <p className="static-section-intro">The projects I’m working on now.</p>
        <div className="static-projects">
          {current.map((project, index) => (
            <article className="static-project" key={project.slug}>
              {project.image && (
                <figure className="static-project-figure">
                  <div className="static-project-image">
                    <Image
                      src={project.image.src}
                      alt={project.image.alt}
                      width={project.image.width}
                      height={project.image.height}
                      unoptimized
                    />
                    <span>PROJECT 0{index + 1}</span>
                  </div>
                  <figcaption>
                    {project.image.caption}
                    {project.image.referenceUrl && (
                      <>
                        {' '}
                        <a
                          href={project.image.referenceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {project.image.referenceLabel ?? 'Source'} ↗
                        </a>
                      </>
                    )}
                  </figcaption>
                </figure>
              )}
              <div className="static-project-copy">
                <p className="static-meta">
                  {project.discipline} · {project.period}
                </p>
                <h3>{shortProjectNames[project.slug]}</h3>
                <p>{project.summary}</p>
                <Link
                  className="static-text-link"
                  href={'/work/' + project.slug}
                >
                  Read the case study{' '}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="archive"
        className="static-section static-archive"
        aria-labelledby="static-archive-title"
      >
        <p className="static-eyebrow">04 / THE TOOLBOX</p>
        <h2 id="static-archive-title">Past projects</h2>
        <p className="static-section-intro">
          Some things I’ve built and explored.
        </p>
        <div className="static-archive-list">
          {archive.map((project, index) => (
            <Link href={'/work/' + project.slug} key={project.slug}>
              <span className="static-item-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3>{project.title}</h3>
                <p className="static-meta">
                  {project.discipline} · {project.period}
                </p>
              </div>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section
        id="experience"
        className="static-section static-experience"
        aria-labelledby="static-experience-title"
      >
        <p className="static-eyebrow">05 / EXPERIENCE</p>
        <h2 id="static-experience-title">Learning by doing.</h2>
        <p className="static-section-intro">
          Engineering, product, finance, and the people I’ve worked with.
        </p>
        <div className="static-experience-list">
          {journeyExperience.map((item, i) => (
            <article key={item.company}>
              <span className="static-mission-number">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="static-meta">
                  {item.category} · {item.period}
                </p>
                <h3>{item.company}</h3>
                <p className="static-role">{item.role}</p>
                <p>{item.description}</p>
                {'href' in item && (
                  <Link className="static-text-link" href={item.href}>
                    Internship case study{' '}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
        <Link className="static-text-link" href="/about">
          Full background & leadership{' '}
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </section>

      <section
        id="journal"
        className="static-section static-journal"
        aria-labelledby="static-journal-title"
      >
        <p className="static-eyebrow">06 / THE NOTEBOOK</p>
        <h2 id="static-journal-title">Mika’s Life.</h2>
        <p className="static-section-intro">
          Things I’ve been reading about, trying out, and still figuring out.
        </p>
        <div className="static-notes">
          {posts.slice(0, 4).map((post) => (
            <Link href={'/blog/' + post.slug} key={post.slug}>
              <BookOpen size={22} aria-hidden="true" />
              <div>
                <p className="static-meta">
                  {post.category} · {post.readingMinutes} min read
                </p>
                <h3>{post.title}</h3>
              </div>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </div>
        <Link className="static-text-link" href="/blog">
          All my notes <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </section>

      <section
        id="contact"
        className="static-section static-contact"
        aria-labelledby="static-contact-title"
      >
        <p className="static-eyebrow">07 / SAY HELLO</p>
        <h2 id="static-contact-title">Get in touch.</h2>
        <p>
          Have a project in mind or a question about the work? I’d like to hear
          from you.
        </p>
        <a className="static-button" href="mailto:psmithul@gmail.com">
          Email me <Mail size={17} aria-hidden="true" />
        </a>
        <a className="static-email" href="mailto:psmithul@gmail.com">
          psmithul@gmail.com
        </a>
        <nav className="static-socials" aria-label="Contact links">
          <a
            href="https://github.com/psmithul"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
          <a
            href="https://www.linkedin.com/in/psmithulsourav"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn ↗
          </a>
          <a href="/Mithul-Sourav-CV.pdf" target="_blank" rel="noreferrer">
            Résumé ↗
          </a>
        </nav>
        <footer>
          <span>Keep building. Keep learning.</span>
          <a href="#home">Back to top ↑</a>
        </footer>
      </section>
    </main>
  );
}
