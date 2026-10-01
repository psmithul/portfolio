import { test } from 'node:test';
import assert from 'node:assert/strict';
import { archiveFanPositions } from '../lib/portfolio-motion.ts';

await test('a 1280-pixel laptop keeps all five roles on one arc with a scrollbar', () => {
  const positions = archiveFanPositions(1177, 210, 466, 5);
  assert.equal(positions[2].y, 0);
  assert.ok(positions.every(({ y }) => y < 466));
  assert.ok(positions[0].y > positions[1].y);
  assert.ok(positions[4].y > positions[3].y);
});

await test('the experience fan fits laptop widths without overlapping cards', () => {
  for (const viewport of [640, 768, 900, 1024, 1280, 1366, 1440, 1600, 1920]) {
    const width = Math.max(220, viewport - 88);
    const cardWidth = Math.min(284, Math.max(210, (width - 128) / 5));
    // Long text and larger system text can make every card taller.
    for (const height of [460, 560, 680]) {
      const positions = archiveFanPositions(width, cardWidth, height, 5);
      for (const [i, a] of positions.entries()) {
        assert.ok(
          Math.abs(a.x) + cardWidth / 2 <= viewport / 2 - 24,
          `${viewport}: card fits`,
        );
        for (const b of positions.slice(i + 1)) {
          assert.ok(
            Math.abs(a.x - b.x) >= cardWidth + 20 ||
              Math.abs(a.y - b.y) >= height + 20,
            `${viewport}: cards have space for rotation`,
          );
        }
      }
    }
  }
});

await test('certificates fit ordinary laptops and narrow windows with the same fan', () => {
  for (const viewport of [320, 640, 768, 1024, 1280, 1440]) {
    const width = Math.max(220, viewport - 88);
    const cardWidth = Math.min(350, Math.max(210, (width - 32) / 2));
    const positions = archiveFanPositions(width, cardWidth, 400, 2);
    assert.equal(positions.length, 2);
    assert.ok(
      positions.every(({ x }) => Math.abs(x) + cardWidth / 2 < viewport / 2),
    );
    const [a, b] = positions;
    assert.ok(
      Math.abs(a.x - b.x) >= cardWidth + 20 || Math.abs(a.y - b.y) >= 420,
    );
  }
});
