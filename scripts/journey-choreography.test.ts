import test from 'node:test';
import assert from 'node:assert/strict';
import { journeyOffset, journeyPosition } from '../lib/journey-timeline.ts';
import {
  exhibitTravel,
  exhibitReadingPhases,
  EXHIBIT_SPACING,
  exhibitPresentation,
} from '../lib/journey-exhibits.ts';
import {
  journeyPose,
  smoothTimeline,
  dock,
  lunarFloor,
  type Point,
} from '../lib/journey-choreography.ts';
const distance = (a: Point, b: Point) =>
  Math.hypot(...a.map((v, i) => v - b[i]));

void test('camera, train and rocket remain continuous through every chapter and planet boundary', () => {
  const boundaries = [1, 2, 3, 3.68, 4, 4.2, 4.4, 4.6, 4.8, 5, 6];
  for (const boundary of boundaries) {
    const before = journeyPose(boundary - 1e-5),
      after = journeyPose(boundary + 1e-5);
    assert.ok(
      distance(before.focus, after.focus) < 0.02,
      `camera at ${boundary}`,
    );
    assert.ok(
      distance(before.rocket, after.rocket) < 0.02,
      `rocket at ${boundary}`,
    );
    assert.ok(
      Math.abs(before.trainX - after.trainX) < 0.02,
      `train at ${boundary}`,
    );
  }
});
void test('the rocket docks once and the rover connects the orbital workplaces', () => {
  for (let i = 0; i < 5; i++) {
    const pose = journeyPose(4 + i / 5);
    assert.ok(distance(pose.rocket, dock(0)) < 1e-6);
    assert.equal(pose.flight, 0);
    assert.equal(pose.pitch, 0);
    assert.ok(Math.abs(pose.rover[0] - 112 - i * 32 - 6) < 1e-8);
    assert.ok(
      Math.abs(pose.rocket[2] - pose.rover[2]) > 6,
      'landing bay is separate from the rover road',
    );
  }
  for (let t = 4; t < 6.99; t += 0.001) {
    const pose = journeyPose(t);
    assert.ok(
      Math.abs(pose.rover[1] - 80 - lunarFloor(pose.rover[0] - 112)) < 1e-8,
    );
    assert.equal(pose.rover[2], -7.5);
    if (pose.seated)
      assert.ok(
        distance(pose.avatar, [
          pose.rover[0],
          pose.rover[1] + 0.9,
          pose.rover[2],
        ]) < 1e-8,
      );
  }
});
void test('visible walking has no jumps and the character boards before launch', () => {
  for (let t = 0.001; t < 6.9; t += 0.001) {
    const pose = journeyPose(t);
    if (pose.avatarVisible && journeyPose(t + 1e-6).avatarVisible)
      assert.ok(
        distance(pose.avatar, journeyPose(t + 1e-6).avatar) < 0.005,
        `walk at ${t}`,
      );
    assert.ok(
      [...pose.avatar, ...pose.rocket, ...pose.focus, pose.pitch].every(
        Number.isFinite,
      ),
    );
  }
  assert.equal(journeyPose(3.65).avatarVisible, false);
  assert.equal(journeyPose(3.65).flight, 0);
  assert.ok(journeyPose(3.8).flight > 0);
});
void test('motion response is identical at 30, 60 and 144 Hz and is reversible', () => {
  const results = [30, 60, 144].map((fps) => {
    let x = 0;
    for (let n = 0; n < fps; n++) x = smoothTimeline(x, 4, 1 / fps);
    return x;
  });
  assert.ok(Math.max(...results) - Math.min(...results) < 1e-10);
  let x = 6;
  for (let n = 0; n < 300; n++) x = smoothTimeline(x, 0, 1 / 60);
  assert.ok(x < 1e-8);
});

void test('navigation settles at the new workplace rather than remaining just before its boundary', () => {
  for (const fps of [30, 60, 144])
    for (let i = 0; i < 5; i++) {
      const target = 4 + i / 5;
      let timeline = target - 0.15;
      for (let frame = 0; frame < fps * 6; frame++)
        timeline = smoothTimeline(timeline, target, 1 / fps);
      assert.equal(timeline, target);
      const pose = journeyPose(timeline);
      assert.equal(pose.board, 4 + i);
      assert.ok(pose.boardPhase < 1e-8);
    }
});

void test('the guide uses the visitor side, stands on its floor, and visits the current display', () => {
  for (const chapter of [1, 2, 3]) {
    const pose = journeyPose(chapter + 0.25);
    const offset = exhibitTravel(chapter, 0.25).offset;
    assert.equal(pose.avatar[0], chapter * 34 + 1 + offset);
    assert.equal(pose.avatar[1], 0.9);
    assert.equal(pose.avatar[2], 6.5);
    assert.equal(pose.inspecting, true);
    assert.equal(pose.display[0], chapter * 34 - 5 + offset);
    assert.equal(pose.display[2], 8);
  }
  for (let t = 3.3; t < 3.64; t += 0.001) {
    const pose = journeyPose(t);
    assert.ok(pose.avatar[2] >= 6.5);
    assert.ok(pose.avatar[1] >= 0.9);
  }
});

void test('orbital walks stay on the docking gantry, workplace floor, or connected visitor deck', () => {
  for (let i = 0; i < 5; i++)
    for (let phase = 0.035; phase < 0.7; phase += 0.001) {
      const pose = journeyPose(4 + (i + phase) / 5);
      const x = pose.avatar[0] - 112 - i * 32,
        z = pose.avatar[2] + 12;
      const floor = Math.abs(x) <= 6.5 && Math.abs(z) <= 5.5;
      const gantry =
        x >= 5.5 &&
        x <= (i === 0 ? 11.5 : 10.5) &&
        z >= (i === 0 ? -5.5 : 1.5) &&
        z <= (i === 0 ? 5.5 : 4.5);
      const visitor = x >= -10.5 && x <= 3.5 && z >= 4 && z <= 9.5;
      assert.ok(
        floor || gantry || visitor,
        `unsupported foot at ${i}: ${x}, ${z}`,
      );
      assert.ok(pose.avatar[1] >= 83.5);
    }
});

void test('one continuous scroll visits every reading bay before departure', () => {
  for (const board of [1, 2, 3, 9]) {
    const phases = exhibitReadingPhases(board);
    for (const [page, phase] of phases.entries()) {
      const gallery = exhibitTravel(board, phase);
      assert.equal(gallery.offset, page * EXHIBIT_SPACING);
      assert.equal(gallery.moving, false);
      const pose = journeyPose((board === 9 ? 5 : board) + phase);
      assert.equal(pose.exhibitOffset, page * EXHIBIT_SPACING);
      assert.equal(pose.inspecting, true);
      assert.ok(Math.abs(pose.avatar[0] - pose.display[0] - 6) < 1e-8);
      assert.ok(Math.abs(pose.focus[0] - pose.display[0] - 5) < 1e-8);
    }
  }
});

void test('reading bays return to the same train and rocket coordinates without an end-of-section jump', () => {
  for (const board of [1, 2, 3, 9])
    assert.equal(exhibitTravel(board, 0.999).offset, 0);
  for (const chapter of [1, 2, 3])
    for (let phase = 0.001; phase < 0.76; phase += 0.001) {
      const p = journeyPose(chapter + phase);
      assert.ok(
        p.avatar[0] >= chapter * 34 - 12 && p.avatar[0] <= chapter * 34 + 20,
      );
      assert.ok(p.avatar[1] >= 0.9);
    }
});

void test('phone rotation preserves the same actor and camera pose', () => {
  const landscape = [0, 429, 916.5, 1404, 2086.5, 4426.5, 4914];
  const portrait = landscape.map((y) => (y * 844) / 390);
  for (let stop = 0; stop <= 6; stop++)
    for (const phase of [
      0.02,
      0.18,
      0.2,
      ...(stop < 6 ? [0.4, 0.78, 0.95] : []),
    ]) {
      const y = journeyOffset({ stop, phase }, landscape, 390);
      const before = journeyPosition(y, landscape, 390, 5);
      const after = journeyPosition(
        journeyOffset(before, portrait, 844),
        portrait,
        844,
        5,
      );
      const a = journeyPose(before.stop + before.phase),
        b = journeyPose(after.stop + after.phase);
      for (const key of ['avatar', 'rocket', 'rover', 'focus'] as const)
        assert.ok(distance(a[key], b[key]) < 1e-8);
    }
});

void test('pages turn into view continuously before chapter and planet boundaries', () => {
  for (let board = 0; board <= 10; board++) {
    const start =
      board < 4 ? board : board < 9 ? 4 + (board - 4) / 5 : board - 4;
    if (board)
      assert.ok(exhibitPresentation(board, 0, start - 0.00001).fold < 0.001);
    for (let t = 0; t < 7; t += 0.0005) {
      for (let leaf = 0; leaf < 3; leaf++) {
        const a = exhibitPresentation(board, leaf, t),
          b = exhibitPresentation(board, leaf, t + 0.0005);
        assert.ok(
          Math.abs(a.angle - b.angle) < 0.12,
          `page rotation snap at ${board}/${leaf}/${t}`,
        );
      }
    }
  }
});
