import { annotationOpacity } from '../lib/journey-annotations.ts';
import { EXHIBIT_COUNTS, exhibitSpacing } from '../lib/journey-exhibits.ts';
import { journeyTourStops } from '../lib/journey-tour.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createJourneyClearance } from '../lib/journey-clearance.ts';
import {
  dock,
  journeyPose,
  experienceBay,
} from '../lib/journey-choreography.ts';
import { chapterEntryTimeline } from '../lib/journey-tour.ts';
const bounds = (x: number, y: number, z: number, w = 1, h = 1, d = 1) => ({
  min: [x - w / 2, y - h / 2, z - d / 2] as [number, number, number],
  max: [x + w / 2, y + h / 2, z + d / 2] as [number, number, number],
});

void test('the scene placement guard rejects rocks and tall posts in the actual walking corridor, allows supporting floor', () => {
  const route = createJourneyClearance();
  assert.ok(route.samples > 2500);
  for (const t of [3.4, 3.5, 4.04, 4.19, 4.28, 4.43, 4.65, 4.83]) {
    const p = journeyPose(t).avatar;
    assert.ok(
      route.obstruction(bounds(p[0], p[1] + 0.5, p[2])),
      `rock at ${t} intersects an actor corridor`,
    );
    assert.ok(
      route.obstruction(bounds(p[0] + 0.55, p[1] + 1.5, p[2], 0.2, 2, 0.2)),
      'arm and crown clearance',
    );
    if ([3.5, 4.28, 4.43, 4.65].includes(t))
      assert.equal(
        route.obstruction(bounds(p[0], p[1] - 0.5, p[2])),
        null,
        'flat floor remains under the feet; inclined supports use their walkable surface',
      );
  }
});
void test('the launch corridor rises above lunar architecture before lateral movement and descends only over the pad', () => {
  const route = createJourneyClearance();
  const landing = dock();
  for (let t = 3.68; t < 4; t += 0.0001) {
    const p = journeyPose(t).rocket;
    if (t < 3.8) {
      assert.equal(p[0], 122);
      assert.equal(p[2], 6);
    } else if (t < 3.91) assert.equal(p[1], 118);
    else {
      assert.equal(p[0], landing[0]);
      assert.equal(p[2], landing[2]);
    }
    assert.ok(
      !route.obstruction(bounds(124, 82.15, -22, 24, 2.7, 24)),
      'no flight through the research foundation',
    );
    assert.ok(
      !route.obstruction(bounds(118, 83.25, 0, 5, 0.5, 6)),
      'landing pad remains below rocket feet',
    );
  }
  const p = journeyPose(3.75).rocket;
  assert.equal(
    route.obstruction(bounds(p[0], p[1] + 3, p[2], 1, 2, 1))?.actor,
    'rocket',
  );
});
void test('every chapter entry is its first readable frame, not arrival motion or the middle of its copy', () => {
  for (let chapter = 0; chapter < 7; chapter++) {
    const p = journeyPose(chapterEntryTimeline(chapter));
    assert.equal(p.walking, false);
    assert.equal(p.board, chapter < 5 ? chapter : chapter === 5 ? 9 : 10);
    if (chapter < 4) assert.equal(p.exhibitOffset, 0);
  }
});

void test('all five mission objects fit below their own text and clear the complete entry, walking ring and exit', () => {
  const route = createJourneyClearance();
  for (let i = 0; i < 5; i++) {
    const p = experienceBay(i).instrument;
    // Contains the rotated pedestal, aircraft/propeller, bars, microphone and globe.
    assert.equal(
      route.obstruction(bounds(p[0], p[1] + 1.7, p[2], 3.4, 3.4, 3.4)),
      null,
    );
  }
});

void test('the landed hatch faces the rover and the visible landing walk stays outside the rocket hull', () => {
  for (let t = 4.012; t < 4.1; t += 0.0001) {
    const p = journeyPose(t);
    assert.equal(p.rocketYaw, Math.PI);
    if (Math.abs(p.avatar[0] - p.rocket[0]) < 1)
      assert.ok(
        p.avatar[2] < p.rocket[2] - 1.3,
        'exit along the hatch face, never turn through the solid rear wall',
      );
  }
});

void test('chapter and role captions fade continuously without popping at any page boundary', () => {
  const boundaries = [
    1,
    2,
    3,
    5,
    6,
    ...Array.from({ length: 4 }, (_, i) => 4 + 0.25 + ((i + 1) * 0.54) / 5),
  ];
  for (const t of boundaries)
    for (let index = 0; index < 11; index++)
      for (let leaf = 0; leaf < 3; leaf++)
        assert.ok(
          Math.abs(
            annotationOpacity(index, leaf, t - 1e-7) -
              annotationOpacity(index, leaf, t + 1e-7),
          ) < 0.0001,
          `caption ${index}:${leaf} at ${t}`,
        );
  for (const stop of journeyTourStops(5)) {
    const p = journeyPose(stop.timeline);
    assert.ok(
      annotationOpacity(
        p.board,
        Math.round(p.exhibitOffset / exhibitSpacing(p.board)),
        stop.timeline,
      ) > 0.99,
      'every original reading frame stays fully legible',
    );
  }
});

void test('only one caption owns the HTML layer throughout forward and reverse travel', () => {
  for (let t = 0; t < 7; t += 0.0005) {
    let owners = 0;
    for (let index = 0; index < EXHIBIT_COUNTS.length; index++)
      for (let leaf = 0; leaf < EXHIBIT_COUNTS[index]; leaf++)
        if (annotationOpacity(index, leaf, t) > 0.002) owners++;
    assert.ok(owners <= 1, `${owners} captions at ${t}`);
  }
});
