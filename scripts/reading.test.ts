import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Markdown from 'react-markdown';
import katex from 'katex';
import { parsePost } from './content.mjs';
import {
  readingHeadings,
  readingRemarkPlugins,
  readingRehypePlugins,
} from '../lib/reading.ts';
import { projectStudies } from '../content/project-studies.ts';
import {
  journalHighlights,
  journalTopics,
  nextJournalPost,
} from '../lib/journal-highlights.ts';
import type { Post } from '../lib/post-types.ts';

const render = (body: string) =>
  renderToStaticMarkup(
    createElement(
      Markdown,
      {
        remarkPlugins: readingRemarkPlugins,
        rehypePlugins: readingRehypePlugins,
        skipHtml: true,
      },
      body,
    ),
  );

await test('equations render accessible MathML inside a keyboard-scrollable container', () => {
  const html = render('## The spring\n\n$$\n\\tau = F r_\\perp\n$$\n');
  assert.match(html, /<math /);
  assert.match(html, /class="reading-equation" tabindex="0"/);
  assert.match(html, /role="group"/);
  assert.doesNotMatch(html, /katex-error/);
});

await test('captions stay with their image, including source links', () => {
  const html = render(
    '![The joint](/images/joint.png)\n\n_CAD study · [Source](https://example.com)._',
  );
  assert.match(html, /<figure class="reading-figure">/);
  assert.match(
    html,
    /<figcaption>CAD study · <a href="https:\/\/example.com">Source<\/a>\.<\/figcaption>/,
  );
  assert.doesNotMatch(html, /<blockquote>/);
});

await test('table of contents and rendered heading IDs agree without duplicate anchors', () => {
  const body =
    '## Results\n\nText.\n\n## Results\n\nText.\n\n## Results-2\n\nText.';
  const headings = readingHeadings(body);
  assert.equal(new Set(headings.map(({ id }) => id)).size, headings.length);
  const html = render(body);
  for (const { id } of headings) assert.ok(html.includes('id="' + id + '"'));
});

await test('currency stays text and author HTML or unsafe math cannot create executable links', () => {
  const html = render(
    'The budget was $20, then $25.\n\n<iframe src="https://example.com"></iframe>\n\n$$\n\\href{javascript:alert(1)}{click}\n$$\n',
  );
  assert.ok(html.includes('$20, then $25'));
  assert.doesNotMatch(html, /<iframe|href="javascript:/);
});

await test('every project has a write-up and every equation compiles strictly', () => {
  const projectSource = readFileSync('content/projects.ts', 'utf8');
  const slugs = [...projectSource.matchAll(/slug: '([^']+)'/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(Object.keys(projectStudies).sort(), slugs.sort());
  for (const [slug, body] of Object.entries(projectStudies)) {
    assert.ok(readingHeadings(body).length >= 2, slug + ': document sections');
    const equations = [...body.matchAll(/\$\$\n([\s\S]*?)\n\$\$/g)];
    assert.ok(equations.length, slug + ': explanatory equation');
    for (const [, equation] of equations) {
      assert.doesNotThrow(
        () =>
          katex.renderToString(equation, {
            throwOnError: true,
            strict: 'error',
            trust: false,
          }),
        slug,
      );
    }
    const html = render(body);
    assert.doesNotMatch(html, /katex-error/, slug);
    for (const [, path] of body.matchAll(/!\[[^\]]*\]\((\/[^)]+)\)/g)) {
      assert.ok(existsSync('public' + path), slug + ': ' + path);
    }
  }
});

await test('all four requested learning notes are highlighted without repeating entries', () => {
  const posts: Post[] = readdirSync('content/posts')
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) =>
      parsePost(readFileSync('content/posts/' + filename, 'utf8'), filename),
    )
    .filter((post) => !post.draft);
  const highlights = journalHighlights(posts);
  assert.deepEqual(
    highlights.map(({ slug }) => slug),
    journalTopics.map(({ slug }) => slug),
  );
  assert.equal(new Set(highlights.map(({ slug }) => slug)).size, 4);
  assert.equal(
    journalHighlights(
      posts.filter((post) => post.slug !== journalTopics[0].slug),
    ).length,
    3,
  );
});

await test('keep reading follows index order, including new owner entries, before returning to the first', () => {
  const posts = [
    'a-new-owner-entry',
    'the-small-blue-thing',
    ...journalTopics.map(({ slug }) => slug).reverse(),
    'leave-room-for-the-unfinished',
  ].map((slug) => ({ slug, tags: [] }) as unknown as Post);
  const expected = posts.map(({ slug }) => slug);
  let current = expected[0];
  const visited: string[] = [];
  for (let step = 0; step < posts.length; step++) {
    visited.push(current);
    current = nextJournalPost(posts, current)!.slug;
  }
  assert.deepEqual(visited, expected);
  assert.equal(current, expected[0]);
  assert.equal(nextJournalPost(posts, 'not-a-post'), undefined);
  assert.equal(nextJournalPost([posts[0]], posts[0].slug), undefined);
  assert.equal(nextJournalPost([], 'not-a-post'), undefined);

  const withoutHighlights = posts.filter(
    (post) => !journalTopics.some(({ slug }) => slug === post.slug),
  );
  assert.equal(
    nextJournalPost(withoutHighlights, withoutHighlights[0].slug)?.slug,
    withoutHighlights[1].slug,
  );
});
