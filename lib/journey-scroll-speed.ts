type Point = readonly number[];
export type ScrollPose = {
  trainX: number;
  avatar: Point;
  rocket: Point;
  rover: Point;
  focus: Point;
  walking: boolean;
  avatarVisible: boolean;
  transit: number;
};
const distance = (a: Point, b: Point) =>
  Math.hypot(...a.map((n, i) => n - b[i]));
/** Accelerate only after reading; ease back down before the next page. */
export function journeyMotionLimits(transit: number) {
  const pace = Math.max(0, Math.min(1, transit));
  return {
    pixels: 1 + 1.6 * pace,
    train: 8 + 12 * pace,
    rocket: 13 + 15 * pace,
    rover: 8 + 12 * pace,
    focus: 13 + 15 * pace,
    walking: 2.2 + 1.6 * pace,
  };
}
/** Bound the actual world motion, not just the input device's arbitrary wheel delta. */
export function journeyScrollStep(
  current: number,
  target: number,
  seconds: number,
  viewport: number,
  sample: (y: number) => ScrollPose,
) {
  const remaining = target - current,
    direction = Math.sign(remaining);
  if (!direction) return current;
  const dt = Math.min(0.05, Math.max(0, seconds));
  if (!dt) return current;
  const a = sample(current);
  const limits = journeyMotionLimits(a.transit);
  const maximum = Math.min(
    Math.abs(remaining),
    Math.min(240, Math.max(90, viewport * 0.28)) * limits.pixels * dt,
  );
  function allowed(step: number) {
    const b = sample(current + direction * step);
    const bound = journeyMotionLimits(Math.min(a.transit, b.transit));
    return (
      Math.abs(a.trainX - b.trainX) <= bound.train * dt &&
      distance(a.rocket, b.rocket) <= bound.rocket * dt &&
      distance(a.rover, b.rover) <= bound.rover * dt &&
      distance(a.focus, b.focus) <= bound.focus * dt &&
      (!(a.avatarVisible && b.avatarVisible && (a.walking || b.walking)) ||
        distance(a.avatar, b.avatar) <= bound.walking * dt)
    );
  }
  if (allowed(maximum)) return current + direction * maximum;
  // Sample the proposed displacement itself, including curved paths and phase boundaries.
  let low = 0,
    high = maximum;
  for (let i = 0; i < 12; i++) {
    const middle = (low + high) / 2;
    if (allowed(middle)) low = middle;
    else high = middle;
  }
  return current + direction * low;
}
