'use client';
import dynamic from 'next/dynamic';
import type { ModelKind } from '@/lib/engineering-scene';
import { usePortfolioMode } from '@/components/use-portfolio-mode';
import { ProjectVisual } from '@/components/project-visual';
import { MinecraftLoader } from '@/components/minecraft-loader';
const Playground = dynamic(
  () =>
    import('@/components/engineering-playground').then(
      (m) => m.EngineeringPlayground,
    ),
  {
    ssr: false,
    loading: () => (
      <MinecraftLoader label="Assembling the concept model…" compact />
    ),
  },
);
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
        <p>
          {mode === 'desktop'
            ? 'Drag to orbit. Animate the mechanism, change a parameter, or pull the assembly apart.'
            : 'A concept view of the mechanism. The design and analysis continue below.'}
        </p>
      </div>
      {mode === 'desktop' ? (
        <Playground initialModel={model} compact />
      ) : (
        <figure className="mobile-model-illustration">
          <ProjectVisual kind={model} />
          <figcaption>
            Concept illustration. Open this page on a computer to explore the
            interactive mechanics.
          </figcaption>
        </figure>
      )}
    </section>
  );
}
