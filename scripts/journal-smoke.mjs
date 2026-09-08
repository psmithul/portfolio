import assert from 'node:assert/strict';
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
assert.equal(
  forged.status,
  401,
  'local dispatcher strips forged identity headers',
);
console.log('PASS anonymous and forged-identity writes denied');

const login = await request('/signin-with-chatgpt?return_to=%2Fwrite');
assert.ok([302, 303, 307].includes(login.status));
cookie = login.headers
  .getSetCookie()
  .map((value) => value.split(';')[0])
  .join('; ');
assert.ok(cookie, 'local sign-in sets a session cookie');
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
  'PASS owner sign-in, database initialization, and cross-origin rejection',
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
