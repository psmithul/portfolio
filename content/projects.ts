import { projectImages } from '@/content/project-images';
import type { ModelKind } from '@/lib/engineering-scene';
export type Project = {
  slug: string;
  number: string;
  title: string;
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
    kind?: 'documentation' | 'illustration' | 'stock' | 'reference';
    referenceLabel?: string;
    licenseUrl?: string;
    fit?: 'cover' | 'contain';
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
    slug: 'uav-vibration-integration',
    number: '12',
    title: 'UAV Vibration Analysis & Isolation',
    discipline: 'UAV hardware',
    period: 'Jun — Jul 2026',
    status: 'Completed',
    context: 'Product internship · Vayu Aerospace, Bengaluru',
    model: 'electronics',
    visualLabel: 'FLIGHT CONTROLLER / MOUNTING STUDY',
    image: projectImages['uav-vibration-integration'],
    tools: ['ANSYS Mechanical', 'MATLAB', 'IMU log analysis'],
    summary:
      'Modeled and integrated three flight-controller mounts, then used ground motor runs and IMU analysis to compare their vibration isolation.',
    question:
      'Which mounting arrangement keeps motor vibration away from the flight controller?',
    role: 'As a Product Intern at Vayu Aerospace, I traced the vibration path, modeled three mounts, and integrated the shortlisted designs into hardware for ground motor-run tests.',
    approach: [
      {
        title: 'Compare three mounts',
        body: 'Evaluate a rigid baseline, an elastomer-isolated modular tray, and a suspended mount. Use ANSYS modal and response analysis to shortlist two isolation concepts for hardware evaluation.',
      },
      {
        title: 'Support the hardware evaluation',
        body: 'Check CAD fit, clearances, cable slack, fasteners, and controller orientation during integration. Test the assembled mounts through ground motor runs.',
      },
      {
        title: 'Compare the IMU logs',
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
      'Adaptive Suspension and Vibration-Aware Control for a Rough-Terrain Rover',
    discipline: 'Field robotics',
    period: 'Sep 2026 — Present',
    status: 'Ongoing',
    context: 'Research & staged hardware development',
    model: 'rover',
    visualLabel: 'SIX-WHEEL ROVER / CONCEPT STUDY',
    image: projectImages['adaptive-suspension-rover'],
    tools: [
      'Variable-stiffness suspension',
      'IMU & encoders',
      'Control design',
    ],
    summary:
      'Designing a six-wheel rover with adjustable suspension, using vibration feedback to decide when to change stiffness.',
    question:
      'Can a rover reduce vibration by changing its suspension before it has to slow down?',
    role: 'I am designing a six-wheel rover with adjustable spring leverage. The suspension moves between soft, medium, and stiff settings, then mechanically locks the selected setting.',
    approach: [
      {
        title: 'Start with one suspension unit',
        body: 'Build and evaluate one adjustable unit before committing to the full rover. Vary spring leverage to get three stiffness settings, with a mechanical lock at each setting and a separate load path that keeps the rover supported if reconfiguration fails.',
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
      'Design and staged hardware development. Rough-terrain testing and full-system comparisons are planned.',
    evidence: [
      'Three mechanically locked stiffness settings',
      'IMU and encoder feedback architecture',
      'Four planned control comparisons',
    ],
  },
  {
    slug: 'tensegrity-joint',
    number: '02',
    title:
      'Design and Development of a Tensegrity Based Variable Stiffness Joint',
    discipline: 'Compliant mechanisms',
    period: 'May 2026 — Present',
    status: 'Ongoing',
    context: 'Research project',
    model: 'tensegrity',
    visualLabel: 'TENSEGRITY JOINT / GEOMETRY & FORCE',
    image: projectImages['tensegrity-joint'],
    tools: ['MATLAB', 'Member-force modeling', 'Mechanism design'],
    summary:
      'A MATLAB study of member forces and stiffness, alongside the design of a tensegrity joint.',
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
      'Modeling and design are ongoing. A wearable application is a possible later direction.',
    evidence: [
      'MATLAB member-force calculations',
      'Geometry and loading comparisons',
      'Stiffness-informed design direction',
    ],
  },
  {
    slug: 'kneeassist',
    number: '04',
    title: 'Development of Actuated Knee Assistance System',
    discipline: 'Assistive mechatronics',
    period: 'Oct 2025 — Sep 2026',
    status: 'Completed',
    context: 'NeoLeg to KneeAssist · Team project',
    model: 'knee',
    visualLabel: 'PASSIVE MECHANISM / ACTUATED ASSISTANCE',
    image: projectImages['kneeassist'],
    tools: ['SolidWorks', 'ANSYS', 'Angle sensing', 'Cable-and-spring drive'],
    summary:
      'A spring-assisted knee mechanism developed into an actuated brace with angle sensing, controlled assistance, and a manual release.',
    question:
      'How can a knee mechanism assist movement while the user continues to extend actively?',
    role: 'I worked on the passive spring-assisted mechanism, refined the assembly in SolidWorks, and checked its motion in ANSYS. We then extended it into an actuated brace and defined a procurement-ready system with drive, sensing, power protection, and an independent manual release.',
    approach: [
      {
        title: 'Start with passive assistance',
        body: 'Study how spring placement and joint geometry change the assistance available through knee motion. Model and refine the assembly in SolidWorks, then use ANSYS and interference checks to compare workable layouts.',
      },
      {
        title: 'Add sensing and actuation',
        body: 'Extend the passive concept into a brace that tracks knee angle and adds controlled cable-and-spring assistance while the user extends actively.',
      },
      {
        title: 'Prepare the system for procurement',
        body: 'Define the drive, sensing, power, adjustable rails, cuffs, and independent manual release as one integrated system.',
      },
      {
        title: 'Define the bench checks',
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
      'Reaction-Wheel Microvibration Prediction with FEM and Machine Learning',
    discipline: 'Structural dynamics',
    period: 'Aug — Oct 2026',
    status: 'Completed',
    context: 'FEM & machine-learning study',
    model: 'satellite',
    visualLabel: 'SATELLITE PANEL / VIBRATION PATH',
    image: projectImages['reaction-wheel-microvibrations'],
    tools: ['ANSYS Mechanical', 'Modal & harmonic FEM', 'Regression'],
    summary:
      'Tracing reaction-wheel vibration from a satellite panel to a camera mount, using modal and harmonic analysis.',
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
      'A simulation study. The 0.33% figure is the change after mesh refinement. Experimental validation remains separate.',
    evidence: [
      'Response peak near 5,800 rpm',
      '0.33% change after mesh refinement',
      '24-design parameter sweep',
    ],
  },
  {
    slug: 'off-road-leaf-robot',
    number: '05',
    title: 'Off-Road Leaf-Collection Robot',
    discipline: 'Robot architecture',
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
      'Designing a robot to collect wet and dry leaves on uneven ground while leaving the soil behind.',
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
      'A differential-drive simulation combining A* planning, EKF localization, and recovery when the position estimate becomes uncertain.',
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
    discipline: 'Kinematics & fabrication',
    period: 'Feb — Apr 2024',
    status: 'Completed',
    context: 'Team build',
    model: 'linkage',
    visualLabel: 'LINK LENGTHS / PIVOTS / DOOR MOTION',
    image: projectImages['four-bar-door-mechanism'],
    tools: ['Linkage design', 'Kinematics', 'Team fabrication'],
    summary:
      'A team-built door-opening mechanism, developed through link-length and pivot-position studies.',
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
    discipline: 'User-centred mechanical design',
    period: 'Sep — Nov 2023',
    status: 'Completed',
    context: 'Design project',
    model: 'wallet',
    visualLabel: 'USER PROBLEM / MECHANICAL RESPONSE',
    image: projectImages['easy-access-wallet'],
    tools: ['Problem framing', 'Mechanical design', 'Layout development'],
    summary:
      'A compact card-holder concept designed to make cards easier to reach and remove.',
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
    discipline: 'Electronics & sensing',
    period: 'Sep 2019 — Jan 2020',
    status: 'Completed',
    context: 'Working electronic model',
    model: 'electronics',
    visualLabel: 'SENSORS / LOGIC / SOLAR POWER',
    image: projectImages['solar-smart-home'],
    tools: ['Arduino', 'Sensor integration', 'Circuit debugging'],
    summary:
      'An Arduino smart-home model with connected sensors, control logic, and a photovoltaic power option.',
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
    discipline: 'Logic & working models',
    period: 'Sep 2018 — Jan 2019',
    status: 'Completed',
    context: 'Two electronic model builds',
    model: 'electronics',
    visualLabel: 'LOGIC GATES / SIGNALS / SEQUENCING',
    image: projectImages['traffic-and-elevated-bus'],
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
