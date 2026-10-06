import * as THREE from 'three';
import {
  CSS3DObject,
  CSS3DRenderer,
} from 'three/addons/renderers/CSS3DRenderer.js';
import {
  journeyPose,
  ORBIT_ORIGIN,
  easeBetween,
  smoothTimeline,
} from '@/lib/journey-choreography';
import { EXHIBIT_SPACING } from '@/lib/journey-exhibits';
import { createSuspensionResponse } from '@/lib/suspension-physics';
import { journeyExperience } from '@/content/journey';
import { createBlockMaterials, type Block } from '@/lib/voxel-textures';

export type WorldOptions = {
  timeline: number;
  progress: number;
  phase: number;
  stop: number;
  experience: number;
  onboard: boolean;
  reading: boolean | null;
  mobile: boolean;
  reducedMotion: boolean;
  night: boolean;
};
export type WorldAction =
  | { kind: 'project'; slug: string }
  | { kind: 'planet'; index: number }
  | { kind: 'journal' };
export type VoxelWorld = { dispose: () => void; resetView: () => void };
const SPACING = 34;
const LAST_PLANET_X = (journeyExperience.length - 1) * 32;
const LIBRARY_X = LAST_PLANET_X + 36;
const CONTACT_X = LIBRARY_X + 32;
const clamp = THREE.MathUtils.clamp;

const routeZ = (x: number) => Math.sin(x * 0.032) * 2;
const routeAngle = (x: number) => -Math.atan(Math.cos(x * 0.032) * 0.064);

type BatchItem = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
};
/** A continuous Three.js journey: railway, walking character, launch, and voxel planets. */
export function createVoxelWorld(
  host: HTMLElement,
  read: () => WorldOptions,
  onLost: () => void,
  onAction?: (action: WorldAction) => void,
): VoxelWorld {
  const scene = new THREE.Scene();
  const sky = new THREE.Color('#97bbce'),
    dusk = new THREE.Color('#203352'),
    spaceColor = new THREE.Color('#070b21');
  scene.background = sky.clone();
  scene.fog = new THREE.Fog(sky, 90, 205);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);
  const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 500);
  const cube = new THREE.BoxGeometry(1, 1, 1),
    mats = createBlockMaterials();
  const land = new THREE.Group(),
    orbit = new THREE.Group();
  orbit.position.set(...ORBIT_ORIGIN);
  scene.add(land, orbit);
  const batches = new Map<
    string,
    { parent: THREE.Group; type: string; items: BatchItem[] }
  >();
  const targets: THREE.Object3D[] = [];
  const ownedTextures: THREE.Texture[] = [];
  let seed = 120226;
  function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  function block(
    parent: THREE.Group,
    x: number,
    y: number,
    z: number,
    type: string,
    w = 1,
    h = 1,
    d = 1,
  ) {
    const key = parent.uuid + type;
    if (!batches.has(key)) batches.set(key, { parent, type, items: [] });
    batches.get(key)!.items.push({ x, y, z, w, h, d });
  }
  function part(
    parent: THREE.Group,
    x: number,
    y: number,
    z: number,
    type: string,
    w = 1,
    h = 1,
    d = 1,
  ) {
    const mesh = new THREE.Mesh(cube, mats.get(type));
    mesh.position.set(x, y, z);
    mesh.scale.set(w, h, d);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function label(
    parent: THREE.Group,
    x: number,
    y: number,
    z: number,
    text: string,
    sub = '',
    action?: WorldAction,
    width = 4.5,
  ) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#2c2119';
    ctx.fillRect(0, 0, 512, 160);
    ctx.fillStyle = '#a77a48';
    ctx.fillRect(4, 4, 504, 152);
    ctx.fillStyle = '#bc915b';
    ctx.fillRect(10, 10, 492, 140);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#211b17';
    ctx.font = 'bold 30px monospace';
    ctx.fillText(text, 256, sub ? 68 : 92);
    if (sub) {
      ctx.font = '18px monospace';
      ctx.fillText(sub, 256, 111);
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.magFilter = THREE.NearestFilter;
    ownedTextures.push(map);
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(width, width * 0.31, 0.15),
      [
        mats.get('plank') as THREE.Material,
        mats.get('plank') as THREE.Material,
        mats.get('plank') as THREE.Material,
        mats.get('plank') as THREE.Material,
        new THREE.MeshBasicMaterial({ map }),
        mats.get('plank') as THREE.Material,
      ],
    );
    board.position.set(x, y, z);
    parent.add(board);
    if (action) {
      board.userData.action = action;
      targets.push(board);
    }
    block(parent, x, y - 1.05, z, 'log', 0.22, 2.1, 0.22);
    return board;
  }
  const hemi = new THREE.HemisphereLight('#eaf4ff', '#687456', 1.05);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff0ce', 1.45);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, {
    left: -32,
    right: 32,
    top: 32,
    bottom: -32,
    near: 1,
    far: 110,
  });
  sun.shadow.bias = -0.001;
  sun.shadow.normalBias = 0.035;
  scene.add(sun, sun.target);
  const moonLight = new THREE.DirectionalLight('#a7bfff', 0.25);
  moonLight.position.set(-15, 25, 15);
  scene.add(moonLight);

  // Every visible terrain cell is a textured cube on an integer grid.
  for (let x = -35; x <= 139; x++)
    for (let z = -27; z <= 25; z++) {
      const river = x > 12 && x < 23 && z > 5;
      const hill =
        z < -19
          ? Math.max(
              0,
              Math.floor(
                (Math.sin(x * 0.13) + Math.cos(z * 0.18) + 2) *
                  (Math.abs(z) - 18) *
                  0.2,
              ),
            )
          : 0;
      if (river) {
        block(land, x, -1.1, z, 'water', 1, 0.3, 1);
        block(land, x, -2, z, 'dirt');
        continue;
      }
      block(land, x, hill - 0.5, z, 'grass');
      if (hill > 0 || z === 25 || x === -35 || x === 139)
        block(land, x, (hill - 4) / 2, z, 'dirt', 1, hill + 2, 1);
    }
  // Broad grass terraces and wooded ridgelines replace the isolated stone pyramids.
  const ridgeHeight = (x: number, z: number) =>
    Math.max(
      1,
      Math.floor(
        2.5 +
          Math.sin(x * 0.035 + z * 0.07) * 1.8 +
          Math.cos(x * 0.07 - z * 0.035) * 1.2 +
          Math.max(0, -z - 28) * 0.09,
      ),
    );
  for (let x = -45; x <= 150; x++)
    for (let z = -60; z <= -28; z++) {
      const height = ridgeHeight(x, z);
      block(land, x, height - 0.5, z, 'grass');
      block(land, x, (height - 4) / 2, z, 'dirt', 1, height + 2, 1);
    }
  function tree(x: number, z: number, birch = false, base = 0) {
    const h = 4 + Math.floor(random() * 3);
    for (let y = 0; y < h; y++)
      block(land, x, base + y + 0.5, z, birch ? 'birch' : 'log');
    for (let y = h - 2; y <= h + 1; y++) {
      const radius = y === h + 1 ? 1 : 2;
      for (let a = -radius; a <= radius; a++)
        for (let b = -radius; b <= radius; b++) {
          if (
            Math.abs(a) === radius &&
            Math.abs(b) === radius &&
            random() > 0.45
          )
            continue;
          if (a === 0 && b === 0 && y < h) continue;
          block(land, x + a, base + y + 0.5, z + b, 'leaf');
        }
    }
  }
  for (let i = 0; i < 90; i++) {
    const x = -37 + Math.floor(random() * 177),
      z = -32 - Math.floor(random() * 24);
    tree(x, z, i % 5 === 0, ridgeHeight(x, z));
  }
  for (let i = 0; i < 105; i++) {
    const x = -27 + Math.floor(random() * 164),
      z = -24 + Math.floor(random() * 45);
    if (
      z > 0 ||
      Math.abs(z - routeZ(x)) < 6 ||
      (z > -18 &&
        z < 0 &&
        Math.abs(x - Math.round(x / SPACING) * SPACING) < 12) ||
      (x > 8 && x < 26 && z > 3)
    )
      continue;
    tree(x, z, i % 7 === 0);
  }
  for (let i = 0; i < 180; i++) {
    const x = -30 + Math.floor(random() * 162),
      z = 13 + Math.floor(random() * 11);
    if (x > 10 && x < 25) continue;
    if (
      i % 9 === 0 &&
      Math.abs(x - Math.round(x / SPACING) * SPACING) > 13 &&
      z > 20
    )
      tree(x, z);
    else {
      block(land, x, 0.23, z, 'leaf', 0.65, 0.46, 0.65);
      if (i % 4 === 0)
        block(
          land,
          x,
          0.62,
          z,
          i % 8 === 0 ? 'gold' : 'redstone',
          0.3,
          0.3,
          0.3,
        );
    }
  }
  // A raised track, rail ties, and redstone-powered rail intervals.
  for (let x = -29; x < 131; x += 0.5) {
    const z = routeZ(x);
    block(land, x, -0.01, z, 'cobble', 0.5, 0.24, 2.5);
    if (Number.isInteger(x)) block(land, x, 0.18, z, 'plank', 0.4, 0.16, 2.5);
    for (const side of [-1, 1])
      block(
        land,
        x,
        0.32,
        z + side * 0.8,
        x % 8 === 0 ? 'gold' : 'iron',
        0.5,
        0.16,
        0.13,
      );
    if (x % 8 === 0) block(land, x, 0.19, z, 'redstone', 0.35, 0.08, 1.3);
  }
  // River footbridge and fencing.
  for (let x = 11; x <= 24; x++) {
    block(land, x, 0.15, 9, 'plank', 1, 0.3, 3);
    if (x % 2 === 0)
      for (const z of [7.5, 10.5])
        block(land, x, 0.9, z, 'log', 0.22, 1.5, 0.22);
    for (const z of [7.5, 10.5])
      block(land, x, 1.15, z, 'plank', 1, 0.15, 0.16);
  }
  function house(x: number, z: number, roof: Block, width = 9, depth = 7) {
    const hw = Math.floor(width / 2),
      hd = Math.floor(depth / 2);
    for (let a = -hw; a <= hw; a++)
      for (let b = -hd; b <= hd; b++) block(land, x + a, 0.5, z + b, 'cobble');
    for (let y = 1; y <= 4; y++)
      for (let a = -hw; a <= hw; a++)
        for (let b = -hd; b <= hd; b++) {
          if (Math.abs(a) !== hw && Math.abs(b) !== hd) continue;
          const corner = Math.abs(a) === hw && Math.abs(b) === hd;
          if (b === hd && Math.abs(a) <= 1 && y <= 3) continue;
          const window =
            (b === hd || Math.abs(a) === hw) &&
            y >= 2 &&
            y <= 3 &&
            Math.abs(a) % 3 !== 1;
          block(
            land,
            x + a,
            y + 0.5,
            z + b,
            corner ? 'log' : window ? 'glass' : 'plank',
          );
        }
    for (let b = -hd; b <= hd; b++) {
      const top = 5 + hd - Math.abs(b);
      for (let y = 5; y <= top; y++)
        for (const a of [-hw, hw])
          block(land, x + a, y + 0.5, z + b, b === 0 ? 'log' : 'plank');
    }
    for (let b = -hd - 1; b <= hd + 1; b++) {
      const y = 5 + hd + 1 - Math.abs(b);
      for (let a = -hw - 1; a <= hw + 1; a++) {
        // Two touching half-blocks form a Minecraft stair, with no daylight gaps.
        block(land, x + a, y + 0.25, z + b, roof, 1, 0.5, 1);
        block(
          land,
          x + a,
          y + 0.75,
          z + b - Math.sign(b) * 0.25,
          roof,
          1,
          0.5,
          b === 0 ? 1 : 0.5,
        );
      }
    }
    for (let y = 5; y < 8; y++)
      block(land, x - hw + 1, y + 0.5, z - 1, 'brick');
    for (const a of [-hw, hw]) {
      block(land, x + a, 3.8, z + hd + 1, 'dark', 0.15, 0.7, 0.15);
      block(land, x + a, 3.25, z + hd + 1, 'gold', 0.36, 0.48, 0.36);
    }
  }
  for (let s = 0; s < 4; s++) {
    const x = s * SPACING;
    // A continuous visitor platform is on the same side as the cab door and reading display.
    for (let a = -12; a <= (s === 0 ? 12 : 20); a++)
      for (let z = 4; z <= 11; z++)
        block(land, x + a, 0.45, z, s === 2 ? 'cobble' : 'plank', 1, 0.9, 1);
    house(
      x + 5,
      routeZ(x) - 14,
      s === 0 ? 'brick' : s === 1 ? 'oxidized' : s === 2 ? 'dark' : 'copper',
      s === 2 ? 13 : 9,
    );
    // A Create-style inclined gangway joins the exact cab and platform floor heights.
    const startZ = routeZ(x) + 1.7,
      endZ = 4.15,
      length = Math.hypot(endZ - startZ, 0.58);
    const gangway = part(
      land,
      x - 2.2,
      1.19 - 0.07,
      (startZ + endZ) / 2,
      'plank',
      1.25,
      0.14,
      length,
    );
    gangway.rotation.x = Math.atan2(0.58, endZ - startZ);
    for (const side of [-1, 1]) {
      const rail = part(
        land,
        x - 2.2 + side * 0.67,
        1.75,
        (startZ + endZ) / 2,
        'iron',
        0.08,
        0.08,
        length,
      );
      rail.rotation.x = gangway.rotation.x;
    }
    for (const a of [-10, 10]) {
      block(land, x + a, 2.4, 10, 'log', 0.25, 3, 0.25);
      block(land, x + a + 0.35, 3.8, 10, 'dark', 0.9, 0.12, 0.12);
      block(land, x + a + 0.7, 3.4, 10, 'dark', 0.4, 0.15, 0.4);
      block(land, x + a + 0.7, 3.15, 10, 'gold', 0.3, 0.35, 0.3);
    }
    if (s < 3) {
      block(land, x + 8, 1.65, 9.5, 'plank', 3, 0.2, 0.9);
      block(land, x + 8, 2.1, 9.85, 'plank', 3, 0.8, 0.16);
      for (const a of [-1, 1])
        block(land, x + 8 + a, 1.2, 9.5, 'log', 0.22, 0.6, 0.6);
    }
    for (const a of [-12, s === 0 ? 12 : 20])
      for (let z = 5; z <= 11; z += 2) {
        block(land, x + a, 1.5, z, 'log', 0.25, 1.2, 0.25);
        if (z < 11) block(land, x + a, 1.8, z + 1, 'plank', 0.15, 0.15, 2);
      }
  }
  // A village garden beside the About station.
  for (let a = 0; a < 6; a++)
    for (let b = 0; b < 4; b++) {
      block(land, 28 + a, 0.1, -18 - b, 'dirt', 1, 0.2, 1);
      block(
        land,
        28 + a,
        0.45,
        -18 - b,
        b % 2 ? '#b7a63b' : '#4c8a28',
        0.18,
        0.7,
        0.18,
      );
    }
  // Workshop motion comes from linked geometry and a fixed-step spring response.
  const mechanicalUpdates: ((time: number, dt: number) => void)[] = [];
  const yAxis = new THREE.Vector3(0, 1, 0);
  function beam(parent: THREE.Group, type = 'iron', width = 0.12) {
    const mesh = part(parent, 0, 0, 0, type, width, 1, width);
    return (a: THREE.Vector3, b: THREE.Vector3) => {
      const delta = b.clone().sub(a);
      mesh.position.copy(a).add(b).multiplyScalar(0.5);
      mesh.scale.y = delta.length();
      mesh.quaternion.setFromUnitVectors(yAxis, delta.normalize());
    };
  }
  function gearWheel(
    parent: THREE.Group,
    radius: number,
    x: number,
    y: number,
    z: number,
  ) {
    const wheel = new THREE.Group();
    wheel.position.set(x, y, z);
    parent.add(wheel);
    part(wheel, 0, 0, 0, 'dark', radius * 1.5, radius * 1.5, 0.26);
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      const tooth = part(
        wheel,
        Math.cos(a) * radius * 0.88,
        Math.sin(a) * radius * 0.88,
        0,
        'copper',
        radius * 0.38,
        radius * 0.38,
        0.3,
      );
      tooth.rotation.z = a;
    }
    part(wheel, 0, 0, 0.18, 'gold', radius * 0.4, radius * 0.4, 0.16);
    return wheel;
  }
  const projectSlugs = [
    'adaptive-suspension-rover',
    'tensegrity-joint',
    'off-road-leaf-robot',
  ];
  for (let i = 0; i < 3; i++) {
    const x = 70 + i * EXHIBIT_SPACING;
    block(land, x, 1.75, -5, 'dark', 5.5, 0.25, 4);
    for (const a of [-2, 2])
      for (const b of [-1.5, 1.5])
        block(land, x + a, 0.85, -5 + b, 'log', 0.5, 1.7, 0.5);
    const exhibit = new THREE.Group();
    exhibit.position.set(x, 1.9, -5);
    land.add(exhibit);
    if (i === 0) {
      const chassis = new THREE.Group();
      exhibit.add(chassis);
      part(chassis, 0, 1.45, 0, 'oxidized', 3.5, 0.5, 1.5);
      part(chassis, 0.5, 1.9, 0, 'dark', 1.5, 0.4, 1.15);
      part(chassis, 1, 2.4, 0, 'iron', 0.12, 0.8, 0.12);
      part(chassis, 1, 2.8, 0, 'glass', 0.5, 0.3, 0.35);
      const wheels: THREE.Group[] = [],
        links: ReturnType<typeof beam>[] = [],
        coils: ReturnType<typeof beam>[][] = [];
      for (const side of [-1, 1])
        for (const axle of [-1.3, 0, 1.3]) {
          wheels.push(gearWheel(exhibit, 0.48, axle, 0.48, side * 1.05));
          links.push(beam(exhibit, 'iron', 0.14));
          coils.push(
            Array.from({ length: 10 }, () => beam(exhibit, 'copper', 0.07)),
          );
        }
      const response = createSuspensionResponse();
      const drive = gearWheel(exhibit, 0.4, -2.15, 0.45, 0);
      const cam = part(exhibit, -1.3, 0.05, 0, 'redstone', 0.6, 0.1, 2.3);
      mechanicalUpdates.push((time, dt) => {
        const angle = time * 1.35,
          base = (1 + Math.sin(angle)) * 0.23;
        const displacement = response.step(dt, base, 1);
        chassis.position.y = displacement;
        drive.rotation.z = -angle;
        cam.position.y = base * 0.85;
        wheels.forEach((wheel, j) => {
          const axle = [-1.3, 0, 1.3][j % 3],
            side = j < 3 ? -1 : 1;
          const rise = j % 3 === 0 ? base : j % 3 === 1 ? base * 0.5 : 0;
          wheel.position.y = 0.48 + rise;
          wheel.rotation.z = -angle;
          const a = new THREE.Vector3(axle, wheel.position.y, side * 0.94);
          const b = new THREE.Vector3(
            axle + 0.3,
            1.45 + displacement,
            side * 0.78,
          );
          links[j](a, b);
          coils[j].forEach((segment, k) => {
            const from = a.clone().lerp(b, k / 10),
              to = a.clone().lerp(b, (k + 1) / 10);
            from.x += k % 2 ? 0.12 : -0.12;
            to.x += (k + 1) % 2 ? 0.12 : -0.12;
            segment(from, to);
          });
        });
      });
    } else if (i === 1) {
      const bars = Array.from({ length: 3 }, () => beam(exhibit, 'iron', 0.17));
      const cables = Array.from({ length: 9 }, () =>
        beam(exhibit, 'redstone', 0.045),
      );
      const baseEdges = Array.from({ length: 3 }, () =>
        beam(exhibit, 'copper', 0.16),
      );
      const upperEdges = Array.from({ length: 3 }, () =>
        beam(exhibit, 'copper', 0.16),
      );
      const drive = gearWheel(exhibit, 0.42, 1.9, 0.6, 0);
      const actuator = beam(exhibit, 'gold', 0.14);
      const response = createSuspensionResponse();
      mechanicalUpdates.push((time, dt) => {
        const compression = response.step(dt, Math.sin(time * 1.1) * 0.23, 0);
        const bottom = Array.from(
          { length: 3 },
          (_, j) =>
            new THREE.Vector3(
              Math.cos((j * Math.PI * 2) / 3) * 1.3,
              0.25,
              Math.sin((j * Math.PI * 2) / 3) * 1.3,
            ),
        );
        const top = bottom.map(
          (_, j) =>
            new THREE.Vector3(
              Math.cos((j * Math.PI * 2) / 3 + Math.PI / 3) * 1.15 +
                compression * 0.3,
              2.9 - compression,
              Math.sin((j * Math.PI * 2) / 3 + Math.PI / 3) * 1.15,
            ),
        );
        for (let j = 0; j < 3; j++) {
          bars[j](bottom[j], top[(j + 1) % 3]);
          baseEdges[j](bottom[j], bottom[(j + 1) % 3]);
          upperEdges[j](top[j], top[(j + 1) % 3]);
          cables[j](bottom[j], top[j]);
          cables[3 + j](bottom[j], top[(j + 2) % 3]);
          cables[6 + j](bottom[j], bottom[(j + 1) % 3]);
        }
        drive.rotation.z = -time * 1.1;
        actuator(new THREE.Vector3(1.9, 0.6, 0), top[0]);
      });
    } else {
      part(exhibit, 0, 0.85, 0, 'gold', 3, 0.6, 1.65);
      part(exhibit, -0.7, 1.65, 0, 'copper', 1.25, 1.1, 1.5);
      for (const side of [-1, 1])
        for (const axle of [-1, 1])
          gearWheel(exhibit, 0.43, axle, 0.43, side * 1.05);
      const pivotA = new THREE.Vector3(0.3, 1.3, 1.05),
        pivotD = new THREE.Vector3(1.25, 1.3, 1.05);
      const links = Array.from({ length: 3 }, () =>
        beam(exhibit, 'iron', 0.16),
      );
      const drive = gearWheel(exhibit, 0.36, pivotA.x, pivotA.y, pivotA.z);
      const scoop = new THREE.Group();
      exhibit.add(scoop);
      part(scoop, 0, 0, 0, 'oxidized', 0.9, 0.22, 1.9);
      for (const side of [-1, 1])
        part(scoop, 0, 0.35, side * 0.85, 'copper', 0.85, 0.5, 0.15);
      const conveyor = Array.from({ length: 9 }, (_, j) =>
        part(exhibit, -0.1 + j * 0.18, 1.15, 0, 'dark', 0.12, 0.08, 1.4),
      );
      mechanicalUpdates.push((time) => {
        const a = time * 0.8;
        const B = pivotA
          .clone()
          .add(new THREE.Vector3(Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0));
        const delta = pivotD.clone().sub(B),
          d = delta.length(),
          along = (1.25 ** 2 - 1.05 ** 2 + d ** 2) / (2 * d),
          h = Math.sqrt(Math.max(0, 1.25 ** 2 - along ** 2));
        const C = B.clone()
          .addScaledVector(delta, along / d)
          .add(
            new THREE.Vector3(-delta.y / d, delta.x / d, 0).multiplyScalar(-h),
          );
        links[0](pivotA, B);
        links[1](B, C);
        links[2](C, pivotD);
        drive.rotation.z = a;
        scoop.position.copy(C);
        scoop.position.z = 0;
        scoop.rotation.z = Math.atan2(C.y - B.y, C.x - B.x);
        conveyor.forEach((slat, j) => {
          slat.position.x = -0.4 + ((time * 0.25 + j * 0.18) % 1.7);
        });
      });
    }
    exhibit.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.userData.action = { kind: 'project', slug: projectSlugs[i] };
        targets.push(o);
      }
    });
    label(
      land,
      x,
      1.55,
      -2.8,
      ['SPRING · DAMPER', 'TENSION · COMPRESSION', 'CRANK · LINKAGE'][i],
      'CLICK TO EXPLORE',
      { kind: 'project', slug: projectSlugs[i] },
      3.2,
    );
  }
  // Crates, crafting table and archive chests.
  for (let i = 0; i < 4; i++) {
    const x = 96 + i * 2.1;
    block(land, x, 1.5, -5, 'plank', 1.7, 1.2, 1.3);
    block(land, x, 2.17, -5, 'log', 1.8, 0.2, 1.4);
    block(land, x, 1.6, -4.3, 'gold', 0.2, 0.35, 0.08);
  }
  for (let i = 0; i < 3; i++) block(land, 75 + i, 1.5, -12, 'copper');
  // Blocky locomotive: stepped copper boiler, redstone flywheels, open cab and gantry.
  const train = new THREE.Group();
  land.add(train);
  const wheelGroups: THREE.Group[] = [];
  const cars: THREE.Group[] = [];
  let cabDoor: THREE.Group | null = null;
  for (let c = 0; c < 3; c++) {
    const car = new THREE.Group();
    car.position.x = -c * 8;
    train.add(car);
    cars.push(car);
    part(car, 0, 1.2, 0, 'dark', 7.3, 0.45, 2.6);
    for (const side of [-1, 1])
      for (const x of [-2.3, 2.3]) {
        const wheel = new THREE.Group();
        wheel.position.set(x, 0.75, side * 1.35);
        car.add(wheel);
        wheelGroups.push(wheel);
        part(wheel, 0, 0, 0, 'dark', 1.15, 0.75, 0.25);
        part(wheel, 0, 0, 0, 'dark', 0.75, 1.15, 0.25);
        part(wheel, 0, 0, side * 0.15, 'copper', 0.65, 0.65, 0.12);
        part(wheel, 0, 0, side * 0.22, 'iron', 0.22, 0.22, 0.12);
        part(wheel, 0.22, 0, side * 0.26, 'gold', 0.15, 0.15, 0.15);
      }
    part(car, -3.8, 1.2, 0, 'iron', 0.7, 0.18, 0.18);
    if (c === 0) {
      for (let a = 0; a < 4; a++) {
        part(car, a * 0.7 - 0.3, 2.15, 0, 'copper', 0.7, 1.65, 1.7);
        part(car, a * 0.7 - 0.3, 3.06, 0, 'copper', 0.7, 0.25, 1.25);
      }
      for (const side of [-1, 1]) {
        part(car, 0.8, 1.48, side * 1, 'gold', 3.2, 0.13, 0.15);
        part(car, 0, 1.93, side * 1, 'redstone', 0.65, 0.55, 0.13);
        part(
          car,
          side < 0 ? -1.9 : -1.25,
          1.8,
          side * 1.1,
          'oxidized',
          side < 0 ? 2 : 0.5,
          0.65,
          0.23,
        );
        for (const x of [-2.8, -1])
          part(car, x, 2.8, side * 1.1, 'oxidized', 0.2, 2.1, 0.2);
        part(
          car,
          side < 0 ? -2 : -1.25,
          2.8,
          side * 1.1,
          'glass',
          side < 0 ? 0.75 : 0.45,
          0.9,
          0.12,
        );
        part(car, 2.1, 2.15, side * 0.7, 'gold', 0.35, 0.5, 0.2);
      }
      cabDoor = new THREE.Group();
      cabDoor.position.set(-2.2, 2.6, 1.12);
      car.add(cabDoor);
      part(cabDoor, 0, -0.45, 0, 'oxidized', 0.8, 1.2, 0.12);
      part(cabDoor, 0, 0.55, 0, 'glass', 0.8, 0.8, 0.12);
      part(car, -1.9, 3.9, 0, 'dark', 2.6, 0.3, 2.8);
      part(car, -1.9, 4.12, 0, 'oxidized', 2.2, 0.2, 2.4);
      part(car, 1.35, 3.75, 0, 'dark', 0.6, 1.2, 0.6);
      part(car, 1.35, 4.42, 0, 'iron', 0.95, 0.23, 0.95);
      for (let a = 0; a < 3; a++)
        part(
          car,
          3.5 + a * 0.23,
          1.22 - a * 0.18,
          0,
          'dark',
          0.25,
          0.25,
          2.5 - a * 0.6,
        );
      part(car, -1.9, 1.48, 0, 'plank', 2, 0.16, 2);
      // Ladder and externally visible power cells.
      for (let y = 0; y < 3; y++)
        part(car, -2.6, 0.9 + y * 0.36, 1.52, 'iron', 0.7, 0.1, 0.18);
      part(car, -3.15, 2.1, 0, 'redstone', 0.3, 0.7, 1.3);
    } else {
      part(car, 0, 1.48, 0, 'plank', 6.7, 0.15, 2.4);
      for (const side of [-1, 1]) {
        part(
          car,
          0,
          1.9,
          side * 1.12,
          c === 1 ? 'oxidized' : 'copper',
          6.6,
          0.8,
          0.22,
        );
        for (let j = -3; j <= 3; j += 2)
          part(car, j, 2.8, side * 1.12, 'log', 0.2, 2, 0.2);
        part(car, 0, 2.75, side * 1.12, 'glass', 5.8, 0.85, 0.06);
      }
      part(car, 0, 3.85, 0, 'dark', 7, 0.3, 2.9);
      part(car, 0, 4.1, 0, 'oxidized', 6.6, 0.2, 2.4);
      for (let j = -2; j <= 2; j += 2)
        part(car, j, 1.95, 0, 'plank', 0.8, 0.6, 1.5);
    }
  }
  // Create-inspired transmission: toothed flywheels and reciprocating coupling rods.
  const gears: THREE.Group[] = [];
  const couplingRods: THREE.Mesh[] = [];
  const pistonUpdates: ((angle: number) => void)[] = [];
  for (const side of [-1, 1]) {
    const gear = new THREE.Group();
    gear.position.set(0.1, 2.15, side * 1.02);
    cars[0].add(gear);
    gears.push(gear);
    part(gear, 0, 0, 0, 'dark', 0.74, 0.74, 0.15);
    part(gear, 0, 0, side * 0.1, 'gold', 0.38, 0.38, 0.18);
    for (let tooth = 0; tooth < 12; tooth++) {
      const a = (tooth * Math.PI) / 6;
      const mesh = part(
        gear,
        Math.cos(a) * 0.5,
        Math.sin(a) * 0.5,
        0,
        'copper',
        0.22,
        0.22,
        0.2,
      );
      mesh.rotation.z = a;
    }
    const rod = part(cars[0], 0, 0.8, side * 1.61, 'iron', 4.6, 0.15, 0.12);
    couplingRods.push(rod);
    const connectingRod = beam(cars[0], 'iron', 0.13);
    const piston = part(
      cars[0],
      3.5,
      0.75,
      side * 1.61,
      'copper',
      0.4,
      0.25,
      0.25,
    );
    part(cars[0], 4.05, 0.75, side * 1.61, 'dark', 0.8, 0.42, 0.42);
    pistonUpdates.push((angle) => {
      const pin = new THREE.Vector3(
        2.3 + Math.cos(angle) * 0.22,
        0.75 + Math.sin(angle) * 0.22,
        side * 1.61,
      );
      const slider = new THREE.Vector3(
        pin.x + Math.sqrt(1.1 ** 2 - (pin.y - 0.75) ** 2),
        0.75,
        pin.z,
      );
      piston.position.x = slider.x;
      connectingRod(pin, slider);
    });
    part(cars[0], 1.9, 1.65, side * 1.12, 'dark', 0.85, 0.55, 0.45);
    part(cars[0], -2.9, 2.8, side * 1.1, 'gold', 0.16, 1.15, 0.16);
  }
  // Four independently pivoting limbs give the guide a Minecraft walk cycle.
  function character(parent: THREE.Object3D) {
    const avatar = new THREE.Group();
    parent.add(avatar);
    part(avatar, 0, 1.15, 0, '#242832', 0.6, 0.72, 0.32);
    part(avatar, 0, 1.82, 0, '#a97954', 0.53, 0.53, 0.53);
    part(avatar, 0, 2.08, -0.015, '#202027', 0.58, 0.18, 0.58);
    part(avatar, 0, 1.88, -0.265, '#202027', 0.53, 0.34, 0.065);
    // Block curls, squared spectacles, a short beard and the portrait's dark shirt.
    for (let a = -1; a <= 1; a++)
      for (let b = -1; b <= 1; b++)
        part(
          avatar,
          a * 0.19,
          2.14 + ((a + b) % 2 ? 0.04 : 0),
          b * 0.19,
          (a + b) % 2 ? '#30313a' : '#22232b',
          0.2,
          0.15,
          0.2,
        );
    part(avatar, 0, 1.64, 0.268, '#302a27', 0.42, 0.12, 0.035);
    part(avatar, 0, 1.71, 0.285, '#493a30', 0.24, 0.045, 0.04);
    part(avatar, 0, 1.77, 0.294, '#b58763', 0.07, 0.09, 0.06);
    for (let y = 0; y < 3; y++)
      part(avatar, 0, 1.03 + y * 0.15, 0.168, '#8b8c88', 0.035, 0.035, 0.018);
    part(avatar, 0, 0.79, 0.01, '#1b1d22', 0.61, 0.08, 0.34);
    part(avatar, 0, 0.79, 0.188, '#a4a6a3', 0.09, 0.065, 0.035);
    for (const side of [-1, 1]) {
      part(avatar, side * 0.12, 1.85, 0.279, '#24242a', 0.055, 0.045, 0.015);
      for (const edge of [-1, 1]) {
        part(
          avatar,
          side * 0.13,
          1.86 + edge * 0.07,
          0.3,
          '#24242a',
          0.22,
          0.018,
          0.025,
        );
        part(
          avatar,
          side * 0.13 + edge * 0.1,
          1.86,
          0.3,
          '#24242a',
          0.018,
          0.14,
          0.025,
        );
      }
      part(avatar, side * 0.24, 1.68, 0.269, '#302a27', 0.035, 0.14, 0.035);
    }
    part(avatar, 0, 1.85, 0.281, '#172125', 0.12, 0.035, 0.018);
    const limbs: THREE.Group[] = [];
    for (let i = 0; i < 4; i++) {
      const arm = i < 2,
        side = i % 2 ? 1 : -1,
        pivot = new THREE.Group();
      pivot.position.set(side * (arm ? 0.42 : 0.16), arm ? 1.45 : 0.82, 0);
      avatar.add(pivot);
      part(
        pivot,
        0,
        arm ? -0.23 : -0.36,
        0,
        arm ? '#242832' : '#30323c',
        arm ? 0.22 : 0.26,
        arm ? 0.48 : 0.73,
        0.28,
      );
      part(
        pivot,
        0,
        arm ? -0.5 : -0.73,
        arm ? 0 : 0.035,
        arm ? '#a97954' : '#22252b',
        arm ? 0.22 : 0.27,
        arm ? 0.2 : 0.16,
        arm ? 0.26 : 0.36,
      );
      limbs.push(pivot);
    }
    part(limbs[1], 0, -0.49, 0.145, 'iron', 0.16, 0.12, 0.035);
    part(limbs[1], 0, -0.49, 0.17, '#e2d9c9', 0.09, 0.09, 0.02);
    return { avatar, limbs };
  }
  const guide = character(scene);
  // Launch pad and an approaching rocket with a lower boarding hatch.
  const padX = 112,
    padZ = 6;
  for (let a = -4; a <= 4; a++)
    for (let b = -4; b <= 4; b++)
      block(
        land,
        padX + a,
        0.45,
        padZ + b,
        Math.abs(a) === 4 || Math.abs(b) === 4 ? 'dark' : 'iron',
        1,
        0.9,
        1,
      );
  for (let y = 1; y <= 10; y++) {
    block(land, padX - 4, y + 0.5, padZ - 3, 'iron', 0.3, 1, 0.3);
    block(land, padX - 4, y + 0.5, padZ + 1, 'iron', 0.3, 1, 0.3);
    block(land, padX - 4, y + 0.5, padZ - 1, 'dark', 0.15, 0.12, 4);
  }

  const hatchPanels: THREE.Mesh[] = [];
  function rocket(parent: THREE.Object3D) {
    const group = new THREE.Group();
    parent.add(group);
    for (let y = 1; y < 7; y++) {
      part(group, 0, y, 0, y === 2 ? 'copper' : 'white', 2, 1, 2);
      if (y > 2 && y < 6)
        for (const side of [-1, 1])
          part(group, side * 1.02, y, 0, 'oxidized', 0.12, 1, 1.5);
    }
    part(group, 0, 7, 0, 'copper', 1.5, 1, 1.5);
    part(group, 0, 7.8, 0, 'copper', 1, 0.6, 1);
    part(group, 0, 8.3, 0, 'copper', 0.5, 0.4, 0.5);
    part(group, 0, 1.9, 1.03, 'dark', 0.85, 2.4, 0.1);
    const hatchPanel = part(group, 0, 1.9, 1.13, 'oxidized', 0.82, 2.35, 0.12);
    hatchPanels.push(hatchPanel);
    const handle = new THREE.Mesh(cube, mats.get('gold'));
    handle.position.set(0.3, 0, 0.7);
    handle.scale.set(0.1, 0.12, 0.15);
    hatchPanel.add(handle);
    part(group, 0, 5, 1.03, 'dark', 1.12, 1.28, 0.1);
    part(group, 0, 5, 1.1, 'glass', 0.8, 0.92, 0.1);
    part(group, 0, 1, 0, 'dark', 1.4, 0.5, 1.4);
    for (const side of [-1, 1]) {
      part(group, side * 1.5, 1.7, 0, 'oxidized', 1, 2, 1.2);
      part(group, side * 1.8, 0.65, 0, 'dark', 0.6, 0.35, 1.7);
      part(group, 0, 1.7, side * 1.5, 'oxidized', 1.2, 2, 1);
    }
    return group;
  }
  const launchRocket = rocket(scene);
  launchRocket.position.set(padX, 0.65, padZ);
  const flames = new THREE.Group();
  launchRocket.add(flames);
  for (let i = 0; i < 14; i++) {
    part(
      flames,
      (random() - 0.5) * 1.2,
      -1 - i * 0.35,
      (random() - 0.5) * 1.2,
      i % 3 === 0 ? '#fff4b3' : i % 3 === 1 ? '#f5b13e' : '#e46728',
      0.4,
      0.7,
      0.4,
    );
  }

  // Five orbital workplaces make each role a place to visit, rather than a generic globe.
  const orbitalUpdates: ((time: number) => void)[] = [];
  for (let index = 0; index < journeyExperience.length; index++) {
    const group = new THREE.Group();
    group.position.set(index * 32, -1, 0);
    orbit.add(group);
    const floor = index === 0 ? 'grass' : index === 3 ? 'plank' : 'moon';
    for (let a = -6; a <= 6; a++)
      for (let c = -5; c <= 5; c++) {
        const edge = Math.abs(a) === 6 || Math.abs(c) === 5;
        block(group, a, 4, c, edge ? 'oxidized' : floor);
        const depth = edge ? 2 : 3 + ((a + c + 20) % 3 === 0 ? 1 : 0);
        block(
          group,
          a,
          3.5 - depth / 2,
          c,
          edge ? 'dark' : 'stone',
          1,
          depth,
          1,
        );
      }
    for (const a of [-5.5, 5.5])
      for (const c of [-4.5, 4.5]) {
        block(group, a, 0.7, c, 'copper', 0.65, 1, 0.65);
        block(group, a, 0.05, c, 'glass', 0.85, 0.35, 0.85);
      }
    for (let a = 6; a <= 10; a++)
      for (let c = 2; c <= 4; c++) block(group, a, 4, c, 'iron');
    for (let a = 7; a < 10; a++)
      block(group, a, 4.7, 4.5, 'iron', 1, 0.15, 0.15);
    // Back-wall beams and a completed roof give every workplace a distinct architectural silhouette.
    if (index === 0) {
      for (let a = -4; a <= 4; a++)
        for (let y = 5; y <= 8; y++) block(group, a, y, -4, 'iron');
      for (const a of [-4, 4])
        for (let y = 5; y <= 9; y++)
          for (let c = -3; c <= 1; c++)
            block(group, a, y, c, y < 8 && c > -2 ? 'glass' : 'iron');
      for (let c = -5; c <= 2; c++)
        for (let a = -5; a <= 5; a++)
          block(
            group,
            a,
            10 + Math.floor((5 - Math.abs(a)) / 2) * 0.5,
            c,
            'oxidized',
            1,
            0.5,
            1,
          );
      block(group, 0, 4.55, 0, 'dark', 7, 0.1, 3);
      for (let a = -3; a <= 3; a++)
        block(group, a, 4.62, 0, 'gold', 0.5, 0.04, 0.2);
      const aircraft = new THREE.Group();
      aircraft.position.set(0, 5.15, 0);
      group.add(aircraft);
      part(aircraft, 0, 0, 0, 'white', 4, 0.45, 0.6);
      part(aircraft, -0.25, 0.2, 0, 'oxidized', 0.8, 0.3, 4.3);
      part(aircraft, -1.65, 0.55, 0, 'copper', 0.7, 0.6, 0.2);
      const propeller = new THREE.Group();
      propeller.position.set(2.1, 0, 0);
      aircraft.add(propeller);
      part(propeller, 0, 0, 0, 'dark', 0.12, 1.6, 0.12);
      part(propeller, 0, 0, 0, 'dark', 0.12, 0.12, 1.6);
      orbitalUpdates.push((time) => {
        propeller.rotation.x = time * 2;
      });
      for (const a of [-5, 5]) {
        block(group, a, 5, 2, 'log', 1, 1, 1);
        block(group, a, 6, 2, 'leaf', 2, 1, 2);
      }
    } else if (index === 1) {
      for (let a = -4; a <= 4; a++)
        for (let y = 5; y <= 9; y++)
          block(group, a, y, -4, y === 9 ? 'oxidized' : 'dark');
      for (const a of [-4, 4])
        for (let c = -3; c <= 1; c++)
          for (let y = 5; y <= 8; y++)
            block(group, a, y, c, y === 5 || c === 1 ? 'oxidized' : 'glass');
      for (let a = -4; a <= 4; a++)
        for (let c = -4; c <= 1; c++)
          block(group, a, 9.6, c, 'oxidized', 1, 0.2, 1);
      for (let a = -3; a <= 3; a += 3) {
        block(group, a, 5.35, -1, 'log', 2, 0.2, 1.2);
        block(group, a, 6.2, -1.3, 'dark', 1.35, 1.1, 0.18);
        block(group, a, 6.2, -1.19, 'glass', 1.1, 0.85, 0.05);
        block(group, a, 4.9, 0.8, 'purple', 0.9, 0.8, 0.8);
      }
      for (let a = -3; a <= 3; a++)
        block(group, a, 4.55, 2.5, 'redstone', 1, 0.06, 0.15);
      for (let y = 5; y <= 8; y++)
        block(group, 2, y, -3.3, 'copper', 1, 1, 0.5);
    } else if (index === 2) {
      for (const a of [-4, -2, 2, 4])
        for (let y = 5; y <= 8; y++)
          block(group, a, y, -1.5, 'white', 0.7, 1, 0.7);
      for (let a = -5; a <= 5; a++) block(group, a, 9, -1.5, 'white', 1, 1, 2);
      for (let a = -4; a <= 4; a++)
        block(group, a, 9.75, -1.5, 'gold', 1, 0.5, 2);
      for (let a = -4; a <= 4; a++)
        for (let y = 5; y <= 8; y++) block(group, a, y, -4, 'plank');
      block(group, 0, 5.2, -2.5, 'log', 5, 1.2, 1);
      for (let a = -2; a <= 2; a += 2)
        block(group, a, 6, -2.4, 'white', 0.8, 0.08, 0.6);
      for (let step = 0; step < 3; step++)
        block(
          group,
          0,
          4.6 + step * 0.25,
          2 - step * 0.5,
          'white',
          6,
          0.25,
          0.5,
        );
    } else if (index === 3) {
      for (let a = -4; a <= 4; a++)
        block(group, a, 4.85, -1.5, 'plank', 1, 0.7, 4);
      for (const a of [-4, 4])
        for (let y = 5; y <= 10; y++)
          block(group, a, y, -3, 'log', 0.5, 1, 0.5);
      for (let a = -5; a <= 5; a++)
        for (let c = -4; c <= 0; c++)
          block(group, a, 10.25, c, 'copper', 1, 0.5, 1);
      for (const a of [-3, 3])
        block(group, a, 8.5, -3, 'redstone', 1.5, 2.5, 0.15);
      block(group, 0, 5.8, -0.5, 'dark', 1.2, 1.2, 0.8);
      block(group, 0, 6.7, -0.5, 'iron', 0.12, 0.6, 0.12);
      for (const a of [-3, 0, 3])
        block(group, a, 4.95, 2, 'plank', 2, 0.5, 0.7);
    } else {
      for (let a = -4; a <= 4; a++)
        for (let c = -4; c <= 1; c++) {
          if (Math.abs(a) === 4 || c === -4)
            for (let y = 5; y <= 8; y++)
              block(group, a, y, c, y >= 6 && c > -4 ? 'glass' : 'plank');
        }
      for (let level = 0; level < 4; level++)
        for (let a = -5 + level; a <= 5 - level; a++)
          for (let c = -4 + level; c <= 2 - level; c++)
            block(group, a, 9 + level * 0.5, c, 'oxidized', 1, 0.5, 1);
      block(group, 0, 5.35, -0.5, 'log', 4.5, 0.3, 1.5);
      for (let a = -1; a <= 1; a++)
        block(group, a, 5.6, -0.5, 'white', 0.6, 0.08, 0.8);
      const telescope = new THREE.Group();
      telescope.position.set(4.5, 5, 2);
      group.add(telescope);
      part(telescope, 0, 0.3, 0, 'iron', 0.3, 1.4, 0.3);
      const tube = new THREE.Group();
      tube.position.y = 1;
      telescope.add(tube);
      part(tube, 0, 0.5, 0, 'copper', 0.65, 2, 0.65);
      part(tube, 0, 1.7, 0, 'dark', 0.8, 0.3, 0.8);
      part(tube, 0, 1.88, 0, 'glass', 0.5, 0.04, 0.5);
      orbitalUpdates.push((time) => {
        telescope.rotation.y = Math.sin(time * 0.08) * 0.3;
        tube.rotation.z = -0.55 + Math.sin(time * 0.11) * 0.1;
      });
    }
  }
  // A small asteroid belt links the workplaces visually.
  for (let i = 0; i < 100; i++) {
    const angle = (i * Math.PI * 2) / 100;
    block(
      orbit,
      32 + Math.cos(angle) * 10,
      -2 + Math.sin(angle) * 3,
      Math.sin(angle) * 8,
      'moon',
      0.5,
      0.25,
      0.5,
    );
  }
  // A lunar library at the sixth chapter, with a stepped observatory roof.
  const moon = new THREE.Group();
  moon.position.set(LIBRARY_X, 0, 0);
  orbit.add(moon);
  for (let a = -10; a <= 10; a++)
    for (let b = -8; b <= 8; b++) {
      if ((a * a) / 100 + (b * b) / 64 > 1.1) continue;
      block(moon, a, -0.5, b, 'moon');
      block(moon, a, -2, b, 'stone', 1, 2, 1);
    }
  for (let a = -4; a <= 4; a++)
    for (let b = -3; b <= 3; b++) {
      block(moon, a, 0.5, b, 'plank');
      for (let y = 1; y < 5; y++)
        if (Math.abs(a) === 4 || b === -3)
          block(moon, a, y + 0.5, b, Math.abs(a) === 4 ? 'glass' : 'purple');
    }
  for (let level = 0; level < 4; level++)
    for (let a = -5 + level; a <= 5 - level; a++)
      for (let b = -4 + level; b <= 4 - level; b++)
        block(moon, a, 5 + level * 0.6, b, 'oxidized', 1, 0.6, 1);
  for (let a = -3; a <= 3; a++)
    for (let y = 1; y <= 3; y++) {
      block(moon, a, y + 0.5, -2.4, 'plank', 1, 1, 0.6);
      for (let j = 0; j < 3; j++)
        block(
          moon,
          a - 0.28 + j * 0.28,
          y + 0.5,
          -2,
          ['redstone', 'gold', 'purple'][(a + j + y + 6) % 3],
          0.18,
          0.65,
          0.16,
        );
    }
  block(moon, 0, 1.5, 1, 'log', 2, 0.3, 1);
  block(moon, 0, 1.75, 1, 'white', 1, 0.12, 0.7);
  label(
    moon,
    1,
    3.2,
    4,
    'MIKA’S LIFE',
    'CLICK TO READ',
    { kind: 'journal' },
    5,
  );
  // Contact beacon and landing platform, beyond the library.
  const finalMoon = new THREE.Group();
  finalMoon.position.set(CONTACT_X, 0, 0);
  orbit.add(finalMoon);
  for (let a = -7; a <= 7; a++)
    for (let b = -6; b <= 6; b++)
      if (Math.abs(a) + Math.abs(b) < 12)
        block(finalMoon, a, -0.5, b, 'moon', 1, 1, 1);
  for (let a = -3; a <= 3; a++)
    for (let b = -3; b <= 3; b++)
      block(
        finalMoon,
        a,
        0.12,
        b,
        Math.abs(a) === 3 || Math.abs(b) === 3 ? 'oxidized' : 'iron',
        1,
        0.25,
        1,
      );
  for (let y = 0; y < 5; y++) block(finalMoon, -4, y + 0.5, -2, 'dark');
  block(finalMoon, -4, 5, -2, 'glass', 1.2, 1.2, 1.2);
  label(
    finalMoon,
    0,
    2.7,
    3,
    'GET IN TOUCH',
    'PSMITHUL@GMAIL.COM',
    undefined,
    6,
  );
  for (const dockParent of [moon, finalMoon])
    for (let a = 5; a <= 10; a++)
      for (let c = 2; c <= 4; c++)
        block(dockParent, a, -0.25, c, 'iron', 1, 0.5, 1);
  // Pixel stars at fixed positions; no screen-space images.
  const starPositions = new Float32Array(1500 * 3);
  for (let i = 0; i < 1500; i++) {
    starPositions[i * 3] = -180 + random() * 490;
    starPositions[i * 3 + 1] = -90 + random() * 220;
    starPositions[i * 3 + 2] = -160 + random() * 140;
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(starPositions, 3),
  );
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      color: '#cddaff',
      size: 0.23,
      sizeAttenuation: true,
    }),
  );
  orbit.add(stars);
  const earth = new THREE.Group();
  orbit.add(earth);
  earth.position.set(-30, -15, -70);
  for (let a = -10; a <= 10; a++)
    for (let b = -10; b <= 10; b++)
      for (let c = -10; c <= 10; c++)
        if (a * a + b * b + c * c <= 100 && a * a + b * b + c * c > 80)
          block(
            earth,
            a,
            b,
            c,
            Math.sin(a * 0.5 + b * 0.4) + Math.cos(c * 0.5) > 0.5
              ? 'leaf'
              : 'water',
          );
  const clouds: THREE.Group[] = [];
  for (let i = 0; i < 14; i++) {
    const cloud = new THREE.Group();
    cloud.position.set(-40 + i * 14, 14 + (i % 3) * 1.5, -35 - (i % 4) * 6);
    land.add(cloud);
    clouds.push(cloud);
    block(cloud, 0, 0, 0, '#f7f7ed', 10, 1, 5);
    block(cloud, 2, 1, -1, '#f7f7ed', 6, 1, 4);
    block(cloud, -5, 0, 1, '#f7f7ed', 4, 1, 3);
  }
  // Small reading bays form an arcade beside the exhibits. Every page belongs to
  // the main scroll timeline; nothing in this scene has its own scroll surface.
  const lettering = new CSS3DRenderer();
  lettering.domElement.className = 'world-lettering';
  host.appendChild(lettering.domElement);
  const textScene = new THREE.Scene();
  const galleryGlass = new THREE.MeshLambertMaterial({
    color: '#b9d2c6',
    transparent: true,
    opacity: 0.08,
    depthWrite: false,
  });
  const boardElements = Array.from(
    host.closest('main')!.querySelectorAll<HTMLElement>('[data-world-board]'),
  );
  const boards = boardElements.flatMap((source) => {
    const index = Number(source.dataset.worldBoard);
    const leaves = Array.from(
      source.querySelectorAll<HTMLElement>('[data-world-leaf]'),
    );
    const elements = leaves.length ? leaves : [source];
    const baseX =
      index < 4
        ? index * 34
        : ORBIT_ORIGIN[0] +
          (index < 9 ? (index - 4) * 32 : index === 9 ? LIBRARY_X : CONTACT_X);
    const y = index < 4 ? 0.9 : ORBIT_ORIGIN[1] + (index < 9 ? 3.5 : 0);
    const z = index < 4 ? 8 : ORBIT_ORIGIN[2] + 8;
    if (index >= 4) {
      const deck = new THREE.Group();
      deck.position.set(baseX - 4, y, z - 1);
      scene.add(deck);
      for (let a = -6; a <= 7 + (elements.length - 1) * EXHIBIT_SPACING; a++)
        for (let b = -3; b <= 2; b++)
          block(deck, a, -0.25, b, 'plank', 1, 0.5, 1);
      for (let a = -6; a <= 7 + (elements.length - 1) * EXHIBIT_SPACING; a += 2)
        block(deck, a, -0.8, 0, 'log', 0.6, 1, 5.5);
    }
    return elements.map((element, leaf) => {
      const parent = element.parentNode!,
        next = element.nextSibling,
        oldStyle = element.getAttribute('style');
      element.classList.add('in-world-board');
      const width = 680,
        scale = 0.011;
      const position = new THREE.Vector3(
        baseX - 5 + leaf * EXHIBIT_SPACING,
        y + 5.4,
        z,
      );
      const frameGroup = new THREE.Group();
      frameGroup.position.copy(position);
      scene.add(frameGroup);
      const w = width * scale;
      const turntable = new THREE.Group();
      frameGroup.add(turntable);
      const plate = part(turntable, 0, 0, -0.05, '#e8e5d7', w, 1, 0.06);
      const spindle = part(frameGroup, 0, 0, -0.08, 'copper', 0.08, 1, 0.08);
      // An open stone-and-copper alcove: masonry below, a small canopy above,
      // with the text inset in its wall instead of a freestanding giant board.
      const wall = part(frameGroup, 0, 0, -0.2, 'iron', w + 0.3, 1, 0.3);
      wall.material = galleryGlass;
      const base = part(frameGroup, 0, 0, -0.75, 'cobble', w + 0.5, 1, 1.5);
      const canopy = part(
        frameGroup,
        0,
        0,
        0,
        index < 4 ? 'oxidized' : 'dark',
        w + 0.9,
        0.22,
        2.5,
      );
      const sill = part(frameGroup, 0, 0, 0, 'copper', w + 0.5, 0.16, 0.6);
      const columns = [-1, 1].map((side) =>
        part(
          frameGroup,
          side * (w / 2 + 0.24),
          0,
          -0.25,
          index < 4 ? 'log' : 'iron',
          0.22,
          1,
          0.22,
        ),
      );
      let measured = 0;
      const resizeFrame = () => {
        const height = element.offsetHeight;
        if (!height || measured === height) return;
        measured = height;
        const h = height * scale;
        wall.scale.y = h + 0.16;
        plate.scale.y = h;
        spindle.scale.y = h + 0.35;
        base.scale.y = 0.65;
        base.position.y = -5.4 + 0.325;
        canopy.position.y = h / 2 + 0.18;
        sill.position.y = -h / 2 - 0.04;
        columns.forEach((column) => {
          column.scale.y = 5.4 + h / 2;
          column.position.y = (h / 2 - 5.4) / 2;
        });
      };
      resizeFrame();
      const object = new CSS3DObject(element);
      object.position.copy(position);
      object.scale.setScalar(scale);
      textScene.add(object);
      return {
        element,
        object,
        frameGroup,
        parent,
        next,
        oldStyle,
        index,
        leaf,
        scale,
        readHeight: () => measured * scale,
        turntable,
        resizeFrame,
      };
    });
  });
  // Batch static voxels by parent and texture, leaving articulated objects separate.
  const dummy = new THREE.Object3D();
  batches.forEach(({ parent, type, items }) => {
    const mesh = new THREE.InstancedMesh(cube, mats.get(type), items.length);
    items.forEach((v, i) => {
      dummy.position.set(v.x, v.y, v.z);
      dummy.scale.set(v.w, v.h, v.d);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.castShadow = type !== 'grass' && type !== 'dirt' && type !== 'water';
    mesh.receiveShadow = true;
    mesh.computeBoundingSphere();
    parent.add(mesh);
  });
  const smokeMaterial = new THREE.MeshLambertMaterial({
    color: '#d9dfdf',
    transparent: true,
    opacity: 0.3,
  });
  const smoke = Array.from({ length: 9 }, () => {
    const p = new THREE.Mesh(cube, smokeMaterial.clone());
    land.add(p);
    return p;
  });
  let timeline = read().timeline,
    time = 0,
    last = 0,
    frame = 0,
    visible = !document.hidden;
  let azimuth = 0,
    elevation = 0,
    dragging = false,
    dragDistance = 0,
    px = 0,
    py = 0;
  let cameraInitialized = false,
    cameraMode = 0,
    readMode = 0,
    walkDistance = 0,
    sampleFrames = 0,
    sampleTime = 0;
  const lastAvatar = new THREE.Vector3(),
    avatarVelocity = new THREE.Vector3();
  const destination = new THREE.Vector3(),
    look = new THREE.Vector3(),
    cameraRig = new THREE.PerspectiveCamera();
  const mouse = new THREE.Vector2(),
    parallax = new THREE.Vector2();
  const raycaster = new THREE.Raycaster(),
    pointer = new THREE.Vector2();
  const resize = () => {
    const w = host.clientWidth,
      h = host.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    lettering.setSize(w, h);
    camera.clearViewOffset();
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  function pick(e: PointerEvent) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      (-(e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(targets, false).find((h) => {
      let o: THREE.Object3D | null = h.object;
      while (o) {
        if (!o.visible) return false;
        o = o.parent;
      }
      return true;
    });
    if (hit?.object.userData.action)
      onAction?.(hit.object.userData.action as WorldAction);
  }
  let pointerType = 'mouse';
  const down = (e: PointerEvent) => {
    pointerType = e.pointerType;
    dragging = e.pointerType === 'mouse';
    dragDistance = 0;
    px = e.clientX;
    py = e.clientY;
    if (dragging) renderer.domElement.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (!dragging) {
      if (pointerType !== 'mouse') {
        dragDistance += Math.abs(e.clientX - px) + Math.abs(e.clientY - py);
        px = e.clientX;
        py = e.clientY;
      }
      return;
    }
    const dx = e.clientX - px,
      dy = e.clientY - py;
    dragDistance += Math.abs(dx) + Math.abs(dy);
    azimuth = clamp(azimuth + dx * 0.004, -1, 1);
    elevation = clamp(elevation + dy * 0.025, -6, 9);
    px = e.clientX;
    py = e.clientY;
  };
  const up = (e: PointerEvent) => {
    if (dragDistance < 6) pick(e);
    dragging = false;
  };
  const cancel = () => {
    dragging = false;
  };
  const visibility = () => {
    visible = !document.hidden;
    last = 0;
  };
  const lost = (e: Event) => {
    e.preventDefault();
    visible = false;
    onLost();
  };
  renderer.domElement.addEventListener('pointerdown', down);
  renderer.domElement.addEventListener('pointermove', move);
  renderer.domElement.addEventListener('pointerup', up);
  renderer.domElement.addEventListener('pointercancel', cancel);
  renderer.domElement.addEventListener('webglcontextlost', lost);
  document.addEventListener('visibilitychange', visibility);
  const pointerParallax = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    mouse.set(
      (e.clientX / window.innerWidth - 0.5) * 2,
      (e.clientY / window.innerHeight - 0.5) * 2,
    );
  };
  window.addEventListener('pointermove', pointerParallax, { passive: true });
  function animate(now: number) {
    frame = requestAnimationFrame(animate);
    if (!visible) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    sampleFrames++;
    sampleTime += dt;
    if (sampleTime >= 1) {
      host.dataset.fps = String(Math.round(sampleFrames / sampleTime));
      sampleFrames = sampleTime = 0;
    }
    const opts = read();
    if (!opts.reducedMotion) time += dt;
    timeline = opts.reducedMotion
      ? opts.timeline
      : smoothTimeline(timeline, opts.timeline, dt);
    const pose = journeyPose(timeline, journeyExperience.length);
    const trainX = pose.trainX,
      trainZ = routeZ(trainX),
      rotation = -trainX / 0.575;
    train.position.set(trainX, 0, trainZ);
    train.rotation.y = routeAngle(trainX);
    // Each carriage follows the track tangent rather than cutting across the bend.
    cars.forEach((car, i) => {
      const behind = trainX - i * 8;
      car.position.z = routeZ(behind) - trainZ;
      car.rotation.y = routeAngle(behind) - train.rotation.y;
    });
    if (cabDoor) cabDoor.position.x = -2.2 - pose.trainDoor * 0.85;
    wheelGroups.forEach((wheel) => {
      wheel.rotation.z = rotation;
    });
    gears.forEach((gear) => {
      gear.rotation.z = -rotation * 0.6;
    });
    pistonUpdates.forEach((update) => update(rotation));
    couplingRods.forEach((rod) => {
      rod.position.x = Math.cos(rotation) * 0.22;
      rod.position.y = 0.75 + Math.sin(rotation) * 0.22;
    });
    smoke.forEach((p, i) => {
      const age = (time * 0.26 + i / 9) % 1;
      p.position.set(trainX + 1.35 - age * 3, 4.7 + age * 5, trainZ);
      p.scale.setScalar(0.3 + age * 1.25);
      p.material.opacity = Math.sin(Math.PI * age) * 0.2;
      p.visible = !opts.reducedMotion && pose.space < 0.98;
    });
    clouds.forEach((cloud, i) => {
      cloud.position.x =
        -40 +
        i * 14 +
        (opts.reducedMotion ? 0 : Math.sin(time * 0.025 + i) * 3);
    });
    if (pose.space > 0.9) orbitalUpdates.forEach((update) => update(time));
    if (Math.abs(trainX - 68) < 28 && pose.space < 0.1)
      mechanicalUpdates.forEach((update) =>
        update(time, opts.reducedMotion ? 0 : dt),
      );
    guide.avatar.position.set(...pose.avatar);
    if (cameraInitialized) {
      avatarVelocity.copy(guide.avatar.position).sub(lastAvatar);
      const distance = avatarVelocity.length();
      walkDistance += distance;
      const walking = pose.walking
        ? Math.min(1, distance / Math.max(dt, 0.001) / 2.5)
        : 0;
      const heading = pose.inspecting
        ? Math.atan2(
            pose.display[0] - pose.avatar[0],
            pose.display[2] - pose.avatar[2],
          )
        : pose.walking && distance > 0.0001
          ? Math.atan2(avatarVelocity.x, avatarVelocity.z)
          : Math.PI / 2;
      const facing = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, heading, 0),
      );
      guide.avatar.quaternion.slerp(facing, 1 - Math.exp(-10 * dt));
      guide.limbs.forEach((limb, i) => {
        limb.rotation.x =
          Math.sin(
            walkDistance * 5 + (i % 2) * Math.PI + (i < 2 ? Math.PI : 0),
          ) *
          0.55 *
          walking;
      });
    }
    if (pose.inspecting) guide.limbs[1].rotation.x = -0.8;
    lastAvatar.copy(guide.avatar.position);
    guide.avatar.visible = pose.avatarVisible;
    launchRocket.position.set(...pose.rocket);
    launchRocket.rotation.z = pose.pitch;
    const planetPhase =
      timeline >= 4 && timeline < 5
        ? ((timeline - 4) * journeyExperience.length) % 1
        : timeline % 1;
    const opening =
      timeline < 4
        ? easeBetween(3.3, 3.48, timeline) *
          (1 - easeBetween(3.64, 3.68, timeline))
        : easeBetween(0, 0.035, planetPhase) *
          (1 - easeBetween(0.68, 0.72, planetPhase));
    hatchPanels.forEach((hatch) => {
      hatch.position.x = opening * 0.82;
    });
    flames.visible = pose.flight > 0.001;
    flames.scale.y = 0.2 + pose.flight * 0.65 + Math.sin(time * 8) * 0.025;
    const focus = new THREE.Vector3(...pose.focus);
    const smallScreen = window.innerHeight < 550;
    // Narrow landscape screens get a wider view; both renderers share this projection.
    const spread =
      22 /
      (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
    const cameraDistance = smallScreen ? Math.max(29, 6 + spread) : 6 + spread;
    const floorOffset =
      (1 - pose.space) * 0.9 +
      pose.space * (1 - easeBetween(4.92, 5, timeline)) * 3.5;
    destination
      .copy(focus)
      .add(
        new THREE.Vector3(
          3.5 + Math.sin(azimuth) * 10,
          10.5 + floorOffset + elevation,
          cameraDistance + Math.cos(azimuth) * 2,
        ),
      );
    look
      .copy(focus)
      .add(
        new THREE.Vector3(
          -1.6,
          smallScreen
            ? 4.8 + floorOffset
            : 10.5 +
                floorOffset -
                (5.1 * (cameraDistance + 2)) / (cameraDistance - 6),
          0,
        ),
      );
    const currentBoard = boards
      .filter((board) => board.index === pose.board)
      .reduce<(typeof boards)[number] | undefined>(
        (closest, candidate) =>
          !closest ||
          Math.abs(candidate.leaf * EXHIBIT_SPACING - pose.exhibitOffset) <
            Math.abs(closest.leaf * EXHIBIT_SPACING - pose.exhibitOffset)
            ? candidate
            : closest,
        undefined,
      );
    const localPhase =
      timeline >= 4 && timeline < 5
        ? ((timeline - 4) * journeyExperience.length) % 1
        : timeline % 1;
    const autoRead =
      opts.mobile &&
      !opts.onboard &&
      (timeline < 0.45
        ? 1 - easeBetween(0.28, 0.45, timeline)
        : timeline >= 3.3 && timeline < 4
          ? 0
          : easeBetween(0, 0.08, localPhase) *
            (1 - easeBetween(0.55, 0.72, localPhase)));
    readMode = THREE.MathUtils.damp(
      readMode,
      opts.reading === null ? Number(autoRead) : Number(opts.reading),
      5,
      dt,
    );
    if (currentBoard && readMode > 0.001) {
      const siblings = boards.filter((board) => board.index === pose.board);
      const center = siblings[0].object.position.clone();
      center.x += pose.exhibitOffset;
      const page = pose.exhibitOffset / EXHIBIT_SPACING;
      const first = Math.min(siblings.length - 1, Math.floor(page));
      const next = Math.min(siblings.length - 1, first + 1);
      const height = THREE.MathUtils.lerp(
        siblings[first].readHeight(),
        siblings[next].readHeight(),
        page - first,
      );
      const distance = Math.max(
        (height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)))) *
          1.25,
        (7.48 /
          (2 *
            Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
            camera.aspect)) *
          1.25,
      );
      destination.lerp(
        center.clone().add(new THREE.Vector3(0.3, 0.08, distance)),
        readMode,
      );
      look.lerp(center, readMode);
    }
    cameraMode = THREE.MathUtils.damp(cameraMode, opts.onboard ? 1 : 0, 4, dt);
    if (cameraMode > 0.001) {
      const ride =
        pose.space > 0.99
          ? launchRocket.position.clone().add(new THREE.Vector3(0, 7.5, 5.5))
          : new THREE.Vector3(trainX - 2.4, 3.5, trainZ + 1.6);
      const rideLook =
        pose.space > 0.99
          ? ride.clone().add(new THREE.Vector3(3, -1, -14))
          : new THREE.Vector3(trainX + 6, 2.4, trainZ - 2);
      destination.lerp(ride, cameraMode);
      look.lerp(rideLook, cameraMode);
    }
    parallax.lerp(
      opts.reducedMotion ? new THREE.Vector2() : mouse,
      1 - Math.exp(-5 * dt),
    );
    destination.x += parallax.x * 0.28;
    destination.y -= parallax.y * 0.16;
    if (!cameraInitialized || opts.reducedMotion)
      camera.position.copy(destination);
    else camera.position.lerp(destination, 1 - Math.exp(-12 * dt));
    cameraRig.position.copy(camera.position);
    cameraRig.lookAt(look);
    // Camera orientation has its own quaternion buffer, as in the supplied reference.
    if (!cameraInitialized || opts.reducedMotion)
      camera.quaternion.copy(cameraRig.quaternion);
    else camera.quaternion.slerp(cameraRig.quaternion, 1 - Math.exp(-12 * dt));
    cameraInitialized = true;
    const color = (opts.night ? dusk : sky)
      .clone()
      .lerp(spaceColor, pose.space);
    (scene.background as THREE.Color).lerp(color, 1 - Math.exp(-4 * dt));
    const fog = scene.fog as THREE.Fog;
    fog.color.copy(scene.background as THREE.Color);
    fog.near = 65 + pose.space * 110;
    fog.far = 145 + pose.space * 205;
    hemi.intensity = pose.space > 0.9 ? 0.95 : opts.night ? 0.65 : 1.05;
    sun.intensity = opts.night ? 0.5 : 1.45;
    moonLight.intensity = pose.space * 0.25;
    sun.position.copy(focus).add(new THREE.Vector3(-24, 36, 20));
    sun.target.position.copy(focus);
    sun.target.updateMatrixWorld();
    // Opaque pages rotate on copper spindles as the camera walks the arcade.
    // Their neighbours turn edge-on, avoiding ghosted text over the landscape.
    boards.forEach(
      ({
        element,
        object,
        frameGroup,
        index,
        leaf,
        turntable,
        resizeFrame,
      }) => {
        resizeFrame();
        const distance = object.position.distanceTo(focus);
        const leafDistance =
          index === pose.board
            ? Math.abs(leaf * EXHIBIT_SPACING - pose.exhibitOffset)
            : Infinity;
        const local =
          timeline >= 4 && timeline < 5
            ? ((timeline - 4) * journeyExperience.length) % 1
            : timeline % 1;
        const leaving =
          index === 3
            ? easeBetween(0.31, 0.38, local)
            : easeBetween(0.6, 0.72, local);
        const fold = Math.max(
          THREE.MathUtils.smoothstep(leafDistance, 2.5, 8),
          leaving,
        );
        const angle =
          ((leaf * EXHIBIT_SPACING < pose.exhibitOffset ? -1 : 1) *
            fold *
            Math.PI) /
          2;
        object.rotation.y = angle;
        turntable.rotation.y = angle;
        const near = fold < 0.2 && cameraMode < 0.5;
        object.visible = distance < 30 && fold < 0.995 && cameraMode < 0.95;
        frameGroup.visible = distance < 75;
        element.inert = !near;
        element.setAttribute('aria-hidden', String(!near));
        element.style.opacity = '1';
        element.style.pointerEvents = near ? 'auto' : 'none';
        element.dataset.active = String(index === pose.board && near);
      },
    );
    renderer.render(scene, camera);
    lettering.render(textScene, camera);
  }
  frame = requestAnimationFrame(animate);
  return {
    resetView() {
      azimuth = 0;
      elevation = 0;
      mouse.set(0, 0);
    },
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pointermove', pointerParallax);
      boards.forEach(({ element, parent, next, oldStyle }) => {
        element.classList.remove('in-world-board');
        element.inert = false;
        element.removeAttribute('aria-hidden');
        if (oldStyle === null) element.removeAttribute('style');
        else element.setAttribute('style', oldStyle);
        parent.insertBefore(element, next?.parentNode === parent ? next : null);
      });
      lettering.domElement.remove();
      renderer.domElement.removeEventListener('pointerdown', down);
      renderer.domElement.removeEventListener('pointermove', move);
      renderer.domElement.removeEventListener('pointerup', up);
      renderer.domElement.removeEventListener('pointercancel', cancel);
      renderer.domElement.removeEventListener('webglcontextlost', lost);
      const geometry = new Set<THREE.BufferGeometry>(),
        material = new Set<THREE.Material>();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
          geometry.add(o.geometry);
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
            material.add(m),
          );
        }
      });
      geometry.forEach((g) => g.dispose());
      material.forEach((m) => m.dispose());
      mats.dispose();
      ownedTextures.forEach((t) => t.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
