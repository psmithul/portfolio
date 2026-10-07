import {
  exhibitTravel,
  EXHIBIT_COUNTS,
  EXHIBIT_SPACING,
} from './journey-exhibits.ts';

export type Point = [number, number, number];
export const ORBIT_ORIGIN: Point = [112, 80, -12];
export const STATION_CENTER: Point = [12, 3.5, -10];
export const STATION_RADIUS = 12;
export const GALLERY_RADIUS = 3.8;
export const DISPLAY_RADIUS = 9.5;
export const GALLERY_START = 0.25;
export const GALLERY_END = 0.79;
export const GALLERY_ANGLE = 0.4;
export const LIBRARY_X = 42;
/** All role navigation uses the same gallery timing as the camera and guide. */
export const experienceReadingPhase = (index: number, count = 5) =>
  GALLERY_START + ((GALLERY_END - GALLERY_START) / count) * (index + 0.3);
export function experienceBay(index: number, count = 5) {
  const angle = GALLERY_ANGLE + (index * Math.PI * 2) / count;
  return {
    angle,
    position: [
      ORBIT_ORIGIN[0] + STATION_CENTER[0] + Math.sin(angle) * DISPLAY_RADIUS,
      ORBIT_ORIGIN[1] + STATION_CENTER[1] + 4,
      ORBIT_ORIGIN[2] + STATION_CENTER[2] + Math.cos(angle) * DISPLAY_RADIUS,
    ] as Point,
    instrument: [
      ORBIT_ORIGIN[0] +
        STATION_CENTER[0] +
        Math.sin(angle) * (DISPLAY_RADIUS - 1),
      ORBIT_ORIGIN[1] + STATION_CENTER[1],
      ORBIT_ORIGIN[2] +
        STATION_CENTER[2] +
        Math.cos(angle) * (DISPLAY_RADIUS - 1),
    ] as Point,
    yaw: angle + Math.PI,
  };
}
export const ARCHIVE_TRAIN_X = 102 + (EXHIBIT_COUNTS[3] - 1) * EXHIBIT_SPACING;
const ROCKET_FOOT = 0.475;
export const railZ = (x: number) => Math.sin(x * 0.032) * 2;
export const railAngle = (x: number) => -Math.atan(Math.cos(x * 0.032) * 0.064);
/** The guide's feet use the same rotated cab floor as the rendered locomotive. */
export function trainCab(x: number): Point {
  const angle = railAngle(x);
  return [
    x - 2.2 * Math.cos(angle) + 0.4 * Math.sin(angle),
    1.56,
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
/** The station and library connect through a shallow, continuous lunar ramp. */
export function lunarFloor(x: number) {
  return 3.5 * (1 - easeBetween(22, LIBRARY_X - 8, x));
}
export function dock(x = 0): Point {
  return [
    ORBIT_ORIGIN[0] + x + 6,
    ORBIT_ORIGIN[1] + 3.5 - ROCKET_FOOT,
    ORBIT_ORIGIN[2] + 12,
  ];
}
const orbitPoint = (x: number, y: number, z: number): Point => [
  ORBIT_ORIGIN[0] + x,
  ORBIT_ORIGIN[1] + y,
  ORBIT_ORIGIN[2] + z,
];
const circlePoint = (angle: number): Point =>
  orbitPoint(
    STATION_CENTER[0] + Math.sin(angle + 0.45) * GALLERY_RADIUS,
    STATION_CENTER[1],
    STATION_CENTER[2] + Math.cos(angle + 0.45) * GALLERY_RADIUS,
  );
/** Raised side entry clears the wheel envelope before lowering onto the floor. */
export function stationEntryPath(): Point[] {
  return [
    orbitPoint(18, 4.4, 4.5),
    orbitPoint(18, 4.75, 4.5),
    orbitPoint(18, 4.75, 6.6),
    orbitPoint(18, 3.5, 8.4),
    orbitPoint(14.5, 3.5, 8.4),
    orbitPoint(14.5, 3.5, 0.5),
    orbitPoint(19.5, 3.5, 0.5),
    orbitPoint(19.5, 3.5, -4.5),
    circlePoint(GALLERY_ANGLE),
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
  let rocket: Point = [122, 0.9 - ROCKET_FOOT, 6];
  let rover: Point = [
    ORBIT_ORIGIN[0] + 6,
    ORBIT_ORIGIN[1] + 3.5,
    ORBIT_ORIGIN[2] + 4.5,
  ];
  let seated = false;
  let seating = 0;
  let stationView = 0,
    galleryAngle = GALLERY_ANGLE;
  let focus: Point = [trainX, 0, 0];
  let flight = 0,
    pitch = 0,
    rocketYaw = 0,
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
    const hatch: Point = [122, 0.9, 7.9];
    // Only leave after the last archive card, on the gangway beside the launch pad.
    avatar = walkPath(
      [
        cab,
        [cab[0], 1.56, railZ(trainX) + 1.7],
        [cab[0], 0.9, 4.15],
        hatch,
        [122, 1.15, 7.65],
        [122, 1.15, 6.55],
      ],
      easeBetween(3.32, 3.64, t),
    );
    avatarVisible = t < 3.64;
    walking = t > 3.32 && t < 3.64;
    trainDoor = easeBetween(3.3, 3.32, t) * (1 - easeBetween(3.5, 3.56, t));
    const launch = easeBetween(3.68, 4, t);
    // Rise vertically above the complete lunar foundation before translating.
    // Separate burns also make reverse scrolling follow the same clear corridor.
    const high: Point = [122, 118, 6];
    const overhead: Point = [dock()[0], 118, dock()[2]];
    rocket =
      t < 3.8
        ? blend(rocket, high, easeBetween(3.68, 3.8, t))
        : t < 3.91
          ? blend(high, overhead, easeBetween(3.8, 3.91, t))
          : blend(overhead, dock(), easeBetween(3.91, 4, t));
    flight = Math.sin(Math.PI * launch);
    pitch = 0;
    rocketYaw = Math.PI * easeBetween(3.91, 3.965, t);
    focus = blend([trainX, 0, 0], [122, 0, 6], easeBetween(3.4, 3.68, t));
    focus[0] = mix(focus[0], ORBIT_ORIGIN[0], launch);
    focus[2] = mix(focus[2], ORBIT_ORIGIN[2], launch);
    focus[1] =
      rocket[1] -
      (0.9 - ROCKET_FOOT) * (1 - launch) -
      (3.5 - ROCKET_FOOT) * launch;
  }
  if (t >= 4) {
    rocket = dock();
    rocketYaw = Math.PI;
    if (chapter === 4) {
      const local =
        clamp((phase - GALLERY_START) / (GALLERY_END - GALLERY_START)) * count;
      const index = Math.min(count - 1, Math.floor(local + 1e-9));
      const fraction = Math.min(1, Math.max(0, local - index));
      board = 4 + index;
      boardPhase = fraction;
      display = experienceBay(index, count).position;
      const advance = easeBetween(0.56, 1, fraction);
      galleryAngle = GALLERY_ANGLE + ((index + advance) * Math.PI * 2) / count;
      const driveIn = easeBetween(0.1, 0.16, phase);
      const driveOut = easeBetween(0.9, 1, phase);
      const roverX = mix(mix(6, 18, driveIn), LIBRARY_X + 6, driveOut);
      rover = orbitPoint(roverX, lunarFloor(roverX), 4.5);
      const seat = roverSeat(rover);
      const landingPath: Point[] = [
        [rocket[0], rocket[1] + 0.725, rocket[2] - 1.45],
        [rocket[0], rocket[1] + 0.725, rocket[2] - 1.65],
        [rocket[0], rocket[1] + 0.475, rocket[2] - 1.9],
        orbitPoint(6, 3.5, 8.4),
        orbitPoint(6, 4.75, 6.6),
        orbitPoint(6, 4.75, 4.5),
        orbitPoint(6, 4.4, 4.5),
      ];
      if (phase < 0.1) {
        const arrival = easeBetween(0.007, 0.1, phase);
        avatar = walkPath(landingPath, arrival);
        avatarVisible = phase > 0.012;
        walking = arrival > 0 && arrival < 1;
        seating = easeBetween(0.075, 0.1, phase);
        seated = arrival >= 1;
      } else if (phase < 0.16 || phase >= 0.9) {
        avatar = seat;
        seated = true;
        seating = 1;
      } else if (phase < GALLERY_START) {
        const entry = easeBetween(0.16, GALLERY_START, phase);
        avatar = walkPath(stationEntryPath(), entry);
        walking = entry > 0 && entry < 1;
        seating = 1 - easeBetween(0.16, 0.175, phase);
      } else if (phase <= GALLERY_END) {
        avatar = circlePoint(galleryAngle);
        walking = fraction > 0.56 && fraction < 1;
        inspecting = !walking;
      } else {
        const exit = easeBetween(GALLERY_END, 0.9, phase);
        avatar = walkPath(stationEntryPath().reverse(), exit);
        walking = exit > 0 && exit < 1;
        seating = easeBetween(0.88, 0.9, phase);
      }
      // Enter and leave once. The camera follows the open doorway, then circles
      // the gallery continuously; the rover is stationary for the entire visit.
      stationView =
        easeBetween(0.1, 0.16, phase) * (1 - easeBetween(0.9, 1, phase));
      const center = orbitPoint(...STATION_CENTER);
      focus = blend(
        orbitPoint(roverX - 6, 0, 0),
        center,
        easeBetween(0.16, GALLERY_START, phase) *
          (1 - easeBetween(GALLERY_END, 0.9, phase)),
      );
      const galleryTransit =
        easeBetween(0.5, 0.68, fraction) * (1 - easeBetween(0.9, 1, fraction));
      transit =
        phase < GALLERY_START
          ? easeBetween(0.02, 0.055, phase) *
            (1 - easeBetween(0.22, GALLERY_START, phase))
          : phase <= GALLERY_END
            ? galleryTransit
            : easeBetween(GALLERY_END, 0.81, phase) *
              (1 - easeBetween(0.97, 1, phase));
    } else {
      const fromX = LIBRARY_X + (chapter === 6 ? 32 : 0);
      const toX = fromX + (chapter === 6 ? 0 : 32);
      const travel = easeBetween(0.72, 1, phase);
      const roverX = mix(fromX + gallery.offset, toX, travel) + 6;
      rover = orbitPoint(roverX, lunarFloor(roverX), 4.5);
      avatar = roverSeat(rover);
      seated = true;
      seating = 1;
      board = chapter === 5 ? 9 : 10;
      boardPhase = phase;
      transit =
        (chapter === 5 ? gallery.transit : 0) *
        (1 - easeBetween(0.92, 1, phase));
      display = orbitPoint(fromX - 5 + gallery.offset, 5.4, 8);
      focus = orbitPoint(roverX - 6, 0, 0);
    }
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
    stationView,
    galleryAngle,
    focus,
    flight,
    pitch,
    rocketYaw,
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
