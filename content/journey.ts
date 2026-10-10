import { portfolioExperience } from '@/content/profile';

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
// The same experience records power desktop, mobile, and About.
export const journeyExperience = portfolioExperience.map((item) => ({
  ...item,
  description: item.journeySummary,
  category: item.category.toUpperCase(),
}));
