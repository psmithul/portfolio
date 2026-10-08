import type { Point } from './journey-choreography.ts';

/** A closed four-bar, mounted ahead of the chassis and above its test table. */
export function leafCollectorLinkage(angle: number) {
  const A: Point = [1.6, 1.55, 1.05];
  const D: Point = [2.55, 1.55, 1.05];
  const B: Point = [
    A[0] + Math.cos(angle) * 0.3,
    A[1] + Math.sin(angle) * 0.3,
    A[2],
  ];
  const dx = D[0] - B[0],
    dy = D[1] - B[1],
    distance = Math.hypot(dx, dy);
  const along = (1.25 ** 2 - 1.05 ** 2 + distance ** 2) / (2 * distance);
  const height = Math.sqrt(Math.max(0, 1.25 ** 2 - along ** 2));
  const C: Point = [
    B[0] + (dx * along + dy * height) / distance,
    B[1] + (dy * along - dx * height) / distance,
    B[2],
  ];
  return { A, B, C, D, scoopAngle: Math.atan2(C[1] - B[1], C[0] - B[0]) };
}
