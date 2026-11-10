import type { Project } from '@/content/projects';

// Only documentation from Mithul’s project files belongs here. Entries without
// verified imagery render as text. The v1 archive retains its own asset list.
export const projectImages: Partial<
  Record<string, NonNullable<Project['image']>>
> = {
  'battery-control-and-estimation': {
    kind: 'documentation',
    label: 'Measured cell-data replay',
    src: '/images/projects/a123-cell-estimator-replay.png',
    width: 1811,
    height: 1130,
    alt: 'Two plots comparing one-RC and two-RC estimates of state of charge against a processed reference and showing their errors over the recorded test.',
    caption:
      'Original MATLAB comparison of the one- and two-RC estimators on the recorded A123 cell data, with matched initial state of charge.',
    fit: 'contain',
  },
  'adaptive-suspension-rover': {
    kind: 'documentation',
    label: 'Rover CAD assembly',
    src: '/images/projects/rover-assembly-cad.png',
    width: 1800,
    height: 1350,
    alt: 'CAD view of the six-wheel rover with its enclosed chassis and individual suspension modules.',
    caption:
      'Six-wheel rover assembly from the project’s native CAD files. This is a design view; terrain testing is planned.',
    fit: 'contain',
  },
  'tensegrity-joint': {
    kind: 'documentation',
    label: 'Joint design schematic',
    src: '/images/projects/tensegrity-knee-design.png',
    width: 1600,
    height: 588,
    alt: 'Three diagrams from the knee-joint design review showing the support network and separate femoral and tibial torque tendons.',
    caption:
      'Compound tensegrity knee: support and torque networks from the project’s preliminary design review. Blue members are rigid; red members are tendons. This is a design schematic.',
    fit: 'contain',
  },
  kneeassist: {
    kind: 'documentation',
    label: 'Knee-assistance CAD',
    src: '/images/projects/knee-assistance-cad.png',
    width: 1718,
    height: 1268,
    alt: 'Original CAD screenshot of the actuated knee-assistance design, showing the brace, rails, cuffs, motor, spring, and cable drive.',
    caption:
      'Original CAD screenshot of the actuated knee-assistance design. Procurement and bench testing are the next steps.',
    fit: 'contain',
  },
  'reaction-wheel-microvibrations': {
    kind: 'documentation',
    label: 'COMSOL project screenshot',
    src: '/images/projects/spacecraft-comsol-model.png',
    width: 2036,
    height: 1052,
    alt: 'COMSOL screenshot from the spacecraft vibration pilot, with the satellite structure and camera-support response visible.',
    caption:
      'COMSOL model screenshot from the project’s Reaction Wheel Vibration and Camera Pointing Jitter presentation. The displayed case is a 5 Hz unit-force response; it is a numerical result.',
    fit: 'contain',
  },
};
