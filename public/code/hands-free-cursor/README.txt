HANDS-FREE CURSOR CONTROL

Use Python 3.9 and a desktop with a webcam.

On macOS or Linux:

    python3.9 -m venv .venv
    source .venv/bin/activate
    python -m pip install -r requirements.txt
    python cursor_control.py

The window starts in hand mode. Point inside the guide rectangle to move
the green preview dot. Use E for eye mode and H to return to hand mode.
To play a local recording in preview, run:

    python cursor_control.py --video recording.mp4 --mode hand

In eye mode, keep your head still. Look toward the top-left corner of
your screen, hold your gaze briefly, and press C. Repeat for the
bottom-right corner. Press R to clear the calibration. Eye tracking
works best with even lighting and a steady camera position.

Run with --move to allow desktop pointer control. Press Space in the
preview window to enable or pause it. Switching modes pauses movement.
On macOS, allow camera access and give your terminal Accessibility access
only if you want to move the desktop pointer. Use --camera 1 if the
default camera is unavailable. Press Q or Esc to quit. The script runs
locally and keeps frames in memory while processing them.

On Windows, create the environment with py -3.9 -m venv .venv and run
.venv\Scripts\activate.bat in Command Prompt before installing requirements.
