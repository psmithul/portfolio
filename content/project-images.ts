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
    label: 'Suspension module CAD',
    src: '/images/projects/rover-suspension-module-cad.png',
    width: 1920,
    height: 1080,
    alt: 'Isometric CAD view of one rover suspension module with its wheel, pivoting linkage, and spring preload assembly.',
    caption:
      'One suspension module from the CY06 rover CAD, shown apart from the chassis so the wheel carrier, linkage, and spring preload assembly are visible.',
    fit: 'contain',
  },
  'tensegrity-joint': {
    kind: 'documentation',
    label: 'Knee joint components',
    src: '/images/projects/tensegrity-knee-step-parts.webp',
    width: 1800,
    height: 1012,
    alt: 'Three CAD parts for the tensegrity knee: the femoral stem, floating tristar, and tibial stem.',
    caption:
      'The femoral stem, floating tristar, and tibial stem rendered from their individual STEP files at the same scale. The drawings below show how the tendons connect them.',
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
