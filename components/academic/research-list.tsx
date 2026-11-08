import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/content/projects';

export function ResearchList({ projects }: { projects: Project[] }) {
  return (
    <ul className="research-list">
      {projects.map((project) => (
        <li
          className={`research-row${project.image ? '' : ' research-row-text'}`}
          key={project.slug}
        >
          {project.image && (
            <div>
              <Link
                className="research-image"
                href={`/work/${project.slug}`}
                tabIndex={-1}
                aria-hidden="true"
              >
                {project.image && (
                  <Image
                    src={project.image.src}
                    alt=""
                    width={220}
                    height={122}
                    unoptimized
                    style={{ objectFit: project.image.fit ?? 'contain' }}
                  />
                )}
              </Link>
              {project.image && (
                <p
                  className="research-image-note"
                  title={project.image.caption}
                >
                  {project.image.label}
                  {project.image.referenceUrl && (
                    <>
                      {' '}
                      ·{' '}
                      <a
                        href={project.image.referenceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Source &amp; credit
                      </a>
                    </>
                  )}
                </p>
              )}
            </div>
          )}
          <div className="research-text">
            <h3>
              <Link href={`/work/${project.slug}`}>{project.title}</Link>
            </h3>
            <p className="research-context">{project.discipline}</p>
            <p className="research-period">
              <em>{project.period}</em> ·{' '}
              <span
                className={
                  project.status === 'Ongoing' ? 'research-ongoing' : undefined
                }
              >
                {project.status}
              </span>
            </p>
            <p className="research-description">{project.summary}</p>
            <div className="research-actions">
              <Link href={`/work/${project.slug}`}>[Read more]</Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
