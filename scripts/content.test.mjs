import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parsePost, selectPosts, buildPosts } from './content.mjs';
function fixture({
  draft = false,
  date = '2026-09-08',
  title = 'An engineering note',
  body = 'A real essay body.',
} = {}) {
  return [
    '---',
    'title: ' + JSON.stringify(title),
    'date: ' + JSON.stringify(date),
    'description: "An introduction"',
    'tags: ["Engineering"]',
    'draft: ' + draft,
    '---',
    body,
  ].join('\n');
}
test('publishing excludes drafts and future dates and sorts newest first', () => {
  const posts = [
    parsePost(fixture({ draft: true }), 'private-note.md'),
    parsePost(fixture({ date: '2099-01-01' }), 'future.md'),
    parsePost(fixture({ date: '2026-08-01' }), 'older.md'),
    parsePost(fixture(), 'today.md'),
  ];
  assert.deepEqual(
    selectPosts(posts, { today: '2026-09-08' }).map((p) => p.slug),
    ['today', 'older'],
  );
  assert.equal(selectPosts(posts, { includeDrafts: true }).length, 4);
});
test('invalid metadata fails with the filename and a useful error', () => {
  assert.throws(
    () => parsePost(fixture({ date: '2026-02-30' }), 'bad-date.md'),
    /bad-date.md: Date is not a real/,
  );
  assert.throws(
    () => parsePost(fixture({ title: '' }), 'missing-title.md'),
    /Missing or empty "title"/,
  );
  assert.throws(
    () =>
      parsePost(
        fixture().replace('draft: false', 'draft: "false"'),
        'ambiguous.md',
      ),
    /Set draft explicitly/,
  );
  assert.throws(
    () => parsePost(fixture(), '../Wrong Title.md'),
    /Filename must use/,
  );
  assert.throws(
    () => parsePost(fixture({ body: '' }), 'empty.md'),
    /article body is empty/,
  );
});
test('duplicate slugs are rejected', () => {
  const p = parsePost(fixture(), 'one.md');
  assert.throws(() => selectPosts([p, p]), /Duplicate article slug/);
});
test('production generation removes draft text even after draft preview', () => {
  const root = mkdtempSync(join(tmpdir(), 'mithul-journal-'));
  try {
    mkdirSync(join(root, 'content/posts'), { recursive: true });
    writeFileSync(
      join(root, 'content/posts/private-note.md'),
      fixture({ draft: true, body: 'PRIVATE_DRAFT_SENTINEL' }),
    );
    buildPosts({ root, includeDrafts: true });
    assert.match(
      readFileSync(join(root, 'lib/posts.generated.ts'), 'utf8'),
      /PRIVATE_DRAFT_SENTINEL/,
    );
    buildPosts({ root, includeDrafts: false });
    const result = readFileSync(join(root, 'lib/posts.generated.ts'), 'utf8');
    assert.doesNotMatch(result, /PRIVATE_DRAFT_SENTINEL/);
    assert.match(result, /isDraftPreview = false/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
test('article renderer supports editorial formatting and rejects executable HTML and links', () => {
  const markdown =
    '## A section\n\nA **strong** idea.[^1]\n\n> A quotation\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n[^1]: A source.\n\n<script>alert(1)</script>\n\n[bad](javascript:alert%281%29)';
  const html = renderToStaticMarkup(
    createElement(
      Markdown,
      { remarkPlugins: [remarkGfm], skipHtml: true },
      markdown,
    ),
  );
  assert.match(html, /<h2>A section/);
  assert.match(html, /<strong>strong/);
  assert.match(html, /<blockquote>/);
  assert.match(html, /<table>/);
  assert.match(html, /data-footnotes/);
  assert.doesNotMatch(html, /<script|javascript:/);
});
