export type JourneyPosition = {
  stop: number;
  phase: number;
  progress: number;
  experience: number;
};
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const ease = (value: number) => value * value * (3 - 2 * value);

export function journeyOffset(
  position: Pick<JourneyPosition, 'stop' | 'phase'>,
  offsets: readonly number[],
  viewport: number,
) {
  const start = offsets[position.stop] ?? 0;
  const length =
    position.stop < 6
      ? (offsets[position.stop + 1] ?? start + viewport) - start
      : viewport;
  return start + position.phase * length;
}

/** Native scroll remains the single source of truth for rail, launch and orbit. */
export function journeyPosition(
  y: number,
  offsets: readonly number[],
  viewport: number,
  experienceCount = 3,
): JourneyPosition {
  let stop = 0;
  for (let i = 0; i < offsets.length; i++) if (y + 2 >= offsets[i]) stop = i;
  stop = clamp(stop, 0, 6);
  const start = offsets[stop] ?? 0;
  const length =
    stop < 6 ? (offsets[stop + 1] ?? start + viewport) - start : viewport;
  const phase = clamp((y - start) / Math.max(length, 1), 0, 1);
  const hold =
    stop === 0
      ? 0
      : stop === 3
        ? 0.35
        : stop === 4
          ? 1 - 0.3 / experienceCount
          : 0.72;
  const departure = clamp((phase - hold) / (1 - hold), 0, 1);
  const p = phase * experienceCount,
    whole = Math.floor(p);
  const fraction = clamp((p - whole - 0.65) / 0.35, 0, 1);
  return {
    stop,
    phase,
    progress: Math.min(6, stop + ease(departure)),
    experience:
      stop === 4 ? Math.min(experienceCount - 1, whole + ease(fraction)) : 0,
  };
}
