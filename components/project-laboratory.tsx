'use client';
import type { ModelKind } from '@/lib/engineering-scene';
import { usePortfolioMode } from '@/components/use-portfolio-mode';
import { ProjectVisual } from '@/components/project-visual';
import { EngineeringPlayground } from '@/components/engineering-playground';
export function ProjectLaboratory({ model }: { model: ModelKind }) {
  const mode = usePortfolioMode();
  return (
    <section
      className="project-laboratory"
      aria-label="Project physics laboratory"
    >
      <div className="laboratory-heading">
        <div>
          <p className="world-eyebrow">THE WORKBENCH</p>
          <h2>Get a feel for the mechanics.</h2>
        </div>
        <p className="laboratory-desktop">
          Drag to orbit. Animate the mechanism, change a parameter, or pull the
          assembly apart.
        </p>
        <p className="laboratory-mobile">
          A concept view of the mechanism. The design and analysis continue
          below.
        </p>
      </div>
      <div className="laboratory-desktop">
        <EngineeringPlayground
          key={mode ?? 'preparing'}
          initialModel={model}
          compact
          enabled={mode === 'desktop'}
        />
      </div>
      <figure className="mobile-model-illustration laboratory-mobile">
        <ProjectVisual kind={model} />
        <figcaption>
          Concept illustration. Open this page on a computer to explore the
          interactive mechanics.
        </figcaption>
      </figure>
    </section>
  );
}
