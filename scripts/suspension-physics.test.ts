import assert from 'node:assert/strict';
import test from 'node:test';
import { createSuspensionResponse } from '../lib/suspension-physics.ts';

void test('all three suspension settings converge to a static base displacement', () => {
  for (let stiffness = 0; stiffness < 3; stiffness++) {
    const response = createSuspensionResponse();
    let y = 0;
    for (let i = 0; i < 1200; i++) y = response.step(1 / 120, 0.2, stiffness);
    assert.ok(Math.abs(y - 0.2) < 0.0001);
    response.reset();
    assert.equal(response.step(0, 0, stiffness), 0);
  }
});

void test('fixed-step response stays consistent at different display frame rates', () => {
  function run(fps: number) {
    const response = createSuspensionResponse();
    let y = 0;
    for (let i = 0; i < fps * 4; i++) y = response.step(1 / fps, 0.1, 1);
    return y;
  }
  assert.ok(Math.abs(run(30) - run(60)) < 0.0001);
});

void test('stiffness changes transient motion and damping dissipates the response', () => {
  const soft = createSuspensionResponse(),
    stiff = createSuspensionResponse();
  let a = 0,
    b = 0;
  for (let i = 0; i < 12; i++) {
    a = soft.step(1 / 120, 0.2, 0);
    b = stiff.step(1 / 120, 0.2, 2);
  }
  assert.ok(b > a * 2);
  for (let i = 0; i < 1800; i++) {
    a = soft.step(1 / 120, 0, 0);
    b = stiff.step(1 / 120, 0, 2);
  }
  assert.ok(Math.abs(a) < 0.0001 && Math.abs(b) < 0.0001);
});
