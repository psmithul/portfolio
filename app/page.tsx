import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  Box,
  Braces,
  ChartSpline,
  Cpu,
  GitBranch,
} from 'lucide-react';
import { PortraitStory } from '@/components/portrait-story';
import { MotionDirector } from '@/components/motion-director';
import { PortfolioCursor } from '@/components/portfolio-cursor';
import { SideQuests } from '@/components/side-quests';
import { projects } from '@/content/projects';
import { getPublicPosts } from '@/lib/journal-store';

export const dynamic = 'force-dynamic';
const featuredOrder = [
  'adaptive-suspension-rover',
  'reaction-wheel-microvibrations',
  'tensegrity-joint',
  'uav-vibration-integration',
];
const featured = featuredOrder.map((slug) =>
  projects.find((project) => project.slug === slug)!,
);
const sideOrder = [
  'four-bar-door-mechanism',
  'easy-access-wallet',
  'kneeassist',
  'uncertainty-aware-navigation',
  'neoleg-knee-mechanism',
  'off-road-leaf-robot',
  'solar-smart-home',
  'traffic-and-elevated-bus',
];
const sideProjects = sideOrder.map((slug) =>
  projects.find((project) => project.slug === slug)!,
);
const covers: Record<
  string,
  { title: string[]; note: string; tags: string[]; focus: string[] }
> = {
  'adaptive-suspension-rover': {
    title: ['Adaptive suspension', 'for rough terrain'],
    note: 'Design in progress / 2026',
    tags: ['Field robotics', 'Suspension', 'Vibrations'],
    focus: [
      'Three stiffness settings',
      'IMU + encoder feedback',
      'Terrain tests planned',
    ],
  },
  'reaction-wheel-microvibrations': {
    title: ['Reaction-wheel', 'microvibrations'],
    note: 'FEM + machine learning / 2026',
    tags: ['Space systems', 'Structural dynamics', 'FEM'],
    focus: [
      'Response peak ≈ 5,800 rpm',
      'Mesh refinement: 0.33% change',
      '24-design parameter sweep',
    ],
  },
  'tensegrity-joint': {
    title: ['Tensegrity', 'variable-stiffness joint'],
    note: 'Mechanism modelling / 2026',
    tags: ['Robotics', 'Mechanisms', 'Tensegrity'],
    focus: [
      'Member-force calculations',
      'Geometry + load comparisons',
      'Paper-based CAD reconstruction',
    ],
  },
  'uav-vibration-integration': {
    title: ['UAV vibration &', 'hardware integration'],
    note: 'Vayu Aerospace / 2026',
    tags: ['UAV hardware', 'IMU', 'Vibration isolation'],
    focus: [
      'Three mounts compared',
      'Ground motor-run testing',
      'RMS + frequency analysis',
    ],
  },
};
const experience = [
  {
    company: 'Vayu Aerospace',
    role: 'Product Intern',
    period: 'Jun — Jul 2026',
    detail:
      'Compared flight-controller mounts, supported ground tests, and analysed IMU vibration logs.',
  },
  {
    company: 'ISTE NITK',
    role: 'Secretary',
    period: 'Sep 2024 — Present',
    detail:
      'Sponsor outreach, budgets, vendors, and event logistics. Three sponsors; a technical event with 500+ participants.',
  },
  {
    company: 'Thinkify Labs',
    role: 'Product & Strategy Intern',
    period: 'May — Aug 2025',
    detail:
      'Redesigned a lead-qualification workflow so the team could spend more time on the right prospects.',
  },
  {
    company: 'NH66 Fund · P&L Club',
    role: 'Fund Manager',
    period: 'Jan 2025 — Apr 2026',
    detail:
      'Managed a ₹150K student fund, mentored three junior analysts, and organised recruitment and training.',
  },
  {
    company: 'ILO Consulting',
    role: 'Investment Banking Intern',
    period: 'May — Jul 2024',
    detail:
      'Financial modelling, due diligence, and an Ireland market-entry assessment.',
  },
];
const tools = [
  { name: 'SolidWorks', icon: Box },
  { name: 'ANSYS', icon: Activity },
  { name: 'MATLAB / Simulink', icon: ChartSpline },
  { name: 'Python', icon: Braces },
  { name: 'ESP32 / embedded', icon: Cpu },
  { name: 'Git / GitHub', icon: GitBranch },
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
            <h2>Selected builds</h2>
          </div>
          <p>
            Mechanisms, vibration, and the questions that keep me at the
            workbench.
          </p>
        </div>
        <div className="flow-project-list">
          {featured.map((project, index) => {
            const cover = covers[project.slug];
            return (
              <Link
                href={`/work/${project.slug}`}
                className={`flow-project-card flow-cover-${project.slug}`}
                key={project.slug}
                data-cursor="project"
              >
                <figure className="flow-project-image">
                  <div className="flow-cover-body">
                    <span className="flow-cover-number">0{index + 1}</span>
                    <span className="flow-cover-label">{cover.note}</span>
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
                    <div className="flow-cover-annotations" aria-hidden="true">
                      {cover.focus.map((focus) => (
                        <span key={focus}>{focus}</span>
                      ))}
                    </div>
                    <span className="flow-cover-cta">
                      View project <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                  <figcaption>{project.image?.caption}</figcaption>
                </figure>
                <div className="flow-project-details">
                  <span className="flow-project-date">2026</span>
                  <div className="flow-project-description">
                    <h3>
                      {cover.title[0]}
                      <br />
                      {cover.title[1]}
                    </h3>
                    <div className="flow-tags">
                      {cover.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <p>{project.summary}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <SideQuests projects={sideProjects} />
      <section className="flow-experience flow-section shell">
        <div className="flow-section-heading">
          <div>
            <p className="eyebrow">03 — People & places</p>
            <h2>Experience</h2>
          </div>
          <p>
            Work, student teams, and learning to make things happen together.
          </p>
        </div>
        <div className="flow-experience-board">
          <div className="flow-experience-list">
            {experience.map((job, index) => (
              <article className="flow-experience-card" key={job.company}>
                <span className="flow-experience-index">0{index + 1}</span>
                <div>
                  <span className="flow-experience-period">{job.period}</span>
                  <h3>{job.company}</h3>
                  <p className="flow-role">{job.role}</p>
                </div>
                <p className="flow-experience-detail">{job.detail}</p>
              </article>
            ))}
          </div>
          <Link
            href="/about"
            className="flow-work-folder"
            aria-label="Read more about my background"
          >
            <Image
              src="/images/work-folder.webp"
              alt=""
              width={800}
              height={800}
              unoptimized
            />
            <span>
              Work, in a little more detail <span aria-hidden="true">↗</span>
            </span>
          </Link>
        </div>
      </section>
      <section className="flow-tools flow-section shell">
        <div className="flow-section-heading">
          <div>
            <p className="eyebrow">04 — On the desk</p>
            <h2>Tools</h2>
          </div>
          <p>
            Things I use to turn an idea into a model, a mechanism, or a useful
            test.
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
      <section className="flow-philosophy shell">
        <p className="eyebrow">A working principle</p>
        <h2>
          I like machines
          <br />
          that have to work
          <br />
          <span>outside the simulation.</span>
        </h2>
        <p>
          My interests sit where mechanics, sensing, control, and
          experimentation meet. I care about understanding the physics,
          predicting what should happen, and checking whether I was right.
        </p>
      </section>
      <section className="flow-journal flow-section shell">
        <div className="flow-section-heading">
          <div>
            <p className="eyebrow">05 — Notes along the way</p>
            <h2>Mika’s Life</h2>
          </div>
          <p>
            What I’m reading, noticing, and trying to understand outside the
            project files.
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
              <span className="flow-journal-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
        <Link href="/blog" className="flow-text-link">
          Read the journal <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <section className="flow-contact shell">
        <p className="eyebrow">A good question is a good place to start.</p>
        <h2>
          Let’s build
          <br />
          <span>something real.</span>
        </h2>
        <div>
          <a
            href="https://www.linkedin.com/in/psmithulsourav"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a
            href="https://github.com/psmithul"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href="mailto:psmithul@gmail.com">
            Email <span aria-hidden="true">↗</span>
          </a>
          <a href="/Mithul-Sourav-CV.pdf" target="_blank" rel="noreferrer">
            Résumé <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}
