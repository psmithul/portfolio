import * as THREE from 'three';
import { voxelSurfaces, type VoxelSolid } from './voxel-surfaces.ts';

export function voxelSurfaceGeometry(solids: VoxelSolid[]) {
  const result = voxelSurfaces(solids);
  const byType = new Map<string, typeof result.surfaces>();
  for (const surface of result.surfaces) {
    if (!byType.has(surface.solid.type)) byType.set(surface.solid.type, []);
    byType.get(surface.solid.type)!.push(surface);
  }
  const geometries = new Map<string, THREE.BufferGeometry>();
  byType.forEach((surfaces, type) => {
    const positions: number[] = [],
      normals: number[] = [],
      uv: number[] = [];
    const geometry = new THREE.BufferGeometry();
    // BoxGeometry's material order: +X, -X, +Y, -Y, +Z, -Z.
    for (let face = 0; face < 6; face++) {
      const start = positions.length / 3;
      for (const { solid, axis, sign, plane, rect } of surfaces) {
        if (axis * 2 + (sign > 0 ? 0 : 1) !== face) continue;
        const u = axis === 0 ? 2 : 0,
          v = axis === 1 ? 2 : 1;
        const corners = [
          [rect[0], rect[1]],
          [rect[2], rect[1]],
          [rect[2], rect[3]],
          [rect[0], rect[3]],
        ];
        const forward = (axis === 2 ? 1 : -1) === sign;
        const indices = forward ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2];
        for (const i of indices) {
          const position = [0, 0, 0],
            normal = [0, 0, 0];
          position[axis] = plane;
          position[u] = corners[i][0];
          position[v] = corners[i][1];
          normal[axis] = sign;
          positions.push(...position);
          normals.push(...normal);
          uv.push(corners[i][0] - solid.min[u], corners[i][1] - solid.min[v]);
        }
      }
      geometry.addGroup(start, positions.length / 3 - start, face);
    }
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute(
      'normal',
      new THREE.Float32BufferAttribute(normals, 3),
    );
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geometry.computeBoundingSphere();
    geometries.set(type, geometry);
  });
  return {
    geometries,
    trimmedFaces: result.trimmedFaces,
    inputFaces: result.inputFaces,
    exposedFaces: result.surfaces.length,
  };
}
