import { easeBetween, journeyPose } from './journey-choreography.ts';
import { EXHIBIT_SPACING } from './journey-exhibits.ts';

/** Adjacent captions blend in their fixed world positions; no page-switch pop. */
export function annotationOpacity(
  index: number,
  leaf: number,
  timeline: number,
  pose = journeyPose(timeline),
) {
  const chapter = Math.floor(timeline),
    phase = timeline - chapter;
  if (index >= 4 && index < 9) {
    if (chapter !== 4) return 0;
    const role =
      index === pose.board
        ? 1 - easeBetween(0.62, 0.96, pose.boardPhase)
        : index === pose.board + 1 && pose.board < 8
          ? easeBetween(0.86, 1, pose.boardPhase)
          : 0;
    return (
      role *
      easeBetween(4.2, 4.25, timeline) *
      (1 - easeBetween(4.79, 4.85, timeline))
    );
  }
  const owner = index < 4 ? index : index === 9 ? 5 : 6;
  if (owner === chapter) {
    const departure =
      owner === 6
        ? 1
        : 1 -
          easeBetween(
            owner === 3 ? 0.3 : owner === 0 ? 0.55 : 0.72,
            owner === 3 ? 0.4 : owner === 0 ? 0.9 : 0.97,
            phase,
          );
    const distance =
      Math.abs(leaf * EXHIBIT_SPACING - pose.exhibitOffset) / EXHIBIT_SPACING;
    return departure * (1 - easeBetween(0.15, 0.82, distance));
  }
  if (leaf !== 0 || owner !== chapter + 1) return 0;
  return owner === 5
    ? easeBetween(4.9, 5, timeline)
    : owner < 4 || owner === 6
      ? easeBetween(0.86, 1, phase)
      : 0;
}
