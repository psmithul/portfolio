import type { Metadata } from 'next';
import { projects } from '@/content/projects';
import { ResearchList } from '@/components/academic/research-list';
export const metadata: Metadata = {
  title: 'Research & Projects',
  description:
    'Robotics, mechanisms, spacecraft dynamics, and the projects I am learning through.',
  alternates: { canonical: '/work' },
};
export default function Work() {
  return (
    <main id="main" className="academic-content">
      <h1 className="page-title">research &amp; projects</h1>
      <p className="page-introduction">
        Mechanical design, sensing, vibration, and control, from early builds to
        current research.
      </p>
      <section className="academic-section">
        <h2>ongoing</h2>
        <ResearchList
          projects={projects.filter((item) => item.status === 'Ongoing')}
        />
      </section>
      <section className="academic-section" id="archive">
        <h2>completed work</h2>
        <ResearchList
          projects={projects.filter((item) => item.status === 'Completed')}
        />
      </section>
    </main>
  );
}
