import { journeyPosition } from './journey-timeline.ts';
import { journeyPose } from './journey-choreography.ts';
import { journeyScrollSpeed } from './journey-scroll-speed.ts';

export const WALKING_SPEED = 5;

/** Keep the guide, camera and scroll together while limiting actual walking distance. */
export function journeyWalkingPace(
  current: number,
  target: number,
  offsets: readonly number[],
  viewport: number,
  count: number,
) {
  const ceiling = journeyScrollSpeed(viewport);
  const direction = Math.sign(target - current);
  if (!direction) return ceiling;
  // Sample the complete possible long-frame displacement, so a sharp change
  // of path direction cannot slip through the limit at a waypoint.
  const interval = (ceiling * 0.05) / 6;
  const poseAt = (y: number) => {
    const p = journeyPosition(y, offsets, viewport, count);
    return journeyPose(p.stop + p.phase, count);
  };
  let distance = 0;
  for (let i = 0; i <= 6; i++) {
    const y = current + direction * interval * i;
    const a = poseAt(y),
      b = poseAt(y + direction * 0.5);
    if (a.walking || b.walking)
      distance = Math.max(
        distance,
        Math.hypot(...a.avatar.map((n, j) => b.avatar[j] - n)),
      );
  }
  return Math.min(
    ceiling,
    // A small sampling allowance also covers curved movement between frames.
    (WALKING_SPEED * 0.5 * 0.98) / Math.max(distance, 1e-6),
  );
}
