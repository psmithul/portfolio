import test from 'node:test';
import assert from 'node:assert/strict';
import { journeyOffset, journeyPosition } from '../lib/journey-timeline.ts';
import {
  exhibitTravel,
  exhibitReadingPhases,
  EXHIBIT_SPACING,
} from '../lib/journey-exhibits.ts';
import {
  journeyPose,
  smoothTimeline,
  dock,
  lunarFloor,
  type Point,
  PLANET_SPACING,
  ARCHIVE_TRAIN_X,
  trainCab,
  roverSeat,
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
    assert.ok(Math.abs(pose.rover[0] - 112 - i * PLANET_SPACING - 6) < 1e-8);
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
      assert.ok(distance(pose.avatar, roverSeat(pose.rover)) < 1e-8);
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

void test('the guide stays inside the moving cab through every ground card until the rocket transfer', () => {
  for (let t = 0; t <= 3.32; t += 0.001) {
    const pose = journeyPose(t);
    assert.ok(distance(pose.avatar, trainCab(pose.trainX)) < 1e-8);
    assert.equal(pose.walking, false);
    assert.equal(pose.inspecting, false);
    if (t < 3.3) assert.equal(pose.trainDoor, 0);
  }
});

void test('the rocket transfer uses the final gangway and never crosses the archive walls', () => {
  const cab = trainCab(ARCHIVE_TRAIN_X);
  let walked = 0;
  for (let t = 3.32; t < 3.64; t += 0.0001) {
    const pose = journeyPose(t),
      next = journeyPose(t + 0.0001);
    walked += distance(pose.avatar, next.avatar);
    assert.ok(pose.avatar[2] < 7.6, 'archive walls start at z=9.65');
    if (pose.avatar[2] < 4.15)
      assert.ok(Math.abs(pose.avatar[0] - cab[0]) < 1e-8, 'on the cab gangway');
    assert.ok(pose.avatar[1] >= 0.9);
  }
  assert.ok(walked < 12, 'a single short boarding walk');
});

void test('one landing transfer clears the rover wheels; all later roles are viewed from its seat', () => {
  for (let t = 4.005; t < 4.048; t += 0.0001) {
    const pose = journeyPose(t);
    const z = pose.avatar[2] - pose.rover[2];
    assert.ok(pose.avatar[1] >= 83.5);
    if (
      Math.abs(pose.avatar[0] - pose.rover[0]) < 0.5 &&
      z > 0.7 &&
      z < 1.93 &&
      !pose.seated
    )
      assert.ok(
        pose.avatar[1] - pose.rover[1] > 1.15,
        'entry passes above the tyre',
      );
    assert.ok(
      pose.avatar[1] - pose.rover[1] + 2.25 < 3.675,
      'head clears the cabin roof',
    );
  }
  for (let t = 4.05; t < 6.999; t += 0.001) {
    const pose = journeyPose(t);
    assert.equal(pose.walking, false);
    assert.equal(pose.seated, true);
    assert.ok(distance(pose.avatar, roverSeat(pose.rover)) < 1e-8);
    assert.ok(
      pose.avatar[2] + 0.5 < pose.display[2] - 0.35,
      'passenger clears the alcove wall',
    );
  }
});

void test('experience travel is compact and includes no repeat disembarking or boarding', () => {
  assert.ok(PLANET_SPACING <= 20);
  for (let role = 0; role < 5; role++) {
    const reading = journeyPose(4 + (role + 0.3) / 5);
    assert.equal(reading.board, 4 + role);
    assert.equal(reading.seated, true);
    const departing = journeyPose(4 + (role + 0.7) / 5);
    assert.ok(departing.rover[0] > reading.rover[0]);
    assert.equal(departing.walking, false);
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
      assert.ok(Math.abs(pose.focus[0] - pose.display[0] - 5) < 1e-8);
      assert.equal(pose.walking, false);
    }
  }
});

void test('ground cards are passed in order with no camera or train return trip', () => {
  for (const board of [1, 2, 3]) {
    let lastOffset = 0;
    for (let phase = 0; phase < 1; phase += 0.001) {
      const offset = exhibitTravel(board, phase).offset;
      assert.ok(offset >= lastOffset);
      lastOffset = offset;
    }
    assert.equal(lastOffset, 16);
  }
  let last = journeyPose(0);
  for (let t = 0.001; t < 3.32; t += 0.001) {
    const next = journeyPose(t);
    assert.ok(next.trainX >= last.trainX - 1e-9, `train reverses at ${t}`);
    assert.ok(next.focus[0] >= last.focus[0] - 1e-9, `camera reverses at ${t}`);
    last = next;
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
