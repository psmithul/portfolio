import * as THREE from 'three';
import { journeyExperience } from '@/content/journey';
import { createBlockMaterials, type Block } from '@/lib/voxel-textures';

export type WorldOptions = {
  progress: number;
  phase: number;
  stop: number;
  experience: number;
  onboard: boolean;
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
const smooth = (a: number, b: number, x: number) =>
  THREE.MathUtils.smoothstep(x, a, b);
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
  const sky = new THREE.Color('#83b8ed'),
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
  const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 380);
  const cube = new THREE.BoxGeometry(1, 1, 1),
    mats = createBlockMaterials();
  const land = new THREE.Group(),
    orbit = new THREE.Group();
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
  const hemi = new THREE.HemisphereLight('#eaf4ff', '#555044', 2.1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff1d4', 2.5);
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
  const moonLight = new THREE.DirectionalLight('#a7bfff', 1.5);
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
        for (let y = -2; y < hill - 1; y++)
          block(land, x, y + 0.5, z, y === hill - 2 ? 'dirt' : 'stone');
    }
  // Distant terrain has hard stair steps, with snow at the summit.
  for (let m = 0; m < 8; m++) {
    const mx = -36 + m * 26,
      mz = -48 - (m % 3) * 8,
      r = 9 + (m % 3) * 3;
    for (let a = -r; a <= r; a++)
      for (let b = -r; b <= r; b++) {
        const height = Math.floor(
          (r - Math.max(Math.abs(a), Math.abs(b))) * 1.45,
        );
        if (height <= 0) continue;
        block(
          land,
          mx + a,
          height / 2 - 0.5,
          mz + b,
          height > 10 ? 'white' : 'stone',
          1,
          height,
          1,
        );
      }
  }
  function tree(x: number, z: number, birch = false) {
    const h = 4 + Math.floor(random() * 3);
    for (let y = 0; y < h; y++)
      block(land, x, y + 0.5, z, birch ? 'white' : 'log');
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
          block(land, x + a, y + 0.5, z + b, 'leaf');
        }
    }
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
  for (let i = 0; i < 140; i++) {
    const x = -30 + random() * 163,
      z = 6 + random() * 17;
    if (x > 10 && x < 25) continue;
    block(land, x, 0.22, z, '#44822c', 0.06, 0.44, 0.06);
    if (i % 4 === 0)
      block(
        land,
        x,
        0.5,
        z,
        i % 8 === 0 ? '#e8cf3b' : '#bc3d3e',
        0.22,
        0.17,
        0.22,
      );
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
    for (let b = -hd - 1; b <= hd + 1; b++) {
      const y = 5 + hd + 1 - Math.abs(b);
      for (let a = -hw - 1; a <= hw + 1; a++) {
        block(land, x + a, y + 0.2, z + b, roof, 1, 0.5, 1);
        if (b !== 0)
          block(
            land,
            x + a,
            y - 0.25,
            z + b - Math.sign(b) * 0.25,
            roof,
            1,
            0.4,
            0.5,
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
    const x = s * SPACING,
      z = routeZ(x) - 6;
    for (let a = -12; a <= 12; a++)
      for (let b = -3; b <= 2; b++)
        block(
          land,
          x + a,
          0.45,
          z + b,
          s === 2 ? 'cobble' : 'plank',
          1,
          0.9,
          1,
        );
    house(
      x - 2,
      z - 8,
      s === 0 ? 'brick' : s === 1 ? 'oxidized' : s === 2 ? 'dark' : 'copper',
      s === 2 ? 13 : 9,
    );
    for (let a = -9; a <= 9; a += 3) {
      block(land, x + a, 1.65, z - 3, 'log', 0.2, 1.4, 0.2);
      if (a < 9) block(land, x + a + 1.5, 2, z - 3, 'plank', 3, 0.16, 0.18);
    }
    label(
      land,
      x + 6,
      3.2,
      z + 1,
      ['MITHUL SOURAV', 'ABOUT', 'PROJECTS', 'ARCHIVE'][s],
      [
        'NITK SURATHKAL',
        'MECHANICAL ENGINEERING',
        'INTERACTIVE MODELS',
        'LAUNCH SITE',
      ][s],
      undefined,
      5,
    );
    for (let a = -1; a <= 1; a++)
      block(land, x + a, 0.22, routeZ(x) - 2, 'stone', 1, 0.45, 1);
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
  // Workshop exhibits are actual animated Three.js objects and click targets.
  const exhibits: THREE.Group[] = [];
  const projectSlugs = [
    'adaptive-suspension-rover',
    'tensegrity-joint',
    'off-road-leaf-robot',
  ];
  for (let i = 0; i < 3; i++) {
    const x = SPACING * 2 - 8 + i * 7;
    for (let a = -2; a <= 2; a++)
      for (let b = -1; b <= 1; b++)
        block(land, x + a, 1.15, -4 + b, 'stone', 1, 0.3, 1);
    const exhibit = new THREE.Group();
    exhibit.position.set(x, 1.5, -4);
    land.add(exhibit);
    exhibits.push(exhibit);
    if (i === 1) {
      for (const y of [0, 2])
        for (let j = 0; j < 3; j++) {
          const a = (j * Math.PI * 2) / 3 + y * 0.3;
          part(
            exhibit,
            Math.cos(a) * 0.9,
            y,
            Math.sin(a) * 0.9,
            'copper',
            0.18,
            0.18,
            0.18,
          );
        }
      for (let j = 0; j < 3; j++) {
        const a = (j * Math.PI * 2) / 3;
        const rod = part(
          exhibit,
          Math.cos(a) * 0.55,
          1,
          Math.sin(a) * 0.55,
          'iron',
          0.1,
          2.3,
          0.1,
        );
        rod.rotation.z = 0.45;
        rod.rotation.y = a;
        const cable = part(
          exhibit,
          Math.cos(a + 0.7) * 0.5,
          1,
          Math.sin(a + 0.7) * 0.5,
          'redstone',
          0.035,
          2.2,
          0.035,
        );
        cable.rotation.z = -0.5;
        cable.rotation.y = a;
      }
    } else {
      part(exhibit, 0, 0.65, 0, i === 0 ? 'oxidized' : 'gold', 2.6, 0.55, 1.5);
      for (const side of [-1, 1])
        for (let w = -1; w <= 1; w++) {
          part(exhibit, w, 0.3, side * 0.85, 'dark', 0.52, 0.6, 0.3);
          part(exhibit, w, 0.3, side * 1.02, 'iron', 0.18, 0.18, 0.07);
        }
      if (i === 0) {
        part(exhibit, 0.7, 1.2, 0, 'iron', 0.12, 0.8, 0.12);
        part(exhibit, 0.7, 1.6, 0, 'glass', 0.55, 0.23, 0.35);
      } else {
        part(exhibit, -0.4, 1.35, 0, 'copper', 1.3, 0.9, 1.2);
        part(exhibit, 1.5, 0.25, 0, 'oxidized', 0.45, 0.6, 1.6);
      }
    }
    // Raycast against the display as well as its nameplate.
    exhibit.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.userData.action = { kind: 'project', slug: projectSlugs[i] };
        targets.push(o);
      }
    });
    label(
      land,
      x,
      3.6,
      -2,
      ['ROVER', 'TENSEGRITY', 'LEAF ROBOT'][i],
      'CLICK TO EXPLORE',
      { kind: 'project', slug: projectSlugs[i] },
      3.9,
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
        part(car, -1.9, 1.8, side * 1.1, 'oxidized', 2, 0.65, 0.23);
        for (const x of [-2.8, -1])
          part(car, x, 2.8, side * 1.1, 'oxidized', 0.2, 2.1, 0.2);
        part(car, -2, 2.8, side * 1.1, 'glass', 0.75, 0.9, 0.12);
        part(car, 2.1, 2.15, side * 0.7, 'gold', 0.35, 0.5, 0.2);
      }
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
    part(cars[0], 1.9, 1.65, side * 1.12, 'dark', 0.85, 0.55, 0.45);
    part(cars[0], -2.9, 2.8, side * 1.1, 'gold', 0.16, 1.15, 0.16);
  }
  // Four independently pivoting limbs give the guide a Minecraft walk cycle.
  function character(parent: THREE.Group) {
    const avatar = new THREE.Group();
    parent.add(avatar);
    part(avatar, 0, 1.15, 0, '#243d4d', 0.6, 0.72, 0.32);
    part(avatar, 0, 1.82, 0, '#bb8b65', 0.53, 0.53, 0.53);
    part(avatar, 0, 2.08, -0.015, '#29241f', 0.56, 0.17, 0.56);
    part(avatar, 0, 1.86, -0.265, '#29241f', 0.53, 0.32, 0.055);
    for (const side of [-1, 1]) {
      part(avatar, side * 0.12, 1.86, 0.272, '#172125', 0.17, 0.09, 0.025);
      part(avatar, side * 0.12, 1.86, 0.293, '#a1c4c6', 0.065, 0.052, 0.012);
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
        arm ? '#243d4d' : '#384559',
        arm ? 0.22 : 0.26,
        arm ? 0.48 : 0.73,
        0.28,
      );
      part(
        pivot,
        0,
        arm ? -0.5 : -0.73,
        arm ? 0 : 0.035,
        arm ? '#bb8b65' : '#22282d',
        arm ? 0.22 : 0.27,
        arm ? 0.2 : 0.16,
        arm ? 0.26 : 0.36,
      );
      limbs.push(pivot);
    }
    return { avatar, limbs };
  }
  const guide = character(land),
    astronaut = character(orbit);
  // Launch pad and an approaching rocket with a lower boarding hatch.
  const padX = 112,
    padZ = -2;
  for (let a = -4; a <= 4; a++)
    for (let b = -4; b <= 4; b++)
      block(
        land,
        padX + a,
        0.32,
        padZ + b,
        Math.abs(a) === 4 || Math.abs(b) === 4 ? 'dark' : 'iron',
        1,
        0.65,
        1,
      );
  for (let y = 1; y <= 10; y++) {
    block(land, padX - 4, y + 0.5, padZ - 3, 'iron', 0.3, 1, 0.3);
    block(land, padX - 4, y + 0.5, padZ + 1, 'iron', 0.3, 1, 0.3);
    block(land, padX - 4, y + 0.5, padZ - 1, 'dark', 0.15, 0.12, 4);
  }
  label(land, 109, 2.7, 3, 'EXPERIENCE', 'NEXT: ORBIT', undefined, 4);
  function rocket(parent: THREE.Group) {
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
    part(group, 0, 2.2, 1.03, 'dark', 0.85, 1.65, 0.1);
    part(group, 0.34, 2.2, 1.12, 'gold', 0.06, 0.18, 0.05);
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
  const launchRocket = rocket(land),
    spaceRocket = rocket(orbit);
  launchRocket.position.set(padX, 18, padZ);
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
  const orbitFlames = flames.clone();
  spaceRocket.add(orbitFlames);
  // Voxel planets: cubic shells form stepped spherical silhouettes.
  const planets: THREE.Group[] = [];
  const planetNames = journeyExperience.map((p) =>
    p.company === 'NH66 Fund · P&L Club'
      ? 'NH66 FUND'
      : p.company.toUpperCase(),
  );
  function planet(x: number, index: number, r = 6) {
    const group = new THREE.Group();
    group.position.set(x, -1, 0);
    orbit.add(group);
    planets.push(group);
    const type: Block =
      index === 0
        ? 'grass'
        : index === 1
          ? 'purple'
          : index === 3
            ? 'oxidized'
            : 'gold';
    for (let a = -r; a <= r; a++)
      for (let b = -r; b <= r; b++)
        for (let c = -r; c <= r; c++) {
          const d = a * a + b * b + c * c;
          if (d > r * r || d < (r - 1.5) * (r - 1.5)) continue;
          if (b > r - 2 && Math.abs(a) < 4 && Math.abs(c) < 4) continue;
          block(group, a, b, c, index === 0 && b < r * 0.5 ? 'stone' : type);
        }
    for (let a = -4; a <= 4; a++)
      for (let c = -4; c <= 4; c++)
        block(
          group,
          a,
          4.2,
          c,
          index === 0 ? 'grass' : index === 1 ? 'dark' : 'plank',
          1,
          0.6,
          1,
        );
    // A docking gantry lets the rocket land beside each planet.
    for (let a = 4; a <= 9; a++)
      for (let b = 2; b <= 4; b++)
        block(group, a, 4.2, b, a === 9 ? 'oxidized' : 'iron', 1, 0.6, 1);
    for (let a = 5; a <= 8; a++)
      block(group, a, 4.8, 4.5, 'iron', 1, 0.15, 0.12);
    if (index === 0) {
      // Aerospace hangar, solar arrays and voxel aircraft.
      for (let a = -2; a <= 2; a++)
        for (let b = 0; b < 3; b++) {
          if (Math.abs(a) === 2) block(group, a, 4.8 + b, -2, 'iron');
          block(group, a, 7.8, -2, 'iron');
        }
      block(group, 0, 5.3, 0, 'white', 3, 0.5, 0.65);
      block(group, 0, 5.5, 0, 'oxidized', 0.7, 0.2, 3.5);
      for (const side of [-1, 1])
        block(group, side * 3, 5, 1, 'glass', 1.6, 0.15, 2);
      for (let y = 0; y < 6; y++)
        block(group, 3, 5 + y, -2, 'iron', 0.18, 1, 0.18);
      block(group, 3, 10, -2, 'redstone', 0.4, 0.4, 0.4);
    } else if (index === 1) {
      for (let a = -1; a <= 1; a++)
        for (let y = 0; y < 3 + a + 1; y++) {
          block(group, a * 2, 5 + y, -1, 'dark');
          block(group, a * 2, 5 + y, -0.45, 'glass', 0.65, 0.45, 0.1);
        }
      for (let a = -3; a <= 3; a++)
        block(group, a, 4.58, 1, 'redstone', 1, 0.08, 0.15);
      block(group, 0, 8.8, -1, 'purple', 1.5, 0.5, 1.5);
    } else if (index === 3) {
      // Student leadership: a campus stage, banners and a technical-event tower.
      for (let a = -3; a <= 3; a++) block(group, a, 5, -1, 'plank', 1, 0.6, 3);
      block(group, 0, 5.9, 0, 'dark', 1.2, 1.2, 0.7);
      block(group, 0, 6.7, 0, 'iron', 0.12, 0.5, 0.12);
      for (const side of [-1, 1]) {
        for (let y = 0; y < 5; y++)
          block(group, side * 3, 5 + y, -2, 'iron', 0.18, 1, 0.18);
        block(group, side * 2.4, 8.5, -2, 'redstone', 1.2, 2, 0.1);
      }
    } else {
      for (let a = -3; a <= 3; a++)
        block(group, a, 4.8, -1, index === 4 ? 'copper' : 'white');
      for (const a of [-3, -1, 1, 3])
        for (let y = 0; y < 3; y++)
          block(group, a, 5.8 + y, -1, 'white', 0.65, 1, 0.65);
      for (let a = -4; a <= 4; a++) block(group, a, 8.8, -1, 'gold', 1, 0.5, 2);
      for (let step = 0; step < 3; step++)
        block(group, 0, 4.6 + step * 0.3, 2 - step * 0.5, 'moon', 5, 0.3, 0.5);
    }
    label(
      group,
      0,
      2.8,
      6.3,
      planetNames[index],
      journeyExperience[index].category +
        ' · ' +
        (journeyExperience[index].period.match(/20\d{2}/)?.[0] ?? ''),
      { kind: 'planet', index },
      6,
    );
    const hit = part(group, 0, 0, 0, type, 0.01, 0.01, 0.01);
    hit.visible = false;
    return group;
  }
  for (let i = 0; i < journeyExperience.length; i++) planet(i * 32, i);
  // Planet orbital rings are also individual blocks.
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
    cloud.position.set(-30 + i * 14, 22 + (i % 3) * 3, -26 - (i % 4) * 7);
    land.add(cloud);
    clouds.push(cloud);
    block(cloud, 0, 0, 0, 'white', 6, 1, 3);
    block(cloud, 2, 1, -1, 'white', 4, 1, 3);
    block(cloud, -3, 0, 1, 'white', 4, 1, 3);
  }
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
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.computeBoundingSphere();
    parent.add(mesh);
  });
  const smokeMaterial = new THREE.MeshLambertMaterial({
    color: '#d9dfdf',
    transparent: true,
    opacity: 0.65,
  });
  const smoke = Array.from({ length: 9 }, () => {
    const p = new THREE.Mesh(cube, smokeMaterial);
    land.add(p);
    return p;
  });
  let progress = read().progress,
    experience = read().experience,
    time = 0,
    last = 0,
    frame = 0,
    visible = !document.hidden;
  let azimuth = 0,
    elevation = 0,
    dragging = false,
    dragDistance = 0,
    px = 0,
    py = 0,
    previousStop = -1,
    entered = 0;
  const destination = new THREE.Vector3(),
    look = new THREE.Vector3(),
    cameraLook = new THREE.Vector3();
  const raycaster = new THREE.Raycaster(),
    pointer = new THREE.Vector2();
  const resize = () => {
    const w = host.clientWidth,
      h = host.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.setViewOffset(
      w,
      h,
      w > 800 || w > h ? -w * 0.13 : 0,
      w > 800 || w > h ? 0 : -h * 0.23,
      w,
      h,
    );
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
  function walk(who: ReturnType<typeof character>, motion: number) {
    who.limbs.forEach((limb, i) => {
      limb.rotation.x =
        Math.sin(time * 7 + (i % 2) * Math.PI + (i < 2 ? Math.PI : 0)) *
        0.55 *
        motion;
    });
  }
  function animate(now: number) {
    frame = requestAnimationFrame(animate);
    if (!visible) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    const opts = read();
    if (!opts.reducedMotion) time += dt;
    if (opts.stop !== previousStop) {
      previousStop = opts.stop;
      entered = time;
    }
    progress = opts.reducedMotion
      ? opts.progress
      : THREE.MathUtils.damp(progress, opts.progress, 4, dt);
    experience = opts.reducedMotion
      ? opts.experience
      : THREE.MathUtils.damp(experience, opts.experience, 4, dt);
    const inSpace = opts.stop >= 4,
      launch = smooth(3.55, 4, progress),
      x = Math.min(progress, 3) * SPACING,
      z = routeZ(x);
    land.visible = !inSpace;
    orbit.visible = inSpace;
    const parkedX =
      x - (opts.stop === 2 ? 9 * (1 - smooth(0.6, 0.75, opts.phase)) : 0);
    const trainX = opts.reducedMotion
      ? parkedX
      : THREE.MathUtils.damp(train.position.x, parkedX, 5, dt);
    const trainZ = routeZ(trainX);
    train.position.set(trainX, 0, trainZ);
    train.rotation.y = routeAngle(trainX);
    const rotation = -trainX * 1.6;
    wheelGroups.forEach((w) => {
      w.rotation.z = rotation;
    });
    gears.forEach((g, i) => {
      g.rotation.z =
        -rotation * 0.6 +
        (opts.reducedMotion ? 0 : Math.sin(time * 0.9) * 0.08) * (i ? 1 : -1);
    });
    couplingRods.forEach((r) => {
      r.position.x = Math.cos(rotation) * 0.22;
      r.position.y = 0.75 + Math.sin(rotation) * 0.22;
    });
    smoke.forEach((p, i) => {
      const phase = (time * 0.35 + i / 9) % 1,
        size = 0.35 + phase * 1.4;
      p.position.set(trainX + 1.5 - phase * 5, 4.7 + phase * 6, trainZ);
      p.scale.setScalar(size);
      p.visible = !opts.reducedMotion;
    });
    clouds.forEach((c, i) => {
      c.position.x = -30 + i * 14 + Math.sin(time * 0.03 + i) * 1.5;
    });
    exhibits.forEach((e, i) => {
      e.rotation.y = i === 1 ? time * 0.2 : Math.sin(time * 0.45) * 0.12;
      e.position.y =
        1.5 +
        (i === 1 ? Math.sin(time * 0.6) * 0.08 : Math.sin(time * 1.4) * 0.035);
    });
    // The guide steps down, walks alongside the train, and visits the exhibits.
    const atStop = opts.stop === 1 || opts.stop === 2 || opts.stop === 3;
    let dismount = atStop
      ? Math.max(smooth(0, 0.22, opts.phase), smooth(0.5, 3, time - entered))
      : 0;
    if (opts.stop === 1 || opts.stop === 2)
      dismount *= 1 - smooth(0.6, 0.75, opts.phase);
    const departing = opts.phase > 0.6;
    const walkPhase = clamp((opts.phase - 0.18) / 0.5, 0, 1);
    const stroll = opts.reducedMotion
      ? 0
      : Math.sin((time - entered) * 0.5) * 1.3;
    guide.avatar.visible =
      opts.stop < 4 && !(opts.stop === 3 && opts.phase > 0.62);
    guide.avatar.position.set(
      THREE.MathUtils.lerp(
        trainX - 1.9,
        opts.stop === 2
          ? x + 1 + Math.sin(walkPhase * Math.PI) * 5 + stroll
          : x + 0.1 + Math.sin(walkPhase * Math.PI) * 4 + stroll,
        dismount,
      ),
      THREE.MathUtils.lerp(1.5, opts.stop === 2 ? 0.9 : 0, dismount),
      THREE.MathUtils.lerp(trainZ, opts.stop === 2 ? z - 4 : z + 3.5, dismount),
    );
    guide.avatar.rotation.y =
      dismount > 0 ? Math.PI / 2 + Math.sin(walkPhase * Math.PI) * 0.7 : 0;
    walk(guide, atStop && dismount > 0 && !departing ? 0.65 : 0);
    // Rocket first descends onto the archive pad, then takes the guide into orbit.
    const arrival = smooth(3.1, 3.35, progress),
      boarding = smooth(3.35, 3.55, progress);
    launchRocket.visible = opts.stop >= 3;
    launchRocket.position.set(
      padX,
      22 * (1 - arrival) + launch * launch * 95,
      padZ,
    );
    launchRocket.rotation.z = launch * 0.12;
    if (opts.stop === 3 && boarding > 0 && launch === 0) {
      guide.avatar.visible = boarding < 0.9;
      guide.avatar.position.set(
        THREE.MathUtils.lerp(x + 2, padX, boarding),
        boarding * 0.5,
        THREE.MathUtils.lerp(z + 3.5, padZ + 1.5, boarding),
      );
      guide.avatar.rotation.y = Math.PI / 2;
      walk(guide, 1);
    }
    flames.visible = launch > 0 || (arrival > 0.05 && arrival < 0.95);
    flames.scale.y = 0.8 + Math.sin(time * 22) * 0.12;
    const spaceX =
      opts.stop === 4
        ? experience * 32 + (progress - 4) * 36
        : opts.stop === 5
          ? LIBRARY_X + (progress - 5) * 32
          : CONTACT_X;
    const localPlanet = clamp(
        Math.round(experience),
        0,
        journeyExperience.length - 1,
      ),
      planetX = localPlanet * 32;
    const betweenPlanets =
      Math.abs(experience - Math.round(experience)) > 0.035;
    const flight =
      betweenPlanets ||
      (opts.stop === 4 && progress > 4.005) ||
      (opts.stop === 5 && progress > 5.005);
    const flightArc =
      opts.stop === 4
        ? Math.sin((experience % 1) * Math.PI) * 5
        : Math.sin((progress % 1) * Math.PI) * 6;
    const rocketY = (opts.stop === 4 ? 3 : -0.2) + flightArc;
    spaceRocket.position.set(
      spaceX + 8,
      THREE.MathUtils.damp(spaceRocket.position.y, rocketY, 5, dt),
      3,
    );
    spaceRocket.rotation.z = flight ? -0.15 : 0;
    orbitFlames.visible = flight;
    astronaut.avatar.visible = opts.stop >= 4 && !flight;
    astronaut.avatar.position.set(
      opts.stop === 4 ? planetX + 2 : spaceX + 2,
      opts.stop === 4 ? 3.5 : 0,
      opts.stop === 4 ? 2.3 : 2,
    );
    astronaut.avatar.rotation.y = 0.5;
    walk(astronaut, opts.phase > 0.1 ? 0.35 : 0);
    if (inSpace) {
      const radius =
          host.clientWidth <= 800 && host.clientWidth < host.clientHeight
            ? 32
            : 29,
        angle = 0.35 + azimuth;
      destination.set(
        spaceX + Math.sin(angle) * radius,
        13 + elevation,
        Math.cos(angle) * radius,
      );
      look.set(spaceX, 2, 0);
      if (opts.onboard) {
        destination.set(spaceX + 7, 12, 5);
        look.set(spaceX - 8, 3, 0);
      }
    } else {
      const radius =
          host.clientWidth <= 800 && host.clientWidth < host.clientHeight
            ? 34
            : 31,
        angle = 0.65 + azimuth;
      destination.set(
        x + Math.sin(angle) * radius,
        13 + elevation + launch * 60,
        z + Math.cos(angle) * radius,
      );
      look.set(x - 1 + boarding * 5, 2.5 + launch * 75, z - 3);
      if (opts.onboard && launch === 0) {
        destination.set(trainX - 2, 4.7, trainZ + 1.5);
        look.set(
          x + 17 * Math.cos(azimuth),
          3.6,
          routeZ(x + 17) - Math.sin(azimuth) * 15,
        );
      }
    }
    const factor = opts.reducedMotion ? 1 : 1 - Math.exp(-5 * dt);
    camera.position.lerp(destination, factor);
    cameraLook.lerp(look, factor);
    camera.lookAt(cameraLook);
    const color = inSpace
      ? spaceColor
      : (opts.night ? dusk : sky).clone().lerp(spaceColor, launch);
    (scene.background as THREE.Color).lerp(color, 1 - Math.exp(-4 * dt));
    const fog = scene.fog as THREE.Fog;
    fog.color.copy(scene.background as THREE.Color);
    fog.near = inSpace ? 180 : 90;
    fog.far = inSpace ? 350 : 205;
    hemi.intensity = inSpace ? 1.7 : opts.night ? 1.1 : 2.1;
    sun.intensity = inSpace ? 1.8 : opts.night ? 0.7 : 2.5;
    moonLight.intensity = inSpace ? 1.5 : 0;
    sun.position.set((inSpace ? spaceX : x) - 20, 40, 25);
    sun.target.position.set(inSpace ? spaceX : x, 0, 0);
    sun.target.updateMatrixWorld();
    renderer.render(scene, camera);
  }
  camera.position.set(20, 13, 25);
  cameraLook.set(0, 2, -3);
  frame = requestAnimationFrame(animate);
  return {
    resetView() {
      azimuth = 0;
      elevation = 0;
    },
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
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
