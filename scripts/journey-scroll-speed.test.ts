import test from 'node:test';
import assert from 'node:assert/strict';
import {
  journeyScrollStep,
  journeyMotionLimits,
  type ScrollPose,
} from '../lib/journey-scroll-speed.ts';
import { journeyPosition } from '../lib/journey-timeline.ts';
import { journeyPose } from '../lib/journey-choreography.ts';
import { createJourneyMotion } from '../lib/journey-scroll-motion.ts';

const offsets = [0, 990, 2115, 3240, 4815, 7065, 8190];
const distance = (a: readonly number[], b: readonly number[]) =>
  Math.hypot(...a.map((n, i) => n - b[i]));
const sample = (y: number) => {
  const p = journeyPosition(y, offsets, 900, 5);
  return journeyPose(p.stop + p.phase, 5);
};

void test('snap motion eases into and out of a stop without overshoot at 30, 60 and 144 Hz', () => {
  const endings: number[] = [];
  const free = () => ({
    trainX: 0,
    avatar: [0, 0, 0],
    rocket: [0, 0, 0],
    rover: [0, 0, 0],
    focus: [0, 0, 0],
    walking: false,
    avatarVisible: false,
    transit: 0,
  });
  for (const fps of [30, 60, 144]) {
    const motion = createJourneyMotion();
    let y = 0,
      velocity = 0,
      peak = 0;
    for (let i = 0; i < fps * 12; i++) {
      const next = motion.step(y, 1000, 1 / fps, 900, free);
      const speed = (next - y) * fps;
      assert.ok(next >= y && next <= 1000);
      assert.ok(
        Math.abs(speed - velocity) <= 900 / fps + 0.3,
        `velocity snap at ${fps} Hz: ${speed} vs ${velocity}`,
      );
      velocity = speed;
      peak = Math.max(peak, speed);
      y = next;
      if (i === fps * 2 - 1) endings.push(y);
    }
    assert.equal(y, 1000);
    assert.equal(velocity, 0);
    assert.ok(peak > 200 && peak <= 240.00001);
  }
  assert.ok(Math.max(...endings) - Math.min(...endings) < 2);
});

void test('one smoothed route position stays continuous through every world transition and reverse', () => {
  const motion = createJourneyMotion();
  let y = 0;
  for (const target of [8190, 0]) {
    let frames = 0;
    while (y !== target && frames++ < 18000) {
      const next = motion.step(y, target, 1 / 60, 900, sample);
      assert.ok(Number.isFinite(next));
      assert.ok(Math.abs(next - y) < 11);
      assertSpeed(sample(y), sample(next), 1 / 60 + 0.0001);
      y = next;
    }
    assert.equal(y, target);
  }
});

void test('manual braking stops smoothly at 30, 60 and 144 Hz without resuming a pending target', () => {
  for (const fps of [30, 60, 144])
    for (const start of [0, 3200, 4200, 5500, 7200]) {
      const motion = createJourneyMotion();
      let y = start;
      for (let frame = 0; frame < fps / 2; frame++) {
        const next = motion.step(y, y + 40, 1 / fps, 900, sample, 'input');
        assertSpeed(sample(y), sample(next), 1 / fps + 1e-5);
        y = next;
      }
      const released = y;
      for (let frame = 0; frame < Math.ceil(fps * 0.25); frame++) {
        const next = motion.step(y, y, 1 / fps, 900, sample, 'brake');
        assertSpeed(sample(y), sample(next), 1 / fps + 1e-5);
        assert.ok(next >= y);
        y = next;
      }
      assert.ok(y - released < 40, `braking distance at ${fps} Hz`);
      const stopped = y;
      for (let frame = 0; frame < fps; frame++)
        y = motion.step(y, y, 1 / fps, 900, sample, 'brake');
      assert.equal(y, stopped, `idle drift at ${fps} Hz from ${start}`);
    }
});

function assertSpeed(a: ScrollPose, b: ScrollPose, dt: number) {
  const limits = journeyMotionLimits(Math.min(a.transit, b.transit));
  assert.ok(
    Math.abs(a.trainX - b.trainX) <= limits.train * dt + 1e-8,
    'train speed',
  );
  assert.ok(
    distance(a.rocket, b.rocket) <= limits.rocket * dt + 1e-8,
    'rocket speed',
  );
  assert.ok(
    distance(a.focus, b.focus) <= limits.focus * dt + 1e-8,
    'camera speed',
  );
  assert.ok(
    distance(a.rover, b.rover) <= limits.rover * dt + 1e-8,
    'rover speed',
  );
  if (a.avatarVisible && b.avatarVisible && (a.walking || b.walking))
    assert.ok(
      distance(a.avatar, b.avatar) <= limits.walking * dt + 1e-8,
      'walking speed',
    );
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
        assert.ok(
          Math.abs(next - y) <=
            (240 * journeyMotionLimits(sample(y).transit).pixels) / fps + 1e-8,
        );
      }
});

void test('scroll traverses the entire continuous route and reverses without getting stuck', () => {
  let y = 0,
    elapsed = 0;
  while (y < 9500 && elapsed < 240) {
    const next = journeyScrollStep(y, 9500, 1 / 60, 900, sample);
    assert.ok(next > y, `stalled at ${y}`);
    y = next;
    elapsed += 1 / 60;
  }
  assert.equal(y, 9500);
  assert.ok(elapsed > 30, 'a full route cannot be rushed');
  const reverse = journeyScrollStep(y, 0, 1 / 60, 900, sample);
  assert.ok(reverse < y);
  assertSpeed(sample(y), sample(reverse), 1 / 60);
});

void test('the compact station visit reads every role with one entry and exit', () => {
  let y = offsets[4],
    elapsed = 0;
  const visited = new Set<number>();
  while (y < offsets[5] && elapsed < 60) {
    const pose = sample(y);
    if (pose.board < 9 && pose.boardPhase < 0.52) visited.add(pose.board);
    y = journeyScrollStep(y, offsets[5], 1 / 60, 900, sample);
    elapsed += 1 / 60;
  }
  assert.deepEqual([...visited], [4, 5, 6, 7, 8]);
  assert.ok(elapsed >= 12 && elapsed < 38, `experience took ${elapsed}s`);
});

void test('frame stalls, small targets, and phone viewports cannot bypass the speed limit', () => {
  const y = 3820;
  const stalled = journeyScrollStep(y, 10000, 30, 390, sample);
  assertSpeed(sample(y), sample(stalled), 0.05);
  assert.ok(
    stalled - y <=
      390 * 0.28 * journeyMotionLimits(sample(y).transit).pixels * 0.05,
  );
  assert.equal(journeyScrollStep(y, y, 1, 900, sample), y);
  assert.equal(journeyScrollStep(y, y + 20, 0, 900, sample), y);
  assert.equal(journeyScrollStep(0, 0.1, 1 / 60, 900, sample), 0.1);
});

void test('travel accelerates after content while reading retains its original pace', () => {
  assert.equal(sample(2115 + 1125 * 0.1).transit, 0);
  assert.equal(sample(2115 + 1125 * 0.85).transit, 1);
  const free = (transit: number) => ({
    trainX: 0,
    avatar: [0, 0, 0],
    rocket: [0, 0, 0],
    rover: [0, 0, 0],
    focus: [0, 0, 0],
    walking: false,
    avatarVisible: false,
    transit,
  });
  const reading = journeyScrollStep(0, 1e6, 1 / 60, 900, () => free(0));
  const travel = journeyScrollStep(0, 1e6, 1 / 60, 900, () => free(1));
  assert.ok(travel > reading * 2.5);
  for (let t = 0; t < 6.999; t += 0.0002) {
    const a = journeyPose(t),
      b = journeyPose(t + 0.0002);
    assert.ok(Math.abs(a.transit - b.transit) < 0.05, `pace snap at ${t}`);
  }
});
