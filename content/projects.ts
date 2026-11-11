import { projectImages } from '@/content/project-images';
import type { ModelKind } from '@/lib/engineering-scene';
export type Project = {
  slug: string;
  number: string;
  title: string;
  discipline: string;
  period?: string;
  status: 'Ongoing' | 'Completed';
  earlierWork?: boolean;
  context: string;
  tools: string[];
  summary: string;
  question: string;
  role?: string;
  approach: { title: string; body: string }[];
  outcome: string;
  scope: string;
  evidence: string[];
  image?: {
    kind?: 'documentation' | 'illustration' | 'stock' | 'reference';
    label?: string;
    referenceLabel?: string;
    licenseUrl?: string;
    fit?: 'cover' | 'contain';
    src: string;
    alt: string;
    width: number;
    height: number;
    caption: string;
    referenceUrl?: string;
    thumbnail?: {
      src: string;
      alt: string;
      width: number;
      height: number;
      label: string;
    };
  };
  model?:
    | ModelKind
    | 'navigation'
    | 'linkage'
    | 'electronics'
    | 'collection'
    | 'wallet';
  visualLabel?: string;
};

export const battleBots: Project = {
  slug: 'nitk-battle-bots',
  number: '12',
  title: 'Combat Robot Development',
  discipline: 'Combat robotics',
  status: 'Ongoing',
  context: 'Team mechanical design · NITK Battle Bots',
  tools: [],
  image: projectImages['nitk-battle-bots'],
  summary:
    'At NITK Battle Bots, we designed a 3 lb flipper with a one-piece chassis and built the 15 kg GN4RLY 2.5. We’re using what we learned in competition to design a 7 kg successor.',
  question:
    'How do the weight limit and weapon change what a combat robot needs from its chassis?',
  approach: [
    {
      title: '3 lb Jelly Baby–inspired flipper',
      body: 'Integrate the main chassis into one piece while keeping the front low and giving the flipper room to rise.',
    },
    {
      title: 'GN4RLY 2.5: sponsored 15 kg hammer saw bot',
      body: 'Use stronger chassis materials and design the frame around the weapon arm’s motion and impact loads.',
    },
    {
      title: 'Next GN4RLY (7 kg)',
      body: 'Revisit the layout of the weapon, drivetrain and chassis for the lighter class.',
    },
  ],
  outcome: 'We designed a unibody flipper and assembled the 15 kg GN4RLY 2.5.',
  scope:
    'We assembled GN4RLY 2.5 in the Robocon Lab and are developing its 7 kg successor.',
  evidence: [
    '3 lb unibody flipper design',
    'GN4RLY 2.5 assembly photo from the team proposal',
    'Event photo',
  ],
};

export const projects: Project[] = [
  battleBots,
  {
    slug: 'uav-vibration-integration',
    number: '06',
    title: 'UAV Vibration Analysis & Isolation',
    discipline: 'UAV hardware',
    period: 'Jun — Jul 2026',
    status: 'Completed',
    context: 'Product internship · Vayu Aerospace Pvt. Ltd., Bengaluru',
    model: 'electronics',
    visualLabel: 'FLIGHT CONTROLLER / MOUNTING STUDY',
    image: projectImages['uav-vibration-integration'],
    tools: ['ANSYS Mechanical', 'MATLAB', 'IMU log analysis'],
    summary:
      'I compared three ways to mount a UAV flight controller at Vayu Aerospace. Ground motor tests helped us choose an elastomer-isolated tray.',
    question:
      'Which mounting arrangement keeps motor vibration away from the flight controller?',
    role: 'As a Product Intern at Vayu Aerospace Pvt. Ltd., I investigated vibration transmission from the motors through the airframe to the flight-controller IMU, compared three mounts in ANSYS, and integrated and ground-tested the shortlisted designs.',
    approach: [
      {
        title: 'Compare rigid, isolated, and suspended mounts',
        body: 'Evaluate a rigid baseline, an elastomer-isolated modular tray, and a suspended mount. Use ANSYS modal and response analysis to shortlist two isolation concepts for hardware evaluation.',
      },
      {
        title: 'Integrate and ground-test the shortlisted mounts',
        body: 'Check CAD fit, clearances, cable slack, fasteners, and controller orientation during integration. Test the assembled mounts through ground motor runs.',
      },
      {
        title: 'Analyze IMU time histories, RMS, and FFT spectra',
        body: 'Use MATLAB to compare consistent operating windows, RMS vibration, and frequency spectra. Contribute to the selection of the elastomer-isolated modular tray.',
      },
    ],
    outcome:
      'The team selected the elastomer-isolated modular tray after simulation and hardware evaluation. My contribution covered mount modeling, hardware integration, ground tests, and IMU analysis.',
    scope:
      'Internship work covering vibration-path modeling, hardware integration, and ground motor-run testing.',
    evidence: [
      'Three mounting arrangements compared',
      'Two isolation concepts shortlisted for hardware evaluation',
      'MATLAB RMS and FFT analysis of IMU logs',
    ],
  },
  {
    slug: 'adaptive-suspension-rover',
    number: '01',
    title:
      'Variable-Stiffness Suspension and Vibration-Aware Control for a Rough-Terrain Rover',
    discipline: 'Field robotics · Suspension and control',
    period: 'Sep 2026 — Present',
    status: 'Ongoing',
    context: 'Mechanical design and control development',
    model: 'rover',
    visualLabel: 'SIX-WHEEL ROVER / CONCEPT STUDY',
    image: projectImages['adaptive-suspension-rover'],
    tools: [
      'Variable-stiffness suspension',
      'IMU & encoders',
      'Control design',
    ],
    summary:
      'We designed a six-wheel inspection rover with a motor that can adjust the spring preload at each wheel. The goal is to keep the rover’s body steadier over rough ground at the same speed.',
    question:
      'Can a rover reduce vibration by changing its suspension before it has to slow down?',
    role: 'I’m developing a six-wheel rover with one motor-driven preload carriage per suspension module. The carriage holds the selected preload while wheel travel remains passive.',
    approach: [
      {
        title: 'Design a guided suspension with adjustable preload',
        body: 'A fine-pitch screw moves each preload carriage by up to 6 mm. The design uses three compression links, three elastic tension paths, and a holding lock.',
      },
      {
        title: 'Detect vibration, reconfigure, and verify',
        body: 'Measure vibration on the wheel carriers and the chassis. Stop to adjust preload, confirm position and lock feedback, then resume and reassess vibration before reducing travel speed.',
      },
      {
        title: 'Compare four control strategies',
        body: 'Plan rough-terrain tests comparing fixed stiffness, speed-only control, stiffness-only control, and the combined system.',
      },
    ],
    outcome:
      'Developed the rover layout, suspension concepts, feedback strategy, and test plan. The next step is to evaluate a single suspension unit before testing the complete platform.',
    scope:
      'The complete rover is documented in CAD. The next step is a loaded test of one suspension module to measure its force–travel response and verify that the lock holds without power.',
    evidence: [
      'Six guided suspension modules in CAD',
      'Wheel-carrier and chassis acceleration measurements planned',
      'Four planned control comparisons',
    ],
  },
  {
    slug: 'tensegrity-joint',
    number: '03',
    title:
      'Tensegrity-Based Variable-Stiffness Knee Joint for a Knee Exoskeleton',
    discipline: 'Tensegrity · Knee exoskeletons',
    period: 'May 2026 — Present',
    status: 'Ongoing',
    context: 'Joint modeling and preliminary mechanical design',
    model: 'tensegrity',
    visualLabel: 'KNEE JOINT / GEOMETRY / INTERNAL FORCE / STIFFNESS',
    image: projectImages['tensegrity-joint'],
    tools: ['MATLAB', 'Member-force modeling', 'Mechanism design'],
    summary:
      'This knee joint uses 12 tendons to suspend a three-armed piece between two rigid frames. I’m using MATLAB to find out how much initial tension the tendons need to stay taut under load.',
    question:
      'How can geometry and internal forces make the same joint respond differently to a load?',
    role: 'I’m modeling the joint’s force and stiffness response in MATLAB and developing a support network with two Y-frames and a floating tristar.',
    approach: [
      {
        title: 'Model member forces and joint response',
        body: 'Calculate how tension and compression are distributed among the joint members under external loading.',
      },
      {
        title: 'Compare geometry, external loading, and internal force',
        body: 'Vary geometry, external loading, and internal force in MATLAB to identify the design variables with the strongest influence on force output and joint stiffness.',
      },
      {
        title: 'Narrow the physical prototype configurations',
        body: 'Use the analysis to narrow the design space to a smaller set of configurations for a physical knee-exoskeleton prototype.',
      },
    ],
    outcome:
      'Narrowed the joint configurations through force and stiffness analysis, then developed a preliminary layout and static sizing calculations. Detailed CAD, assembly checks, and bench validation remain in progress.',
    scope:
      'Ongoing computational and preliminary mechanical design. Static calculations do not establish whole-joint stability, fatigue life, or suitability for human use.',
    evidence: [
      'MATLAB member-force calculations',
      'Geometry, external-load, and internal-force comparisons',
      'Design variables ranked by influence on force and stiffness',
      'Configurations narrowed for a physical knee-exoskeleton prototype',
    ],
  },
  {
    slug: 'kneeassist',
    number: '05',
    title: 'Actuated Knee-Assistance System',
    discipline: 'Assistive mechatronics',
    period: 'Oct 2025 — Sep 2026',
    status: 'Completed',
    context: 'Passive concept to actuated brace · Team project',
    model: 'knee',
    visualLabel: 'PASSIVE MECHANISM / ACTUATED ASSISTANCE',
    image: projectImages['kneeassist'],
    tools: ['SolidWorks', 'ANSYS', 'Angle sensing', 'Cable-and-spring drive'],
    summary:
      'We developed a passive spring mechanism into a brace that uses a motor and cable to assist knee extension. Our team placed in the top five at the Incubate X Prosthetic Challenge.',
    question:
      'How can a knee mechanism assist movement while the user continues to extend actively?',
    role: 'I worked on the passive spring-assisted mechanism, refined the assembly in SolidWorks, and checked its motion in ANSYS. We then extended it into an actuated brace and defined a procurement-ready system with drive, sensing, power protection, and an independent manual release.',
    approach: [
      {
        title: 'Develop the passive spring-assisted mechanism',
        body: 'Study how spring placement and joint geometry change the assistance available through knee motion. Model and refine the assembly in SolidWorks, then use ANSYS and interference checks to compare workable layouts.',
      },
      {
        title: 'Add knee-angle tracking and cable-and-spring actuation',
        body: 'Extend the passive concept into a brace that tracks knee angle and adds controlled cable-and-spring assistance while the user extends actively.',
      },
      {
        title: 'Define drive, sensing, power, and manual release',
        body: 'Define the drive, sensing, power, adjustable rails, cuffs, and independent manual release as one integrated system.',
      },
      {
        title: 'Define the bench-test architecture',
        body: 'Plan checks for angle accuracy, spring force, assisted motion, jam release, faults, and cycle life before physical validation.',
      },
    ],
    outcome:
      'The design reached a procurement-ready system. Our team placed in the top 5 of 70 teams nationwide in the Incubate X Prosthetic Challenge.',
    scope:
      'Completed design and system-definition work, from the passive concept to the actuated brace. Procurement and bench testing remain the next steps.',
    evidence: [
      'Passive spring-assisted mechanism developed in SolidWorks and ANSYS',
      'Angle sensing and controlled cable-and-spring assistance',
      'Procurement-ready system definition',
      'Top 5 of 70 teams nationwide',
    ],
  },
  {
    slug: 'reaction-wheel-microvibrations',
    number: '04',
    title:
      'Physics-Informed Multi-Fidelity FEM Surrogate for Reaction-Wheel-Induced Spacecraft Microvibration and Payload Jitter',
    discipline: 'Spacecraft dynamics · Physics-informed machine learning',
    period: 'Aug — Oct 2026',
    status: 'Completed',
    context: 'Computational study · 5–20 Hz reduced-model pilot',
    model: 'satellite',
    visualLabel: 'REACTION WHEEL / SPACECRAFT / PAYLOAD JITTER',
    image: projectImages['reaction-wheel-microvibrations'],
    tools: [
      'COMSOL Multiphysics',
      'Modal and harmonic-response analysis',
      'Reduced-order models',
      'MLP & DeepONet',
      'Physics-informed multi-fidelity learning',
    ],
    summary:
      'I built a faster model of how vibration from four reaction wheels reaches a spacecraft camera. I used it to test whether a stiffer mount would improve the simulated pointing response over 5–20 Hz.',
    question:
      'Can a multi-fidelity surrogate preserve resonance and physics while predicting spacecraft microvibration and payload jitter efficiently?',
    role: 'I worked on the spacecraft structural model, wheel-to-camera response calculations, reduced equations, and comparisons between neural predictors. The current pilot uses a 52-coordinate reduced model and separates complete structural configurations for training, validation, and testing.',
    approach: [
      {
        title: 'Model the coupled wheel–spacecraft–payload system',
        body: 'Use modal and harmonic-response analysis to calculate wheel-to-camera and optical-bench responses. Treat force and moment inputs separately, and estimate relative structural tilt from the camera-support stations.',
      },
      {
        title: 'Check the numerical reference',
        body: 'Compare reduced-model responses with selected full-FEM points. Keep the earlier local mesh check near 5,800 rpm separate from the current 5–20 Hz pilot; neither establishes full-band convergence.',
      },
      {
        title: 'Build and compare multi-fidelity surrogates',
        body: 'Compare MLP and DeepONet response predictors, then examine physics-residual training and transfer between 36- and 52-coordinate reduced models. Report reduced-model and full-FEM comparisons separately.',
      },
      {
        title: 'Use scenario studies to question a design change',
        body: 'Explore assumed stiffness, damping, and wheel-disturbance scenarios. Compare the apparent design gain with numerical and prediction error before recommending a change.',
      },
    ],
    outcome:
      'Completed a computational pilot with structural response curves, trained neural predictors, held-out configuration tests, and selected full-FEM checks. The scenario study supported retaining the nominal design because prediction error exceeded the candidate’s small apparent gain.',
    scope:
      'Computational pilot over 5–20 Hz. Neural training uses reduced-model labels; selected full-FEM points provide a separate numerical check. Global convergence, measured wheel inputs, and experimental pointing validation remain open.',
    evidence: [
      '52-coordinate reduced model: 36 modes and 16 response corrections',
      'Configuration-level train, validation, and test separation',
      'Full-FEM checks reported separately from reduced-model prediction errors',
      'MLP, DeepONet, and physics-informed/multi-fidelity comparisons',
      'Scenario exploration and a conservative design decision',
    ],
  },
  {
    slug: 'off-road-leaf-robot',
    number: '02',
    title:
      'Modular Terrain-Adaptive Robot for Leaf Collection on Wet and Undulating Terrain',
    discipline: 'Field robotics · Modular architecture',
    period: 'Jul 2026 — Present',
    status: 'Ongoing',
    context: 'Robot design & subsystem architecture',
    model: 'collection',
    visualLabel: 'PICKUP / TRANSFER / TERRAIN FOLLOWING',
    image: projectImages['off-road-leaf-robot'],
    tools: [
      'Subsystem architecture',
      'Mechanism selection',
      'BOM & test planning',
    ],
    summary:
      'I’m designing a robot to lift dry and wet leaves on uneven ground. The main challenge is keeping the pickup close enough to reach the leaves without pulling in too much soil.',
    question: 'How do you pick up the leaves without picking up the ground?',
    role: 'I broke the robot into locomotion, pickup, transfer, storage, and terrain-following systems, then compared mechanisms against space, manufacturing, and integration limits.',
    approach: [
      {
        title: 'Decompose the platform into five subsystems',
        body: 'Define what locomotion, pickup, transfer, storage, and terrain following each need to do.',
      },
      {
        title: 'Screen pickup concepts against integration constraints',
        body: 'Evaluate mechanism ideas against packaging, manufacturing, and integration constraints rather than selecting them in isolation.',
      },
      {
        title: 'Define traction, pickup, soil-rejection, and endurance tests',
        body: 'Build a bottom-up BOM and define tests for traction, pickup efficiency, soil rejection, and endurance.',
      },
    ],
    outcome:
      'A subsystem architecture, bottom-up BOM, and test criteria support the next design decisions.',
    scope:
      'Architecture and mechanism selection are ongoing. Pickup and endurance tests are planned.',
    evidence: [
      'Five subsystem groups',
      'Bottom-up BOM',
      'Four defined test areas',
    ],
  },
  {
    slug: 'uncertainty-aware-navigation',
    number: '07',
    title: 'Uncertainty-Aware Navigation for an Indoor Mobile Robot',
    discipline: 'State estimation & autonomy',
    period: 'Sep — Dec 2025',
    status: 'Completed',
    context: 'Differential-drive simulation project',
    model: 'navigation',
    visualLabel: 'PLANNING / LOCALIZATION / RECOVERY',
    image: projectImages['uncertainty-aware-navigation'],
    tools: ['Python', 'A* & EKF', 'Monte Carlo'],
    summary:
      'I built a robot simulator to see how a robot should react when wheel slip or noisy sensors make its position uncertain. I tested when it would slow down or try to recover.',
    question:
      'What should a robot do when it no longer trusts its position estimate?',
    role: 'I built a differential-drive simulator with A* planning, heading control, encoders, an IMU, and extended Kalman filter localization.',
    approach: [
      {
        title: 'Connect A* planning, heading control, and EKF localization',
        body: 'Connect differential-drive motion, A* path planning, heading control, sensing, and EKF localization.',
      },
      {
        title: 'Inject encoder noise, IMU drift, yaw bias, and wheel slip',
        body: 'Add encoder noise, IMU drift, yaw bias, and wheel slip. Use confidence-aware logic to slow down or recover.',
      },
      {
        title:
          'Evaluate confidence-aware speed and recovery in Monte Carlo trials',
        body: 'Run Monte Carlo trials and track success, collisions, localization error, recovery events, and time to goal.',
      },
    ],
    outcome:
      'Completed a simulation and Monte Carlo evaluation workflow for uncertainty-aware speed and recovery behavior.',
    scope: 'Simulation and Monte Carlo evaluation.',
    evidence: [
      'Differential-drive simulator',
      'Deliberately imperfect sensors',
      'Five evaluation measures',
    ],
  },
  {
    slug: 'four-bar-door-mechanism',
    number: '08',
    title: 'Four-Bar Linkage Door-Opening Mechanism',
    earlierWork: true,
    discipline: 'Kinematics & fabrication',
    period: 'Feb — Apr 2024',
    status: 'Completed',
    context: 'Team build',
    model: 'linkage',
    visualLabel: 'LINK LENGTHS / PIVOTS / DOOR MOTION',
    image: projectImages['four-bar-door-mechanism'],
    tools: ['Linkage design', 'Kinematics', 'Team fabrication'],
    summary:
      'We built a four-bar mechanism that opens a door. We chose the lengths and pivots of the links around the motion we wanted the door to follow.',
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
    title: 'Wallet for Easier Card Access',
    earlierWork: true,
    discipline: 'User-centred mechanical design',
    period: 'Sep — Nov 2023',
    status: 'Completed',
    context: 'Design project',
    model: 'wallet',
    visualLabel: 'USER PROBLEM / MECHANICAL RESPONSE',
    image: projectImages['easy-access-wallet'],
    tools: ['Problem framing', 'Mechanical design', 'Layout development'],
    summary:
      'I designed a compact wallet concept around the motion of getting a finger under a card and lifting it out of the stack.',
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
        title: 'Develop the layout',
        body: 'Turn the access requirement into a compact mechanical layout.',
      },
    ],
    outcome: 'Developed a mechanical design concept for easier card access.',
    scope: 'An early mechanical design concept for card access.',
    evidence: [
      'Observed access problem',
      'User-centred layout',
      'Tangible mechanical design idea',
    ],
  },
  {
    slug: 'solar-smart-home',
    number: '10',
    title: 'Arduino-Based Smart Home with Solar Power',
    earlierWork: true,
    discipline: 'Electronics & sensing',
    period: 'Sep 2019 — Jan 2020',
    status: 'Completed',
    context: 'Working electronic model',
    model: 'solar',
    visualLabel: 'SENSORS / LOGIC / SOLAR POWER',
    image: projectImages['solar-smart-home'],
    tools: ['Arduino', 'Sensor integration', 'Circuit debugging'],
    summary:
      'I built a small Arduino smart-home model, wired its sensors, and tested it with a solar cell as a second power source.',
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
    scope: 'A working model with integrated sensors and a solar-power option.',
    evidence: [
      'Integrated sensor inputs',
      'Wired control logic',
      'Photovoltaic power testing',
    ],
  },
  {
    slug: 'traffic-and-elevated-bus',
    number: '11',
    title: 'Smart Traffic Light System and Transit Elevated Bus Model',
    earlierWork: true,
    discipline: 'Logic & working models',
    period: 'Sep 2018 — Jan 2019',
    status: 'Completed',
    context: 'Two electronic model builds',
    model: 'transit',
    visualLabel: 'LOGIC GATES / SIGNALS / SEQUENCING',
    image: projectImages['traffic-and-elevated-bus'],
    tools: ['Logic gates', 'Circuit wiring', 'Fault tracing'],
    summary:
      'I built a model traffic junction and a separate elevated-bus model. I wired the circuits by hand and used logic gates to control their sequences.',
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
