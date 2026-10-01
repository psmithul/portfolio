import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHeroPhysics, HERO_ANCHORS } from '../lib/hero-physics.ts';

await test('hero physics stays consistent at 30 and 60 frames per second', async () => {
  const slow = await createHeroPhysics();
  const fast = await createHeroPhysics();
  try {
    slow.drive(0.7);
    fast.drive(0.7);
    for (let i = 0; i < 120; i++) slow.step(1 / 30);
    for (let i = 0; i < 240; i++) fast.step(1 / 60);
    slow.states().forEach((state, i) => {
      const other = fast.states()[i];
      for (const axis of ['x', 'y', 'z'] as const) {
        assert.ok(
          Math.abs(state.position[axis] - other.position[axis]) < 0.0001,
        );
        assert.ok(
          Math.abs(state.rotation[axis] - other.rotation[axis]) < 0.0001,
        );
      }
    });
  } finally {
    slow.dispose();
    fast.dispose();
  }
});

await test('scroll targets turn the satellite, roll the rover along its heading, and raise the rocket reversibly', async () => {
  const physics = await createHeroPhysics();
  try {
    physics.seek(0.25);
    for (let i = 0; i < 600; i++) physics.step(1 / 60);
    const [satellite, rover, rocket] = physics.states();
    assert.ok(
      satellite.rotation.y > 0.6,
      'Satellite turns through a quarter orbit',
    );
    assert.ok(
      rover.position.x > 0.2 && rover.position.z > 0.1,
      'Rover travels forwards along its chassis heading',
    );
    assert.ok(rocket.position.y > 0.24, 'Rocket rises with scrolling');
    physics.seek(0);
    for (let i = 0; i < 900; i++) physics.step(1 / 60);
    physics.states().forEach((state, i) => {
      assert.ok(Math.abs(state.position.x - HERO_ANCHORS[i]) < 0.0001);
      assert.ok(Math.abs(state.position.z) < 0.0001);
      assert.ok(Math.abs(state.position.y - (i === 1 ? -0.12 : 0.08)) < 0.0001);
      const q = state.rotation;
      const angularError =
        2 * Math.asin(Math.min(1, Math.hypot(q.x, q.y, q.z)));
      assert.ok(
        angularError < Math.PI / 1800,
        'Returns within 0.1 degree of its resting orientation',
      );
    });
  } finally {
    physics.dispose();
  }
});

await test('sustained scrolling keeps models in separate slots and damping returns them to rest', async () => {
  const physics = await createHeroPhysics();
  try {
    for (let i = 0; i < 1200; i++) {
      physics.drive(i < 600 ? 1 : -1);
      physics.step(1 / 60);
      physics.states().forEach((state, j) => {
        assert.ok(Math.abs(state.position.x - HERO_ANCHORS[j]) < 0.1);
        assert.ok(Math.abs(state.position.y - (j === 1 ? -0.12 : 0.08)) < 0.2);
        const q = state.rotation;
        assert.ok(Math.abs(Math.hypot(q.x, q.y, q.z, q.w) - 1) < 0.0001);
      });
    }
    for (let i = 0; i < 900; i++) physics.step(1 / 60);
    physics.states().forEach((state, i) => {
      assert.ok(
        Math.hypot(state.velocity.x, state.velocity.y, state.velocity.z) <
          0.0001,
      );
      assert.ok(Math.abs(state.position.y - (i === 1 ? -0.12 : 0.08)) < 0.0001);
    });
  } finally {
    physics.dispose();
  }
});
