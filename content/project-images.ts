import type { Project } from '@/content/projects';

// Only documentation from Mithul’s project files belongs here. Entries without
// verified imagery render as text.
export const projectImages: Partial<
  Record<string, NonNullable<Project['image']>>
> = {
  'nitk-battle-bots': {
    kind: 'documentation',
    label: 'Team at the event',
    src: '/images/projects/nitk-battle-bots-event.jpeg',
    width: 2252,
    height: 4000,
    alt: 'Five NITK Battle Bots teammates stand behind a combat robot with black front wedges.',
    caption: 'Our NITK Battle Bots team with one of our robots at the event.',
    fit: 'contain',
    thumbnail: {
      src: '/images/projects/gn4rly-2-5-assembly.jpg',
      width: 768,
      height: 432,
      alt: 'GN4RLY 2.5 on the workbench with its chassis, weapon assembly and drivetrain exposed.',
      label: 'GN4RLY 2.5 assembly',
    },
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
