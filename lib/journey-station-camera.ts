/** Keep every camera inside the clear central area, away from terminal backs. */
export const STATION_CAMERA_DISTANCE = 17;
export function stationCameraFov(
  aspect: number,
  width: number,
  height: number,
  portrait: boolean,
) {
  const fittingAngle =
    (2 *
      Math.atan(
        Math.max((width * 1.3) / aspect, height * 1.4) /
          (2 * STATION_CAMERA_DISTANCE),
      ) *
      180) /
    Math.PI;
  return Math.max(portrait ? 55 : 43, fittingAngle);
}
export function stationCameraDistance(
  aspect: number,
  width: number,
  height: number,
  fov: number,
  closeUp: boolean,
  smallScreen: boolean,
) {
  const tangent = Math.tan((fov * Math.PI) / 360);
  return Math.min(
    STATION_CAMERA_DISTANCE,
    Math.max(
      closeUp ? 0 : smallScreen ? 10.5 : STATION_CAMERA_DISTANCE,
      (height * 1.4) / (2 * tangent),
      (width * 1.3) / (2 * tangent * aspect),
    ),
  );
}
