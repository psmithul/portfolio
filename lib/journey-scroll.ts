import { journeyPosition, journeyOffset } from './journey-timeline.ts';
import { journeyPose } from './journey-choreography.ts';
import { createJourneyMotion } from './journey-scroll-motion.ts';
import { createJourneyTour, chapterEntryTimeline } from './journey-tour.ts';
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
    writing = false;
  const viewport = options.viewport ?? (() => window.innerHeight);
  const gesture = createJourneyGesture();
  const tour = createJourneyTour(count);
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
  const to = (y: number) => {
    pause();
    setTarget(y);
  };
  function jump(y: number) {
    pause();
    current = Math.max(0, Math.min(maximum(), y));
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
      node.closest('dialog, input, textarea, select, [contenteditable="true"]'),
    );
  function snap(direction: -1 | 1) {
    if (tour.playing()) pause();
    tour.skip(timeline(), direction);
    setTarget(tourDestination());
  }
  // Every input contributes immediately. Keep a bounded runway, rather than
  // dropping gestures while travelling or waiting for a swipe to end.
  const nudge = (delta: number) => {
    if (!delta) return;
    if (tour.playing()) pause();
    const runway = viewport() * 0.65;
    setTarget(
      Math.max(current - runway, Math.min(current + runway, target + delta)),
    );
  };
  const wheel = (e: WheelEvent) => {
    if (e.ctrlKey || exempt(e.target)) return;
    if (e.cancelable) e.preventDefault();
    nudge(
      (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) *
        (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? viewport() : 1),
    );
  };
  const startTouch = (e: TouchEvent) => {
    if (e.touches.length !== 1 || exempt(e.target)) {
      gesture.cancel();
      if (e.touches.length > 1) pause();
      return;
    }
    gesture.start(e.touches[0].clientX, e.touches[0].clientY);
  };
  const touch = (e: TouchEvent) => {
    if (e.touches.length !== 1 || exempt(e.target) || !e.cancelable) {
      gesture.cancel();
      return;
    }
    e.preventDefault();
    nudge(gesture.move(e.touches[0].clientX, e.touches[0].clientY));
  };
  const endTouch = () => gesture.cancel();
  const cancelTouch = () => {
    gesture.cancel();
    pause();
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
      nudge(delta);
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
    if (element?.matches('.journey-stop, #main')) {
      const chapter = previousOffsets.indexOf(element.offsetTop);
      jump(chapter < 0 ? 0 : offset(chapterEntryTimeline(chapter, count)));
    }
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
  window.addEventListener('wheel', wheel, { passive: false, capture: true });
  window.addEventListener('touchstart', startTouch, {
    passive: true,
    capture: true,
  });
  window.addEventListener('touchmove', touch, {
    passive: false,
    capture: true,
  });
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
      window.removeEventListener('wheel', wheel, true);
      window.removeEventListener('touchstart', startTouch, true);
      window.removeEventListener('touchmove', touch, true);
      window.removeEventListener('touchend', endTouch);
      window.removeEventListener('touchcancel', cancelTouch);
      window.removeEventListener('keydown', key);
      window.removeEventListener('resize', resize);
      window.removeEventListener('hashchange', hash);
      window.removeEventListener('scroll', nativeScroll, true);
    },
  };
}
