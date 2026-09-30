import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const base = process.argv[2];
if (!base || !['localhost', '127.0.0.1'].includes(new URL(base).hostname))
  throw new Error(
    'Run only against a local preview: npm run smoke:journal -- http://localhost:4317',
  );
const origin = new URL(base).origin;
let cookie = '';
async function request(
  path,
  { method = 'GET', body, authenticated = true, requestOrigin = origin } = {},
) {
  const headers = authenticated && cookie ? { Cookie: cookie } : {};
  if (body) {
    headers['Content-Type'] = 'application/json';
    headers.Origin = requestOrigin;
  }
  const options = { method, headers, redirect: 'manual' };
  if (body && method !== 'GET') options.body = JSON.stringify(body);
  return fetch(new URL(path, base), options);
}
async function json(path, options) {
  const response = await request(path, options);
  const result = await response.json();
  assert.equal(response.status, 200, `${path}: ${JSON.stringify(result)}`);
  return result;
}

assert.equal(
  (await request('/api/journal', { authenticated: false })).status,
  401,
);
assert.equal(
  (
    await request('/api/journal', {
      method: 'POST',
      body: { action: 'create' },
      authenticated: false,
    })
  ).status,
  401,
);
const forged = await fetch(new URL('/api/journal', base), {
  headers: {
    'oai-authenticated-user-id': 'owner',
    'oai-authenticated-user-email': 'miastromika@gmail.com',
  },
});
assert.equal(forged.status, 401, 'forged identity headers do not grant access');
console.log('PASS anonymous and forged-identity writes denied');

assert.equal(
  (
    await request('/api/journal/session', {
      method: 'POST',
      body: { password: 'incorrect-password' },
    })
  ).status,
  401,
);
assert.equal(
  (
    await request('/api/journal/session', {
      method: 'POST',
      body: { password: 'anything' },
      requestOrigin: 'https://other.example',
    })
  ).status,
  403,
);
const password =
  process.env.JOURNAL_SMOKE_PASSWORD ??
  readFileSync(
    '/Users/mika/.config/mithul-portfolio/writing-desk-password.txt',
    'utf8',
  ).trim();
const login = await request('/api/journal/session', {
  method: 'POST',
  body: { password },
});
assert.equal(login.status, 200, 'owner password sign-in succeeds');
assert.ok(login.headers.get('set-cookie')?.includes('HttpOnly'));
assert.match(login.headers.get('set-cookie') ?? '', /SameSite=Strict/i);
cookie = login.headers
  .getSetCookie()
  .map((value) => value.split(';')[0])
  .join('; ');
assert.ok(cookie, 'password sign-in sets a signed session cookie');
const desk = await request('/write');
const deskHtml = await desk.text();
assert.equal(desk.status, 200, deskHtml.slice(0, 3500));
assert.ok(deskHtml.includes('Your writing desk'));
const initialized = await json('/api/journal', {
  method: 'POST',
  body: { action: 'initialize' },
});
assert.ok(initialized.entries.length >= 3);
assert.equal(
  (
    await request('/api/journal', {
      method: 'POST',
      body: {},
      requestOrigin: 'https://other.example',
    })
  ).status,
  403,
);
console.log(
  'PASS owner sign-in, private storage initialization, and cross-origin rejection',
);

const { entry: created } = await json('/api/journal', {
  method: 'POST',
  body: { action: 'create' },
});
const path = `/api/journal/${created.id}`;
const editor = await request(`/write/${created.id}`);
const editorHtml = await editor.text();
assert.equal(editor.status, 200, editorHtml.slice(0, 1800));
assert.ok(editorHtml.includes('Give this thought a title'));
assert.ok(editorHtml.includes('Save draft'));
assert.ok(editorHtml.includes('Add an image'));
assert.equal((await request(path, { authenticated: false })).status, 401);

const draft = {
  title: 'Journal integration check ' + created.id.slice(0, 8),
  description: 'Checks persistence and publication boundaries.',
  body: 'A saved paragraph.\n\n## A heading\n\nThis text should survive a reload.',
  tags: ['Verification'],
};
let { entry } = await json(path, {
  method: 'PATCH',
  body: { draft, version: created.version },
});
assert.deepEqual(
  (await json(path)).entry.draft,
  draft,
  'draft persists after a fresh request',
);
assert.equal(
  (await request(`/blog/${entry.slug}`, { authenticated: false })).status,
  404,
);
assert.equal(
  (
    await request(path, {
      method: 'PATCH',
      body: { draft, version: created.version },
    })
  ).status,
  409,
);
assert.equal(
  (
    await request(path, {
      method: 'POST',
      body: {
        action: 'publish',
        draft: { ...draft, body: '' },
        version: entry.version,
      },
    })
  ).status,
  400,
);
console.log(
  'PASS saved draft reload, private draft, conflict detection, and publication validation',
);

({ entry } = await json(path, {
  method: 'POST',
  body: { action: 'publish', draft, version: entry.version },
}));
const publicPath = `/blog/${entry.slug}`;
const publicResponse = await request(publicPath, { authenticated: false });
assert.equal(publicResponse.status, 200);
assert.ok(
  (await publicResponse.text()).includes('This text should survive a reload.'),
);
const edited = { ...draft, body: 'PRIVATE_REVISION_' + created.id };
({ entry } = await json(path, {
  method: 'PATCH',
  body: { draft: edited, version: entry.version },
}));
assert.ok(
  !(
    await (await request(publicPath, { authenticated: false })).text()
  ).includes('PRIVATE_REVISION_'),
);
({ entry } = await json(path, {
  method: 'POST',
  body: { action: 'publish', draft: edited, version: entry.version },
}));
assert.ok(
  (await (await request(publicPath, { authenticated: false })).text()).includes(
    'PRIVATE_REVISION_',
  ),
);
({ entry } = await json(path, {
  method: 'POST',
  body: { action: 'unpublish', version: entry.version },
}));
assert.equal((await request(publicPath, { authenticated: false })).status, 404);
assert.equal((await json(path)).entry.draft.body, edited.body);
console.log(
  'PASS publish, private revision, update, and unpublish with draft retained',
);
console.log('LOCAL_TEST_ENTRY_ID=' + created.id);
assert.equal(
  (
    await request('/api/journal/session', {
      method: 'POST',
      body: { action: 'signout' },
    })
  ).status,
  200,
);
cookie = '';
assert.equal((await request('/api/journal')).status, 401);
console.log('PASS sign-out removes writing access');
