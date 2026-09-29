import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { projects } from '@/content/projects';
import { EngineeringPlayground } from '@/components/engineering-playground';
import { ProjectVisual } from '@/components/project-visual';
import type { ModelKind } from '@/lib/engineering-scene';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return p
    ? { title: p.shortTitle, description: p.summary }
    : { title: 'Project not found' };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const hasModel = ['rover', 'tensegrity', 'knee', 'satellite'].includes(
    project.model,
  );
  return (
    <main id="main">
      <section className="project-hero shell">
        <Link href="/#work" className="back-link">
          All projects
        </Link>
        <div className="project-kicker">
          <p className="eyebrow">
            PROJECT {project.number} / {project.discipline}
          </p>
          <span className={`status-badge ${project.status.toLowerCase()}`}>
            {project.status}
          </span>
        </div>
        <h1>{project.shortTitle}</h1>
        <p className="project-deck">{project.summary}</p>
        <div className="project-meta">
          <div>
            <span className="eyebrow">TIMELINE</span>
            <p>{project.period}</p>
          </div>
          <div>
            <span className="eyebrow">CONTEXT</span>
            <p>{project.context}</p>
          </div>
          <div>
            <span className="eyebrow">TOOLS & METHODS</span>
            <p>{project.tools.join(' · ')}</p>
          </div>
        </div>
      </section>
      <section className="project-question shell">
        <div>
          <p className="eyebrow">THE ENGINEERING QUESTION</p>
          <h2>{project.question}</h2>
        </div>
        {hasModel ? (
          <EngineeringPlayground
            initialModel={project.model as ModelKind}
            compact
          />
        ) : (
          <figure className="project-reading-visual">
            <ProjectVisual kind={project.model} />
            <figcaption>
              Conceptual illustration · {project.visualLabel.toLowerCase()}
            </figcaption>
          </figure>
        )}
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">01 / MY CONTRIBUTION</p>
        </div>
        <div className="about-body">
          <p className="large-body">{project.role}</p>
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">02 / APPROACH</p>
        </div>
        <div className="about-body approach-steps">
          {project.approach.map((s, i) => (
            <div key={s.title}>
              <span className="step-index">0{i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">03 / CURRENT OUTCOME</p>
        </div>
        <div className="about-body">
          <p className="large-body">{project.outcome}</p>
          <ul className="evidence-list">
            {project.evidence.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <div className="scope-note">
            <span className="eyebrow">SCOPE</span>
            <p>{project.scope}</p>
          </div>
        </div>
      </section>
      <section className="next-project shell">
        <p className="eyebrow">NEXT PROJECT / {next.number}</p>
        <Link href={`/work/${next.slug}`}>
          <h2>{next.title}</h2>
        </Link>
      </section>
    </main>
  );
}
