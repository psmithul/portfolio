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
};
export const projects: Project[] = [
  {
    slug: 'tensegrity-joint',
    number: '01',
    title: 'Tensegrity-based variable-stiffness joint',
    shortTitle: 'Geometry, loading, and stiffness in a compliant joint.',
    discipline: 'Compliant mechanisms',
    period: 'May 2026 — Present',
    status: 'Ongoing',
    context: 'Research project',
    tools: ['MATLAB', 'Force modeling', 'Mechanism design'],
    summary:
      'Studying how geometry and loading shape the response of a tensegrity knee joint.',
    question:
      'How do the geometry and load paths of a tensegrity joint influence its mechanical response?',
    role: 'I am developing an element-level force model and a structured simulation study of a tensegrity knee joint.',
    approach: [
      {
        title: 'Model the elements',
        body: 'Develop an element-level force model to investigate how loads travel through the joint.',
      },
      {
        title: 'Make the questions testable',
        body: 'Define three engineering hypotheses and a simulation plan that compares controlled cases in MATLAB.',
      },
      {
        title: 'Study sensitivity',
        body: 'Compare the response to changes in geometry and loading to identify parameters for later prototype testing and refinement.',
      },
    ],
    outcome:
      'The project is in the modeling and simulation stage. Three engineering hypotheses and a structured simulation plan have been defined.',
    scope:
      'Ongoing computational work. Prototype testing and design refinement are future stages; the schematic on this site illustrates the tensegrity principle.',
    evidence: [
      'Element-level force model under development',
      'Three defined engineering hypotheses',
      'Controlled MATLAB simulation plan',
    ],
  },
  {
    slug: 'uncertainty-aware-navigation',
    number: '02',
    title: 'Uncertainty-aware indoor robot navigation',
    shortTitle: 'Navigation with noisy sensors and uncertain position.',
    discipline: 'Robotics & state estimation',
    period: 'June — July 2026',
    status: 'Completed',
    context: 'Independent simulation project',
    tools: ['Python', 'Extended Kalman filter', 'A* planning', 'Monte Carlo'],
    summary:
      'Combining planning, localization, and confidence-aware behavior in a differential-drive robot simulator.',
    question:
      'How can an indoor robot adapt its speed and recovery behavior when its position estimate becomes uncertain?',
    role: 'I developed a differential-drive simulator and evaluated confidence-aware speed and recovery logic through Monte Carlo trials.',
    approach: [
      {
        title: 'Build the simulation',
        body: 'Implement differential-drive motion, A* path planning, and heading control in Python.',
      },
      {
        title: 'Model imperfect sensing',
        body: 'Introduce encoder and IMU noise, yaw-bias drift, and wheel-slip events; use an extended Kalman filter for localization.',
      },
      {
        title: 'Evaluate behavior',
        body: 'Measure success, collisions, localization error, recovery events, and time to goal across Monte Carlo trials.',
      },
    ],
    outcome:
      'Completed an independent simulation with uncertainty-aware speed and recovery logic and a Monte Carlo evaluation workflow.',
    scope:
      'Completed simulation study covering planning, sensing noise, localization, and recovery behavior.',
    evidence: [
      'Differential-drive simulator',
      'A* planning and EKF localization',
      'Monte Carlo evaluation across five outcome measures',
    ],
  },
  {
    slug: 'reaction-wheel-microvibrations',
    number: '03',
    title: 'Reaction-wheel microvibration prediction',
    shortTitle: 'From wheel excitation to camera-interface vibration.',
    discipline: 'Structural dynamics & simulation',
    period: 'August 2026 — Present',
    status: 'Ongoing',
    context: 'Course project',
    tools: ['ANSYS Mechanical', 'Python', 'Modal & harmonic FEM', 'Regression'],
    summary:
      'Modeling satellite-panel vibration under reaction-wheel excitation, with particular attention to resonance.',
    question:
      'How does reaction-wheel excitation affect a camera mounting interface across the wheel operating-speed range?',
    role: 'I am building modal and harmonic finite-element models and developing a parametric FEM dataset for regression-based prediction.',
    approach: [
      {
        title: 'Model the structure',
        body: 'Build modal and harmonic finite-element models of a satellite panel under reaction-wheel excitation.',
      },
      {
        title: 'Locate resonant regions',
        body: 'Estimate vibration at the camera mounting interface across the wheel operating-speed range.',
      },
      {
        title: 'Evaluate the predictor',
        body: 'Generate a parametric FEM dataset and evaluate regression predictions on held-out FEM cases, focusing on behavior near resonance.',
      },
    ],
    outcome:
      'The finite-element modeling and prediction workflow is under development.',
    scope:
      'Ongoing course project. Held-out FEM cases are the planned reference for evaluating the regression models.',
    evidence: [
      'Modal and harmonic modeling in progress',
      'Parametric FEM dataset workflow',
      'Evaluation focused on behavior near resonance',
    ],
  },
  {
    slug: 'neoleg-knee-mechanism',
    number: '04',
    title: 'NeoLeg spring-assisted knee mechanism',
    shortTitle: 'A passive spring-assist mechanism for knee motion.',
    discipline: 'Mechanical design & analysis',
    period: 'December 2025 — March 2026',
    status: 'Completed',
    context: 'Team project',
    tools: ['SolidWorks', 'ANSYS', 'Assembly design', 'Interference checks'],
    summary:
      'Co-designing a passive spring-assist knee and evaluating its modeled motion and attachment geometry.',
    question:
      'How can a passive spring-assist mechanism be integrated around knee motion without modeled interference?',
    role: 'I co-designed the mechanism and contributed to the complete SolidWorks knee-joint assembly and ANSYS analysis.',
    approach: [
      {
        title: 'Develop the mechanism',
        body: 'Co-design a passive spring-assist knee mechanism as a team.',
      },
      {
        title: 'Integrate the assembly',
        body: 'Contribute to the complete SolidWorks knee-joint assembly and its ANSYS analysis.',
      },
      {
        title: 'Check motion and geometry',
        body: 'Verify interference-free modeled motion through approximately 75–120 degrees of flexion and support evaluation of spring and attachment geometry.',
      },
    ],
    outcome:
      'Verified interference-free modeled motion through approximately 75–120° of flexion.',
    scope:
      'Completed team design and analysis project. The reported flexion range describes the CAD model and its interference checks.',
    evidence: [
      'Complete knee-joint CAD assembly',
      'ANSYS analysis contribution',
      'Modeled interference check at approximately 75–120°',
    ],
  },
  {
    slug: 'off-road-leaf-robot',
    number: '05',
    title: 'Off-road leaf-collection robot',
    shortTitle: 'Locomotion and leaf pickup on uneven terrain.',
    discipline: 'Mechatronics & system architecture',
    period: 'July 2026 — Present',
    status: 'Ongoing',
    context: 'NITK IDEA Factory',
    tools: ['Mechanical design', 'Concept selection', 'BOM', 'Test planning'],
    summary:
      'Developing an outdoor robot architecture that connects locomotion, collection, and terrain following.',
    question:
      'How can locomotion, leaf pickup, and debris handling work together on uneven outdoor terrain?',
    role: 'I am developing the system architecture, comparing mechanism concepts, and defining a bottom-up bill of materials and test metrics.',
    approach: [
      {
        title: 'Break down the system',
        body: 'Define locomotion, leaf pickup, debris transfer, storage, and terrain-following subsystems.',
      },
      {
        title: 'Compare the concepts',
        body: 'Benchmark existing products and compare mechanisms against integration constraints.',
      },
      {
        title: 'Plan the build and tests',
        body: 'Build a bottom-up BOM and define metrics for traction, pickup efficiency, soil rejection, and endurance.',
      },
    ],
    outcome:
      'Architecture development is ongoing. Products and mechanisms have been benchmarked, a bottom-up BOM has been built, and test metrics have been defined.',
    scope:
      'Ongoing architecture and design work at NITK IDEA Factory, with traction, collection, soil rejection, and endurance as the intended test areas.',
    evidence: [
      'Subsystem architecture in development',
      'Product and mechanism benchmarking',
      'BOM and four test-metric categories',
    ],
  },
];
