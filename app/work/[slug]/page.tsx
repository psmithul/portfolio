import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { projects } from '@/content/projects';
import { projectStudies } from '@/content/project-studies';
import { ArticleBody } from '@/components/article-body';
import { ReadingContents } from '@/components/reading-contents';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(
    (item) =>
      item.slug === (slug === 'neoleg-knee-mechanism' ? 'kneeassist' : slug),
  );
  return project
    ? {
        title: project.title,
        description: project.summary,
        alternates: { canonical: `/work/${project.slug}` },
        openGraph: {
          title: project.title,
          description: project.summary,
          url: `/work/${project.slug}`,
        },
      }
    : { title: 'Project not found' };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  if (slug === 'neoleg-knee-mechanism') permanentRedirect('/work/kneeassist');
  const index = projects.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const body = projectStudies[slug];
  if (!body) throw new Error(`The project write-up is missing for ${slug}.`);
  return (
    <main id="main" className="academic-content academic-case">
      <Link href="/work" className="academic-back">
        ← All projects
      </Link>
      <header>
        <p className="academic-kicker">
          {project.discipline} · {project.status}
        </p>
        <h1>{project.title}</h1>
        <p className="academic-deck">{project.summary}</p>
        <dl className="academic-meta">
          {project.period && (
            <div>
              <dt>When</dt>
              <dd>{project.period}</dd>
            </div>
          )}
          <div>
            <dt>Type of work</dt>
            <dd>{project.context}</dd>
          </div>
          {project.tools.length > 0 && (
            <div>
              <dt>Tools &amp; methods</dt>
              <dd>{project.tools.join(' · ')}</dd>
            </div>
          )}
        </dl>
      </header>
      <ReadingContents body={body} />
      {project.image && (
        <figure
          className={
            project.image.height > project.image.width
              ? 'academic-cover academic-cover-portrait'
              : 'academic-cover'
          }
        >
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            unoptimized
            priority
          />
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
                  {project.image.referenceLabel ?? 'Image source'}
                </a>
              </>
            )}
            {project.image.licenseUrl && (
              <>
                {' '}
                ·{' '}
                <a
                  href={project.image.licenseUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  License
                </a>
              </>
            )}
          </figcaption>
        </figure>
      )}
      {project.role && (
        <section
          className="academic-status"
          aria-labelledby="contribution-heading"
        >
          <h2 id="contribution-heading">My contribution</h2>
          <p>{project.role}</p>
        </section>
      )}
      <ArticleBody body={body} />
      <aside className="academic-status">
        <h2>Where the project stands</h2>
        <p>{project.scope}</p>
      </aside>
      <nav className="academic-next" aria-label="Next project">
        <p>Next project</p>
        <Link href={`/work/${next.slug}`}>{next.title} →</Link>
        <div className="academic-inline-links">
          <Link href="/work">All projects</Link>
        </div>
      </nav>
    </main>
  );
}
