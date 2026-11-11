import argparse
from collections import deque
from math import hypot


def map_point(point, start, end):
    return tuple(
        max(0.0, min(1.0, (value - low) / (high - low)))
        for value, low, high in zip(point, start, end)
    )


def smooth_point(previous, target, weight=0.35):
    if previous is None:
        return target
    return tuple(a + weight * (b - a) for a, b in zip(previous, target))


def eye_offset(points, corners, lids, iris, width, height):
    def position(index):
        point = points[index]
        return point.x * width, point.y * height

    left, right = sorted(position(index) for index in corners)
    dx, dy = right[0] - left[0], right[1] - left[1]
    span = hypot(dx, dy)
    if span < 1:
        return None

    ux, uy = dx / span, dy / span
    upper, lower = (position(index) for index in lids)
    lid_gap = -(lower[0] - upper[0]) * uy + (lower[1] - upper[1]) * ux
    if lid_gap / span < 0.08:
        return None

    x, y = position(iris)
    x -= (left[0] + right[0]) / 2
    y -= (left[1] + right[1]) / 2
    return (x * ux + y * uy) / span, (-x * uy + y * ux) / span


def gaze_position(points, width, height):
    first = eye_offset(points, (33, 133), (159, 145), 468, width, height)
    second = eye_offset(points, (362, 263), (386, 374), 473, width, height)
    if first is None or second is None:
        return None
    return tuple((a + b) / 2 for a, b in zip(first, second))


def index_position(points, width, height):
    wrist, joint, tip = points[0], points[6], points[8]

    def distance(a, b):
        return hypot((a.x - b.x) * width, (a.y - b.y) * height)

    if distance(wrist, tip) <= distance(wrist, joint):
        return None
    return tip.x, tip.y


def run(source, move_mouse, mode):
    import cv2
    import mediapipe as mp

    if move_mouse:
        import pyautogui

        screen_width, screen_height = pyautogui.size()
        if min(screen_width, screen_height) < 3:
            raise RuntimeError("The desktop is too small for cursor control.")
        pyautogui.PAUSE = 0

    camera = cv2.VideoCapture(source)
    from_video = isinstance(source, str)
    armed = False
    position = None
    samples = deque(maxlen=12)
    corners = []
    window = "Hands-free cursor control"

    try:
        if not camera.isOpened():
            if from_video:
                raise RuntimeError(f"Could not open video: {source}")
            raise RuntimeError("Could not open the camera. Check permissions and the camera index.")
        with mp.solutions.hands.Hands(max_num_hands=1) as hands, \
                mp.solutions.face_mesh.FaceMesh(max_num_faces=1, refine_landmarks=True) as face:
            frame_rate = camera.get(cv2.CAP_PROP_FPS) if from_video else 0
            frame_delay = max(1, round(1000 / frame_rate)) if frame_rate > 0 else 1
            while True:
                ok, frame = camera.read()
                if not ok:
                    if from_video:
                        break
                    raise RuntimeError("The camera stopped returning frames.")

                frame = cv2.flip(frame, 1)
                height, width = frame.shape[:2]
                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                target = None
                status = "Point with your index finger"

                if mode == "hand":
                    result = hands.process(rgb)
                    cv2.rectangle(
                        frame, (int(width * 0.18), int(height * 0.18)),
                        (int(width * 0.82), int(height * 0.82)), (160, 160, 160), 1,
                    )
                    if result.multi_hand_landmarks:
                        points = result.multi_hand_landmarks[0].landmark
                        finger = index_position(points, width, height)
                        if finger is not None:
                            target = map_point(finger, (0.18, 0.18), (0.82, 0.82))
                            status = "Tracking index finger"
                else:
                    result = face.process(rgb)
                    gaze = None
                    if result.multi_face_landmarks:
                        points = result.multi_face_landmarks[0].landmark
                        gaze = gaze_position(points, width, height)
                    if gaze is None:
                        samples.clear()
                    else:
                        samples.append(gaze)

                    if len(corners) == 2:
                        status = "Tracking eyes" if gaze is not None else "Eyes out of view"
                        if gaze is not None:
                            target = map_point(gaze, *corners)
                    else:
                        corner = "top left" if not corners else "bottom right"
                        status = f"Look at the screen's {corner}, then press C"
                        if gaze is None:
                            status += " (eyes out of view)"

                position = None if target is None else smooth_point(position, target)
                if position is not None:
                    x, y = position
                    cv2.circle(frame, (int(x * (width - 1)), int(y * (height - 1))), 9, (65, 220, 130), -1)
                    if armed:
                        pyautogui.moveTo(
                            1 + round(x * (screen_width - 3)),
                            1 + round(y * (screen_height - 3)),
                        )

                controls = "H: hand   E: eyes   R: recalibrate   Q: quit"
                if move_mouse:
                    controls += "   Space: pause/resume"
                output = "Desktop cursor active" if armed else "Preview only"
                cv2.rectangle(frame, (0, 0), (width, 83), (24, 24, 24), -1)
                for line, y in ((output, 22), (status, 46), (controls, 70)):
                    cv2.putText(frame, line, (10, y), cv2.FONT_HERSHEY_SIMPLEX, 0.48,
                                (245, 245, 245), 1, cv2.LINE_AA)
                cv2.imshow(window, frame)
                key = cv2.waitKey(frame_delay) & 0xFF

                if key in (ord("q"), 27) or cv2.getWindowProperty(window, cv2.WND_PROP_VISIBLE) == 0:
                    break
                if key == ord(" ") and move_mouse:
                    armed = not armed
                elif key in (ord("h"), ord("e")):
                    mode = "hand" if key == ord("h") else "eyes"
                    position = None
                    armed = False
                    samples.clear()
                elif key == ord("r"):
                    corners.clear()
                    samples.clear()
                    armed = False
                elif key == ord("c") and mode == "eyes" and len(corners) < 2:
                    if len(samples) < samples.maxlen:
                        continue
                    point = tuple(sum(axis) / len(samples) for axis in zip(*samples))
                    if corners and any(abs(a - b) < 0.01 for a, b in zip(corners[0], point)):
                        print("Calibration points were too close. Keep your head still and try again.")
                        continue
                    corners.append(point)
                    samples.clear()
    finally:
        camera.release()
        cv2.destroyAllWindows()


def main():
    parser = argparse.ArgumentParser(description="Move a cursor with a finger or with eye movement.")
    source = parser.add_mutually_exclusive_group()
    source.add_argument("--camera", type=int, default=0, help="Camera index (default: 0)")
    source.add_argument("--video", help="Play a local video in the preview window")
    parser.add_argument("--mode", choices=("hand", "eyes"), default="hand")
    parser.add_argument("--move", action="store_true", help="Allow the Space key to enable desktop movement")
    args = parser.parse_args()
    if args.video and args.move:
        parser.error("Desktop pointer control requires a live camera.")
    try:
        run(args.video or args.camera, args.move, args.mode)
    except (RuntimeError, ImportError) as error:
        parser.exit(1, f"{error}\n")


if __name__ == "__main__":
    main()
