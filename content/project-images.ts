import projectAssets from '@/docs/current-project-assets.json';

type ImageDimensions = { width: number; height: number };
type ImageCopy = { src: string; alt: string; label: string };

export type ProjectImage = ImageCopy &
  ImageDimensions & {
    caption: string;
    framing?: 'wide-crop' | 'full-frame';
    thumbnail?: ImageCopy & ImageDimensions;
  };

export const projectFigureDimensions: Partial<Record<string, ImageDimensions>> =
  Object.fromEntries(
    projectAssets.assets.map(({ path, width, height }) => [
      path.replace(/^public/, ''),
      { width, height },
    ]),
  );

function withDimensions<T extends ImageCopy>(image: T): T & ImageDimensions {
  const dimensions = projectFigureDimensions[image.src];
  if (!dimensions) throw new Error(`Missing project asset: ${image.src}`);
  return { ...image, ...dimensions };
}

// Only documentation from Mithul’s project files belongs here. Entries without
// verified imagery render as text.
export const projectImages = {
  'fireworks-galaxy': withDimensions({
    label: 'Full Hubble detector frame',
    src: '/images/projects/fireworks-original-frame.png',
    alt: 'The full Hubble NICMOS detector frame, with the bright centre of NGC 6946 near the lower middle of the field.',
    caption:
      'The full F160W detector frame from my original notebook. This exposure covers the central region of NGC 6946. Data from NASA/ESA Hubble via MAST.',
    framing: 'full-frame',
    thumbnail: withDimensions({
      src: '/images/projects/fireworks-field.png',
      alt: 'The near-infrared Hubble detector image of NGC 6946 next to two nested crops of its bright centre.',
      label: 'Hubble NICMOS · NGC 6946',
    }),
  }),
  'nitk-battle-bots': withDimensions({
    label: 'Robocon Lab assembly',
    src: '/images/projects/gn4rly-lab-assembly.jpg',
    alt: 'NITK Battle Bots members assembling a robot at the Robocon Lab workbench.',
    caption:
      'Assembly at the Robocon Lab. Photo from the NITK Battle-Bots club proposal.',
    framing: 'wide-crop',
    thumbnail: withDimensions({
      src: '/images/projects/gn4rly-2-5-assembly.jpg',
      alt: 'GN4RLY 2.5 on the workbench with its chassis, weapon assembly and drivetrain exposed.',
      label: 'GN4RLY 2.5 assembly',
    }),
  }),
  'adaptive-suspension-rover': withDimensions({
    label: 'Suspension module CAD',
    src: '/images/projects/rover-suspension-module-cad.png',
    alt: 'Isometric CAD view of one rover suspension module with its wheel, pivoting linkage, and spring preload assembly.',
    caption:
      'One suspension module from the CY06 rover CAD, shown apart from the chassis so the wheel carrier, linkage, and spring preload assembly are visible.',
  }),
  'tensegrity-joint': withDimensions({
    label: 'Assembled knee · support network',
    src: '/images/projects/tensegrity-knee-support-assembly.webp',
    alt: 'Two views of the assembled tensegrity knee with red support tendons fastened to collars on the amber tristar and pins on the blue and teal frames.',
    caption:
      'The 12 support tendons join collars on the floating tristar to pins at the Y-frame tips. The fittings are illustrative, and the femoral frame is set slightly outward to give the parts clearance.',
  }),
  kneeassist: withDimensions({
    label: 'Knee-assistance CAD',
    src: '/images/projects/knee-assistance-cad.png',
    alt: 'Original CAD screenshot of the actuated knee-assistance design, showing the brace, rails, cuffs, motor, spring, and cable drive.',
    caption:
      'Original CAD screenshot of the actuated knee-assistance design. Procurement and bench testing are the next steps.',
  }),
  'reaction-wheel-microvibrations': withDimensions({
    label: 'COMSOL project screenshot',
    src: '/images/projects/spacecraft-comsol-model.png',
    alt: 'COMSOL screenshot from the spacecraft vibration pilot, with the satellite structure and camera-support response visible.',
    caption:
      'COMSOL model screenshot from the project’s Reaction Wheel Vibration and Camera Pointing Jitter presentation. The displayed case is a 5 Hz unit-force response; it is a numerical result.',
  }),
  'four-bar-door-mechanism': withDimensions({
    label: 'Twin-lid mechanism CAD',
    src: '/images/projects/four-bar-twin-lid-cad.png',
    alt: 'CAD view of two raised lids linked to one shared crank by a blue rod and a green rod.',
    caption:
      'The later parametric CAD reconstruction with both lids open to 75°.',
  }),
  'uncertainty-aware-navigation': withDimensions({
    label: 'Navigation simulation output',
    src: '/images/projects/navigation-trajectory.png',
    alt: 'Four simulation plots showing the route, localisation error, commanded speed, and gyro bias.',
    caption:
      'One successful nominal adaptive run from the project’s simulation.',
  }),
} satisfies Record<string, ProjectImage>;

function demoImage(
  filename: string,
  label: string,
  alt: string,
  caption: string,
): ProjectImage {
  return withDimensions({
    src: `/images/projects/${filename}.jpg`,
    label,
    alt,
    caption,
    framing: 'full-frame',
  });
}

export const additionalProjectImages: Partial<Record<string, ProjectImage>> = {
  'finite-element-beams-and-frames': demoImage(
    'fem-mesh-convergence',
    'MATLAB convergence plots',
    'Two charts compare beam and frame displacement errors as element counts increase.',
    'The team’s MATLAB plots of displacement error from the ANSYS mesh-refinement runs.',
  ),
  'portfolio-website': demoImage(
    'portfolio-website',
    'Portfolio screenshot',
    'The About page with a portrait, biography, and three navigation links.',
    'The portfolio’s About page after the three-page redesign.',
  ),
  'iste-project-brochure': demoImage(
    'iste-project-brochure',
    'Live brochure',
    'The ISTE NITK project brochure landing page with the project count and eight tracks.',
    'Screenshot of the published ISTE NITK project brochure.',
  ),
  restia: demoImage(
    'restia-v2',
    'Restia V2 screenshot',
    'The Restia workspace showing connection and invitation options in Messages.',
    'The Messages screen from the public Restia V2 documentation.',
  ),
  'alive-workspace': demoImage(
    'alive-workspace',
    'Local sketch preview',
    'A small lit house and desk with drifting particles against a dark background.',
    'The p5.js sketch running locally after repairs to the drawing loop.',
  ),
  'iste-industry-analysis': demoImage(
    'iste-industry-analysis',
    'Live research site',
    'The Indian Liquor Industry Disruption Analysis dashboard with navigation for market, policy, and risks.',
    'Screenshot of the published ISTE research site.',
  ),
  bondos: demoImage(
    'bondos',
    'Public sign-in screen',
    'The BondOS public entry screen with sign-in and account creation tabs.',
    'The public BondOS entry screen.',
  ),
  'thinkify-website': demoImage(
    'thinkify-website',
    'Live hiring site',
    'Thinkify’s hiring website with navigation for companies and developers.',
    'The later Thinkify hiring website as deployed.',
  ),
  'thinkify-intake': demoImage(
    'thinkify-intake',
    'Live intake flow',
    'Thinkify’s first intake screen with company and developer choices.',
    'The role-selection screen at the start of the intake flow.',
  ),
  'nh66-fund-website': demoImage(
    'nh66-fund-website',
    'Live recruitment page',
    'The NH66 Fund recruitment page introducing the student fund.',
    'The public NH66 Fund recruitment page.',
  ),
  'thinkify-quiz': demoImage(
    'thinkify-quiz',
    'Live quiz platform',
    'The Thinkify Quiz landing page with options to start learning or browse content.',
    'The public landing page of the later Thinkify Quiz platform.',
  ),
};
