import {
  stationCameraFov,
  stationCameraDistance,
  STATION_CAMERA_DISTANCE,
} from '../lib/journey-station-camera.ts';
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
  STATION_CENTER,
  GALLERY_RADIUS,
  GALLERY_START,
  GALLERY_END,
  experienceReadingPhase,
  experienceBay,
  LIBRARY_X,
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
void test('the rocket docks outside once and the rover follows a continuous road', () => {
  for (let t = 4; t < 6.99; t += 0.001) {
    const pose = journeyPose(t);
    assert.ok(distance(pose.rocket, dock()) < 1e-6);
    assert.equal(pose.flight, 0);
    assert.equal(pose.pitch, 0);
    assert.ok(
      Math.abs(pose.rover[1] - 80 - lunarFloor(pose.rover[0] - 112)) < 1e-8,
    );
    assert.equal(pose.rover[2], -7.5);
    assert.ok(Math.abs(pose.rocket[2] - pose.rover[2]) > 6);
    if (pose.seated)
      assert.ok(distance(pose.avatar, roverSeat(pose.rover)) < 1e-8);
  }
  assert.equal(journeyPose(5).rover[0], 112 + LIBRARY_X + 6);
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

void test('role navigation settles at the matching gallery bay at every refresh rate', () => {
  for (const fps of [30, 60, 144])
    for (let i = 0; i < 5; i++) {
      const target = 4 + experienceReadingPhase(i);
      let timeline = target - 0.15;
      for (let frame = 0; frame < fps * 6; frame++)
        timeline = smoothTimeline(timeline, target, 1 / fps);
      assert.equal(timeline, target);
      const pose = journeyPose(timeline);
      assert.equal(pose.board, 4 + i);
      assert.ok(Math.abs(pose.boardPhase - 0.3) < 1e-8);
      assert.ok(distance(pose.display, experienceBay(i).position) < 1e-8);
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

void test('boarding, entry and exit clear the rover tyres and cabin roof', () => {
  for (let t = 4.012; t < 5; t += 0.0001) {
    const pose = journeyPose(t);
    if (pose.seated) continue;
    const x = Math.abs(pose.avatar[0] - pose.rover[0]);
    const z = Math.abs(pose.avatar[2] - pose.rover[2]);
    if (x < 0.6 && z < 1.93 && z > 0.7)
      assert.ok(
        pose.avatar[1] - pose.rover[1] > 1.15,
        'entry is above the tyres',
      );
    if (x < 1 && z < 1)
      assert.ok(
        pose.avatar[1] - pose.rover[1] + 2.25 < 3.675,
        'head clears roof',
      );
    if (
      pose.avatar[1] < pose.rover[1] + 1.15 &&
      !(x < 0.6 && z < 0.5 && pose.seating > 0)
    )
      assert.ok(
        x > 3.1 || z > 2.1,
        'standing visitor is outside the vehicle envelope',
      );
  }
});

void test('the rover parks for a single circular visit with every role in its own bay', () => {
  for (let phase = 0.16; phase < 0.9; phase += 0.0001) {
    const pose = journeyPose(4 + phase);
    assert.equal(pose.rover[0], 130);
    assert.equal(pose.rover[1], 83.5);
  }
  for (let role = 0; role < 5; role++) {
    const reading = journeyPose(4 + experienceReadingPhase(role));
    assert.equal(reading.board, 4 + role);
    assert.equal(reading.inspecting, true);
    assert.equal(reading.seated, false);
    assert.equal(reading.avatar[1], 83.5);
    assert.ok(
      Math.abs(
        Math.hypot(
          reading.avatar[0] - 112 - STATION_CENTER[0],
          reading.avatar[2] + 12 - STATION_CENTER[2],
        ) - GALLERY_RADIUS,
      ) < 1e-8,
    );
    assert.ok(
      distance(reading.avatar, reading.display) > 5,
      'visitor clears the terminal',
    );
  }
  const first = journeyPose(4 + GALLERY_START);
  const end = journeyPose(4 + GALLERY_END);
  assert.ok(
    distance(first.avatar, end.avatar) < 1e-8,
    'one complete circle joins the exit path',
  );
  assert.equal(journeyPose(4.9).seated, true, 'boards before rover departs');
});

void test('all station phase and role boundaries are continuous for actors and camera', () => {
  const boundaries = [
    4.007,
    4.1,
    4.16,
    4.25,
    4.79,
    4.83,
    4.9,
    5,
    ...Array.from(
      { length: 4 },
      (_, i) =>
        4 + GALLERY_START + ((i + 1) * (GALLERY_END - GALLERY_START)) / 5,
    ),
  ];
  for (const t of boundaries) {
    const a = journeyPose(t - 1e-7),
      b = journeyPose(t + 1e-7);
    for (const key of ['avatar', 'focus', 'rocket', 'rover'] as const)
      assert.ok(distance(a[key], b[key]) < 0.001, `${key} at ${t}`);
    assert.ok(Math.abs(a.galleryAngle - b.galleryAngle) < 0.001 || t === 5);
    assert.ok(Math.abs(a.stationView - b.stationView) < 0.001);
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

void test('station cameras fit desktop and portrait terminals without entering another bay', () => {
  for (const [width, height] of [
    [1280, 720],
    [390, 844],
    [320, 932],
    [375, 812],
    [844, 390],
  ]) {
    const aspect = width / height;
    const pageWidth = width < height ? 5.28 : 6.16;
    const pageHeight = 5.3;
    const fov = stationCameraFov(aspect, pageWidth, pageHeight, width < height);
    for (const closeUp of [false, true]) {
      const distance = stationCameraDistance(
        aspect,
        pageWidth,
        pageHeight,
        fov,
        closeUp,
        height < 550,
      );
      const tangent = Math.tan((fov * Math.PI) / 360);
      assert.ok(
        distance <= STATION_CAMERA_DISTANCE,
        'camera stays in the clear ring',
      );
      assert.ok(
        Math.abs(9.5 - distance) <= 7.5,
        'at least two metres from terminal surfaces',
      );
      assert.ok(
        pageWidth / (2 * distance * tangent * aspect) <= 1 / 1.3 + 1e-8,
        'full width fits',
      );
      assert.ok(
        pageHeight / (2 * distance * tangent) <= 1 / 1.4 + 1e-8,
        'full height fits',
      );
    }
  }
});
