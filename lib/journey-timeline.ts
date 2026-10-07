import {
  GALLERY_START,
  GALLERY_END,
  easeBetween,
} from './journey-choreography.ts';

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
  const hold = stop === 0 ? 0 : stop === 3 ? 0.35 : stop === 4 ? 0.9 : 0.72;
  const departure = clamp((phase - hold) / (1 - hold), 0, 1);
  const p =
    clamp((phase - GALLERY_START) / (GALLERY_END - GALLERY_START), 0, 1) *
    experienceCount;
  const whole = Math.min(experienceCount - 1, Math.floor(p + 1e-9));
  const fraction = p - whole;
  return {
    stop,
    phase,
    progress: Math.min(6, stop + ease(departure)),
    experience:
      stop === 4
        ? Math.min(experienceCount - 1, whole + easeBetween(0.56, 1, fraction))
        : 0,
  };
}
