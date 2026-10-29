import test from 'node:test';
import assert from 'node:assert/strict';
import { siteHref } from '../lib/site-paths.ts';

void test('archived article links keep their version, query and fragment', () => {
  for (const path of [
    '/',
    '/#work',
    '/about',
    '/blog/pid?from=note#equation',
    '/work/rover',
    '/write/draft',
    '/Mithul-Sourav-CV.pdf',
  ]) {
    const expected =
      path === '/'
        ? '/v1'
        : path.startsWith('/#')
          ? '/v1' + path.slice(1)
          : '/v1' + path;
    assert.equal(siteHref(path, '/v1'), expected);
    assert.equal(
      siteHref(expected, '/v1'),
      expected,
      'versioning is idempotent',
    );
    assert.equal(siteHref(path), path, 'current pages keep current links');
  }
});
void test('archive links leave sources, image assets, email and local section anchors intact', () => {
  for (const path of [
    'https://example.com/work/rover',
    '//example.com/blog',
    'mailto:psmithul@gmail.com',
    '#equation',
    '/images/figure.webp',
    '/workbench',
    undefined,
  ])
    assert.equal(siteHref(path, '/v1'), path);
});
