type Point = readonly number[];
export type ScrollPose = {
  trainX: number;
  avatar: Point;
  rocket: Point;
  focus: Point;
  walking: boolean;
  avatarVisible: boolean;
};
const distance = (a: Point, b: Point) =>
  Math.hypot(...a.map((n, i) => n - b[i]));
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
  const maximum = Math.min(
    Math.abs(remaining),
    Math.min(240, Math.max(90, viewport * 0.28)) * dt,
  );
  function allowed(step: number) {
    const b = sample(current + direction * step);
    return (
      Math.abs(a.trainX - b.trainX) <= 8 * dt &&
      distance(a.rocket, b.rocket) <= 13 * dt &&
      distance(a.focus, b.focus) <= 13 * dt &&
      (!(a.avatarVisible && b.avatarVisible && (a.walking || b.walking)) ||
        distance(a.avatar, b.avatar) <= 2.2 * dt)
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
