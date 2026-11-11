import type { Metadata } from 'next';
import { ProjectList } from '@/components/academic/project-list';
import { selectedProjects } from '@/content/projects';
import { sitePages } from '@/lib/site-paths';

export const metadata: Metadata = {
  title: 'Projects',
  alternates: { canonical: sitePages.projects },
};

export default function ProjectsPage() {
  return (
    <main id="main" className="academic-content portfolio-page portfolio-index">
      <h1>Selected projects</h1>
      <ProjectList projects={selectedProjects} />
    </main>
  );
}
