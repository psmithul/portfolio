import type { Metadata } from 'next';
import { MinecraftLink as Link } from '@/components/minecraft-link';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { ArticleBody } from '@/components/article-body';
import { ReadingContents } from '@/components/reading-contents';
import { projects } from '@/content/projects';
import { projectStudies } from '@/content/project-studies';
import { ProjectLaboratory } from '@/components/project-laboratory';

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
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const body = projectStudies[slug];
  if (!body) throw new Error(`The project write-up is missing for ${slug}.`);
  return (
    <main id="main" className="case-page shell">
      <Link href="/#work" className="back-link">
        <ArrowLeft className="link-arrow" aria-hidden="true" /> All projects
      </Link>
      <header className="case-header">
        <div className="case-kicker">
          <p className="eyebrow">{project.discipline}</p>
          <span className={`status-badge ${project.status.toLowerCase()}`}>
            {project.status}
          </span>
        </div>
        <h1>{project.title}</h1>
        <p className="case-description">{project.summary}</p>
        <dl className="case-meta">
          <div>
            <dt>Timeline</dt>
            <dd>{project.period}</dd>
          </div>
          <div>
            <dt>Context</dt>
            <dd>{project.context}</dd>
          </div>
          <div>
            <dt>Tools & methods</dt>
            <dd>{project.tools.join(' · ')}</dd>
          </div>
        </dl>
      </header>
      <ProjectLaboratory model={project.model} />
      <div id="project-notes" className="reading-layout case-layout">
        <ReadingContents body={body} />
        <div className="case-reader">
          {project.image && (
            <figure className="case-cover" data-image-kind={project.image.kind}>
              <Image
                src={project.image.src}
                alt={project.image.alt}
                width={project.image.width}
                height={project.image.height}
                unoptimized
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
          <ArticleBody body={body} />
          <aside className="case-status">
            <p className="eyebrow">Project stage</p>
            <p>{project.scope}</p>
          </aside>
        </div>
      </div>
      <div className="case-next">
        <p className="eyebrow">Next project</p>
        <Link href={`/work/${next.slug}`}>
          <span>{next.title}</span>
          <ArrowUpRight className="link-arrow" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
