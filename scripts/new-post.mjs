import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Usage: npm run post -- "Your article title"');
  process.exit(1);
}
const slug = title
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
if (!slug) {
  console.error(
    'The title must contain at least one letter or number for the URL.',
  );
  process.exit(1);
}
const directory = resolve('content/posts');
mkdirSync(directory, { recursive: true });
const target = resolve(directory, slug + '.md');
const body = [
  '---',
  'title: ' + JSON.stringify(title),
  'date: ' + JSON.stringify(new Date().toISOString().slice(0, 10)),
  'description: "Write a short introduction to this essay."',
  'tags: ["Engineering"]',
  'draft: true',
  '---',
  '',
  'Begin your essay here.',
  '',
  '## A thought to explore',
  '',
  'Your words, in your own time.',
  '',
].join('\n');
try {
  writeFileSync(target, body, { flag: 'wx' });
} catch (error) {
  if (error.code === 'EEXIST') {
    console.error(
      'An article already uses this title. Existing writing was not changed.',
    );
    process.exit(1);
  }
  throw error;
}
console.log(
  'Created draft: ' +
    target +
    '\nWrite your essay, preview it with npm run dev:drafts, then set draft: false when ready.',
);
