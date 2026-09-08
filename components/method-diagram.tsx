type Props = {
  kind: 'structure' | 'navigation' | 'dynamics' | 'mechanism' | 'architecture';
};
export function MethodDiagram({ kind }: Props) {
  const steps = {
    structure: ['Geometry & loading', 'Element forces', 'Joint response'],
    navigation: ['Encoders + IMU', 'EKF estimate', 'Speed + recovery'],
    dynamics: ['Wheel excitation', 'Panel FEM', 'Camera interface'],
    mechanism: ['Spring geometry', 'Knee assembly', 'Motion checks'],
    architecture: ['Locomotion', 'Leaf collection', 'Debris handling'],
  }[kind];
  return (
    <figure
      className={`method-diagram method-${kind}`}
      aria-label={`Method diagram: ${steps.join(' to ')}. This is a workflow schematic, not experimental data.`}
    >
      <div className="method-top">
        <span>ENGINEERING NOTE / METHOD</span>
        <span aria-hidden="true">↗</span>
      </div>
      <div className="method-flow">
        {steps.map((step, i) => (
          <div className="method-step" key={step}>
            <span className="method-node">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{step}</span>
            {i < 2 && (
              <span className="method-arrow" aria-hidden="true">
                ⟶
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="method-bottom">
        <span>
          {kind === 'navigation'
            ? 'PLAN → ESTIMATE → ACT'
            : kind === 'structure'
              ? 'FORM → FORCE → FUNCTION'
              : 'MODEL → EVALUATE → REFINE'}
        </span>
        <span>SCHEMATIC</span>
      </div>
    </figure>
  );
}
