export const siteOrigin = 'https://psmithul.com';
export const sitePages = {
  about: '/',
  projects: '/projects',
  buildLog: '/build-log',
} as const;

export function projectPath(slug: string) {
  return `/work/${slug}`;
}

export function postPath(slug: string) {
  return `/blog/${slug}`;
}
