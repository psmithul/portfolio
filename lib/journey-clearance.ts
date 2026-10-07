import { journeyPose, type Point } from './journey-choreography.ts';

export type Bounds = { min: Point; max: Point };
export type Corridor = Bounds & { actor: 'guide' | 'rocket'; timeline: number };
const cellSize = 8;
const cells = (box: Bounds) => {
  const result: string[] = [];
  for (
    let x = Math.floor(box.min[0] / cellSize);
    x <= Math.floor(box.max[0] / cellSize);
    x++
  )
    for (
      let y = Math.floor(box.min[1] / cellSize);
      y <= Math.floor(box.max[1] / cellSize);
      y++
    )
      for (
        let z = Math.floor(box.min[2] / cellSize);
        z <= Math.floor(box.max[2] / cellSize);
        z++
      )
        result.push(`${x},${y},${z}`);
  return result;
};
export function intersects(a: Bounds, b: Bounds) {
  return a.min.every(
    (n, i) => n < b.max[i] - 0.001 && a.max[i] > b.min[i] + 0.001,
  );
}
/** Volumes match the rendered 32-pixel character and the upright rocket fins.
 * Static mesh placement uses these swept corridors, including floor clearance.
 * Vehicle seating and the open boarding hatch are intentional internal spaces.
 */
export function createJourneyClearance() {
  const grid = new Map<string, Corridor[]>();
  let samples = 0;
  const add = (
    p: Point,
    radius: number,
    height: number,
    actor: Corridor['actor'],
    timeline: number,
    foot = 0,
  ) => {
    const box: Corridor = {
      min: [p[0] - radius, p[1] + foot + 0.06, p[2] - radius],
      max: [p[0] + radius, p[1] + foot + height, p[2] + radius],
      actor,
      timeline,
    };
    for (const key of cells(box)) {
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key)!.push(box);
    }
    samples++;
  };
  for (let t = 3.32; t <= 4.901; t += 0.0005) {
    const pose = journeyPose(t);
    if (pose.avatarVisible && !pose.seated)
      add(pose.avatar, 0.64, 2.3, 'guide', t);
    if (t >= 3.68 && t <= 4) add(pose.rocket, 2.3, 8.05, 'rocket', t, 0.475);
  }
  return {
    samples,
    obstruction(box: Bounds) {
      for (const key of cells(box))
        for (const corridor of grid.get(key) ?? [])
          if (intersects(box, corridor)) return corridor;
      return null;
    },
  };
}
