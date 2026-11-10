import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/content/projects';

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="project-list">
      {projects.map(
        (
          {
            slug,
            title,
            shortTitle,
            discipline,
            period,
            status,
            summary,
            image,
          },
          index,
        ) => {
          const preview = image?.thumbnail ?? image;
          const landscape =
            preview && preview.width > preview.height ? preview : undefined;
          const heading = `project-${slug}`;
          return (
            <li
              className="project-row"
              key={slug}
              data-featured={index === 0 && landscape ? 'true' : undefined}
            >
              <Link
                className="portfolio-project-link"
                href={`/work/${slug}`}
                aria-labelledby={heading}
              >
                {landscape && (
                  <figure className="project-figure">
                    <Image
                      src={landscape.src}
                      alt={landscape.alt}
                      width={landscape.width}
                      height={landscape.height}
                    />
                    {landscape.label && (
                      <figcaption className="portfolio-label">
                        {landscape.label}
                      </figcaption>
                    )}
                  </figure>
                )}
                <div className="project-copy">
                  <div className="portfolio-project-meta">
                    <span className="portfolio-label">{discipline}</span>
                    <span
                      className="portfolio-project-status"
                      data-status={status}
                    >
                      {status}
                    </span>
                  </div>
                  <h3 id={heading}>{shortTitle ?? title}</h3>
                  <p className="project-summary">{summary}</p>
                  <div className="portfolio-project-bottom">
                    <span>{period}</span>
                    <span className="portfolio-link-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        },
      )}
    </ul>
  );
}
