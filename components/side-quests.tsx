import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/content/projects';
import { ScrollRail } from '@/components/scroll-rail';
export function SideQuests({ projects }: { projects: Project[] }) {
  return (
    <ScrollRail
      id="completed-work"
      title="Completed projects"
      eyebrow="02 — Previous work"
      description="Earlier builds and studies, with the work and results from each."
      itemLabel="completed project"
      count={projects.length}
    >
      {projects.map((project, index) => (
        <Link
          href={`/work/${project.slug}`}
          className={`quest-card quest-card-${index % 3}`}
          data-rail-card
          data-cursor="project"
          key={project.slug}
        >
          <div className="quest-copy">
            <div>
              <div className="quest-meta">
                <span
                  className={`status-badge ${project.status.toLowerCase()}`}
                >
                  {project.status}
                </span>
                <span className="flow-project-date">{project.period}</span>
              </div>
              <h3>{project.title}</h3>
              <div className="flow-tags">
                <span>{project.discipline}</span>
                <span>{project.tools[0]}</span>
              </div>
              <p>{project.summary}</p>
            </div>
            <ArrowRight className="quest-arrow link-arrow" aria-hidden="true" />
          </div>
          <figure
            className="quest-image"
            data-image-kind={project.image?.kind}
            data-image-fit={project.image?.fit}
          >
            {project.image && (
              <Image
                src={project.image.src}
                alt={project.image.alt}
                width={project.image.width}
                height={project.image.height}
                unoptimized
              />
            )}
          </figure>
          <span className="quest-image-caption">{project.image?.caption}</span>
        </Link>
      ))}
    </ScrollRail>
  );
}
