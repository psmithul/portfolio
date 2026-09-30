import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  Box,
  Braces,
  ChartSpline,
  Cpu,
  FileCode2,
} from 'lucide-react';
import { PortraitStory } from '@/components/portrait-story';
import { MotionDirector } from '@/components/motion-director';
import { projects } from '@/content/projects';
import { getPublicPosts } from '@/lib/journal-store';

export const dynamic = 'force-dynamic';

const featuredOrder = [
  'tensegrity-joint',
  'reaction-wheel-microvibrations',
  'adaptive-suspension-rover',
];
const featured = featuredOrder.flatMap((slug) =>
  projects.filter((project) => project.slug === slug),
);
const otherBuilds = projects.filter(
  (project) =>
    !featuredOrder.includes(project.slug) && project.slug !== 'kneeassist',
);
const kneeAssist = projects.find((project) => project.slug === 'kneeassist')!;
const coverDetails: Record<
  string,
  { label: string; src: string; alt: string }
> = {
  'tensegrity-joint': {
    label: 'CAD & member-force study',
    src: '/images/projects/tensegrity-leg-cad.webp',
    alt: 'Full leg assembly from the paper-based tensegrity CAD reconstruction',
  },
  'reaction-wheel-microvibrations': {
    label: 'CAD & structural dynamics',
    src: '/images/projects/reaction-wheel-cutaway.webp',
    alt: 'Section view of the reaction-wheel reference CAD assembly',
  },
};
const visualStudies = [
  {
    src: '/images/projects/tensegrity-joint-cad.webp',
    title: 'Joint & cable routing',
    caption: 'Mechanism reconstruction from Mortensen et al. (2025).',
    slug: 'tensegrity-joint',
  },
  {
    src: '/images/projects/reaction-wheel-cutaway.webp',
    title: 'Reaction-wheel cutaway',
    caption: 'Section view of the reference assembly.',
    slug: 'reaction-wheel-microvibrations',
  },
  {
    src: '/images/projects/tensegrity-leg-cad.webp',
    title: 'Leg assembly',
    caption: 'CAD reconstruction for the tensegrity study.',
    slug: 'tensegrity-joint',
  },
  {
    src: '/images/projects/reaction-wheel-reference-cad.webp',
    title: 'Satellite reference assembly',
    caption: 'Wheel, structure, and camera mounting arrangement.',
    slug: 'reaction-wheel-microvibrations',
  },
];
const experience = [
  {
    company: 'Vayu Aerospace',
    role: 'Product Intern',
    period: 'Jun – Jul 2026',
    details: [
      'Compared flight-controller mounts with modal and vibration analysis.',
      'Supported ground testing and reviewed IMU logs in MATLAB.',
    ],
  },
  {
    company: 'Thinkify Labs',
    role: 'Product & Strategy Intern',
    period: 'May – Aug 2025',
    details: [
      'Built an AI-assisted lead-qualification workflow.',
      'Improved how qualified prospects reached the sales team.',
    ],
  },
  {
    company: 'ILO Consulting',
    role: 'Investment Banking Intern',
    period: 'May – Jul 2024',
    details: [
      'Built financial models for due diligence.',
      'Contributed to an Ireland market-entry assessment.',
    ],
  },
];
const tools = [
  { name: 'SolidWorks', icon: Box },
  { name: 'ANSYS Mechanical', icon: Activity },
  { name: 'MATLAB', icon: ChartSpline },
  { name: 'Python', icon: FileCode2 },
  { name: 'C', icon: Braces },
  { name: 'C++', icon: Cpu },
];

export default async function Home() {
  const posts = await getPublicPosts();
  return (
    <main id="main" className="flow-home">
      <MotionDirector />
      <PortraitStory />
      <section id="work" className="flow-work flow-section shell">
        <div className="flow-section-heading">
          <h2>Latest projects</h2>
          <p>
            Recent work in mechanical design, robotics, and structural analysis.
          </p>
        </div>
        <div className="flow-project-list">
          {featured.map((project) => (
            <Link
              href={`/work/${project.slug}`}
              className={`flow-project-card${project.image ? ' has-project-image' : ''}`}
              key={project.slug}
            >
              {project.image && (
                <figure
                  className={`flow-project-image flow-cover-${project.slug}${project.image.kind === 'illustration' ? ' is-illustration' : ''}`}
                >
                  <div className="flow-cover-body">
                    {coverDetails[project.slug] && (
                      <span className="flow-cover-label">
                        {coverDetails[project.slug].label}
                      </span>
                    )}
                    <Image
                      src={project.image.src}
                      alt={project.image.alt}
                      width={project.image.width}
                      height={project.image.height}
                      className="flow-cover-main"
                      unoptimized
                    />
                    {coverDetails[project.slug] && (
                      <Image
                        src={coverDetails[project.slug].src}
                        alt={coverDetails[project.slug].alt}
                        width={1200}
                        height={1200}
                        className="flow-cover-inset"
                        unoptimized
                      />
                    )}
                    <span className="flow-cover-cta">View project</span>
                  </div>
                  <figcaption>{project.image.caption}</figcaption>
                </figure>
              )}
              <div className="flow-project-details">
                <span className="flow-project-date">
                  {project.period.match(/\d{4}/)?.[0]}
                </span>
                <div className="flow-project-description">
                  <h3>{project.title}</h3>
                  <div className="flow-tags">
                    <span>{project.discipline}</span>
                    {project.tools.slice(0, 2).map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                    {project.status === 'Ongoing' && <span>In progress</span>}
                  </div>
                  <p>{project.summary}</p>
                  {project.slug === 'reaction-wheel-microvibrations' && (
                    <div className="flow-project-results">
                      <div>
                        <strong>5,800 rpm</strong>
                        <span>Response peak</span>
                      </div>
                      <div>
                        <strong>0.33%</strong>
                        <span>Mesh-refinement change</span>
                      </div>
                    </div>
                  )}
                  {project.slug === 'kneeassist' && (
                    <div className="flow-project-results">
                      <div>
                        <strong>Top 5 / 70</strong>
                        <span>Incubate X Prosthetic Challenge</span>
                      </div>
                    </div>
                  )}
                  {!project.image && (
                    <span className="flow-read-project">View project</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="flow-other flow-section shell">
        <div className="flow-section-heading">
          <h2>Side projects</h2>
        </div>
        <Link href="/work/kneeassist" className="flow-side-project">
          <figure className="flow-side-illustration">
            <Image
              src={kneeAssist.image!.src}
              alt={kneeAssist.image!.alt}
              width={1200}
              height={800}
              unoptimized
            />
            <figcaption>{kneeAssist.image!.caption}</figcaption>
          </figure>
          <div className="flow-side-copy">
            <span className="flow-project-date">2026</span>
            <h3>KneeAssist</h3>
            <div className="flow-tags">
              <span>Assistive mechatronics</span>
              <span>Team project</span>
            </div>
            <p>{kneeAssist.summary}</p>
            <p className="flow-side-award">
              Top 5 of 70 · Incubate X Prosthetic Challenge
            </p>
            <span className="flow-read-project">View project</span>
          </div>
        </Link>
        <details className="flow-project-archive">
          <summary>
            Earlier builds <span>{otherBuilds.length} projects</span>
          </summary>
          <div className="flow-other-grid">
            {otherBuilds.map((project) => (
              <Link href={`/work/${project.slug}`} key={project.slug}>
                {project.image && (
                  <Image
                    className="flow-archive-image"
                    src={project.image.src}
                    alt={project.image.alt}
                    width={project.image.width}
                    height={project.image.height}
                    unoptimized
                  />
                )}
                <span className="flow-project-date">{project.period}</span>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <span className="flow-other-discipline">
                  {project.discipline}
                </span>
              </Link>
            ))}
          </div>
        </details>
      </section>
      <section className="flow-visuals flow-section">
        <div className="flow-section-heading shell">
          <h2>From the CAD files</h2>
        </div>
        <div className="flow-visual-grid">
          {visualStudies.map((study) => (
            <Link href={`/work/${study.slug}`} key={study.src}>
              <figure>
                <div className="flow-visual-image">
                  <Image
                    src={study.src}
                    alt={study.title}
                    width={1200}
                    height={1200}
                    unoptimized
                  />
                </div>
                <figcaption>
                  <strong>{study.title}</strong>
                  <span>{study.caption}</span>
                </figcaption>
              </figure>
            </Link>
          ))}
        </div>
      </section>
      <section className="flow-experience flow-section shell">
        <div className="flow-section-heading">
          <h2>Experience</h2>
        </div>
        <div className="flow-experience-board">
          {experience.map((job) => (
            <article className="flow-experience-card" key={job.company}>
              <span className="flow-experience-period">{job.period}</span>
              <h3>{job.company}</h3>
              <p className="flow-role">{job.role}</p>
              <ul>
                {job.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          ))}
          <Link
            href="/about"
            className="flow-work-folder"
            aria-label="Read my work experience"
          >
            <Image
              src="/images/work-folder.webp"
              alt=""
              width={800}
              height={800}
              unoptimized
            />
            <span>Work</span>
          </Link>
        </div>
        <Link href="/about" className="flow-text-link">
          More about my background
        </Link>
      </section>
      <section className="flow-tools flow-section shell">
        <div className="flow-section-heading">
          <h2>Tools</h2>
        </div>
        <ul>
          {tools.map(({ name, icon: Icon }) => (
            <li key={name}>
              <Icon size={42} strokeWidth={1.4} aria-hidden="true" />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="flow-journal flow-section shell">
        <div className="flow-section-heading">
          <h2>Mika’s Life</h2>
          <p>
            A notebook for what I’m reading, noticing, and trying to understand.
          </p>
        </div>
        <div className="flow-journal-entries">
          {posts.slice(0, 3).map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <span className="eyebrow">
                {post.tags.slice(0, 2).join(' / ')}
              </span>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </Link>
          ))}
        </div>
        <Link href="/blog" className="flow-text-link">
          Read the journal
        </Link>
      </section>
      <section className="flow-contact flow-section shell">
        <h2>
          Have a project
          <br />
          <span>in mind?</span>
        </h2>
        <div>
          <a href="mailto:psmithul@gmail.com">psmithul@gmail.com</a>
          <a
            href="https://www.linkedin.com/in/psmithulsourav"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </main>
  );
}
