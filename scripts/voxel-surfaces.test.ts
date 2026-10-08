import test from 'node:test';
import assert from 'node:assert/strict';
import { voxelSurfaces, type VoxelSolid } from '../lib/voxel-surfaces.ts';
import { voxelSurfaceGeometry } from '../lib/voxel-surface-geometry.ts';
import * as THREE from 'three';
import { mergeVoxelParts, rollingTireGeometry } from '../lib/voxel-assembly.ts';
import { exhaustSample } from '../lib/journey-exhaust.ts';
import { journeyPose } from '../lib/journey-choreography.ts';
import { leafCollectorLinkage } from '../lib/leaf-collector-linkage.ts';

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

void test('rigid assemblies retain their exterior and project action while moving in a local frame', () => {
  const frame = new THREE.Group();
  const cubeGeometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial();
  const parts = [0, 0.5].map((x, i) => {
    const mesh = new THREE.Mesh(cubeGeometry, material);
    mesh.position.x = x;
    mesh.userData.voxelType = i ? 'copper' : 'white';
    mesh.userData.action = { kind: 'project', slug: 'rover' };
    frame.add(mesh);
    return mesh;
  });
  const hatch = new THREE.Group();
  frame.add(hatch);
  const joined = mergeVoxelParts(frame, parts, () => material);
  assert.ok(joined.trimmedFaces > 0);
  assert.ok(parts.every((mesh) => mesh.parent === null));
  assert.equal(hatch.parent, frame, 'articulated children stay independent');
  assert.ok(
    joined.meshes.every((mesh) => mesh.userData.action.slug === 'rover'),
  );
  for (const [height, yaw] of [
    [0.425, 0],
    [118, 0.75],
    [83.025, Math.PI],
  ]) {
    frame.position.set(118, height, 0);
    frame.rotation.y = yaw;
    frame.updateMatrixWorld(true);
    const actual = new THREE.Box3().setFromObject(frame);
    const expected = new THREE.Box3(
      new THREE.Vector3(-0.5, -0.5, -0.5),
      new THREE.Vector3(1, 0.5, 0.5),
    ).applyMatrix4(frame.matrixWorld);
    assert.ok(actual.min.distanceTo(expected.min) < 1e-6);
    assert.ok(actual.max.distanceTo(expected.max) < 1e-6);
  }
  joined.geometries.forEach((geometry) => geometry.dispose());
  cubeGeometry.dispose();
  material.dispose();
});

void test('rolling tyre surfaces clear their supporting floor at every wheel angle', () => {
  for (const radius of [0.43, 0.48, 0.62]) {
    const geometry = rollingTireGeometry(radius);
    const material = new THREE.MeshBasicMaterial();
    const wheel = new THREE.Mesh(geometry, material);
    wheel.position.y = radius;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 120) {
      wheel.rotation.z = angle;
      const box = new THREE.Box3().setFromObject(wheel, true);
      assert.ok(
        box.min.y >= -1e-7,
        'no teeth penetrate the supporting surface',
      );
      assert.ok(
        box.min.y < 0.022,
        'faceted tire stays in contact with the floor',
      );
    }
    geometry.dispose();
    material.dispose();
  }
});

void test('the complete exhaust particles clear both pads during launch and landing', () => {
  for (let t = 3.68; t <= 4; t += 0.0005) {
    const pose = journeyPose(t);
    const floor = t < 3.91 ? 0.9 : 83.5;
    for (let age = 0; age < 1; age += 1 / 32) {
      const sample = exhaustSample(age, pose.flight, pose.rocket[1], floor);
      assert.ok(pose.rocket[1] + sample.y - sample.height / 2 > floor + 0.0249);
      assert.ok(Object.values(sample).every(Number.isFinite));
    }
  }
});

void test('the leaf collector closes its linkage and clears the table, chassis and front tyres throughout a revolution', () => {
  for (let angle = 0; angle < Math.PI * 2; angle += 0.001) {
    const { A, B, C, D, scoopAngle } = leafCollectorLinkage(angle);
    const distance = (a: number[], b: number[]) =>
      Math.hypot(...a.map((n, i) => n - b[i]));
    assert.ok(Math.abs(distance(A, B) - 0.3) < 1e-8);
    assert.ok(Math.abs(distance(B, C) - 1.25) < 1e-8);
    assert.ok(Math.abs(distance(C, D) - 1.05) < 1e-8);
    for (const [halfWidth, bottom, top] of [
      [0.45, -0.11, 0.11],
      [0.425, 0.1, 0.6],
    ]) {
      for (const x of [-halfWidth, halfWidth])
        for (const y of [bottom, top]) {
          const worldX =
            C[0] + x * Math.cos(scoopAngle) - y * Math.sin(scoopAngle);
          const worldY =
            C[1] + x * Math.sin(scoopAngle) + y * Math.cos(scoopAngle);
          assert.ok(worldY > 0.05, 'scoop stays above the tabletop');
          assert.ok(
            worldX > 1.5,
            'scoop clears the chassis and front wheel envelope',
          );
          assert.ok(
            worldX < 3.8,
            'the complete mechanism fits its support table',
          );
        }
    }
  }
});
