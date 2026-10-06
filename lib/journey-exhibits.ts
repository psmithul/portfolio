const easeBetween = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

export const EXHIBIT_SPACING = 8;
export const EXHIBIT_COUNTS = [1, 3, 3, 3, 1, 1, 1, 1, 1, 2, 1] as const;

/** Reading bays are visited by the same page scroll that drives the train. */
export function exhibitTravel(board: number, phase: number) {
  const count = EXHIBIT_COUNTS[board] ?? 1;
  const end = board === 3 ? 0.3 : 0.56;
  const page = Math.min(
    count - 1,
    Math.floor((Math.max(0, phase) / end) * count),
  );
  const fraction = (phase / end) * count - page;
  const moving = page < count - 1 && fraction > 0.7 && fraction < 1;
  const position =
    page + (page < count - 1 ? easeBetween(0.7, 1, fraction) : 0);
  const returnEnd = board === 3 ? 0.55 : 0.76;
  return {
    offset:
      position * EXHIBIT_SPACING * (1 - easeBetween(end, returnEnd, phase)),
    moving: moving || (count > 1 && phase > end && phase < returnEnd),
    transit: Math.max(
      page < count - 1
        ? easeBetween(0.7, 0.82, fraction) * (1 - easeBetween(0.9, 1, fraction))
        : 0,
      easeBetween(end, end + 0.1, phase),
    ),
    page,
  };
}

/** A page starts turning toward the camera before its chapter boundary. */
export function exhibitPresentation(
  board: number,
  leaf: number,
  timeline: number,
  experiences = 5,
) {
  const start =
    board < 4 ? board : board < 9 ? 4 + (board - 4) / experiences : board - 4;
  const duration = board >= 4 && board < 9 ? 1 / experiences : 1;
  const phase = (timeline - start) / duration;
  const offset = exhibitTravel(board, Math.max(0, phase)).offset;
  const separation = Math.abs(leaf * EXHIBIT_SPACING - offset);
  const t = Math.max(0, Math.min(1, (separation - 2.5) / 5.5));
  const fold = Math.max(
    t * t * (3 - 2 * t),
    1 - easeBetween(-0.24, 0, phase),
    board === 0
      ? easeBetween(0.35, 0.5, phase)
      : board === 3
        ? easeBetween(0.31, 0.38, phase)
        : easeBetween(0.6, 0.72, phase),
  );
  return {
    fold,
    angle: (fold * Math.PI) / 2,
  };
}

export function exhibitReadingPhases(board: number) {
  if (board === 0) return [0];
  if (board === 10) return [0.2];
  const count = EXHIBIT_COUNTS[board] ?? 1;
  const end = board === 3 ? 0.3 : 0.56;
  return Array.from({ length: count }, (_, i) => (end / count) * (i + 0.55));
}
