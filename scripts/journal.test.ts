import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertSameOrigin,
  emptyDraft,
  isJournalOwner,
  publishedPost,
  slugify,
  validateDraft,
  validateVersion,
} from '../lib/journal-model.ts';

await test('only the verified owner can write; no development identity bypass', () => {
  assert.equal(isJournalOwner(null), false);
  assert.equal(
    isJournalOwner({ userId: 'visitor', email: 'visitor@example.com' }),
    false,
  );
  assert.equal(
    isJournalOwner({ userId: 'mika', email: 'miastromika@gmail.com' }),
    true,
  );
  const local = { userId: 'local_seedy', email: 'seedy@sites.test' };
  assert.equal(isJournalOwner(local), false);
  assert.equal(
    isJournalOwner({ ...local, email: 'miastromika@gmail.com' }),
    false,
  );
  assert.equal(
    isJournalOwner({ userId: 'mika', email: 'visitor@example.com' }),
    false,
  );
});

await test('mutations require a same-origin JSON request', () => {
  const request = (origin: string, type = 'application/json') =>
    new Request('https://portfolio.example/api/journal', {
      method: 'POST',
      headers: { origin, 'Content-Type': type },
    });
  assert.doesNotThrow(() =>
    assertSameOrigin(request('https://portfolio.example')),
  );
  assert.throws(() => assertSameOrigin(request('https://other.example')));
  assert.throws(() => assertSameOrigin(request('null')));
  assert.throws(() =>
    assertSameOrigin(request('https://portfolio.example', 'text/plain')),
  );
  assert.doesNotThrow(() => assertSameOrigin(new Request('http://0.0.0.0:3001/api/journal', {
    method: 'POST', headers: {
      host: 'localhost:3001', origin: 'http://localhost:3001', 'Content-Type': 'application/json',
    },
  })));
  assert.throws(() => assertSameOrigin(new Request('http://0.0.0.0:3001/api/journal', {
    method: 'POST', headers: {
      host: 'localhost:3001', origin: 'http://attacker.example', 'Content-Type': 'application/json',
    },
  })));
});

await test('drafts may be unfinished, but publication validates all required text', () => {
  assert.deepEqual(validateDraft(emptyDraft), emptyDraft);
  assert.throws(() => validateDraft(emptyDraft, true), /title/);
  assert.throws(
    () => validateDraft({ ...emptyDraft, body: 'x'.repeat(80001) }),
    /80,000/,
  );
  assert.throws(
    () => validateDraft({ ...emptyDraft, tags: ['x'.repeat(41)] }),
    /40/,
  );
  assert.throws(
    () => validateDraft({ ...emptyDraft, tags: Array(9).fill('a') }),
    /eight/,
  );
  assert.deepEqual(
    validateDraft({ ...emptyDraft, tags: [' Science ', 'Science', ''] }).tags,
    ['Science'],
  );
  assert.throws(() => validateVersion(0));
  assert.throws(() => validateVersion('2'));
  assert.equal(validateVersion(2), 2);
});

await test('publishing creates a snapshot independent of later draft edits', () => {
  const draft = {
    title: 'A title',
    description: 'An introduction.',
    body: 'The essay.',
    tags: ['Science'],
  };
  const post = publishedPost(draft, 'a-title', '2026-09-08');
  draft.title = 'Private revision';
  draft.tags.push('Private topic');
  assert.equal(post.title, 'A title');
  assert.deepEqual(post.tags, ['Science']);
  assert.equal(post.draft, false);
  assert.equal(post.readingMinutes, 1);
  assert.equal(slugify('Mika’s café & a walk'), 'mika-s-cafe-a-walk');
  assert.equal(slugify('☀'), 'a-new-entry');
});
