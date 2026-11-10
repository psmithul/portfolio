// Current portfolio copy. The v1 archive keeps its own content snapshot.
export const profile = {
  fullName: 'P S Mithul Sourav',
  heroIntro:
    'I’m Mithul, a fourth-year Mechanical Engineering undergraduate at NITK Surathkal. I’m interested in building intelligent physical systems that can move, adapt, and interact with the world.',
  bio: [
    "Hey, I'm Mithul, a fourth-year Mechanical Engineering student at NITK Surathkal.",
    "I've always been fascinated by machines that can move, learn, and adapt to unfamiliar environments, almost like living beings. What interests me most is figuring out how we can build robots that are as flexible as humans while having the intelligence to think, learn, and act independently.",
    "I'm particularly drawn to embodied intelligence, soft robotics, and nature-inspired systems. I enjoy exploring both the mechanical side of robotics, like dynamics and design, and the control and algorithms that make everything work together.",
    "Lately, I've also been curious about neural engineering and bioelectronics, especially how we can learn from biological systems to build more adaptive and intelligent robots.",
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
      'Team project developing a passive knee mechanism into an actuated cable-and-spring brace design.',
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
