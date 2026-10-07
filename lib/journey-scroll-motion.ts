import {
  journeyMotionLimits,
  journeyScrollStep,
  type ScrollPose,
} from './journey-scroll-speed.ts';

/** One velocity buffer for the route. The scene reads this position without a second delay. */
export function createJourneyMotion() {
  let velocity = 0;
  return {
    reset() {
      velocity = 0;
    },
    step(
      current: number,
      target: number,
      seconds: number,
      viewport: number,
      sample: (y: number) => ScrollPose,
    ) {
      const duration = Math.min(0.05, Math.max(0, seconds));
      const initial = current;
      const steps = Math.ceil(duration * 120);
      if (!steps) return current;
      const dt = duration / steps;
      for (let i = 0; i < steps; i++) {
        const remaining = target - current;
        if (Math.abs(remaining) < 0.025 && Math.abs(velocity) < 0.2) {
          velocity = 0;
          current = target;
          break;
        }
        const pace = journeyMotionLimits(sample(current).transit).pixels;
        const speed = Math.min(240, Math.max(90, viewport * 0.28)) * pace;
        const desired =
          Math.sign(remaining) * Math.min(speed, Math.abs(remaining) * 6);
        velocity += Math.max(-900 * dt, Math.min(900 * dt, desired - velocity));
        const proposed = current + velocity * dt;
        const bounded =
          Math.sign(velocity) === Math.sign(remaining)
            ? Math.sign(remaining) *
                Math.min(Math.abs(proposed - current), Math.abs(remaining)) +
              current
            : proposed;
        const next = journeyScrollStep(current, bounded, dt, viewport, sample);
        velocity = (next - current) / dt;
        current = next;
      }
      // Curved paths may change their limit inside the frame. Also bound the
      // complete displacement observed by the renderer, not just substeps.
      const bounded = journeyScrollStep(
        initial,
        current,
        duration,
        viewport,
        sample,
      );
      if (bounded !== current) velocity = (bounded - initial) / duration;
      return bounded;
    },
  };
}
