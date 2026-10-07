/** Lock the axis from the whole gesture, including slow one-pixel movements. */
export function createJourneyGesture() {
  let startX = 0,
    startY = 0,
    lastX = 0,
    lastY = 0;
  let axis: 'x' | 'y' | null = null;
  let active = false;
  return {
    start(x: number, y: number) {
      startX = lastX = x;
      startY = lastY = y;
      axis = null;
      active = true;
    },
    cancel() {
      active = false;
    },
    move(x: number, y: number) {
      if (!active) return 0;
      if (!axis) {
        const dx = startX - x,
          dy = startY - y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 5) return 0;
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      const delta = axis === 'x' ? lastX - x : lastY - y;
      lastX = x;
      lastY = y;
      return Math.max(-80, Math.min(80, delta)) * 0.9;
    },
  };
}
