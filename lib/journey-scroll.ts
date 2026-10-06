import { journeyPosition, journeyOffset } from '@/lib/journey-timeline';
import { journeyPose } from '@/lib/journey-choreography';
import { journeyScrollStep } from '@/lib/journey-scroll-speed';

export type JourneyScroll = {
  position: () => number;
  to: (y: number) => void;
  stop: () => void;
  dispose: () => void;
};
export function createJourneyScroll(
  offsets: () => number[],
  count: number,
): JourneyScroll {
  let current = window.scrollY,
    target = current,
    last = 0,
    frame = 0,
    writing = false;
  let touchY = 0,
    touchX = 0,
    touchAxis: 'x' | 'y' | null = null;
  let previousOffsets = offsets(),
    previousViewport = window.innerHeight;
  const maximum = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const to = (y: number) => {
    target = Math.max(0, Math.min(maximum(), y));
  };
  const exempt = (node: EventTarget | null) =>
    node instanceof Element &&
    Boolean(
      node.closest('dialog, input, textarea, select, [contenteditable="true"]'),
    );
  function nudge(delta: number) {
    if (Math.sign(delta) !== Math.sign(target - current)) target = current;
    to(
      Math.max(
        current - window.innerHeight * 0.75,
        Math.min(current + window.innerHeight * 0.75, target + delta),
      ),
    );
  }
  const wheel = (e: WheelEvent) => {
    if (e.ctrlKey || exempt(e.target)) return;
    e.preventDefault();
    const delta =
      (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) *
      (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
    nudge(Math.max(-110, Math.min(110, delta)) * 0.6);
  };
  const startTouch = (e: TouchEvent) => {
    touchY = e.touches[0]?.clientY ?? 0;
    touchX = e.touches[0]?.clientX ?? 0;
    touchAxis = null;
  };
  const touch = (e: TouchEvent) => {
    const y = e.touches[0]?.clientY ?? touchY,
      x = e.touches[0]?.clientX ?? touchX,
      dy = touchY - y,
      dx = touchX - x;
    touchY = y;
    touchX = x;
    if (e.touches.length !== 1 || exempt(e.target)) return;
    if (!touchAxis && Math.max(Math.abs(dx), Math.abs(dy)) > 3)
      touchAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    const delta = touchAxis === 'x' ? dx : dy;
    e.preventDefault();
    nudge(Math.max(-80, Math.min(80, delta)) * 0.75);
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
            ? window.innerHeight * 0.6
            : e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)
              ? -window.innerHeight * 0.6
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
    if (element?.matches('.journey-stop, #main')) to(element.offsetTop);
  };
  function resize() {
    const points = offsets();
    const rebase = (y: number) => {
      const p = journeyPosition(y, previousOffsets, previousViewport, count);
      return Math.min(maximum(), journeyOffset(p, points, window.innerHeight));
    };
    current = rebase(current);
    target = rebase(target);
    previousOffsets = points;
    previousViewport = window.innerHeight;
    writing = true;
    window.scrollTo({ top: current, behavior: 'instant' });
    writing = false;
  }
  function animate(now: number) {
    frame = requestAnimationFrame(animate);
    const dt = last ? (now - last) / 1000 : 0;
    last = now;
    if (document.hidden || document.querySelector('dialog[open]')) return;
    // A browser anchor or scrollbar move can precede its coalesced scroll event.
    // Capture it before our next frame writes the controlled position back.
    nativeScroll();
    target = Math.min(target, maximum());
    current = Math.min(current, maximum());
    const points = offsets();
    const sample = (y: number) => {
      const p = journeyPosition(y, points, window.innerHeight, count);
      return journeyPose(p.stop + p.phase, count);
    };
    current = journeyScrollStep(
      current,
      target,
      dt,
      window.innerHeight,
      sample,
    );
    writing = true;
    window.scrollTo({ top: current, behavior: 'instant' });
    writing = false;
  }
  window.addEventListener('wheel', wheel, { passive: false });
  window.addEventListener('touchstart', startTouch, { passive: true });
  window.addEventListener('touchmove', touch, { passive: false });
  window.addEventListener('keydown', key);
  window.addEventListener('resize', resize);
  window.addEventListener('hashchange', hash);
  window.addEventListener('scroll', nativeScroll, {
    passive: true,
    capture: true,
  });
  frame = requestAnimationFrame(animate);
  return {
    position: () => current,
    to,
    stop() {
      target = current;
    },
    dispose() {
      cancelAnimationFrame(frame);
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('touchstart', startTouch);
      window.removeEventListener('touchmove', touch);
      window.removeEventListener('keydown', key);
      window.removeEventListener('resize', resize);
      window.removeEventListener('hashchange', hash);
      window.removeEventListener('scroll', nativeScroll, true);
    },
  };
}
