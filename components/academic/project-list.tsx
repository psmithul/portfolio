import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/content/projects';
import { projectPath } from '@/lib/site-paths';

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="project-list">
      {projects.map(
        ({ slug, title, discipline, period, status, summary, image }) => {
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
                {landscape && (
                  <figure className="project-figure">
                    <Image
                      src={landscape.src}
                      alt={landscape.alt}
                      width={landscape.width}
                      height={landscape.height}
                      sizes="(max-width: 620px) calc(100vw - 32px), 330px"
                    />
                    {landscape.label && (
                      <figcaption>{landscape.label}</figcaption>
                    )}
                  </figure>
                )}
                <div className="project-copy">
                  <h2 id={heading}>
                    <span>{title}</span>{' '}
                    <span className="portfolio-link-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </h2>
                  <p className="project-summary">{summary}</p>
                  <p className="project-labels">
                    {[discipline, status, period].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </Link>
            </li>
          );
        },
      )}
    </ul>
  );
}
