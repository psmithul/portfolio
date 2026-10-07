import { journeyPosition, journeyOffset } from './journey-timeline.ts';
import { journeyPose } from './journey-choreography.ts';
import { createJourneyMotion } from './journey-scroll-motion.ts';
import { createJourneyTour, journeyTourStops } from './journey-tour.ts';
import { createJourneyGesture } from './journey-gesture.ts';

export type JourneyScroll = {
  position: () => number;
  to: (y: number) => void;
  jump: (y: number) => void;
  stop: () => void;
  play: () => void;
  pause: () => void;
  skip: (direction: -1 | 1) => void;
  dispose: () => void;
};
export function createJourneyScroll(
  offsets: () => number[],
  count: number,
  options: {
    viewport?: () => number;
    onPlayingChange?: (playing: boolean) => void;
    onPositionChange?: (position: number, direct?: boolean) => void;
  } = {},
): JourneyScroll {
  let current = window.scrollY,
    target = current,
    last = 0,
    frame = 0,
    writing = false,
    wheelLast = -Infinity,
    wheelTotal = 0,
    wheelCommitted = false,
    touchTotal = 0;
  const viewport = options.viewport ?? (() => window.innerHeight);
  const gesture = createJourneyGesture();
  const tour = createJourneyTour(count);
  const stops = journeyTourStops(count);
  const motion = createJourneyMotion();
  let previousOffsets = offsets(),
    previousViewport = viewport();
  const maximum = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const setTarget = (y: number) => {
    target = Math.max(0, Math.min(maximum(), y));
  };
  const pause = () => {
    if (tour.playing()) {
      tour.pause();
      options.onPlayingChange?.(false);
    }
    target = current;
    motion.reset();
  };
  const at = (y: number) => {
    const p = journeyPosition(y, previousOffsets, previousViewport, count);
    return p.stop + p.phase;
  };
  const offset = (t: number) =>
    journeyOffset(
      { stop: Math.floor(t), phase: t % 1 },
      previousOffsets,
      previousViewport,
    );
  const closest = (y: number) =>
    stops.reduce((a, b) =>
      Math.abs(b.timeline - at(y)) < Math.abs(a.timeline - at(y)) ? b : a,
    ).timeline;
  const to = (y: number) => {
    pause();
    setTarget(offset(closest(y)));
  };
  function jump(y: number) {
    pause();
    current = Math.max(0, Math.min(maximum(), offset(closest(y))));
    target = current;
    options.onPositionChange?.(current, true);
    writing = true;
    window.scrollTo({ top: current, behavior: 'instant' });
    writing = false;
  }
  const timeline = () => at(current);
  const tourDestination = () => {
    const t = tour.target(),
      stop = Math.floor(t);
    return journeyOffset(
      { stop, phase: t - stop },
      previousOffsets,
      previousViewport,
    );
  };
  const exempt = (node: EventTarget | null) =>
    node instanceof Element &&
    Boolean(
      node.closest(
        'dialog, .route-menu, .scene-controls, input, textarea, select, [contenteditable="true"]',
      ),
    );
  function snap(direction: -1 | 1) {
    if (tour.playing()) pause();
    // A gesture cannot queue several unread pages while the train is in transit.
    if (
      Math.abs(target - current) > 0.5 &&
      Math.sign(target - current) === direction
    )
      return;
    tour.skip(timeline(), direction);
    setTarget(tourDestination());
  }
  const wheel = (e: WheelEvent) => {
    if (e.ctrlKey || exempt(e.target)) return;
    if (e.cancelable) e.preventDefault();
    const delta =
      (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) *
      (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
    const now = e.timeStamp;
    if (now - wheelLast > 240) {
      wheelTotal = 0;
      wheelCommitted = false;
    }
    wheelLast = now;
    wheelTotal += delta;
    if (!wheelCommitted && Math.abs(wheelTotal) >= 18) {
      wheelCommitted = true;
      snap(wheelTotal > 0 ? 1 : -1);
    }
  };
  const startTouch = (e: TouchEvent) => {
    if (e.touches.length !== 1 || exempt(e.target)) {
      gesture.cancel();
      touchTotal = 0;
      if (e.touches.length > 1) pause();
      return;
    }
    gesture.start(e.touches[0].clientX, e.touches[0].clientY);
    touchTotal = 0;
  };
  const touch = (e: TouchEvent) => {
    if (e.touches.length !== 1 || exempt(e.target) || !e.cancelable) {
      gesture.cancel();
      touchTotal = 0;
      return;
    }
    e.preventDefault();
    const delta = gesture.move(e.touches[0].clientX, e.touches[0].clientY);
    if (delta) {
      if (tour.playing()) pause();
      touchTotal += delta;
    }
  };
  const endTouch = () => {
    if (Math.abs(touchTotal) >= 24) snap(touchTotal > 0 ? 1 : -1);
    gesture.cancel();
    touchTotal = 0;
  };
  const cancelTouch = () => {
    gesture.cancel();
    touchTotal = 0;
  };
  const key = (e: KeyboardEvent) => {
    if (exempt(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
    if (
      e.target instanceof Element &&
      e.target.closest('button, a') &&
      e.key === ' '
    )
      return;
    const delta =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? 65
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
          ? -65
          : e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)
            ? viewport() * 0.6
            : e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)
              ? -viewport() * 0.6
              : 0;
    if (delta) {
      e.preventDefault();
      if (!e.repeat) snap(delta > 0 ? 1 : -1);
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      to(e.key === 'Home' ? 0 : maximum());
    }
  };
  const nativeScroll = () => {
    if (writing || Math.abs(window.scrollY - current) < 1.1) return;
    // Scrollbar drags and browser anchor jumps are routed through the same limiter.
    to(window.scrollY);
    writing = true;
    window.scrollTo({ top: current, behavior: 'instant' });
    writing = false;
  };
  const hash = () => {
    let id: string;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    const element = document.getElementById(id);
    if (element?.matches('.journey-stop, #main')) jump(element.offsetTop);
  };
  function resize() {
    const points = offsets();
    const height = viewport();
    if (
      height === previousViewport &&
      points.every((point, i) => point === previousOffsets[i])
    )
      return;
    const rebase = (y: number) => {
      const p = journeyPosition(y, previousOffsets, previousViewport, count);
      return Math.min(maximum(), journeyOffset(p, points, height));
    };
    current = rebase(current);
    target = rebase(target);
    previousOffsets = points;
    previousViewport = height;
    writing = true;
    window.scrollTo({ top: current, behavior: 'instant' });
    writing = false;
    motion.reset();
    options.onPositionChange?.(current);
  }
  function animate(now: number) {
    frame = requestAnimationFrame(animate);
    const dt = last ? (now - last) / 1000 : 0;
    last = now;
    if (document.hidden || document.querySelector('dialog[open]')) return;
    // A browser anchor or scrollbar move can precede its coalesced scroll event.
    // Capture it before our next frame writes the controlled position back.
    nativeScroll();
    if (tour.playing()) {
      setTarget(tourDestination());
      tour.step(Math.abs(current - target) < 0.5, dt);
      if (tour.playing()) setTarget(tourDestination());
      else {
        target = current;
        options.onPlayingChange?.(false);
      }
    }
    target = Math.min(target, maximum());
    current = Math.min(current, maximum());
    const points = previousOffsets;
    const sample = (y: number) => {
      const p = journeyPosition(y, points, viewport(), count);
      return journeyPose(p.stop + p.phase, count);
    };
    const next = motion.step(current, target, dt, previousViewport, sample);
    if (next !== current) {
      current = next;
      // Publish the same unrounded position to CSS3D and WebGL on this frame.
      options.onPositionChange?.(current);
      writing = true;
      window.scrollTo({ top: current, behavior: 'instant' });
      writing = false;
    }
  }
  window.addEventListener('wheel', wheel, { passive: false });
  window.addEventListener('touchstart', startTouch, { passive: true });
  window.addEventListener('touchmove', touch, { passive: false });
  window.addEventListener('touchend', endTouch);
  window.addEventListener('touchcancel', cancelTouch);
  window.addEventListener('keydown', key);
  window.addEventListener('resize', resize);
  window.addEventListener('hashchange', hash);
  window.addEventListener('scroll', nativeScroll, {
    passive: true,
    capture: true,
  });
  frame = requestAnimationFrame(animate);
  options.onPositionChange?.(current);
  return {
    position: () => current,
    to,
    jump,
    stop: pause,
    pause,
    play() {
      tour.play(timeline());
      setTarget(tourDestination());
      options.onPlayingChange?.(true);
    },
    skip(direction) {
      snap(direction);
    },
    dispose() {
      cancelAnimationFrame(frame);
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('touchstart', startTouch);
      window.removeEventListener('touchmove', touch);
      window.removeEventListener('touchend', endTouch);
      window.removeEventListener('touchcancel', cancelTouch);
      window.removeEventListener('keydown', key);
      window.removeEventListener('resize', resize);
      window.removeEventListener('hashchange', hash);
      window.removeEventListener('scroll', nativeScroll, true);
    },
  };
}
