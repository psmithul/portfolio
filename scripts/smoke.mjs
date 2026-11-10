import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
const base = process.argv[2];
if (!base) {
  console.error('Usage: npm run smoke -- http://localhost:3000');
  process.exit(1);
}
const currentCases = [
  ['/', 200, 'Mithul', 'Projects &amp; Notes'],
  ['/blog/the-small-blue-thing', 404, 'here yet.', ''],
  ['/blog/a-walk-in-twenty-four-pictures', 404, 'here yet.', ''],
  ['/blog/leave-room-for-the-unfinished', 404, 'here yet.', ''],
  ['/write', 200, 'MIKA’S LIFE / WRITING DESK', 'Writing desk'],
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
  ['/work/tensegrity-joint', 200, 'Member-force analysis', 'Tensegrity-Based'],
  ['/work/uncertainty-aware-navigation', 200, 'Monte Carlo', 'Uncertainty'],
  ['/work/reaction-wheel-microvibrations', 200, '0.33%', 'Microvibration'],
  [
    '/work/uav-vibration-integration',
    200,
    'elastomer-isolated modular tray',
    'UAV Vibration',
  ],
  [
    '/work/neoleg-knee-mechanism',
    200,
    'passive spring-assisted',
    'Actuated Knee-Assistance',
  ],
  [
    '/work/off-road-leaf-robot',
    200,
    'bottom-up BOM',
    'Modular Terrain-Adaptive',
  ],
  [
    '/work/adaptive-suspension-rover',
    200,
    'mechanical lock',
    'Variable-Stiffness Suspension',
  ],
  ['/work/kneeassist', 200, 'top 5 of 70', 'Actuated Knee-Assistance'],
  [
    '/work/nitk-battle-bots',
    200,
    'GN4RLY 2.5 (15 kg)',
    'Combat Robot Development',
  ],
  ['/work/battery-control-and-estimation', 404, 'here yet.', ''],
  ['/work/four-bar-door-mechanism', 200, 'kinematic limits', 'Four-Bar'],
  ['/work/easy-access-wallet', 200, 'card access', 'Wallet'],
  ['/work/solar-smart-home', 200, 'photovoltaic', 'Arduino'],
  ['/work/traffic-and-elevated-bus', 200, 'logic gates', 'Traffic'],
  ['/work/not-a-real-project', 404, 'here yet.', ''],
  ['/blog/not-a-published-entry', 404, 'here yet.', ''],
  ['/this-page-does-not-exist', 404, 'here yet.', ''],
];
const cases = currentCases.map(([path, status, content, title]) => [
  path,
  status,
  status === 404 ? 'Page not found' : content,
  title,
]);
const imagePaths = new Set();
for (const [path, status, content, title] of cases) {
  const response = await fetch(new URL(path, base));
  const body = await response.text();
  assert.equal(response.status, status, path + ': HTTP status');
  assert.ok(body.includes(content), path + ': expected content');
  assert.doesNotMatch(
    body,
    /href="\/v1(?:[/?#"])/,
    path + ': retired navigation',
  );
  assert.doesNotMatch(
    body,
    /src="\/images\/projects\/(?:photos\/|illustration-|reaction-wheel-reference-cad|tensegrity-(?:joint|leg)-cad)/,
    path + ': project imagery must be original documentation',
  );
  if (path === '/') {
    assert.match(
      body,
      /id="about-heading"[\s\S]*id="research-heading"[\s\S]*id="journal-heading"[\s\S]*id="activities-heading"/,
    );
    assert.match(body, /src="\/images\/mithul-profile-photo-cutout\.webp"/);
    assert.doesNotMatch(
      body,
      /src="\/images\/mithul-profile-illustration-cutout\.webp"/,
    );
    assert.match(body, /src="\/images\/projects\/gn4rly-2-5-assembly\.jpg"/);
    assert.match(body, /Vayu Aerospace.*ISTE/s);
    assert.match(body, /© 2024–2026 Mithul Sourav/);
    assert.match(body, /href="\/blog\/gpt-5-6-sol-and-what-i-want-to-build"/);
    assert.doesNotMatch(body, /recent updates|nitk-battle-bots-event\.jpeg/i);
    assert.doesNotMatch(body, /href="\/(?:about|work|blog|activities)"/);
  }
  if (title) {
    const titles = [...body.matchAll(/<title>([\s\S]*?)<\/title>/gi)];
    assert.ok(
      titles.some((match) => match[1].includes(title)),
      path + ': page-specific title',
    );
  }
  for (const match of body.matchAll(
    /src="(\/[^"?]+\.(?:png|jpg|jpeg|webp|svg))"/gi,
  ))
    imagePaths.add(match[1]);
  for (const article of body.matchAll(
    /<article class="article-prose">([\s\S]*?)<\/article>/gi,
  )) {
    for (const image of article[1].matchAll(/<img\b[^>]*>/gi)) {
      if (!image[0].includes('src="/images/')) continue;
      assert.match(
        image[0],
        /width="[1-9]\d*"/,
        path + ': image width reserved',
      );
      assert.match(
        image[0],
        /height="[1-9]\d*"/,
        path + ': image height reserved',
      );
    }
  }
  if (status === 200 && !path.includes('/write')) {
    const canonicalPath = path.endsWith('/work/neoleg-knee-mechanism')
      ? path.replace('/neoleg-knee-mechanism', '/kneeassist')
      : path;
    assert.ok(
      body.includes(
        `<link rel="canonical" href="https://psmithul.com${canonicalPath === '/' ? '' : canonicalPath}"`,
      ),
      path + ': production canonical',
    );
  }
  if (path.endsWith('/write'))
    assert.match(body, /name="robots" content="noindex, nofollow"/);
  // Next streams the custom 404 through its server-component payload.
  // Its hydrated landmark is also checked in browser QA.
  assert.ok(
    body.includes('id="main"') ||
      (status === 404 && body.includes('\\"id\\":\\"main\\"')),
    path + ': main content landmark',
  );
  console.log('PASS ' + status + ' ' + path);
}
const sectionRedirects = [
  ['/about', '#about'],
  ['/work', '#research'],
  ['/blog', '#journal'],
  ['/activities', '#activities'],
];
for (const [path, hash] of sectionRedirects) {
  const response = await fetch(new URL(path, base), { redirect: 'manual' });
  assert.equal(response.status, 308, path);
  const location = new URL(response.headers.get('location'), base);
  assert.equal(location.pathname, '/');
  assert.equal(location.hash, hash);
  await response.body?.cancel();
}
console.log('PASS former index routes redirect to homepage sections');
for (const path of [
  '/',
  '/about',
  '/work',
  '/work/tensegrity-joint',
  '/blog',
  '/blog/pid-versus-neural-network-control',
  '/write',
  '/write/example-entry',
  '/api/journal',
  '/health',
  '/Mithul-Sourav-CV.pdf',
  '/favicon.svg',
]) {
  const oldPath = path === '/' ? '/v1' : '/v1' + path;
  const response = await fetch(new URL(oldPath, base), { redirect: 'manual' });
  assert.equal(response.status, 308, oldPath);
  assert.equal(new URL(response.headers.get('location'), base).pathname, path);
  await response.body?.cancel();
}
console.log('PASS retired archive redirects');
for (const path of imagePaths) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path + ': referenced image');
  assert.ok(response.headers.get('content-type')?.startsWith('image/'), path);
  await response.body?.cancel();
}
console.log(`PASS ${imagePaths.size} referenced portfolio images`);
const sitemap = await (await fetch(new URL('/sitemap.xml', base))).text();
assert.doesNotMatch(sitemap, /https:\/\/psmithul\.com\/v1/);
for (const [path] of sectionRedirects)
  assert.ok(
    !sitemap.includes(`https://psmithul.com${path}</loc>`),
    path + ': retired index',
  );
for (const [path, status] of cases) {
  if (
    status === 200 &&
    path !== '/write' &&
    path !== '/work/neoleg-knee-mechanism'
  )
    assert.ok(
      sitemap.includes(`https://psmithul.com${path}</loc>`),
      path + ': indexed',
    );
  if (status === 404 || path.startsWith('/write'))
    assert.ok(
      !sitemap.includes(`https://psmithul.com${path}</loc>`),
      path + ': not indexed',
    );
}
const robots = await (await fetch(new URL('/robots.txt', base))).text();
assert.match(robots, /Sitemap: https:\/\/psmithul.com\/sitemap.xml/);
assert.match(robots, /Disallow: \/write/);
console.log('PASS published-only sitemap and robots');
for (const path of ['/api/journal', '/api/journal/example-entry']) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 401, path + ': owner access required');
  assert.match(response.headers.get('cache-control'), /no-store/);
}
const editor = await fetch(new URL('/write/example-entry', base), {
  redirect: 'manual',
});
assert.equal(editor.status, 307);
assert.ok(editor.headers.get('location')?.endsWith('/write'));
console.log('PASS anonymous journal access denied');
const health = await fetch(new URL('/health', base));
assert.equal(health.status, 200);
assert.equal((await health.json()).status, 'ok');
console.log('PASS production health');
for (const path of [
  '/fonts/amarna-regular.woff2',
  '/fonts/amarna-bold.woff2',
  '/fonts/amarna-italic.woff2',
  '/fonts/space-grotesk-latin-variable.woff2',
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
