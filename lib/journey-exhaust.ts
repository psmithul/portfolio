/** The whole particle clears the surface; a centre-only clamp still cuts the pad. */
export function exhaustSample(
  age: number,
  flight: number,
  rocketHeight: number,
  surfaceHeight: number,
) {
  const height = 0.45 + age * 0.7;
  let radius = 0.08 + age * 0.48;
  let y = 0.55 - age * (3 + flight * 4);
  const penetration = surfaceHeight + 0.025 - (rocketHeight + y - height / 2);
  if (penetration > 0) {
    radius += penetration * 0.55;
    y += penetration;
  }
  return { radius, y, height };
}
