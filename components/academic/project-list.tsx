import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/content/projects';
import { projectPath } from '@/lib/site-paths';

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="project-list">
      {projects.map(({ slug, title, discipline, period, summary, image }) => {
        const preview = image?.thumbnail ?? image;
        const landscape =
          preview && preview.width > preview.height ? preview : undefined;
        const heading = `project-${slug}`;
        return (
          <li className="project-row" key={slug}>
            <Link
              className="portfolio-project-link"
              href={projectPath(slug)}
              aria-labelledby={heading}
            >
              <div className="project-copy">
                <h3 id={heading}>
                  <span>{title}</span>{' '}
                  <span className="portfolio-link-arrow" aria-hidden="true">
                    ↗
                  </span>
                </h3>
                <p className="project-labels">
                  {[discipline, period].filter(Boolean).join(' · ')}
                </p>
                <p className="project-summary">{summary}</p>
              </div>
              {landscape && (
                <figure className="project-figure">
                  <Image
                    src={landscape.src}
                    alt={landscape.alt}
                    width={landscape.width}
                    height={landscape.height}
                    sizes="(max-width: 620px) min(calc(100vw - 32px), 355px), 215px"
                  />
                  {landscape.label && (
                    <figcaption>{landscape.label}</figcaption>
                  )}
                </figure>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
