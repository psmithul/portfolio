export type VoxelSolid = {
  min: [number, number, number];
  max: [number, number, number];
  type: string;
  order: number;
};
type Rect = [number, number, number, number];
export type VoxelSurface = {
  solid: VoxelSolid;
  axis: number;
  sign: number;
  plane: number;
  rect: Rect;
};
const epsilon = 1e-6;
const tile = 2;

function subtract(rect: Rect, cover: Rect): Rect[] {
  const [u0, v0, u1, v1] = rect;
  const a = Math.max(u0, cover[0]),
    b = Math.max(v0, cover[1]);
  const c = Math.min(u1, cover[2]),
    d = Math.min(v1, cover[3]);
  if (c - a <= epsilon || d - b <= epsilon) return [rect];
  const pieces: Rect[] = [];
  if (a - u0 > epsilon) pieces.push([u0, v0, a, v1]);
  if (u1 - c > epsilon) pieces.push([c, v0, u1, v1]);
  if (b - v0 > epsilon) pieces.push([a, v0, c, b]);
  if (v1 - d > epsilon) pieces.push([a, d, c, v1]);
  return pieces;
}

/** Union the cuboids before rendering: buried/shared faces have no second owner. */
export function voxelSurfaces(solids: VoxelSolid[]) {
  const grid = new Map<string, number[]>();
  const visit = (
    solid: VoxelSolid,
    padding: number,
    fn: (key: string) => void,
  ) => {
    for (
      let x = Math.floor((solid.min[0] - padding) / tile);
      x <= Math.floor((solid.max[0] + padding) / tile);
      x++
    )
      for (
        let y = Math.floor((solid.min[1] - padding) / tile);
        y <= Math.floor((solid.max[1] + padding) / tile);
        y++
      )
        for (
          let z = Math.floor((solid.min[2] - padding) / tile);
          z <= Math.floor((solid.max[2] + padding) / tile);
          z++
        )
          fn(`${x},${y},${z}`);
  };
  solids.forEach((solid, index) =>
    visit(solid, 0, (key) => {
      const bucket = grid.get(key);
      if (bucket) bucket.push(index);
      else grid.set(key, [index]);
    }),
  );
  const surfaces: VoxelSurface[] = [];
  let trimmedFaces = 0;
  solids.forEach((solid, index) => {
    const nearby = new Set<number>();
    visit(solid, epsilon, (key) =>
      grid.get(key)?.forEach((other) => nearby.add(other)),
    );
    nearby.delete(index);
    for (let axis = 0; axis < 3; axis++) {
      const u = axis === 0 ? 2 : 0,
        v = axis === 1 ? 2 : 1;
      for (const sign of [-1, 1]) {
        const plane = sign > 0 ? solid.max[axis] : solid.min[axis];
        let rects: Rect[] = [
          [solid.min[u], solid.min[v], solid.max[u], solid.max[v]],
        ];
        let trimmed = false;
        for (const otherIndex of nearby) {
          const other = solids[otherIndex];
          if (
            other.min[axis] > plane + epsilon ||
            other.max[axis] < plane - epsilon
          )
            continue;
          const outer = sign > 0 ? other.max[axis] : other.min[axis];
          // A neighbour encloses this face, or owns the same exterior plane.
          if (
            sign * (outer - plane) <= epsilon &&
            !(Math.abs(outer - plane) <= epsilon && other.order > solid.order)
          )
            continue;
          const cover: Rect = [
            other.min[u],
            other.min[v],
            other.max[u],
            other.max[v],
          ];
          const next = rects.flatMap((rect) => subtract(rect, cover));
          if (
            next.length !== rects.length ||
            next.some((rect, i) => rect.some((n, j) => n !== rects[i][j]))
          )
            trimmed = true;
          rects = next;
          if (!rects.length) break;
        }
        if (trimmed) trimmedFaces++;
        rects.forEach((rect) =>
          surfaces.push({ solid, axis, sign, plane, rect }),
        );
      }
    }
  });
  return { surfaces, trimmedFaces, inputFaces: solids.length * 6 };
}
