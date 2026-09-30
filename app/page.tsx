import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  Box,
  Braces,
  ChartSpline,
  Code2,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import { PortraitStory } from '@/components/portrait-story';
import { MotionDirector } from '@/components/motion-director';
import { PortfolioCursor } from '@/components/portfolio-cursor';
import { ExperienceRail } from '@/components/experience-rail';
import { SideQuests } from '@/components/side-quests';
import { projects } from '@/content/projects';
import { getPublicPosts } from '@/lib/journal-store';

export const dynamic = 'force-dynamic';
const featuredOrder = [
  'tensegrity-joint',
  'adaptive-suspension-rover',
  'off-road-leaf-robot',
];
const featured = featuredOrder.map((slug) =>
  projects.find((project) => project.slug === slug)!,
);
const completedProjects = projects.filter(
  (project) =>
    project.status === 'Completed' &&
    project.slug !== 'uav-vibration-integration',
);
const covers: Record<string, { title: string[]; tags: string[] }> = {
  'adaptive-suspension-rover': {
    title: ['Adaptive suspension', 'for rough terrain'],
    tags: ['Field robotics', 'Suspension', 'Vibrations'],
  },
  'off-road-leaf-robot': {
    title: ['Off-road leaf-collection', 'robot'],
    tags: ['Field robotics', 'Mechanism design', 'Test planning'],
  },
  'tensegrity-joint': {
    title: ['Tensegrity', 'variable-stiffness joint'],
    tags: ['Robotics', 'Mechanisms', 'Tensegrity'],
  },
};
const tools = [
  { name: 'SolidWorks', icon: Box },
  { name: 'ANSYS', icon: Activity },
  { name: 'MATLAB', icon: ChartSpline },
  { name: 'Python', icon: Braces },
  { name: 'C / C++', icon: Code2 },
  { name: 'Arduino', icon: Braces },
];

export default async function Home() {
  const posts = await getPublicPosts();
  return (
    <main id="main" className="flow-home">
      <MotionDirector />
      <PortfolioCursor />
      <PortraitStory />
      <section id="work" className="flow-work flow-section shell">
        <div className="flow-section-heading">
          <div>
            <p className="eyebrow">01 — Projects</p>
            <h2>Ongoing projects</h2>
          </div>
          <p>
            Current research and design work in robotics, mechanisms, and
            vibration.
          </p>
        </div>
        <div className="flow-project-list">
          {featured.map((project) => {
            const cover = covers[project.slug];
            return (
              <Link
                href={`/work/${project.slug}`}
                className={`flow-project-card flow-cover-${project.slug}`}
                key={project.slug}
                data-cursor="project"
              >
                <div className="flow-project-details">
                  <div className="flow-project-timeline">
                    <span className="flow-project-year">
                      {project.period.match(/\d{4}/)?.[0]}
                    </span>
                    <span
                      className={`status-badge ${project.status.toLowerCase()}`}
                    >
                      {project.status}
                    </span>
                    <span className="flow-project-date">{project.period}</span>
                  </div>
                  <div className="flow-project-description">
                    <h3>{cover.title.join(' ')}</h3>
                    <div className="flow-tags">
                      {cover.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <p>{project.summary}</p>
                  </div>
                  <ArrowRight
                    className="flow-project-arrow"
                    aria-hidden="true"
                  />
                </div>
                <figure className="flow-project-image">
                  <div className="flow-cover-body">
                    {project.image && (
                      <Image
                        src={project.image.src}
                        alt={project.image.alt}
                        width={project.image.width}
                        height={project.image.height}
                        className="flow-cover-main"
                        unoptimized
                      />
                    )}
                  </div>
                  <figcaption>{project.image?.caption}</figcaption>
                </figure>
              </Link>
            );
          })}
        </div>
      </section>
      <SideQuests projects={completedProjects} />
      <ExperienceRail />
      <section className="flow-tools flow-section shell">
        <div className="flow-section-heading">
          <div>
            <p className="eyebrow">04 — Technical skills</p>
            <h2>Tools</h2>
          </div>
          <p>
            Software and programming tools I use for design, analysis, and
            control.
          </p>
        </div>
        <ul>
          {tools.map(({ name, icon: Icon }) => (
            <li key={name}>
              <Icon size={44} strokeWidth={1.25} aria-hidden="true" />
              <span>{name}</span>
            </li>
          ))}
        </ul>
        <p className="flow-instrumentation">
          IMU <span>·</span> Multimeter <span>·</span> Vernier caliper{' '}
          <span>·</span> Data acquisition <span>·</span> Prototyping{' '}
          <span>·</span> Experimental testing
        </p>
      </section>
      <section className="flow-journal flow-section shell">
        <div className="flow-section-heading">
          <div>
            <p className="eyebrow">05 — Journal</p>
            <h2>Mika’s Life</h2>
          </div>
          <p>
            Personal essays on books, photographs, and things I notice outside
            engineering.
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
              <ArrowUpRight
                className="flow-journal-arrow link-arrow"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
        <Link href="/blog" className="flow-text-link">
          Read the journal{' '}
          <ArrowUpRight className="link-arrow" aria-hidden="true" />
        </Link>
      </section>
      <section className="flow-contact shell">
        <p className="eyebrow">Contact</p>
        <h2>Get in touch.</h2>
        <p className="flow-contact-note">
          For research opportunities, project collaboration, or a conversation
          about mechanical engineering and robotics.
        </p>
        <div>
          <a
            href="https://www.linkedin.com/in/psmithulsourav"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <ArrowUpRight className="link-arrow" aria-hidden="true" />
          </a>
          <a
            href="https://github.com/psmithul"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ArrowUpRight className="link-arrow" aria-hidden="true" />
          </a>
          <a href="mailto:psmithul@gmail.com">
            Email <ArrowUpRight className="link-arrow" aria-hidden="true" />
          </a>
          <a href="/Mithul-Sourav-CV.pdf" target="_blank" rel="noreferrer">
            Résumé <ArrowUpRight className="link-arrow" aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
