import type { Metadata } from 'next';
import { projects } from '@/content/projects';
import { ProjectList } from '@/components/academic/project-list';
export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Projects in robotics, mechanical design, dynamics, and control by Mithul Sourav, a fourth-year undergraduate at NITK Surathkal.',
  alternates: { canonical: '/work' },
};
export default function Work() {
  return (
    <main id="main" className="academic-content">
      <h1 className="page-title">projects</h1>
      <p className="page-introduction">
        My work in robotics, mechanical design, and simulation, from current
        research to my first electronics builds.
      </p>
      <section className="academic-section">
        <h2>ongoing projects</h2>
        <ProjectList
          projects={projects.filter((item) => item.status === 'Ongoing')}
        />
      </section>
      <section className="academic-section" id="archive">
        <h2>completed projects</h2>
        <ProjectList
          projects={projects.filter(
            (item) => item.status === 'Completed' && !item.earlierWork,
          )}
        />
      </section>
      <section className="academic-section" id="earlier-projects">
        <h2>earlier projects</h2>
        <ProjectList projects={projects.filter((item) => item.earlierWork)} />
      </section>
    </main>
  );
}
