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
        }) => (
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
            {image && (
              <figure className="project-figure">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  style={{ objectFit: image.fit ?? 'contain' }}
                />
                {image.label && <figcaption>{image.label}</figcaption>}
              </figure>
            )}
          </li>
        ),
      )}
    </ul>
  );
}
