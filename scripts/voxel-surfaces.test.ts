import test from 'node:test';
import assert from 'node:assert/strict';
import { voxelSurfaces, type VoxelSolid } from '../lib/voxel-surfaces.ts';
import { voxelSurfaceGeometry } from '../lib/voxel-surface-geometry.ts';

const cube = (x: number, order: number, type = 'stone'): VoxelSolid => ({
  min: [x, 0, 0],
  max: [x + 1, 1, 1],
  order,
  type,
});
const area = (rect: number[]) => (rect[2] - rect[0]) * (rect[3] - rect[1]);

void test('touching voxels have no internal competing faces', () => {
  const { surfaces } = voxelSurfaces([cube(0, 0), cube(1, 1)]);
  assert.equal(surfaces.length, 10);
  assert.equal(surfaces.filter((s) => s.axis === 0 && s.plane === 1).length, 0);
  assert.equal(
    surfaces.reduce((total, s) => total + area(s.rect), 0),
    10,
  );
});

void test('a coincident exterior belongs only to the last constructed material', () => {
  const { surfaces } = voxelSurfaces([cube(0, 0), cube(0, 1, 'iron')]);
  assert.equal(surfaces.length, 6);
  assert.ok(surfaces.every((s) => s.solid.type === 'iron'));
});

void test('partially overlapping tops are cut into non-overlapping patches without holes', () => {
  const { surfaces } = voxelSurfaces([cube(0, 0), cube(0.5, 1, 'iron')]);
  const tops = surfaces.filter((s) => s.axis === 1 && s.sign === 1);
  assert.equal(
    tops.reduce((total, s) => total + area(s.rect), 0),
    1.5,
  );
  assert.equal(
    tops
      .filter((s) => s.solid.type === 'stone')
      .reduce((total, s) => total + area(s.rect), 0),
    0.5,
  );
  for (let x = 0.025; x < 1.5; x += 0.05)
    assert.equal(tops.filter((s) => s.rect[0] < x && s.rect[2] > x).length, 1);
  assert.equal(
    surfaces.reduce((total, s) => total + area(s.rect), 0),
    8,
  );
});

void test('a buried cuboid contributes no hidden depth or shadow surface', () => {
  const outer: VoxelSolid = {
    min: [-1, -1, -1],
    max: [2, 2, 2],
    type: 'stone',
    order: 0,
  };
  const { surfaces } = voxelSurfaces([outer, cube(0, 1, 'iron')]);
  assert.equal(surfaces.length, 6);
  assert.ok(surfaces.every((s) => s.solid === outer));
});

void test('floating point seams and translated building/road surfaces retain one owner', () => {
  const a: VoxelSolid = {
    min: [120, 83, -22],
    max: [121, 84, -21],
    type: 'moon',
    order: 0,
  };
  const b: VoxelSolid = {
    min: [120.5, 83, -22],
    max: [121.5, 84 + 1e-9, -21],
    type: 'iron',
    order: 1,
  };
  const tops = voxelSurfaces([a, b]).surfaces.filter(
    (s) => s.axis === 1 && s.sign === 1,
  );
  assert.equal(
    tops.reduce((total, s) => total + area(s.rect), 0),
    1.5,
  );
});

void test('generated triangles face outward and preserve all six grass material groups', () => {
  const { geometries } = voxelSurfaceGeometry([cube(0, 0, 'grass')]);
  const geometry = geometries.get('grass')!;
  assert.equal(geometry.groups.length, 6);
  const p = geometry.getAttribute('position'),
    n = geometry.getAttribute('normal');
  for (let i = 0; i < p.count; i += 3) {
    const a = [
      p.getX(i + 1) - p.getX(i),
      p.getY(i + 1) - p.getY(i),
      p.getZ(i + 1) - p.getZ(i),
    ];
    const b = [
      p.getX(i + 2) - p.getX(i),
      p.getY(i + 2) - p.getY(i),
      p.getZ(i + 2) - p.getZ(i),
    ];
    const cross = [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
    assert.ok(
      cross[0] * n.getX(i) + cross[1] * n.getY(i) + cross[2] * n.getZ(i) > 0,
    );
  }
  geometry.dispose();
});
