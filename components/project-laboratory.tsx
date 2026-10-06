'use client';
import dynamic from 'next/dynamic';
import type { ModelKind } from '@/lib/engineering-scene';
const Playground = dynamic(
  () =>
    import('@/components/engineering-playground').then(
      (m) => m.EngineeringPlayground,
    ),
  {
    ssr: false,
    loading: () => <p className="lab-loading">Assembling the concept model…</p>,
  },
);
export function ProjectLaboratory({ model }: { model: ModelKind }) {
  return (
    <section
      className="project-laboratory"
      aria-label="Project physics laboratory"
    >
      <div className="laboratory-heading">
        <div>
          <p className="world-eyebrow">THE INTERACTIVE LAB</p>
          <h2>Get a feel for the mechanics.</h2>
        </div>
        <p>
          Drag to orbit. Animate the mechanism, change a parameter, or pull the
          assembly apart.
        </p>
      </div>
      <Playground initialModel={model} compact />
    </section>
  );
}
