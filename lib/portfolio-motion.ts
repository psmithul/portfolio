// Input capability selects the experience; viewport size only arranges content.
// Touchscreen laptops keep desktop motion when their primary input is a mouse.
export const DESKTOP_MOTION_QUERY = '(hover: hover) and (pointer: fine)';

export function archiveFanPositions(
  width: number,
  cardWidth: number,
  cardHeight: number,
  count: number,
) {
  const step = cardWidth + 32;
  const columns = Math.max(1, Math.floor((width + 34) / step));
  if (columns >= count) {
    const radius = Math.max(width * 0.65, step * 3);
    return Array.from({ length: count }, (_, index) => {
      const x = (index - (count - 1) / 2) * step;
      return { x, y: radius - Math.sqrt(radius * radius - x * x) };
    });
  }
  if (count === 5 && columns >= 3) {
    const outer = Math.min(step * 1.3, (width - cardWidth) / 2);
    return [
      { x: -outer, y: cardHeight + 64 },
      { x: -step, y: 24 },
      { x: 0, y: 0 },
      { x: step, y: 24 },
      { x: outer, y: cardHeight + 64 },
    ];
  }
  if (count === 5 && columns === 2) {
    return [
      { x: -step / 2, y: (cardHeight + 48) * 2 },
      { x: -step / 2, y: cardHeight + 48 },
      { x: 0, y: 0 },
      { x: step / 2, y: cardHeight + 48 },
      { x: step / 2, y: (cardHeight + 48) * 2 },
    ];
  }
  return Array.from({ length: count }, (_, index) => ({
    x: 0,
    y: index * (cardHeight + 32),
  }));
}
