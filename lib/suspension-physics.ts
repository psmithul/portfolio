/** Fixed-step base-excited mass/spring/damper, in normalized concept-model units. */
export function createSuspensionResponse() {
  let displacement = 0,
    velocity = 0,
    accumulator = 0;
  return {
    step(seconds: number, base: number, stiffness: number) {
      accumulator += Math.min(Math.max(seconds, 0), 0.1);
      const k = [18, 42, 85][Math.max(0, Math.min(2, Math.round(stiffness)))];
      const damping = 2 * Math.sqrt(k) * 0.24;
      while (accumulator >= 1 / 120) {
        const acceleration = k * (base - displacement) - damping * velocity;
        velocity += acceleration / 120;
        displacement += velocity / 120;
        accumulator -= 1 / 120;
      }
      return displacement;
    },
    reset() {
      displacement = 0;
      velocity = 0;
      accumulator = 0;
    },
  };
}
