import * as THREE from 'three';
import { voxelSurfaceGeometry } from './voxel-surface-geometry.ts';

export function rollingTireGeometry(radius: number) {
  return new THREE.CylinderGeometry(radius, radius, 0.36, 12).rotateX(
    Math.PI / 2,
  );
}

/** Join rigid, axis-aligned parts in their own frame before that frame moves. */
export function mergeVoxelParts(
  parent: THREE.Group,
  parts: THREE.Mesh[],
  material: (type: string) => THREE.Material | THREE.Material[],
) {
  const result = voxelSurfaceGeometry(
    parts.map((mesh, order) => {
      if (
        mesh.parent !== parent ||
        mesh.quaternion.angleTo(new THREE.Quaternion()) > 1e-6
      )
        throw new Error(
          'Rigid voxel parts must share an unrotated local frame.',
        );
      const bounds = new THREE.Box3().setFromBufferAttribute(
        mesh.geometry.getAttribute('position') as THREE.BufferAttribute,
      );
      mesh.updateMatrix();
      bounds.applyMatrix4(mesh.matrix);
      return {
        min: bounds.min.toArray() as [number, number, number],
        max: bounds.max.toArray() as [number, number, number],
        type: mesh.userData.voxelType as string,
        order,
      };
    }),
  );
  const action = parts.find((mesh) => mesh.userData.action)?.userData.action;
  parts.forEach((mesh) => mesh.removeFromParent());
  const meshes = Array.from(result.geometries, ([type, geometry]) => {
    const mesh = new THREE.Mesh(geometry, material(type));
    mesh.castShadow = mesh.receiveShadow = true;
    if (action) mesh.userData.action = action;
    parent.add(mesh);
    return mesh;
  });
  return { ...result, meshes };
}
