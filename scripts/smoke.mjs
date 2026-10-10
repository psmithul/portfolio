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
  ['/blog/the-small-blue-thing', 404, 'here yet.', ''],
  ['/blog/a-walk-in-twenty-four-pictures', 404, 'here yet.', ''],
  ['/blog/leave-room-for-the-unfinished', 404, 'here yet.', ''],
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
  ['/work/four-bar-door-mechanism', 200, 'kinematic limits', 'Four-Bar'],
  ['/work/easy-access-wallet', 200, 'card access', 'Wallet'],
  ['/work/solar-smart-home', 200, 'photovoltaic', 'Arduino'],
  ['/work/traffic-and-elevated-bus', 200, 'logic gates', 'Traffic'],
  ['/work/not-a-real-project', 404, 'here yet.', ''],
  ['/blog/not-a-published-entry', 404, 'here yet.', ''],
  ['/this-page-does-not-exist', 404, 'here yet.', ''],
];
const imagePaths = new Set();
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
  if (status === 200 && !path.startsWith('/write')) {
    const canonicalPath =
      path === '/work/neoleg-knee-mechanism' ? '/work/kneeassist' : path;
    assert.ok(
      body.includes(
        `<link rel="canonical" href="https://psmithul.com${canonicalPath === '/' ? '' : canonicalPath}"`,
      ),
      path + ': production canonical',
    );
  }
  if (path === '/write')
    assert.match(body, /name="robots" content="noindex, nofollow"/);
  if (status === 200 && path.startsWith('/work/')) {
    for (const className of [
      'playground-stage',
      'scene-loading',
      'workbench-controls',
      'mobile-model-illustration laboratory-mobile',
    ])
      assert.ok(
        body.includes(`class="${className}"`),
        path + ': reserved server-rendered laboratory frame',
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
// The request must choose the right first paint, before client hydration.
for (const [device, phone, userAgent] of [
  [
    'iPhone',
    true,
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile/15E148 Safari/604.1',
  ],
  [
    'iPad',
    false,
    'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) Mobile/15E148 Safari/604.1',
  ],
  [
    'Android phone',
    true,
    'Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/131.0.0.0 Mobile Safari/537.36',
  ],
  [
    'Android tablet',
    false,
    'Mozilla/5.0 (Linux; Android 14; SM-X710) Chrome/131.0.0.0 Safari/537.36',
  ],
  [
    'iPad desktop mode / Mac',
    false,
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Version/18.0 Safari/605.1.15',
  ],
]) {
  const response = await fetch(new URL('/', base), {
    headers: { 'user-agent': userAgent },
  });
  const body = await response.text();
  assert.equal(response.status, 200, device);
  assert.equal(
    body.includes('class="classic-portfolio"'),
    phone,
    device + ': phone homepage',
  );
  assert.equal(
    body.includes('class="minecraft-loader'),
    !phone,
    device + ': journey loader',
  );
  assert.ok(body.includes('id="main"'), device + ': content landmark');
  if (phone) {
    assert.ok(
      body.includes('Open on a desktop or iPad'),
      device + ': desktop note',
    );
    assert.ok(
      body.includes('class="flow-statement shell"'),
      device + ': original introduction',
    );
    for (const id of [
      'about',
      'work',
      'completed-work',
      'experience',
      'accolades',
      'tools',
      'journal',
      'contact',
    ])
      assert.ok(body.includes(`id="${id}"`), device + ': ' + id);
    for (const match of body.matchAll(
      /src="(\/[^"?]+\.(?:png|jpg|jpeg|webp|svg))"/gi,
    ))
      imagePaths.add(match[1]);
  }
  console.log('PASS device homepage ' + device);
}
for (const path of imagePaths) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path + ': referenced image');
  assert.ok(response.headers.get('content-type')?.startsWith('image/'), path);
  await response.body?.cancel();
}
console.log(`PASS ${imagePaths.size} referenced portfolio images`);
const sitemap = await (await fetch(new URL('/sitemap.xml', base))).text();
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
  '/fonts/manrope-latin-variable.woff2',
  '/fonts/barlow-condensed-800.ttf',
  '/fonts/fraunces-latin-variable.woff2',
  '/fonts/space-mono-latin-regular.woff2',
  '/fonts/pixelify-sans-700.ttf',
  '/fonts/space-grotesk-latin-variable.woff2',
  '/fonts/tanker-regular.woff2',
  '/skins/technoblade.png',
  '/audio/railway-theme.wav',
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
