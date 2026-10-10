// Professional details shared by the journey, phone homepage, and About page.
export const profile = {
  fullName: 'P S Mithul Sourav',
  education: {
    institution: 'National Institute of Technology Karnataka (NITK), Surathkal',
    degree: 'B.Tech. in Mechanical Engineering',
    period: 'August 2023 — June 2027',
    cgpa: '7.37 / 10',
  },
  heroIntro:
    'I’m a final-year mechanical engineering student at NITK Surathkal. I work on robots and mechatronic systems, bringing together mechanical design, sensing, vibration, and control.',
  about: [
    'I’m P S Mithul Sourav, a final-year Mechanical Engineering student at NITK Surathkal, graduating in June 2027. I’m interested in the dynamics and control that govern how robots move and interact with the real world.',
    'Right now, I’m designing a variable-stiffness rough-terrain rover and a modular robot for collecting leaves on wet, uneven ground. I’m also modeling a tensegrity-based variable-stiffness knee joint for a knee exoskeleton.',
    'I’m particularly interested in experimental and field robotics, where mechanical design, sensing, vibration, and control come together in physical hardware. Building things helps me see what I’ve understood and what I still need to learn.',
  ],
  skills: [
    {
      title: 'CAD & CAE',
      detail:
        'SolidWorks · PTC Creo · ANSYS Mechanical (modal and harmonic analysis) · COMSOL Multiphysics',
    },
    { title: 'Programming & computation', detail: 'MATLAB · Python · C · C++' },
    {
      title: 'Research interests',
      detail:
        'Experimental and field robotics · Mechatronic systems · Dynamics and control · Mechanical design, sensing, and vibration',
    },
    { title: 'Languages', detail: 'English · Hindi · Tamil · French (basic)' },
  ],
} as const;

export type PortfolioExperience = {
  company: string;
  role: string;
  period: string;
  category: string;
  location?: string;
  highlights: string[];
  journeySummary: string;
  href?: string;
  link?: string;
  earlier?: boolean;
  metric?: string;
};

export const portfolioExperience: PortfolioExperience[] = [
  {
    company: 'Vayu Aerospace Pvt. Ltd.',
    role: 'Product Intern — UAV Vibration Analysis & Isolation',
    period: 'Jun — Jul 2026',
    category: 'Engineering',
    location: 'Bengaluru, India',
    highlights: [
      'Investigated the vibration path from motors through the airframe to the flight-controller IMU. Compared rigid, elastomer-isolated, and suspended mounts in ANSYS.',
      'Integrated and ground-tested the shortlisted mounts; analyzed IMU time histories, RMS levels, and FFT spectra in MATLAB to support selection of the elastomer-isolated tray.',
    ],
    journeySummary:
      'Compared rigid, elastomer-isolated, and suspended flight-controller mounts in ANSYS. Ground tests and MATLAB IMU analysis supported selection of the elastomer-isolated tray.',
    href: '/work/uav-vibration-integration',
    link: 'Internship case study',
  },
  {
    company: 'Thinkify Labs',
    role: 'Product and Strategy Intern',
    period: 'May — Aug 2025',
    category: 'Product',
    location: 'Bengaluru, India',
    highlights: [
      'Developed an AI-based lead-qualification workflow using profile and email information, with routing logic for the appropriate sales representatives.',
      'Refined the workflow into a structured, testable process that contributed to a reported 25% improvement in operational efficiency.',
    ],
    journeySummary:
      'Built an AI-based lead-qualification and sales-routing workflow from profile and email information. The structured, testable process contributed to a reported 25% gain in operational efficiency.',
  },
  {
    company: 'ILO Consulting',
    role: 'Investment Banking Intern',
    period: 'May — Jul 2024',
    category: 'Finance',
    earlier: true,
    highlights: [
      'Built DCF, LBO, and three-statement financial models.',
      'Supported M&A due diligence and an Ireland market-entry assessment.',
    ],
    journeySummary:
      'Built DCF, LBO, and three-statement financial models. Supported M&A due diligence and an Ireland market-entry assessment.',
  },
  {
    company: 'Indian Society for Technical Education (ISTE), NITK',
    role: 'Secretary',
    period: 'Sep 2024 — Present',
    category: 'Leadership',
    metric: '500+',
    highlights: [
      'Led sponsor outreach, budgeting, vendor coordination, and logistics for a technical event with 500+ participants.',
      'Secured three sponsors and coordinated execution across teams.',
    ],
    journeySummary:
      'Led sponsor outreach, budgeting, vendor coordination, and logistics for a 500+ participant technical event. Secured three sponsors and coordinated execution across teams.',
  },
  {
    company: 'NH66 Fund, P&L Club',
    role: 'Fund Manager',
    period: 'Jan 2025 — Apr 2026',
    category: 'Leadership',
    metric: 'INR 150,000',
    highlights: [
      'Managed strategy for an INR 150,000 student fund and mentored three junior analysts.',
      'Organized two recruitment drives and a training workshop.',
    ],
    journeySummary:
      'Managed strategy for an INR 150,000 student fund and mentored three junior analysts. Organized two recruitment drives and a training workshop.',
  },
];

export const portfolioRecognition = [
  {
    title: 'Incubate X Prosthetic Challenge',
    result: 'Top 5 of 70',
    period: 'September 2026',
    scope: 'National selection',
    detail:
      'Our actuated knee-assistance team placed in the top five of 70 teams nationwide.',
    href: '/work/kneeassist',
    link: 'Actuated knee-assistance project',
  },
  {
    title: 'Global Case Competition at Harvard',
    result: 'Global Top 50',
    period: 'Feb — Mar 2026',
    scope: 'Team competition',
    detail:
      'Analyzed the European defense landscape in a four-member team and translated the evidence and trade-offs into focused recommendations.',
    href: '/Mithul-Sourav-CV.pdf',
    link: 'Read the résumé',
  },
] as const;
