import test from 'node:test';
import assert from 'node:assert/strict';
import {
  journeyScrollStep,
  journeyScrollSpeed,
} from '../lib/journey-scroll-speed.ts';
import { createJourneyMotion } from '../lib/journey-scroll-motion.ts';
import { journeyPosition } from '../lib/journey-timeline.ts';
import { journeyPose } from '../lib/journey-choreography.ts';
import {
  journeyWalkingPace,
  WALKING_SPEED,
} from '../lib/journey-walking-motion.ts';

const offsets = [0, 990, 2115, 3240, 4815, 7065, 8190];

void test('sustained input accelerates to the same moderate ceiling at every chapter, in both directions', () => {
  const ceiling = journeyScrollSpeed(900);
  for (const fps of [30, 60, 144])
    for (const direction of [-1, 1])
      for (let start = 0; start < 9000; start += 37) {
        const motion = createJourneyMotion();
        let y = start;
        for (let frame = 0; frame < fps; frame++) {
          const next = motion.step(
            y,
            y + direction * 96,
            1 / fps,
            900,
            'input',
          );
          assert.ok(direction * (next - y) >= 0);
          assert.ok(Math.abs(next - y) <= ceiling / fps + 1e-8);
          if (frame > fps * 0.75)
            assert.ok(
              Math.abs(Math.abs(next - y) * fps - ceiling) < 1e-7,
              `pace changed near ${y}`,
            );
          y = next;
        }
      }
});

void test('navigation eases into and out of a target without overshoot at 30, 60 and 144 Hz', () => {
  const endings: number[] = [];
  for (const fps of [30, 60, 144]) {
    const motion = createJourneyMotion();
    let y = 0,
      velocity = 0,
      peak = 0;
    for (let i = 0; i < fps * 8; i++) {
      const next = motion.step(y, 1000, 1 / fps, 900);
      const speed = (next - y) * fps;
      assert.ok(next >= y && next <= 1000);
      assert.ok(Math.abs(speed - velocity) <= 900 / fps + 0.3);
      velocity = speed;
      peak = Math.max(peak, speed);
      y = next;
      if (i === fps * 2 - 1) endings.push(y);
    }
    assert.equal(y, 1000);
    assert.equal(velocity, 0);
    const ceiling = journeyScrollSpeed(900);
    assert.ok(peak > ceiling * 0.97 && peak <= ceiling + 1e-5);
  }
  assert.ok(Math.max(...endings) - Math.min(...endings) < 3);
});

void test('releasing input brakes within 250ms, with no idle drift or target backlog', () => {
  for (const fps of [30, 60, 144])
    for (const start of [0, 3200, 4200, 5500, 7200]) {
      const motion = createJourneyMotion();
      let y = start;
      for (let frame = 0; frame < fps; frame++)
        y = motion.step(y, y + 96, 1 / fps, 900, 'input');
      const released = y;
      let lastSpeed = journeyScrollSpeed(900);
      for (let frame = 0; frame < Math.ceil(fps * 0.25); frame++) {
        const next = motion.step(y, y, 1 / fps, 900, 'brake');
        const speed = (next - y) * fps;
        assert.ok(next >= y);
        assert.ok(speed <= lastSpeed + 1e-8);
        assert.ok(lastSpeed - speed <= 5400 / fps + 1e-7);
        y = next;
        lastSpeed = speed;
      }
      assert.ok(y - released < 30);
      const stopped = y;
      for (let frame = 0; frame < fps; frame++)
        y = motion.step(y, y, 1 / fps, 900, 'brake');
      assert.equal(y, stopped);
    }
});

void test('long frames, tiny targets and viewport changes stay bounded without a position jump', () => {
  for (const viewport of [390, 720, 900, 1500]) {
    const speed = journeyScrollSpeed(viewport);
    assert.equal(
      journeyScrollStep(3800, 10000, 30, viewport),
      3800 + speed * 0.05,
    );
    assert.equal(
      journeyScrollStep(3800, -10000, 30, viewport),
      3800 - speed * 0.05,
    );
    assert.equal(journeyScrollStep(3800, 3820, 0, viewport), 3800);
    assert.equal(journeyScrollStep(0, 0.1, 1 / 60, viewport), 0.1);
  }
});

void test('the entire route crosses every chapter under the same ceiling without skips', () => {
  const motion = createJourneyMotion();
  const visited = new Set<number>();
  let y = 0;
  for (let frame = 0; y < 9000 && frame < 3000; frame++) {
    const next = motion.step(y, y + 96, 1 / 60, 900, 'input');
    const p = journeyPosition(next, offsets, 900, 5);
    const pose = journeyPose(p.stop + p.phase, 5);
    assert.ok(
      Object.values(pose).every(
        (value) => typeof value !== 'number' || Number.isFinite(value),
      ),
    );
    assert.ok(next > y && next - y <= journeyScrollSpeed(900) / 60 + 1e-8);
    visited.add(p.stop);
    y = next;
  }
  assert.ok(y >= 9000);
  assert.deepEqual([...visited], [0, 1, 2, 3, 4, 5, 6]);
});

void test('resuming after a reading pause starts immediately and ramps up over 600ms without idle travel', () => {
  for (const fps of [30, 60, 144])
    for (const start of [120, 2300, 5000, 7400])
      for (const direction of [-1, 1]) {
        const motion = createJourneyMotion();
        const ceiling = journeyScrollSpeed(720);
        let y = start;
        for (let gesture = 0; gesture < 2; gesture++) {
          let lastSpeed = 0;
          for (let frame = 0; frame < fps; frame++) {
            const next = motion.step(
              y,
              y + direction * 96,
              1 / fps,
              720,
              'input',
            );
            const speed = direction * (next - y) * fps;
            assert.ok(speed > 0 && speed <= ceiling + 1e-7);
            assert.ok(speed >= lastSpeed - 1e-7);
            if (frame === 0) assert.ok(speed < ceiling * 0.23);
            else assert.ok(speed - lastSpeed <= (ceiling * 1.4) / fps + 1e-7);
            if (frame < fps * 0.4) assert.ok(speed < ceiling * 0.8);
            if (frame > fps * 0.7) assert.ok(Math.abs(speed - ceiling) < 1e-7);
            lastSpeed = speed;
            y = next;
          }
          for (let frame = 0; frame < fps; frame++)
            y = motion.step(y, y, 1 / fps, 720, 'brake');
          const stopped = y;
          for (let frame = 0; frame < fps; frame++)
            y = motion.step(y, y, 1 / fps, 720, 'brake');
          assert.equal(y, stopped);
        }
      }
});

void test('boarding, landing and the gallery limit walking speed in both directions without a separate actor delay', () => {
  for (const fps of [30, 60, 144])
    for (const direction of [-1, 1]) {
      const motion = createJourneyMotion();
      let y = direction > 0 ? offsets[3] : offsets[5];
      let walkingFrames = 0;
      for (let frame = 0; frame < fps * 100; frame++) {
        const target = y + direction * 96;
        const ceiling = journeyWalkingPace(y, target, offsets, 900, 5);
        const next = motion.step(y, target, 1 / fps, 900, 'input', ceiling);
        const poses = [y, next].map((position) => {
          const p = journeyPosition(position, offsets, 900, 5);
          return journeyPose(p.stop + p.phase, 5);
        });
        if (poses.every((pose) => pose.walking)) {
          const speed =
            Math.hypot(
              ...poses[0].avatar.map((n, i) => poses[1].avatar[i] - n),
            ) * fps;
          assert.ok(speed <= WALKING_SPEED + 0.25, `walking ${speed} at ${y}`);
          walkingFrames++;
        }
        assert.ok(direction * (next - y) > 0);
        assert.ok(Math.abs(next - y) * fps <= journeyScrollSpeed(900) + 1e-7);
        y = next;
        if (direction > 0 ? y >= offsets[5] : y <= offsets[3]) break;
      }
      assert.ok(
        walkingFrames > fps * 10,
        'walks remain visible at a human pace',
      );
      assert.ok(direction > 0 ? y >= offsets[5] : y <= offsets[3]);
    }
});
