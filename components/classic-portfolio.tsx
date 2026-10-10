import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUp, ArrowUpRight, Monitor } from 'lucide-react';
import { PortraitStory } from '@/components/portrait-story';
import { SectionLink } from '@/components/section-link';
import { ExperienceRail } from '@/components/experience-rail';
import { Accolades } from '@/components/accolades';
import { SideQuests } from '@/components/side-quests';
import { ToolsCarousel } from '@/components/tools-carousel';
import { JournalPreview } from '@/components/journal-preview';
import type { Project } from '@/content/projects';
import { portfolioTools } from '@/content/tools';
import type { Post } from '@/lib/post-types';
import { profile } from '@/content/profile';

const featuredOrder = [
  'tensegrity-joint',
  'adaptive-suspension-rover',
  'off-road-leaf-robot',
];
const covers: Record<string, { tags: string[] }> = {
  'adaptive-suspension-rover': {
    tags: ['Field robotics', 'Suspension', 'Vibrations'],
  },
  'off-road-leaf-robot': {
    tags: ['Field robotics', 'Mechanism design', 'Test planning'],
  },
  'tensegrity-joint': {
    tags: ['Robotics', 'Mechanisms', 'Tensegrity'],
  },
};

// Restored from the last portrait-led homepage before the Minecraft redesign.
export function ClassicPortfolio({
  projects,
  posts,
}: {
  projects: Project[];
  posts: Post[];
}) {
  const featured = featuredOrder.map((slug) =>
    projects.find((project) => project.slug === slug)!,
  );
  const completedProjects = projects.filter(
    (project) =>
      project.status === 'Completed' &&
      project.slug !== 'uav-vibration-integration',
  );

  return (
    <div className="classic-portfolio">
      <header className="site-header shell">
        <nav aria-label="Main navigation">
          <SectionLink href="/#top">Home</SectionLink>
          <SectionLink href="/#work">Projects</SectionLink>
          <Link href="/about">About</Link>
          <Link href="/blog">Journal</Link>
          <a href="/Mithul-Sourav-CV.pdf" target="_blank" rel="noreferrer">
            Résumé <ArrowUpRight className="link-arrow" aria-hidden="true" />
          </a>
        </nav>
      </header>
      <aside
        className="classic-desktop-note shell"
        aria-label="Desktop experience"
      >
        <Monitor size={18} aria-hidden="true" />
        <p>
          Open on a desktop or iPad to explore the full{' '}
          <strong>3D train journey.</strong>
        </p>
      </aside>
      <main id="main" className="flow-home">
        <PortraitStory staticLayout introId="about" />
        <section id="work" className="flow-work flow-section shell">
          <div className="flow-section-heading">
            <div>
              <p className="eyebrow">01 — Projects</p>
              <h2>Ongoing projects</h2>
            </div>
            <p>The projects I’m working on now.</p>
          </div>
          <div className="flow-project-list">
            {featured.map((project) => {
              const cover = covers[project.slug];
              return (
                <Link
                  href={`/work/${project.slug}`}
                  className={`flow-project-card flow-cover-${project.slug}`}
                  key={project.slug}
                  data-cursor="project"
                >
                  <div className="flow-project-details">
                    <div className="flow-project-timeline">
                      <span className="flow-project-year">
                        {project.period.match(/\d{4}/)?.[0]}
                      </span>
                      <span
                        className={`status-badge ${project.status.toLowerCase()}`}
                      >
                        {project.status}
                      </span>
                      <span className="flow-project-date">
                        {project.period}
                      </span>
                    </div>
                    <div className="flow-project-description">
                      <h3>{project.title}</h3>
                      <div className="flow-tags">
                        {cover.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <p>{project.summary}</p>
                    </div>
                    <ArrowRight
                      className="flow-project-arrow"
                      aria-hidden="true"
                    />
                  </div>
                  <figure
                    className="flow-project-image"
                    data-image-kind={project.image?.kind}
                    data-image-fit={project.image?.fit}
                  >
                    <div className="flow-cover-body">
                      {project.image && (
                        <Image
                          src={project.image.src}
                          alt={project.image.alt}
                          width={project.image.width}
                          height={project.image.height}
                          className="flow-cover-main"
                          unoptimized
                        />
                      )}
                    </div>
                  </figure>
                </Link>
              );
            })}
          </div>
        </section>
        <SideQuests projects={completedProjects} vertical />
        <ExperienceRail staticLayout />
        <Accolades staticLayout />
        <ToolsCarousel tools={portfolioTools} staticLayout />
        <JournalPreview posts={posts} />
        <section id="contact" className="flow-contact shell">
          <p className="eyebrow">Contact</p>
          <h2>Get in touch.</h2>
          <p className="flow-contact-note">
            Have a project in mind or a question about the work? I’d like to
            hear from you.
          </p>
          <div>
            <a
              href="https://www.linkedin.com/in/psmithulsourav"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn{' '}
              <ArrowUpRight className="link-arrow" aria-hidden="true" />
            </a>
            <a
              href="https://github.com/psmithul"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight className="link-arrow" aria-hidden="true" />
            </a>
            <a href="mailto:psmithul@gmail.com">
              Email <ArrowUpRight className="link-arrow" aria-hidden="true" />
            </a>
            <a href="/Mithul-Sourav-CV.pdf" target="_blank" rel="noreferrer">
              Résumé <ArrowUpRight className="link-arrow" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
      <footer className="site-footer shell">
        <div>
          <Link href="/" className="footer-name">
            {profile.fullName}
          </Link>
          <p>NITK Surathkal · Projects, experiments & notes</p>
        </div>
        <div className="footer-links">
          <a
            href="https://github.com/psmithul"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a href="mailto:psmithul@gmail.com">Email</a>
          <a
            href="https://www.linkedin.com/in/psmithulsourav"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a href="/Mithul-Sourav-CV.pdf" target="_blank" rel="noreferrer">
            CV
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getUTCFullYear()} P S Mithul Sourav</span>
          <Link href="/write">Writing desk</Link>
          <a href="#top">
            Back to top <ArrowUp className="link-arrow" aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
  );
}
