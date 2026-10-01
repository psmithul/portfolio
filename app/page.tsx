import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PortraitStory } from '@/components/portrait-story';
import { MotionDirector } from '@/components/motion-director';
import { PortfolioCursor } from '@/components/portfolio-cursor';
import { ExperienceRail } from '@/components/experience-rail';
import { Accolades } from '@/components/accolades';
import { SideQuests } from '@/components/side-quests';
import { ToolsCarousel } from '@/components/tools-carousel';
import { JournalPreview } from '@/components/journal-preview';
import { projects } from '@/content/projects';
import { portfolioTools } from '@/content/tools';
import { getPublicPosts } from '@/lib/journal-store';

export const dynamic = 'force-dynamic';
const featuredOrder = [
  'tensegrity-joint',
  'adaptive-suspension-rover',
  'off-road-leaf-robot',
];
const featured = featuredOrder.map((slug) =>
  projects.find((project) => project.slug === slug)!,
);
const completedProjects = projects.filter(
  (project) =>
    project.status === 'Completed' &&
    project.slug !== 'uav-vibration-integration',
);
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

export default async function Home() {
  const posts = await getPublicPosts();
  return (
    <main id="main" className="flow-home">
      <MotionDirector />
      <PortfolioCursor />
      <PortraitStory />
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
                    <span className="flow-project-date">{project.period}</span>
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
      <SideQuests projects={completedProjects} />
      <ExperienceRail />
      <Accolades />
      <ToolsCarousel tools={portfolioTools} />
      <JournalPreview posts={posts} />
      <section className="flow-contact shell">
        <p className="eyebrow">Contact</p>
        <h2>Get in touch.</h2>
        <p className="flow-contact-note">
          Have a project in mind or a question about the work? I’d like to hear
          from you.
        </p>
        <div>
          <a
            href="https://www.linkedin.com/in/psmithulsourav"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <ArrowUpRight className="link-arrow" aria-hidden="true" />
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
  );
}
