import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createHeroRover } from './engineering-scene';

const material = (color: string, metalness = 0.35, roughness = 0.42) =>
  new THREE.MeshStandardMaterial({ color, metalness, roughness });

function part(
  group: THREE.Group,
  geometry: THREE.BufferGeometry,
  mat: THREE.Material,
  position: [number, number, number] = [0, 0, 0],
) {
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(...position);
  group.add(mesh);
  return mesh;
}

function box(
  group: THREE.Group,
  size: [number, number, number],
  mat: THREE.Material,
  position: [number, number, number],
) {
  return part(group, new RoundedBoxGeometry(...size, 2, 0.014), mat, position);
}

function cubesat() {
  const model = new THREE.Group();
  const alloy = material('#a7b2b5', 0.72, 0.31);
  const gold = material('#c59a4a', 0.55, 0.38);
  const dark = material('#334e68', 0.3, 0.32);
  const solar = new THREE.MeshPhysicalMaterial({
    color: '#263e58',
    metalness: 0.45,
    roughness: 0.23,
    clearcoat: 0.45,
  });
  box(model, [0.72, 1.1, 0.72], gold, [0, 0, 0]);
  for (const x of [-0.37, 0.37])
    for (const z of [-0.37, 0.37])
      box(model, [0.055, 1.18, 0.055], alloy, [x, 0, z]);
  for (const y of [-0.56, 0.56]) {
    box(model, [0.82, 0.05, 0.82], alloy, [0, y, 0]);
    for (const x of [-0.3, 0.3])
      for (const z of [-0.3, 0.3]) {
        const screw = part(
          model,
          new THREE.CylinderGeometry(0.019, 0.019, 0.015, 8),
          dark,
          [x, y + (y > 0 ? 0.033 : -0.033), z],
        );
        screw.rotation.x = y < 0 ? Math.PI : 0;
      }
  }
  box(model, [0.53, 0.79, 0.022], dark, [0, 0, 0.37]);
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 2; col++)
      box(model, [0.21, 0.16, 0.025], solar, [
        -0.12 + col * 0.24,
        -0.29 + row * 0.19,
        0.39,
      ]);
  for (const side of [-1, 1]) {
    box(model, [0.25, 0.055, 0.09], alloy, [side * 0.47, 0, 0]);
    box(model, [0.86, 1.09, 0.04], alloy, [side * 1.02, 0, 0]);
    for (let row = 0; row < 5; row++)
      for (let col = 0; col < 3; col++)
        box(model, [0.24, 0.18, 0.022], solar, [
          side * 1.02 - 0.265 + col * 0.265,
          -0.4 + row * 0.2,
          0.033,
        ]);
    const antenna = part(
      model,
      new THREE.CylinderGeometry(0.008, 0.008, 0.47, 8),
      alloy,
      [side * 0.24, 0.8, -0.1],
    );
    antenna.rotation.z = side * 0.25;
  }
  model.rotation.set(0.16, -0.43, -0.08);
  return model;
}

function rocket() {
  const model = new THREE.Group();
  const white = material('#efeee6', 0.25, 0.35);
  const alloy = material('#8296a5', 0.65, 0.3);
  const dark = material('#334e68', 0.45, 0.3);
  const accent = material('#c59a4a', 0.5, 0.35);
  const radius = 0.245;
  part(
    model,
    new THREE.CylinderGeometry(radius, radius, 1.9, 48),
    white,
    [0, -0.05, 0],
  );
  const nosePoints = Array.from({ length: 25 }, (_, i) => {
    const t = i / 24;
    return new THREE.Vector2(radius * Math.sqrt(1 - t * t), 0.9 + t * 0.72);
  });
  part(model, new THREE.LatheGeometry(nosePoints, 48), alloy);
  for (const y of [-0.99, -0.57, 0.34, 0.91])
    part(
      model,
      new THREE.CylinderGeometry(radius + 0.006, radius + 0.006, 0.025, 48),
      y === 0.34 ? accent : alloy,
      [0, y, 0],
    );
  part(
    model,
    new THREE.CylinderGeometry(0.22, 0.22, 0.18, 48),
    dark,
    [0, -1.08, 0],
  );
  // Open engine bell: the nozzle wall and rim have thickness.
  const bellPoints = [
    new THREE.Vector2(0.105, -1.1),
    new THREE.Vector2(0.12, -1.21),
    new THREE.Vector2(0.185, -1.36),
    new THREE.Vector2(0.17, -1.36),
    new THREE.Vector2(0.105, -1.21),
  ];
  part(model, new THREE.LatheGeometry(bellPoints, 48), alloy);
  const finShape = new THREE.Shape();
  finShape.moveTo(radius, -0.54);
  finShape.lineTo(0.49, -0.97);
  finShape.lineTo(0.49, -1.17);
  finShape.lineTo(radius, -1.01);
  finShape.closePath();
  const finGeometry = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.045,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.006,
    bevelThickness: 0.005,
  });
  finGeometry.translate(0, 0, -0.0225);
  for (let i = 0; i < 4; i++) {
    const fin = part(model, finGeometry, dark);
    fin.rotation.y = (i * Math.PI) / 2;
  }
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const duct = part(
      model,
      new THREE.CylinderGeometry(0.012, 0.012, 1.34, 10),
      alloy,
      [
        Math.sin(angle) * (radius + 0.009),
        -0.06,
        Math.cos(angle) * (radius + 0.009),
      ],
    );
    duct.name = 'external-conduit';
  }
  model.rotation.set(0.05, 0.3, -0.16);
  return model;
}

export function buildHeroModels() {
  return [cubesat(), createHeroRover(), rocket()].map((model) => {
    const body = new THREE.Group();
    body.add(model);
    return body;
  });
}
