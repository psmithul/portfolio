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
  return {
    offset: position * EXHIBIT_SPACING,
    moving,
    transit: Math.max(
      page < count - 1
        ? easeBetween(0.7, 0.82, fraction) * (1 - easeBetween(0.9, 1, fraction))
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
  const end = board === 3 ? 0.3 : 0.56;
  return Array.from({ length: count }, (_, i) => (end / count) * (i + 0.55));
}
