import {
  journeyScrollSpeed,
  journeyScrollStep,
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
      mode: 'travel' | 'input' | 'brake' = 'travel',
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
        const speed = journeyScrollSpeed(viewport);
        const acceleration = mode === 'travel' ? 900 : 3600;
        const desired =
          mode === 'brake'
            ? 0
            : Math.sign(remaining) *
              Math.min(
                speed,
                Math.sqrt(
                  2 *
                    acceleration *
                    Math.max(0, Math.abs(remaining) - Math.abs(velocity) * dt),
                ),
                Math.abs(remaining) * (mode === 'input' ? 32 : 6),
              );
        velocity += Math.max(
          -acceleration * dt,
          Math.min(acceleration * dt, desired - velocity),
        );
        const proposed = current + velocity * dt;
        const bounded =
          Math.sign(velocity) === Math.sign(remaining)
            ? Math.sign(remaining) *
                Math.min(Math.abs(proposed - current), Math.abs(remaining)) +
              current
            : proposed;
        const next = journeyScrollStep(current, bounded, dt, viewport);
        velocity = (next - current) / dt;
        current = next;
      }
      // Bound the displacement observed by the renderer as well as substeps.
      const bounded = journeyScrollStep(initial, current, duration, viewport);
      if (bounded !== current) velocity = (bounded - initial) / duration;
      return bounded;
    },
  };
}
