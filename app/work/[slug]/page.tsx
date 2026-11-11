import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, projects } from '@/content/projects';
import { projectFigureDimensions } from '@/content/project-images';
import { projectStudies } from '@/content/project-studies';
import { ArticleBody } from '@/components/article-body';
import { firstReadingImage } from '@/lib/reading';
import { projectPath, sitePages } from '@/lib/site-paths';
import '../../project-page.css';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project
    ? {
        title: project.title,
        description: project.summary,
        alternates: { canonical: projectPath(project.slug) },
        openGraph: {
          title: project.title,
          description: project.summary,
          url: projectPath(project.slug),
        },
      }
    : { title: 'Project not found' };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const body = projectStudies[slug];
  if (!body) throw new Error(`The project write-up is missing for ${slug}.`);
  const cover = project.image ?? firstReadingImage(body);
  const coverSize = cover && projectFigureDimensions[cover.src];
  const context = [project.context, project.period].filter(Boolean).join(' · ');

  return (
    <main id="main" className="project-page">
      <header className="project-intro">
        <h1>{project.title}</h1>
        <div className="project-intro-grid">
          <div className="project-intro-copy">
            <p>{context}</p>
            <p>{project.summary}</p>
            <p>{project.scope}</p>
          </div>
          {cover && coverSize && (
            <figure className="project-cover">
              <Image
                src={cover.src}
                alt={cover.alt}
                width={coverSize.width}
                height={coverSize.height}
                data-framing={project.image?.framing}
                preload
              />
              {project.image && (
                <figcaption>{project.image.caption}</figcaption>
              )}
            </figure>
          )}
        </div>
      </header>
      <ArticleBody body={body} projectFigures={projectFigureDimensions} />
      {project.tools.length > 0 && (
        <p className="project-tools">
          Tools &amp; methods · {project.tools.join(' · ')}
        </p>
      )}
      <nav className="project-next" aria-label="Project navigation">
        <Link href={sitePages.projects}>← All projects</Link>
        <Link href={projectPath(next.slug)}>{next.title} →</Link>
      </nav>
    </main>
  );
}
