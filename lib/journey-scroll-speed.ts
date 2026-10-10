/** One moderate ceiling for the whole journey, independent of chapter or actor. */
export function journeyScrollSpeed(viewport: number) {
  return Math.min(540, Math.max(330, viewport * 0.675));
}
/** Bound input and long frames without changing pace at reading or transfer points. */
export function journeyScrollStep(
  current: number,
  target: number,
  seconds: number,
  viewport: number,
  ceiling = journeyScrollSpeed(viewport),
) {
  const remaining = target - current,
    direction = Math.sign(remaining);
  if (!direction) return current;
  const dt = Math.min(0.05, Math.max(0, seconds));
  if (!dt) return current;
  const maximum = Math.min(
    Math.abs(remaining),
    Math.min(journeyScrollSpeed(viewport), Math.max(0, ceiling)) * dt,
  );
  return current + direction * maximum;
}
