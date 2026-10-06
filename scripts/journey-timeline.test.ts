import test from 'node:test';
import assert from 'node:assert/strict';
import { journeyPosition } from '../lib/journey-timeline.ts';
const offsets = [0, 1000, 2000, 3000, 4000, 7000, 8000];
void test('each section starts at its own stop, including the first space planet', () => {
  offsets.forEach((y, i) => {
    const p = journeyPosition(y, offsets, 1000);
    assert.equal(p.stop, i);
    assert.equal(p.progress, i);
    assert.equal(p.phase, 0);
  });
});
void test('the rail journey holds while content is read, then approaches the next stop', () => {
  assert.equal(journeyPosition(2500, offsets, 1000).progress, 2);
  assert.ok(journeyPosition(2900, offsets, 1000).progress > 2.5);
  assert.ok(journeyPosition(3500, offsets, 1000).progress > 3.1); // rocket arrival
  assert.ok(journeyPosition(3700, offsets, 1000).progress > 3.55); // launch follows boarding
});
void test('three planet chapters match their content, and the last planet holds before departure', () => {
  [4000, 5000, 6000].forEach((y, i) =>
    assert.equal(journeyPosition(y, offsets, 1000).experience, i),
  );
  assert.equal(journeyPosition(6500, offsets, 1000).progress, 4);
  assert.ok(journeyPosition(6950, offsets, 1000).progress > 4.4);
});
void test('backward scrolling is reversible and endpoints stay bounded', () => {
  for (let y = 9000; y >= -100; y -= 10) {
    const p = journeyPosition(y, offsets, 1000);
    assert.ok(p.progress >= 0 && p.progress <= 6);
    assert.ok(p.experience >= 0 && p.experience <= 2);
  }
  assert.equal(journeyPosition(4000, offsets, 1000).experience, 0);
  assert.ok(Number.isFinite(journeyPosition(0, [0, 0, 0], 0).progress));
});

void test('five original experience roles each have a matching planet and a reading hold', () => {
  for (let i = 0; i < 5; i++)
    assert.equal(
      journeyPosition(4000 + i * 600, offsets, 1000, 5).experience,
      i,
    );
  assert.equal(journeyPosition(6750, offsets, 1000, 5).progress, 4);
  assert.equal(journeyPosition(6990, offsets, 1000, 5).experience, 4);
});
