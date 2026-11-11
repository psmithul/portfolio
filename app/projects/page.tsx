import type { Metadata } from 'next';
import { ProjectList } from '@/components/academic/project-list';
import { projectDirectory } from '@/content/projects';
import { sitePages } from '@/lib/site-paths';

export const metadata: Metadata = {
  title: 'Projects',
  alternates: { canonical: sitePages.projects },
};

export default function ProjectsPage() {
  const sections = [
    {
      id: 'ongoing',
      title: 'Ongoing projects',
      projects: projectDirectory.filter(({ status }) => status === 'Ongoing'),
    },
    {
      id: 'past',
      title: 'Past projects',
      projects: projectDirectory.filter(({ status }) => status !== 'Ongoing'),
    },
  ];

  return (
    <main id="main" className="academic-content portfolio-page projects-page">
      <h1>Projects</h1>
      {sections.map(({ id, title, projects }) => (
        <section key={id} className="portfolio-section" aria-labelledby={id}>
          <h2 id={id}>{title}</h2>
          <ProjectList projects={projects} />
        </section>
      ))}
    </main>
  );
}
