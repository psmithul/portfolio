import type { Metadata } from 'next';
import { projects } from '@/content/projects';
import { ResearchList } from '@/components/academic/research-list';
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
        Robots, mechanisms, and computational models I’ve worked on. Each
        project explains what I did, its current stage, and what still needs
        testing.
      </p>
      <section className="academic-section">
        <h2>ongoing</h2>
        <ResearchList
          projects={projects.filter((item) => item.status === 'Ongoing')}
        />
      </section>
      <section className="academic-section" id="archive">
        <h2>completed studies &amp; earlier builds</h2>
        <ResearchList
          projects={projects.filter((item) => item.status === 'Completed')}
        />
      </section>
    </main>
  );
}
