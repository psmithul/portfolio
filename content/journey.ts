export const stations = [
  { id: 'home', name: 'Welcome', place: 'Spawn Point', color: '#63854b' },
  { id: 'about', name: 'About me', place: 'Village', color: '#63854b' },
  {
    id: 'work',
    name: 'Current projects',
    place: 'The Workshop',
    color: '#c58946',
  },
  {
    id: 'archive',
    name: 'Past projects',
    place: 'The Archives',
    color: '#a47a59',
  },
  {
    id: 'experience',
    name: 'Experience',
    place: 'Orbit',
    color: '#85875d',
  },
  { id: 'journal', name: 'Blog', place: 'Mika’s Library', color: '#847399' },
  {
    id: 'contact',
    name: 'Say hello',
    place: 'Landing site',
    color: '#628b7a',
  },
] as const;

export const currentProjectSlugs = [
  'adaptive-suspension-rover',
  'tensegrity-joint',
  'off-road-leaf-robot',
];
export const shortProjectNames: Record<string, string> = {
  'adaptive-suspension-rover': 'Adaptive suspension rover',
  'tensegrity-joint': 'Tensegrity joint',
  'off-road-leaf-robot': 'Leaf-collection robot',
};

export const journeyExperience = [
  {
    company: 'Vayu Aerospace',
    role: 'Product Intern',
    period: 'Jun — Jul 2026',
    description:
      'Compared three flight-controller mounts in ANSYS. Integrated the mounts, ran ground tests, and analysed IMU logs in MATLAB.',
    href: '/work/uav-vibration-integration',
    category: 'ENGINEERING',
  },
  {
    company: 'Thinkify Labs',
    role: 'Product & Strategy Intern',
    period: 'May — Aug 2025',
    description:
      'Built a lead-qualification and follow-up workflow. Contributed to a reported 25% gain in operational efficiency.',
    category: 'PRODUCT',
  },
  {
    company: 'ILO Consulting',
    role: 'Investment Banking Intern',
    period: 'May — Jul 2024',
    description:
      'Built DCF, LBO, and three-statement financial models. Supported M&A due diligence and an Ireland market-entry assessment.',
    category: 'FINANCE',
  },
  {
    company: 'ISTE NITK',
    role: 'Secretary',
    period: 'Sep 2024 — Present',
    description:
      'Organised a technical event for 500+ participants. Led sponsor outreach and logistics; secured three sponsors.',
    category: 'LEADERSHIP',
  },
  {
    company: 'NH66 Fund · P&L Club',
    role: 'Fund Manager',
    period: 'Jan 2025 — Apr 2026',
    description:
      'Directed strategy for a ₹150K student-run fund. Mentored three analysts; organised recruitment and training.',
    category: 'LEADERSHIP',
  },
] as const;
