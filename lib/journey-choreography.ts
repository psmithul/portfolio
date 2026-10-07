import {
  exhibitTravel,
  EXHIBIT_COUNTS,
  EXHIBIT_SPACING,
} from './journey-exhibits.ts';

export type Point = [number, number, number];
export const ORBIT_ORIGIN: Point = [112, 80, -12];
export const PLANET_SPACING = 20;
export const ARCHIVE_TRAIN_X = 102 + (EXHIBIT_COUNTS[3] - 1) * EXHIBIT_SPACING;
const ROCKET_FOOT = 0.475;
export const railZ = (x: number) => Math.sin(x * 0.032) * 2;
export const railAngle = (x: number) => -Math.atan(Math.cos(x * 0.032) * 0.064);
/** The guide's feet use the same rotated cab floor as the rendered locomotive. */
export function trainCab(x: number): Point {
  const angle = railAngle(x);
  return [
    x - 2.2 * Math.cos(angle) + 0.4 * Math.sin(angle),
    1.48,
    railZ(x) + 2.2 * Math.sin(angle) + 0.4 * Math.cos(angle),
  ];
}
export const roverSeat = (rover: Point): Point => [
  rover[0],
  rover[1] + 0.9,
  rover[2],
];
const clamp = (x: number) => Math.max(0, Math.min(1, x));
/** Quintic easing has zero velocity AND acceleration at both ends. */
export const easeBetween = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const blend = (a: Point, b: Point, t: number): Point =>
  a.map((n, i) => mix(n, b[i], t)) as Point;
/** Walk along connected gangways, never diagonally across a missing corner. */
function walkPath(points: Point[], amount: number): Point {
  const lengths = points
    .slice(1)
    .map((p, i) => Math.hypot(...p.map((n, j) => n - points[i][j])));
  let distance = lengths.reduce((a, b) => a + b, 0) * clamp(amount);
  for (let i = 0; i < lengths.length; i++) {
    if (distance <= lengths[i])
      return blend(
        points[i],
        points[i + 1],
        distance / Math.max(lengths[i], 0.001),
      );
    distance -= lengths[i];
  }
  return points[points.length - 1];
}
export const libraryX = (count: number) => (count - 1) * PLANET_SPACING + 36;
/** Level outposts connect through a shallow, continuous lunar ramp. */
export function lunarFloor(x: number, count = 5) {
  return (
    3.5 *
    (1 - easeBetween((count - 1) * PLANET_SPACING + 10, libraryX(count) - 8, x))
  );
}
export function dock(x: number, moon = false): Point {
  return [
    ORBIT_ORIGIN[0] + x + 9,
    ORBIT_ORIGIN[1] + (moon ? 0 : 3.5) - ROCKET_FOOT,
    ORBIT_ORIGIN[2] - 3,
  ];
}

/** One reversible, continuous coordinate drives every actor and the camera. */
export function journeyPose(timeline: number, count = 5) {
  const t = Math.max(0, Math.min(6.999, timeline));
  const chapter = Math.floor(t),
    phase = t - chapter;
  const stop = Math.min(chapter, 3);
  const gallery = exhibitTravel(
    chapter < 4 ? chapter : chapter === 5 ? 9 : 10,
    phase,
  );
  const departure = easeBetween(stop === 0 ? 0.45 : 0.6, 1, phase);
  const offset = chapter < 4 ? gallery.offset : ARCHIVE_TRAIN_X - 102;
  const trainX = stop * 34 + (stop < 3 ? mix(offset, 34, departure) : offset);
  const cab = trainCab(trainX);
  let avatar = cab,
    avatarVisible = true;
  let rocket: Point = [112, 0.9 - ROCKET_FOOT, 6];
  let rover: Point = [
    ORBIT_ORIGIN[0] + 6,
    ORBIT_ORIGIN[1] + 3.5,
    ORBIT_ORIGIN[2] + 4.5,
  ];
  let seated = false;
  let seating = 0;
  let focus: Point = [trainX, 0, 0];
  let flight = 0,
    pitch = 0,
    board = stop,
    boardPhase = phase,
    walking = false,
    inspecting = false,
    transit = 0,
    trainDoor = 0;
  let display: Point = [stop * 34 - 5, 6.3, 10];
  if (chapter < 4) {
    display[0] += gallery.offset;
    transit = chapter === 0 ? easeBetween(0.28, 0.45, phase) : gallery.transit;
  }
  if (t >= 3 && t < 4) {
    const hatch: Point = [112, 0.9, 7.45];
    // Only leave after the last archive card, on the gangway beside the launch pad.
    avatar = walkPath(
      [
        cab,
        [cab[0], 1.48, railZ(trainX) + 1.7],
        [cab[0], 0.9, 4.15],
        hatch,
        [112, 1.15, 6.55],
      ],
      easeBetween(3.32, 3.64, t),
    );
    avatarVisible = t < 3.64;
    walking = t > 3.32 && t < 3.64;
    trainDoor = easeBetween(3.3, 3.32, t) * (1 - easeBetween(3.5, 3.56, t));
    const launch = easeBetween(3.68, 4, t);
    rocket = blend(rocket, dock(0), launch);
    rocket[1] += Math.sin(Math.PI * launch) * 18;
    flight = Math.sin(Math.PI * launch);
    pitch = -Math.sin(Math.PI * launch) * 0.16;
    focus = blend([trainX, 0, 0], [112, 0, 6], easeBetween(3.4, 3.68, t));
    focus[2] = mix(focus[2], -12, launch);
    focus[1] =
      rocket[1] -
      (0.9 - ROCKET_FOOT) * (1 - launch) -
      (3.5 - ROCKET_FOOT) * launch;
  }
  if (t >= 4) {
    let local = (t - 4) * count;
    // Decimal stop coordinates such as 4.6 must resolve to the new workplace.
    if (Math.abs(local - Math.round(local)) < 1e-9) local = Math.round(local);
    let index = Math.min(count - 1, Math.floor(local));
    let fraction = local - index;
    let fromX = index * PLANET_SPACING,
      toX = fromX + PLANET_SPACING;
    let moonFrom = false;
    if (chapter === 4) {
      board = 4 + index;
      if (index === count - 1) {
        toX = libraryX(count);
      }
    } else {
      index = chapter === 5 ? count : count + 1;
      local = index + phase;
      fraction = phase;
      fromX = libraryX(count) + (chapter === 6 ? 32 : 0);
      toX = fromX + (chapter === 6 ? 0 : 32);
      moonFrom = true;
      board = 4 + index;
    }
    const travel = easeBetween(chapter === 4 ? 0.52 : 0.72, 1, fraction);
    boardPhase = fraction;
    transit =
      chapter === 5
        ? gallery.transit
        : chapter === 6
          ? 0
          : easeBetween(0.42, 0.56, fraction);
    transit *= 1 - easeBetween(0.92, 1, fraction);
    rocket = dock(0);
    const roverX = mix(fromX + gallery.offset, toX, travel) + 6;
    rover = [
      ORBIT_ORIGIN[0] + roverX,
      ORBIT_ORIGIN[1] + lunarFloor(roverX, count),
      ORBIT_ORIGIN[2] + 4.5,
    ];
    const baseX = ORBIT_ORIGIN[0] + fromX,
      baseY = ORBIT_ORIGIN[1] + (moonFrom ? 0 : 3.5),
      baseZ = ORBIT_ORIGIN[2];
    const seat = roverSeat(rover);
    const firstLanding = chapter === 4 && index === 0;
    const hatch: Point = firstLanding
      ? [rocket[0], rocket[1] + 1, rocket[2] + 1.45]
      : seat;
    // A single transfer from the landing gantry to a raised side step. All later
    // reading stops are viewed from the rover, without crossing its chassis.
    const arrival = easeBetween(0.025, 0.24, fraction);
    avatar = firstLanding
      ? walkPath(
          [
            hatch,
            [baseX + 9, baseY, baseZ + 6.5],
            [baseX + 6, baseY, baseZ + 6.5],
            [baseX + 6, baseY + 0.58, baseZ + 6.45],
            [baseX + 6, baseY + 1.25, baseZ + 6.05],
            [seat[0], baseY + 1.25, seat[2]],
            seat,
          ],
          arrival,
        )
      : seat;
    avatarVisible = !firstLanding || fraction > 0.035;
    seating = firstLanding ? easeBetween(0.16, 0.24, fraction) : 1;
    seated = !firstLanding || arrival >= 1;
    walking = firstLanding && arrival > 0 && arrival < 1;
    inspecting = false;
    display = [baseX - 5 + gallery.offset, baseY + 5.4, baseZ + 8];
    focus = [ORBIT_ORIGIN[0] + roverX - 6, ORBIT_ORIGIN[1], ORBIT_ORIGIN[2]];
  }
  if (chapter < 4) transit *= 1 - easeBetween(0.94, 1, phase);
  return {
    trainX,
    avatar,
    avatarVisible,
    walking,
    inspecting,
    display,
    trainDoor,
    rocket,
    rover,
    seated,
    seating,
    focus,
    flight,
    pitch,
    board,
    boardPhase,
    exhibitOffset: gallery.offset,
    transit,
    space: easeBetween(3.72, 3.96, t),
  };
}

/** Exact exponential response is independent of the display's refresh rate. */
export function smoothTimeline(current: number, target: number, dt: number) {
  if (Math.abs(target - current) < 1e-7) return target;
  return current + (target - current) * (1 - Math.exp(-Math.max(0, dt) / 0.22));
}
