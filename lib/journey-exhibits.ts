const easeBetween = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

export const EXHIBIT_SPACING = 8;
export const exhibitSpacing = (board: number) =>
  board === 2 ? 11 : EXHIBIT_SPACING;
export const EXHIBIT_COUNTS = [1, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1] as const;
const readingEnd = (board: number) =>
  board === 2 ? 0.72 : board === 3 ? 0.3 : 0.56;

/** Reading bays are visited by the same page scroll that drives the train. */
export function exhibitTravel(board: number, phase: number) {
  const count = EXHIBIT_COUNTS[board] ?? 1;
  const end = readingEnd(board);
  const page = Math.min(
    count - 1,
    Math.floor((Math.max(0, phase) / end) * count),
  );
  const fraction = (phase / end) * count - page;
  // Spread the glide across the reading interval instead of holding for 70%
  // and rushing the full distance at the end. Reading anchors remain legible.
  const moving = page < count - 1 && fraction > 0.38 && fraction < 1;
  const position =
    page + (page < count - 1 ? easeBetween(0.38, 1, fraction) : 0);
  return {
    offset: position * exhibitSpacing(board),
    moving,
    transit: Math.max(
      page < count - 1
        ? easeBetween(0.38, 0.56, fraction) *
            (1 - easeBetween(0.9, 1, fraction))
        : 0,
      easeBetween(end, end + 0.1, phase),
    ),
    page,
  };
}

export function exhibitReadingPhases(board: number) {
  if (board === 0) return [0];
  if (board === 10) return [0.2];
  const count = EXHIBIT_COUNTS[board] ?? 1;
  if (count === 1) return [0];
  const end = readingEnd(board);
  return Array.from({ length: count }, (_, i) => (end / count) * (i + 0.3));
}
