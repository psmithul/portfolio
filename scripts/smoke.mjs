import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
const base = process.argv[2];
if (!base) {
  console.error('Usage: npm run smoke -- http://localhost:3000');
  process.exit(1);
}
const cases = [
  ['/', 200, 'Mithul', 'Projects &amp; Notes'],
  ['/blog/the-small-blue-thing', 200, 'Most of the photograph', 'small blue'],
  ['/blog/a-walk-in-twenty-four-pictures', 200, 'Muybridge', 'A walk'],
  [
    '/blog/leave-room-for-the-unfinished',
    200,
    'two kinds of satisfaction',
    'unfinished',
  ],
  ['/write', 200, 'MIKA’S LIFE / WRITING DESK', 'Writing desk'],
  ['/about', 200, '7.37', 'About'],
  ['/blog', 200, 'Mika’s', 'Mika’s Life'],
  [
    '/blog/gpt-5-6-sol-and-what-i-want-to-build',
    200,
    '10 July 2026',
    'GPT-5.6 Sol',
  ],
  [
    '/blog/what-excites-me-about-gpt-6-astra',
    200,
    '4 September 2026',
    'GPT-6 Astra',
  ],
  [
    '/blog/gpt-6-and-the-question-of-efficiency',
    200,
    '23 September 2026',
    'GPT-6',
  ],
  [
    '/blog/pid-versus-neural-network-control',
    200,
    'PID',
    'PID or a neural network',
  ],
  [
    '/work/tensegrity-joint',
    200,
    'MATLAB member-force calculations',
    'Tensegrity',
  ],
  ['/work/uncertainty-aware-navigation', 200, 'Monte Carlo', 'Uncertainty'],
  ['/work/reaction-wheel-microvibrations', 200, '0.33%', 'microvibration'],
  [
    '/work/uav-vibration-integration',
    200,
    'elastomer-isolated modular tray',
    'Flight-controller',
  ],
  [
    '/work/neoleg-knee-mechanism',
    200,
    'passive spring-assisted',
    'Actuated knee assistance',
  ],
  ['/work/off-road-leaf-robot', 200, 'bottom-up BOM', 'Off-road'],
  [
    '/work/adaptive-suspension-rover',
    200,
    'mechanical lock',
    'Adaptive suspension',
  ],
  ['/work/kneeassist', 200, 'top 5 of 70', 'Actuated knee assistance'],
  ['/work/four-bar-door-mechanism', 200, 'kinematic limits', 'Four-bar'],
  ['/work/easy-access-wallet', 200, 'card access', 'Wallet'],
  ['/work/solar-smart-home', 200, 'photovoltaic', 'Arduino'],
  ['/work/traffic-and-elevated-bus', 200, 'logic gates', 'Traffic'],
  ['/work/not-a-real-project', 404, 'here yet.', ''],
  ['/blog/not-a-published-entry', 404, 'here yet.', ''],
  ['/this-page-does-not-exist', 404, 'here yet.', ''],
];
for (const [path, status, content, title] of cases) {
  const response = await fetch(new URL(path, base));
  const body = await response.text();
  assert.equal(response.status, status, path + ': HTTP status');
  assert.ok(body.includes(content), path + ': expected content');
  if (title) {
    const titles = [...body.matchAll(/<title>([\s\S]*?)<\/title>/gi)];
    assert.ok(
      titles.some((match) => match[1].includes(title)),
      path + ': page-specific title',
    );
  }
  // Next streams the custom 404 through its server-component payload.
  // Its hydrated landmark is also checked in browser QA.
  assert.ok(
    body.includes('id="main"') ||
      (status === 404 && body.includes('\\"id\\":\\"main\\"')),
    path + ': main content landmark',
  );
  console.log('PASS ' + status + ' ' + path);
}
for (const path of [
  '/fonts/manrope-latin-variable.woff2',
  '/fonts/barlow-condensed-800.ttf',
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
