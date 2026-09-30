import type { ModelKind } from '@/lib/engineering-scene';
export type Project = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  discipline: string;
  period: string;
  status: 'Ongoing' | 'Completed';
  context: string;
  tools: string[];
  summary: string;
  question: string;
  role: string;
  approach: { title: string; body: string }[];
  outcome: string;
  scope: string;
  evidence: string[];
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption: string;
    referenceUrl?: string;
  };
  model:
    | ModelKind
    | 'navigation'
    | 'linkage'
    | 'electronics'
    | 'collection'
    | 'wallet';
  visualLabel: string;
};
export const projects: Project[] = [
  {
    slug: 'adaptive-suspension-rover',
    number: '01',
    title: 'Adaptive suspension rover',
    shortTitle: 'Adaptive suspension & vibration-aware control',
    discipline: 'Field robotics',
    period: 'Sep 2026 — Present',
    status: 'Ongoing',
    context: 'Research & staged hardware development',
    model: 'rover',
    visualLabel: 'SIX-WHEEL ROVER / CONCEPT STUDY',
    tools: [
      'Variable-stiffness suspension',
      'IMU & encoders',
      'Control design',
    ],
    summary:
      'A six-wheel rover that changes suspension stiffness when the ride gets rough—and checks whether the change helped.',
    question:
      'Can a rover reduce vibration by changing its suspension before it has to slow down?',
    role: 'I am designing a six-wheel rover with adjustable spring leverage. The suspension moves between soft, medium, and stiff settings, then mechanically locks the selected setting.',
    approach: [
      {
        title: 'Start with one suspension unit',
        body: 'Build and evaluate one adjustable unit before committing to the full rover. Vary spring leverage to get three stiffness settings, with a mechanical lock at each setting.',
      },
      {
        title: 'Measure, adjust, then measure again',
        body: 'Use IMU and wheel-encoder data to detect sustained vibration. Change stiffness, verify the setting, and assess the new vibration level. Reduce speed only when needed.',
      },
      {
        title: 'Compare the alternatives',
        body: 'Plan rough-terrain tests comparing fixed stiffness, speed-only control, stiffness-only control, and the combined system.',
      },
    ],
    outcome:
      'The rover is in the design stage. Development is planned from one suspension unit through a complete rough-terrain test.',
    scope:
      'Ongoing design and staged hardware development. Full-system performance comparisons are planned work.',
    evidence: [
      'Three mechanically locked stiffness settings',
      'IMU and encoder feedback architecture',
      'Four planned control comparisons',
    ],
  },
  {
    slug: 'tensegrity-joint',
    number: '02',
    title: 'Tensegrity variable-stiffness joint',
    shortTitle: 'Tensegrity-based variable-stiffness joint',
    discipline: 'Compliant mechanisms',
    period: 'May 2026 — Present',
    status: 'Ongoing',
    context: 'Research project',
    model: 'tensegrity',
    visualLabel: 'TENSEGRITY JOINT / GEOMETRY & FORCE',
    image: {
      src: '/images/projects/tensegrity-joint-cad.webp',
      width: 1200,
      height: 1200,
      alt: 'CAD reconstruction of a tensegrity knee joint, showing crossed tension members, connectors, and cable routing',
      caption:
        'CAD reconstruction for mechanism study, based on Mortensen et al. (2025).',
      referenceUrl: 'https://arxiv.org/abs/2504.19685',
    },
    tools: ['MATLAB', 'Member-force modeling', 'Mechanism design'],
    summary:
      'Exploring how a tensegrity joint changes its stiffness through geometry and internal force distribution.',
    question:
      'How can geometry and internal forces make the same joint respond differently to a load?',
    role: 'I use MATLAB to calculate member forces, joint response, and stiffness across different geometries and external loads.',
    approach: [
      {
        title: 'Follow the forces',
        body: 'Calculate how tension and compression are distributed among the joint members under external loading.',
      },
      {
        title: 'Change the geometry',
        body: 'Compare the joint response and stiffness across different geometries and load cases in MATLAB.',
      },
      {
        title: 'Let the model guide the mechanism',
        body: 'Use the results to guide a tensegrity-based joint design, with an exoskeleton or wearable robotic mechanism as a possible later application.',
      },
    ],
    outcome:
      'The computational study is informing the design of a variable-stiffness joint.',
    scope:
      'Ongoing modeling and design. A wearable application is a future direction, not a validated device.',
    evidence: [
      'MATLAB member-force calculations',
      'Geometry and loading comparisons',
      'Stiffness-informed design direction',
    ],
  },
  {
    slug: 'kneeassist',
    number: '03',
    title: 'KneeAssist',
    shortTitle: 'Actuated brace for knee extension deficit',
    discipline: 'Assistive mechatronics',
    period: 'Sep 2026',
    status: 'Completed',
    context: 'Team project · Incubate X Prosthetic Challenge',
    model: 'knee',
    visualLabel: 'ACTUATED BRACE / CONCEPT ASSEMBLY',
    tools: ['CAD & integration', 'Angle sensing', 'Cable-and-spring drive'],
    summary:
      'An actuated brace concept that senses knee angle, preserves active extension, and adds controlled assistance.',
    question:
      'How can a brace assist knee extension while allowing the patient to keep doing the work?',
    role: 'I helped turn the team CAD into a buildable system: adjustable rails and cuffs, a motor drive, angle sensing, power protection, and an independent manual release.',
    approach: [
      {
        title: 'Sense before assisting',
        body: 'Start with the knee angle and the patient’s active extension. Add controlled cable-and-spring assistance when needed.',
      },
      {
        title: 'Make the assembly buildable',
        body: 'Integrate adjustable rails, cuffs, actuation, sensing, and power protection. Include an independent manual release.',
      },
      {
        title: 'Define the bench checks',
        body: 'Plan tests for angle accuracy, spring force, assisted motion, jam release, faults, and cycle life.',
      },
    ],
    outcome:
      'Our team was selected in the top 5 of 70 teams nationwide in the Incubate X Prosthetic Challenge.',
    scope:
      'Completed team concept and integration work. Bench tests were planned; clinical efficacy and patient outcomes are not established.',
    evidence: [
      'Top 5 of 70 teams nationwide',
      'Buildable system integration',
      'Six categories of planned bench checks',
    ],
  },
  {
    slug: 'reaction-wheel-microvibrations',
    number: '04',
    title: 'Reaction-wheel microvibrations',
    shortTitle: 'Reaction-wheel microvibration prediction',
    discipline: 'Structural dynamics',
    period: 'Aug — Oct 2026',
    status: 'Completed',
    context: 'FEM & machine-learning study',
    model: 'satellite',
    visualLabel: 'SATELLITE PANEL / VIBRATION PATH',
    image: {
      src: '/images/projects/reaction-wheel-reference-cad.webp',
      width: 1500,
      height: 1125,
      alt: 'Project reference CAD showing a sectioned reaction wheel inside a satellite structure',
      caption:
        'Reference assembly from the project CAD. Surface finishes are illustrative.',
    },
    tools: ['ANSYS Mechanical', 'Modal & harmonic FEM', 'Regression'],
    summary:
      'Following reaction-wheel vibration through a satellite panel to a camera mounting point, with a peak near 5,800 rpm.',
    question:
      'Where does a reaction wheel excite the structure—and can a faster model capture the response?',
    role: 'I built modal and harmonic FEM models of the satellite panel and camera mounting interface, then checked a strong response peak by refining the mesh.',
    approach: [
      {
        title: 'Model the vibration path',
        body: 'Use modal and harmonic FEM to follow reaction-wheel excitation through the panel to the camera mounting point.',
      },
      {
        title: 'Check the peak',
        body: 'Locate a strong camera-response peak near 5,800 rpm. Refine the mesh to test numerical sensitivity; the peak changed by 0.33%.',
      },
      {
        title: 'Explore a faster predictor',
        body: 'Set up a 24-design parameter sweep and a held-out regression workflow to explore structural-response prediction, especially near resonance.',
      },
    ],
    outcome:
      'The FEM study identified a strong response peak near 5,800 rpm. Mesh refinement changed that peak by 0.33%. A 24-design sweep and held-out regression workflow were set up.',
    scope:
      'Computational study. The 0.33% figure describes mesh-refinement sensitivity, not prediction error. No measured flight or hardware vibration result is claimed.',
    evidence: [
      'Response peak near 5,800 rpm',
      '0.33% change after mesh refinement',
      '24-design parameter sweep',
    ],
  },
  {
    slug: 'off-road-leaf-robot',
    number: '05',
    title: 'Off-road leaf-collection robot',
    shortTitle: 'Off-road leaf-collection robot',
    discipline: 'Robot architecture',
    period: 'Jul 2026 — Present',
    status: 'Ongoing',
    context: 'Robot design & subsystem architecture',
    model: 'collection',
    visualLabel: 'PICKUP / TRANSFER / TERRAIN FOLLOWING',
    tools: [
      'Subsystem architecture',
      'Mechanism selection',
      'BOM & test planning',
    ],
    summary:
      'Working out how to collect dry or wet leaves on uneven ground without pulling in too much soil.',
    question: 'How do you pick up the leaves without picking up the ground?',
    role: 'I broke the robot into locomotion, pickup, transfer, storage, and terrain-following systems, then compared mechanisms against space, manufacturing, and integration limits.',
    approach: [
      {
        title: 'Separate the functions',
        body: 'Define what locomotion, pickup, transfer, storage, and terrain following each need to do.',
      },
      {
        title: 'Compare mechanisms in context',
        body: 'Evaluate mechanism ideas against packaging, manufacturing, and integration constraints rather than selecting them in isolation.',
      },
      {
        title: 'Prepare the next decision',
        body: 'Build a bottom-up BOM and define tests for traction, pickup efficiency, soil rejection, and endurance.',
      },
    ],
    outcome:
      'A subsystem architecture, bottom-up BOM, and test criteria support the next design decisions.',
    scope:
      'Ongoing design. Collection performance and field endurance have not yet been established.',
    evidence: [
      'Five subsystem groups',
      'Bottom-up BOM',
      'Four defined test areas',
    ],
  },
  {
    slug: 'neoleg-knee-mechanism',
    number: '06',
    title: 'NeoLeg: passive knee assistance',
    shortTitle: 'Passive spring-assisted knee mechanism',
    discipline: 'Mechanical design',
    period: 'Dec 2025 — Mar 2026',
    status: 'Completed',
    context: 'Team mechanism-design project',
    model: 'linkage',
    visualLabel: 'PASSIVE KNEE / SPRING GEOMETRY',
    tools: ['SolidWorks', 'ANSYS', 'Interference checks'],
    summary:
      'Exploring passive spring assistance for squatting and lifting, through assembly geometry and modeled motion.',
    question:
      'Can a passive spring assist knee motion without making the mechanism bulky or restrictive?',
    role: 'I helped build and refine the knee assembly in SolidWorks, and used ANSYS and interference checks to evaluate modeled flexion.',
    approach: [
      {
        title: 'Build the assembly',
        body: 'Develop the spring-assisted knee layout in SolidWorks and refine the relationships between the moving parts.',
      },
      {
        title: 'Check the motion',
        body: 'Use ANSYS and interference checks to assess whether the assembly can move through its modeled flexion range.',
      },
      {
        title: 'Compare spring locations',
        body: 'Study how spring positions and attachment geometry affect usable motion and the assist concept.',
      },
    ],
    outcome:
      'The completed design study compared spring layouts and evaluated the assembly’s modeled motion.',
    scope:
      'Design and simulation work. Modeled motion is distinct from measured human assistance or physical performance.',
    evidence: [
      'SolidWorks assembly',
      'ANSYS and interference checks',
      'Spring-position comparisons',
    ],
  },
  {
    slug: 'uncertainty-aware-navigation',
    number: '07',
    title: 'Robot navigation with A* & EKF',
    shortTitle: 'Uncertainty-aware indoor robot navigation',
    discipline: 'State estimation & autonomy',
    period: 'Sep — Dec 2025',
    status: 'Completed',
    context: 'Differential-drive simulation project',
    model: 'navigation',
    visualLabel: 'PLANNING / LOCALIZATION / RECOVERY',
    tools: ['Python', 'A* & EKF', 'Monte Carlo'],
    summary:
      'An indoor robot simulator that slows down or recovers when its confidence in its own position drops.',
    question:
      'What should a robot do when it no longer trusts its position estimate?',
    role: 'I built a differential-drive simulator with A* planning, heading control, encoders, an IMU, and extended Kalman filter localization.',
    approach: [
      {
        title: 'Build the navigation loop',
        body: 'Connect differential-drive motion, A* path planning, heading control, sensing, and EKF localization.',
      },
      {
        title: 'Make the robot imperfect',
        body: 'Add encoder noise, IMU drift, yaw bias, and wheel slip. Use confidence-aware logic to slow down or recover.',
      },
      {
        title: 'Look for failure',
        body: 'Run Monte Carlo trials and track success, collisions, localization error, recovery events, and time to goal.',
      },
    ],
    outcome:
      'Completed a simulation and Monte Carlo evaluation workflow for uncertainty-aware speed and recovery behavior.',
    scope: 'A simulation study, not a physical indoor-robot deployment.',
    evidence: [
      'Differential-drive simulator',
      'Deliberately imperfect sensors',
      'Five evaluation measures',
    ],
  },
  {
    slug: 'four-bar-door-mechanism',
    number: '08',
    title: 'Four-bar linkage',
    shortTitle: 'Four-bar door-opening mechanism',
    discipline: 'Kinematics & fabrication',
    period: 'Feb — Apr 2024',
    status: 'Completed',
    context: 'Team build',
    model: 'linkage',
    visualLabel: 'LINK LENGTHS / PIVOTS / DOOR MOTION',
    tools: ['Linkage design', 'Kinematics', 'Team fabrication'],
    summary:
      'A physical four-bar door-opening mechanism, developed from the motion we wanted to a set of links and joints.',
    question:
      'Which link lengths and pivot positions produce the door motion we want?',
    role: 'I worked with my team to build a four-bar mechanism and choose link lengths and pivot locations within its kinematic limits.',
    approach: [
      {
        title: 'Start with the motion',
        body: 'Define the desired door movement before fixing the linkage geometry.',
      },
      {
        title: 'Work through the geometry',
        body: 'Choose link lengths and pivots to coordinate the door motion while respecting the mechanism’s kinematic limits.',
      },
      {
        title: 'Build and observe',
        body: 'Turn the geometry into a physical mechanism and observe how small link changes affect the whole movement.',
      },
    ],
    outcome: 'Built a working door-opening mechanism with the team.',
    scope:
      'An educational team build focused on mechanism geometry and coordinated motion.',
    evidence: [
      'Physical links, pivots, and joints',
      'Kinematic layout development',
      'Working team-built mechanism',
    ],
  },
  {
    slug: 'easy-access-wallet',
    number: '09',
    title: 'Wallet Shield',
    shortTitle: 'Wallet for easier card access',
    discipline: 'User-centred mechanical design',
    period: 'Sep — Nov 2023',
    status: 'Completed',
    context: 'Design project',
    model: 'wallet',
    visualLabel: 'USER PROBLEM / MECHANICAL RESPONSE',
    tools: ['Problem framing', 'Mechanical design', 'Layout development'],
    summary:
      'A compact wallet layout developed around a small, familiar frustration: getting a card out quickly.',
    question:
      'How can a compact card holder make its contents easier to reach?',
    role: 'I developed a wallet layout around easier card access and turned that observation into a tangible mechanical design idea.',
    approach: [
      {
        title: 'Notice the friction',
        body: 'Start with the difficulty of pulling cards out of compact holders.',
      },
      {
        title: 'Design around access',
        body: 'Develop the layout around reaching and retrieving a card, rather than starting with a preferred mechanism.',
      },
      {
        title: 'Carry the lesson forward',
        body: 'Use the project to practise a design rule: begin with the user problem, then build the mechanism around it.',
      },
    ],
    outcome: 'Developed a mechanical design concept for easier card access.',
    scope:
      'An early design project. No production or user-study performance claim is made.',
    evidence: [
      'Observed access problem',
      'User-centred layout',
      'Tangible mechanical design idea',
    ],
  },
  {
    slug: 'solar-smart-home',
    number: '10',
    title: 'Arduino home & solar models',
    shortTitle: 'Arduino smart home with solar power',
    discipline: 'Electronics & sensing',
    period: 'Sep 2019 — Jan 2020',
    status: 'Completed',
    context: 'Working electronic model',
    model: 'electronics',
    visualLabel: 'SENSORS / LOGIC / SOLAR POWER',
    tools: ['Arduino', 'Sensor integration', 'Circuit debugging'],
    summary:
      'An Arduino smart-home model that connected sensors, automated functions, and a photovoltaic power source.',
    question:
      'How do several sensors and automated functions work reliably as one system?',
    role: 'I designed the wiring and control logic, debugged the connections and code, and added a photovoltaic cell power source.',
    approach: [
      {
        title: 'Connect the functions',
        body: 'Bring several sensors and automated functions into one wired Arduino-based model.',
      },
      {
        title: 'Debug the system',
        body: 'Work through connections and code until the functions operate reliably together.',
      },
      {
        title: 'Change the power source',
        body: 'Test how the model behaves when powered from the photovoltaic cell instead of only an external supply.',
      },
    ],
    outcome:
      'Built and debugged a working smart-home model with a solar-power option.',
    scope:
      'A model-scale electronics project, not a deployed building-control system.',
    evidence: [
      'Integrated sensor inputs',
      'Wired control logic',
      'Photovoltaic power testing',
    ],
  },
  {
    slug: 'traffic-and-elevated-bus',
    number: '11',
    title: 'Traffic signals & elevated-bus models',
    shortTitle: 'Traffic lights & elevated-bus model',
    discipline: 'Logic & working models',
    period: 'Sep 2018 — Jan 2019',
    status: 'Completed',
    context: 'Two electronic model builds',
    model: 'electronics',
    visualLabel: 'LOGIC GATES / SIGNALS / SEQUENCING',
    tools: ['Logic gates', 'Circuit wiring', 'Fault tracing'],
    summary:
      'Hand-wired traffic-light and transit elevated-bus models, with repeatable control sequences built from logic gates.',
    question: 'How can a wired circuit create a reliable operating sequence?',
    role: 'I built both models, wired the circuits by hand, and used logic gates to control their operating sequences.',
    approach: [
      {
        title: 'Sequence the junction',
        body: 'Create a logic-gate signal sequence and connect the traffic lights so the junction follows a repeatable pattern.',
      },
      {
        title: 'Build a separate control circuit',
        body: 'Wire the operating sequence for the elevated-bus model independently.',
      },
      {
        title: 'Trace faults',
        body: 'Follow connection and logic faults until each model behaves consistently.',
      },
    ],
    outcome: 'Built two working electronic models with repeatable sequences.',
    scope:
      'Early model-scale projects in circuit wiring, logic, and debugging.',
    evidence: [
      'Two working models',
      'Hand-wired circuits',
      'Logic-gate control sequences',
    ],
  },
];
