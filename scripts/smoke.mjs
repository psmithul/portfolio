import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
const base = process.argv[2];
if (!base) {
  console.error('Usage: npm run smoke -- http://localhost:3000');
  process.exit(1);
}
const cases = [
  ['/', 200, 'Making sense', 'Mechanical Engineering &amp; Robotics'],
  ['/about', 200, '7.37', 'About'],
  ['/blog', 200, 'The Margins', 'Journal'],
  [
    '/work/tensegrity-joint',
    200,
    'Three defined engineering hypotheses',
    'Tensegrity',
  ],
  ['/work/uncertainty-aware-navigation', 200, 'Monte Carlo', 'Uncertainty'],
  [
    '/work/reaction-wheel-microvibrations',
    200,
    'held-out FEM',
    'microvibration',
  ],
  ['/work/neoleg-knee-mechanism', 200, '75–120', 'NeoLeg'],
  ['/work/off-road-leaf-robot', 200, 'bottom-up BOM', 'Off-road'],
  ['/work/not-a-real-project', 404, 'uncharted territory', ''],
  ['/blog/not-a-published-entry', 404, 'uncharted territory', ''],
  ['/this-page-does-not-exist', 404, 'uncharted territory', ''],
];
for (const [path, status, content, title] of cases) {
  const response = await fetch(new URL(path, base));
  const body = await response.text();
  assert.equal(response.status, status, path + ': HTTP status');
  assert.ok(body.includes(content), path + ': expected content');
  if (title) {
    const match = body.match(/<title>([\s\S]*?)<\/title>/i);
    assert.ok(
      match && match[1].includes(title),
      path + ': page-specific title',
    );
  }
  assert.ok(body.includes('id="main"'), path + ': main content landmark');
  console.log('PASS ' + status + ' ' + path);
}
for (const path of [
  '/fonts/manrope-latin-variable.woff2',
  '/fonts/fraunces-latin-variable.woff2',
  '/fonts/space-mono-latin-regular.woff2',
  '/favicon.svg',
]) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  assert.ok((await response.arrayBuffer()).byteLength > 100, path);
  console.log('PASS asset ' + path);
}
const cv = await fetch(new URL('/Mithul-Sourav-CV.pdf', base));
assert.equal(cv.status, 200);
assert.ok(cv.headers.get('content-type')?.includes('application/pdf'));
const downloaded = Buffer.from(await cv.arrayBuffer());
const source = readFileSync('public/Mithul-Sourav-CV.pdf');
assert.equal(
  createHash('sha256').update(downloaded).digest('hex'),
  createHash('sha256').update(source).digest('hex'),
);
console.log('PASS CV download matches the supplied document');
