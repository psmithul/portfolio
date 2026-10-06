import test from 'node:test';
import assert from 'node:assert/strict';
import {
  journeyScrollStep,
  type ScrollPose,
} from '../lib/journey-scroll-speed.ts';
import { journeyPosition } from '../lib/journey-timeline.ts';
import { journeyPose } from '../lib/journey-choreography.ts';

const offsets = [0, 990, 2115, 3240, 4815, 10215, 11340];
const distance = (a: readonly number[], b: readonly number[]) =>
  Math.hypot(...a.map((n, i) => n - b[i]));
const sample = (y: number) => {
  const p = journeyPosition(y, offsets, 900, 5);
  return journeyPose(p.stop + p.phase, 5);
};

function assertSpeed(a: ScrollPose, b: ScrollPose, dt: number) {
  assert.ok(Math.abs(a.trainX - b.trainX) <= 8 * dt + 1e-8, 'train speed');
  assert.ok(distance(a.rocket, b.rocket) <= 13 * dt + 1e-8, 'rocket speed');
  assert.ok(distance(a.focus, b.focus) <= 13 * dt + 1e-8, 'camera speed');
  if (a.avatarVisible && b.avatarVisible && (a.walking || b.walking))
    assert.ok(distance(a.avatar, b.avatar) <= 2.2 * dt + 1e-8, 'walking speed');
}

void test('a large wheel input or navigation jump respects world speeds in both directions', () => {
  for (const fps of [30, 60, 144])
    for (const direction of [-1, 1])
      for (let y = 0; y <= 11900; y += 3) {
        const next = journeyScrollStep(
          y,
          y + direction * 1e6,
          1 / fps,
          900,
          sample,
        );
        assertSpeed(sample(y), sample(next), 1 / fps);
        assert.ok(direction * (next - y) >= 0);
        assert.ok(Math.abs(next - y) <= 240 / fps + 1e-8);
      }
});

void test('scroll traverses the entire continuous route and reverses without getting stuck', () => {
  let y = 0,
    elapsed = 0;
  while (y < 11500 && elapsed < 240) {
    const next = journeyScrollStep(y, 11500, 1 / 60, 900, sample);
    assert.ok(next > y, `stalled at ${y}`);
    y = next;
    elapsed += 1 / 60;
  }
  assert.equal(y, 11500);
  assert.ok(elapsed > 60, 'a full route cannot be rushed');
  const reverse = journeyScrollStep(y, 0, 1 / 60, 900, sample);
  assert.ok(reverse < y);
  assertSpeed(sample(y), sample(reverse), 1 / 60);
});

void test('frame stalls, small targets, and phone viewports cannot bypass the speed limit', () => {
  const y = 3820;
  const stalled = journeyScrollStep(y, 10000, 30, 390, sample);
  assertSpeed(sample(y), sample(stalled), 0.05);
  assert.ok(stalled - y <= 390 * 0.28 * 0.05);
  assert.equal(journeyScrollStep(y, y, 1, 900, sample), y);
  assert.equal(journeyScrollStep(y, y + 20, 0, 900, sample), y);
  assert.equal(journeyScrollStep(0, 0.1, 1 / 60, 900, sample), 0.1);
});
