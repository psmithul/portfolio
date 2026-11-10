import type { ReactNode } from 'react';

export function HomeSectionLink({
  section,
  className,
  children,
}: {
  section: 'about' | 'research' | 'journal';
  className?: string;
  children: ReactNode;
}) {
  // Let the browser resolve the fragment independently of the last homepage visit.
  return (
    <a href={`/#${section}`} className={className}>
      {children}
    </a>
  );
}
