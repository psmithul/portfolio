export const HERO_ROVER_HEADING = -0.62;
export const HERO_ROVER_SCALE = 0.78;
export const HERO_ROVER_WHEEL_RADIUS = (0.456 + 0.021) * HERO_ROVER_SCALE;
export const HERO_ANCHORS = [-3.5, 0, 3.5] as const;

export function heroTargets(progress: number, phase = 0) {
  const p = Math.max(0, Math.min(1, progress));
  const orbit = p * Math.PI * 2 + phase;
  const travel = p * 1.15;
  return [
    {
      position: {
        x: HERO_ANCHORS[0] + Math.sin(orbit) * 0.4,
        y: 0.08 + (1 - Math.cos(orbit)) * 0.2,
        z: Math.sin(orbit) * 0.12,
      },
      rotation: { x: 0, y: Math.sin(orbit / 2), z: 0, w: Math.cos(orbit / 2) },
    },
    {
      position: {
        x: travel * Math.cos(HERO_ROVER_HEADING),
        y: -0.12,
        z: -travel * Math.sin(HERO_ROVER_HEADING),
      },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
    },
    {
      position: { x: HERO_ANCHORS[2], y: 0.08 + p * 0.75, z: 0 },
      rotation: { x: 0, y: 0, z: Math.sin(p * 0.06), w: Math.cos(p * 0.06) },
    },
  ];
}
