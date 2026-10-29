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
        ← All research &amp; projects
      </Link>
      <header>
        <p className="academic-kicker">
          {project.discipline} · {project.status}
        </p>
        <h1>{project.title}</h1>
        <p className="academic-deck">{project.summary}</p>
        <dl className="academic-meta">
          <div>
            <dt>Timeline</dt>
            <dd>{project.period}</dd>
          </div>
          <div>
            <dt>Context</dt>
            <dd>{project.context}</dd>
          </div>
          <div>
            <dt>Tools &amp; methods</dt>
            <dd>{project.tools.join(' · ')}</dd>
          </div>
        </dl>
      </header>
      {project.image && (
        <figure className="academic-cover">
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
      <ReadingContents body={body} />
      <ArticleBody body={body} />
      <aside className="academic-status">
        <h2>Project stage</h2>
        <p>{project.scope}</p>
      </aside>
      <nav className="academic-next" aria-label="Next project">
        <p>Next project</p>
        <Link href={`/work/${next.slug}`}>{next.title} →</Link>
      </nav>
    </main>
  );
}
