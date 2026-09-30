import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

import { projects } from '@/content/projects';

type Props = { params: Promise<{ slug: string }> };
const studyViews: Record<
  string,
  { src: string; title: string; caption: string }
> = {
  'tensegrity-joint': {
    src: '/images/projects/tensegrity-leg-cad.webp',
    title: 'The joint in context',
    caption:
      'Full leg assembly from the paper-based CAD reconstruction. This is a mechanism study, not a photograph of built hardware.',
  },
  'reaction-wheel-microvibrations': {
    src: '/images/projects/reaction-wheel-cutaway.webp',
    title: 'Inside the reference assembly',
    caption:
      'Section view of the reaction-wheel reference assembly, showing the wheel and surrounding structure. Surface finishes are illustrative.',
  },
};
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
  return (
    <main id="main">
      <section className="project-hero shell">
        <Link href="/#work" className="back-link">
          <ArrowLeft className="link-arrow" aria-hidden="true" /> All projects
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
      {project.image && (
        <figure className="project-documentation shell">
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
                  Reference paper
                </a>
              </>
            )}
          </figcaption>
        </figure>
      )}
      <section className="project-question shell">
        <div>
          <p className="eyebrow">THE PROBLEM</p>
          <h2>{project.question}</h2>
        </div>
        <div className="project-at-a-glance">
          <p className="eyebrow">PROJECT DETAILS</p>
          <ul>
            {project.evidence.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">01 / MY CONTRIBUTION</p>
        </div>
        <div className="about-body">
          <p className="large-body">{project.role}</p>
        </div>
      </section>
      {studyViews[slug] && (
        <section className="project-study-gallery shell">
          <p className="eyebrow">A closer look / CAD study</p>
          <h2>{studyViews[slug].title}</h2>
          <figure>
            <Image
              src={studyViews[slug].src}
              alt={studyViews[slug].caption}
              width={1200}
              height={1200}
              unoptimized
            />
            <figcaption>{studyViews[slug].caption}</figcaption>
          </figure>
        </section>
      )}
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
          <p className="eyebrow">03 / RESULTS & PROGRESS</p>
        </div>
        <div className="about-body">
          <p className="large-body">{project.outcome}</p>
          <div className="scope-note">
            <span className="eyebrow">PROJECT STAGE</span>
            <p>{project.scope}</p>
          </div>
        </div>
      </section>
      <section className="next-project shell">
        <p className="eyebrow">NEXT PROJECT / {next.number}</p>
        <Link href={`/work/${next.slug}`}>
          <h2>{next.title}</h2>
          <ArrowUpRight className="link-arrow" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
