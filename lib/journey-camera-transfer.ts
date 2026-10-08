import { easeBetween, type Point } from './journey-choreography.ts';

/** Rise over the station roof, cross it, then descend into the clear viewing bay. */
export function stationCameraTransfer(
  exterior: Point,
  interior: Point,
  phase: number,
  roofClearance: number,
): Point {
  const lift =
    easeBetween(0.12, 0.16, phase) * (1 - easeBetween(0.94, 1, phase));
  const across =
    easeBetween(0.16, 0.22, phase) * (1 - easeBetween(0.82, 0.9, phase));
  const settle =
    easeBetween(0.22, 0.25, phase) * (1 - easeBetween(0.79, 0.82, phase));
  const y =
    exterior[1] + (Math.max(exterior[1], roofClearance) - exterior[1]) * lift;
  return [
    exterior[0] + (interior[0] - exterior[0]) * across,
    (y + (Math.max(interior[1], roofClearance) - y) * across) * (1 - settle) +
      interior[1] * settle,
    exterior[2] + (interior[2] - exterior[2]) * across,
  ];
}
