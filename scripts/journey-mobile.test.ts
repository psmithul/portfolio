import test from 'node:test';
import assert from 'node:assert/strict';
import { createJourneyGesture } from '../lib/journey-gesture.ts';
import {
  createJourneyTour,
  journeyTourStops,
  chapterEntryTimeline,
} from '../lib/journey-tour.ts';
import { createJourneyScroll } from '../lib/journey-scroll.ts';
import { journeyPosition, journeyOffset } from '../lib/journey-timeline.ts';
import { journeyPose } from '../lib/journey-choreography.ts';
import { exhibitTravel } from '../lib/journey-exhibits.ts';

void test('slow horizontal swipes lock from cumulative motion and reverse without a jump', () => {
  const gesture = createJourneyGesture();
  gesture.start(200, 400);
  for (let x = 199; x >= 195; x--) assert.equal(gesture.move(x, 400), 0.9);
  assert.equal(gesture.move(194, 395), 0.9);
  assert.equal(gesture.move(197, 380), -2.7);
  gesture.cancel();
  assert.equal(gesture.move(0, 0), 0);
  gesture.start(100, 300);
  assert.equal(gesture.move(100, 200), 72);
  assert.equal(gesture.move(100, 220), -18);
});

void test('every original reading page and circular role has an ordered tour stop', () => {
  const stops = journeyTourStops(5);
  assert.equal(stops.length, 18);
  assert.equal(stops[0].timeline, 0);
  assert.equal(stops.at(-1)?.timeline, 6);
  for (let i = 1; i < stops.length; i++)
    assert.ok(stops[i].timeline > stops[i - 1].timeline);
  for (const stop of stops) {
    const pose = journeyPose(stop.timeline, 5);
    assert.equal(
      pose.walking,
      false,
      `not reading while walking at ${stop.timeline}`,
    );
    if (stop.timeline > 4 && stop.timeline < 5)
      assert.equal(pose.stationView, 1);
    else if (stop.timeline > 0 && stop.timeline < 4)
      assert.equal(
        exhibitTravel(Math.floor(stop.timeline), stop.timeline % 1).moving,
        false,
      );
  }
  assert.deepEqual(
    stops
      .filter((s) => s.timeline > 4 && s.timeline < 5)
      .map((s) => journeyPose(s.timeline).board),
    [4, 5, 6, 7, 8],
  );
});

void test('tour reading pauses start after arrival and last equally at different frame rates', () => {
  for (const fps of [30, 60, 144]) {
    const tour = createJourneyTour(5);
    tour.play(0);
    for (let frame = 0; frame < fps * 20; frame++) tour.step(false, 1 / fps);
    assert.equal(tour.target(), 0);
    for (let frame = 0; frame < fps * 12 - 1; frame++) tour.step(true, 1 / fps);
    assert.equal(tour.target(), 0);
    tour.step(true, 1 / fps);
    assert.equal(tour.target(), journeyTourStops(5)[1].timeline);
    tour.pause();
    tour.step(true, 1000);
    assert.equal(tour.playing(), false);
    tour.play(tour.target());
    tour.step(true, 1000);
    assert.equal(tour.target(), journeyTourStops(5)[1].timeline);
  }
});

function environment(t: { after: (fn: () => void) => void }) {
  const originals = new Map<string, PropertyDescriptor | undefined>();
  const frames = new Map<number, FrameRequestCallback>();
  let clock = 0,
    frameId = 0,
    viewport = 844,
    modal = false;
  let points = [0, 928.4, 1983.4, 3038.4, 4515.4, 6625.4, 7680.4];
  const browser = Object.assign(new EventTarget(), {
    innerHeight: 844,
    scrollY: 0,
    location: { hash: '' },
    scrollTo({ top }: { top: number }) {
      browser.scrollY = top;
    },
  });
  const document = {
    hidden: false,
    documentElement: { scrollHeight: 8735.4 },
    querySelector: () => (modal ? {} : null),
  };
  for (const [name, value] of Object.entries({
    window: browser,
    document,
    Element: class extends EventTarget {},
    requestAnimationFrame: (callback: FrameRequestCallback) => {
      frames.set(++frameId, callback);
      return frameId;
    },
    cancelAnimationFrame: (id: number) => frames.delete(id),
  })) {
    originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, {
      value,
      configurable: true,
      writable: true,
    });
  }
  const states: boolean[] = [];
  const published: number[] = [];
  const scroll = createJourneyScroll(() => points, 5, {
    viewport: () => viewport,
    onPlayingChange: (playing) => states.push(playing),
    onPositionChange: (y) => published.push(y),
  });
  t.after(() => {
    scroll.dispose();
    for (const [name, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    }
  });
  const run = (seconds: number) => {
    for (let i = 0; i < seconds * 60; i++) {
      clock += 1000 / 60;
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach((callback) => callback(clock));
    }
  };
  const touch = (type: string, coords: number[][], cancelable = true) => {
    const event = new Event(type, { cancelable });
    Object.defineProperty(event, 'touches', {
      value: coords.map(([clientX, clientY]) => ({ clientX, clientY })),
    });
    browser.dispatchEvent(event);
    return event;
  };
  return {
    browser,
    document,
    scroll,
    states,
    published,
    run,
    touch,
    wheel(delta: number, timestamp: number) {
      const event = new Event('wheel', { cancelable: true });
      Object.defineProperties(event, {
        deltaY: { value: delta },
        deltaX: { value: 0 },
        deltaMode: { value: 0 },
        timeStamp: { value: timestamp },
      });
      browser.dispatchEvent(event);
      return event;
    },
    position: () => journeyPosition(scroll.position(), points, viewport, 5),
    resize(height: number, stable: number) {
      browser.innerHeight = height;
      if (stable !== viewport) {
        points = points.map((point) => (point * stable) / viewport);
        document.documentElement.scrollHeight *= stable / viewport;
      }
      viewport = stable;
      browser.dispatchEvent(new Event('resize'));
    },
    modal(open: boolean) {
      modal = open;
    },
  };
}

void test('mobile autoplay visits all 18 pages, gives reading time, and stops at contact', (t) => {
  const env = environment(t);
  env.scroll.play();
  const visits = new Set<string>();
  for (let second = 0; second < 400; second++) {
    env.run(1);
    const p = env.position(),
      pose = journeyPose(p.stop + p.phase);
    if (pose.board === 0 || pose.board === 10) visits.add(String(pose.board));
    else if (p.stop === 4 && pose.stationView === 1)
      visits.add(String(pose.board));
    else if (p.stop < 4 || p.stop === 5)
      visits.add(`${pose.board}:${exhibitTravel(pose.board, p.phase).page}`);
    if (env.states.at(-1) === false) break;
  }
  assert.equal(env.position().stop, 6);
  assert.equal(env.position().phase, 0);
  assert.deepEqual(env.states, [true, false]);
  for (const bay of [
    '0',
    '1:0',
    '1:1',
    '1:2',
    '2:0',
    '2:1',
    '2:2',
    '3:0',
    '3:1',
    '3:2',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9:0',
    '9:1',
    '10',
  ])
    assert.ok(visits.has(bay), `missed ${bay}`);
  const end = env.scroll.position();
  env.run(30);
  assert.equal(env.scroll.position(), end);
});

void test('manual scrolling moves while the finger is down and never advances by itself', (t) => {
  const env = environment(t);
  env.run(60);
  assert.equal(env.scroll.position(), 0);
  assert.deepEqual(env.states, []);
  env.touch('touchstart', [[200, 700]]);
  env.touch('touchmove', [[200, 699]]);
  env.run(0.2);
  assert.ok(env.scroll.position() > 0, 'first one-pixel swipe moves the scene');
  for (let y = 660; y >= 100; y -= 40) {
    env.touch('touchmove', [[200, y]]);
    env.run(0.1);
  }
  assert.ok(
    env.scroll.position() > 10,
    'movement continues while finger is held',
  );
  env.touch('touchend', []);
  env.run(30);
  const y = env.scroll.position();
  assert.ok(
    y > 100 && y < 928.4,
    'continuous displacement, no forced jump to another chapter',
  );
  env.run(30);
  assert.equal(env.scroll.position(), y);
});

void test('small wheels and additional input during transit all contribute; queue length stays bounded', (t) => {
  const env = environment(t);
  assert.equal(env.wheel(1, 0).defaultPrevented, true);
  env.run(0.2);
  assert.ok(env.scroll.position() > 0, 'no wheel threshold');
  for (let i = 0; i < 10; i++) {
    env.wheel(20, i * 16);
    env.run(0.1);
  }
  env.run(15);
  const first = env.scroll.position();
  assert.ok(first > 150);
  env.wheel(20, 3000);
  env.run(15);
  assert.ok(
    env.scroll.position() > first + 19,
    'next input is never discarded',
  );
  for (let i = 0; i < 80; i++) env.wheel(120, 4000 + i * 16);
  env.run(30);
  assert.ok(
    env.scroll.position() < first + 650,
    'runway cannot build up many seconds of stale input',
  );
});

void test('cancelled or pinched swipes do not trigger a snap on release', (t) => {
  const env = environment(t);
  for (const kind of ['cancel', 'pinch']) {
    env.touch('touchstart', [[200, 600]]);
    env.touch('touchmove', [[200, 100]]);
    if (kind === 'cancel') env.touch('touchcancel', []);
    else
      env.touch('touchstart', [
        [200, 100],
        [300, 100],
      ]);
    env.touch('touchend', []);
    env.run(20);
    assert.equal(env.scroll.position(), 0);
  }
});

void test('direct navigation publishes only the selected frame and never flies through the route', (t) => {
  const env = environment(t);
  env.scroll.play();
  env.scroll.jump(
    journeyOffset(
      { stop: 4, phase: chapterEntryTimeline(4) - 4 },
      [0, 928.4, 1983.4, 3038.4, 4515.4, 6625.4, 7680.4],
      844,
    ),
  );
  const pose = journeyPose(env.position().stop + env.position().phase, 5);
  assert.equal(pose.board, 4);
  assert.equal(pose.stationView, 1);
  assert.equal(pose.walking, false);
  assert.equal(
    env.published.length,
    2,
    'initial position and destination only',
  );
  const y = env.scroll.position();
  env.run(30);
  assert.equal(env.scroll.position(), y);
  assert.equal(env.published.length, 2);
  assert.equal(env.states.at(-1), false);
  env.scroll.jump(928.4);
  const p = env.position();
  assert.ok(Math.abs(p.stop + p.phase - 1) < 1e-9);
});

void test('swiping pauses the tour, cancels safely, and pinch zoom stays with the browser', (t) => {
  const env = environment(t);
  env.scroll.play();
  env.run(14);
  env.touch('touchstart', [[200, 400]]);
  const swipe = env.touch('touchmove', [[200, 340]]);
  assert.equal(swipe.defaultPrevented, true);
  assert.equal(env.states.at(-1), false);
  env.run(5);
  env.touch('touchcancel', []);
  const paused = env.scroll.position();
  env.touch('touchmove', [[200, 250]]);
  env.run(5);
  assert.equal(env.scroll.position(), paused);
  env.scroll.play();
  env.touch('touchstart', [
    [100, 300],
    [200, 300],
  ]);
  assert.equal(env.states.at(-1), false);
  const pinch = env.touch('touchmove', [
    [80, 300],
    [220, 300],
  ]);
  assert.equal(pinch.defaultPrevented, false);
  env.run(5);
  assert.equal(env.scroll.position(), paused);
});

void test('browser toolbar resizing preserves the scene and rotation rebases the same reading phase', (t) => {
  const env = environment(t);
  env.scroll.to(2500);
  env.run(40);
  const before = env.position(),
    y = env.scroll.position();
  env.resize(900, 844);
  env.run(1);
  assert.equal(env.scroll.position(), y);
  assert.deepEqual(env.position(), before);
  env.resize(390, 390);
  assert.equal(env.position().stop, before.stop);
  assert.ok(Math.abs(env.position().phase - before.phase) < 1e-9);
});

void test('paused tours stay paused in hidden tabs and model dialogs, then resume without skipping', (t) => {
  const env = environment(t);
  env.scroll.play();
  env.document.hidden = true;
  env.run(30);
  assert.equal(env.scroll.position(), 0);
  env.document.hidden = false;
  env.modal(true);
  env.run(30);
  assert.equal(env.scroll.position(), 0);
  env.modal(false);
  env.run(5);
  assert.equal(
    env.scroll.position(),
    0,
    'reading time was not consumed in the background',
  );
  env.scroll.skip(1);
  env.run(20);
  assert.equal(env.position().stop, 1);
  env.scroll.pause();
  const paused = env.scroll.position();
  env.run(20);
  assert.equal(env.scroll.position(), paused);
});
