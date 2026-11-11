import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { projects } from '@/content/projects';
import { projectStudies } from '@/content/project-studies';
import { ArticleBody } from '@/components/article-body';
import { firstReadingImage } from '@/lib/reading';
import '../../project-page.css';
import { HomeSectionLink } from '@/components/academic/home-section-link';
import projectAssets from '@/docs/current-project-assets.json';

const projectFigures = Object.fromEntries(
  projectAssets.assets.map(({ path, width, height }) => [
    path.replace(/^public/, ''),
    { width, height },
  ]),
);

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
  const cover =
    slug === 'nitk-battle-bots'
      ? {
          src: '/images/projects/gn4rly-lab-assembly.jpg',
          alt: 'NITK Battle Bots members assembling a robot at the Robocon Lab workbench.',
        }
      : (project.image ?? firstReadingImage(body));
  const coverSize = cover && projectFigures[cover.src];
  const coverCaption =
    slug === 'nitk-battle-bots'
      ? 'Assembly at the Robocon Lab. Photo from the NITK Battle-Bots club proposal.'
      : project.image?.caption;
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
                className={
                  slug === 'nitk-battle-bots'
                    ? 'project-cover-photo'
                    : undefined
                }
                unoptimized
                preload
              />
              {coverCaption && <figcaption>{coverCaption}</figcaption>}
            </figure>
          )}
        </div>
      </header>
      <ArticleBody body={body} projectFigures={projectFigures} />
      {project.tools.length > 0 && (
        <p className="project-tools">
          Tools &amp; methods · {project.tools.join(' · ')}
        </p>
      )}
      <nav className="project-next" aria-label="Project navigation">
        <HomeSectionLink section="research">
          ← Selected projects
        </HomeSectionLink>
        <Link href={`/work/${next.slug}`}>{next.title} →</Link>
      </nav>
    </main>
  );
}
