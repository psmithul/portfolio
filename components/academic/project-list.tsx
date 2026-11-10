import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/content/projects';

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="project-list">
      {projects.map(
        ({
          slug,
          title,
          shortTitle,
          discipline,
          period,
          status,
          summary,
          image,
        }) => {
          const preview = image?.thumbnail ?? image;
          return (
            <li className="project-row" key={slug}>
              <div className="project-copy">
                <h3>
                  <Link href={`/work/${slug}`}>
                    {shortTitle ?? title} <span aria-hidden="true">→</span>
                  </Link>
                </h3>
                <p className="project-summary">{summary}</p>
                <p className="project-labels">
                  {discipline} · {status}
                  {period && ` · ${period}`}
                </p>
              </div>
              {preview && preview.width > preview.height && (
                <figure className="project-figure">
                  <Image
                    src={preview.src}
                    alt={preview.alt}
                    width={preview.width}
                    height={preview.height}
                  />
                  {preview.label && <figcaption>{preview.label}</figcaption>}
                </figure>
              )}
            </li>
          );
        },
      )}
    </ul>
  );
}
