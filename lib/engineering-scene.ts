import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export type ModelKind = 'rover' | 'tensegrity' | 'knee' | 'satellite';
export type SceneOptions = {
  model: ModelKind;
  running: boolean;
  exploded: boolean;
  stiffness: number;
  terrain: number;
};
export type EngineeringScene = {
  dispose: () => void;
  resetView: () => void;
  rotateView: () => void;
};
type AnimatedModel = {
  root: THREE.Group;
  animate: (time: number, options: SceneOptions, dt: number) => void;
};
const Y = new THREE.Vector3(0, 1, 0);

function material(color: string, metalness = 0.25, roughness = 0.4) {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness });
}
function mesh(
  geometry: THREE.BufferGeometry,
  mat: THREE.Material,
  position: [number, number, number] = [0, 0, 0],
) {
  const object = new THREE.Mesh(geometry, mat);
  object.position.set(...position);
  object.castShadow = true;
  object.receiveShadow = true;
  return object;
}
function box(
  size: [number, number, number],
  mat: THREE.Material,
  position: [number, number, number] = [0, 0, 0],
  radius = 0.035,
) {
  return mesh(new RoundedBoxGeometry(...size, 2, radius), mat, position);
}
function cylinder(
  radius: number,
  height: number,
  mat: THREE.Material,
  position: [number, number, number] = [0, 0, 0],
  segments = 32,
) {
  return mesh(
    new THREE.CylinderGeometry(radius, radius, height, segments),
    mat,
    position,
  );
}
function rod(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radius: number,
  mat: THREE.Material,
) {
  const delta = to.clone().sub(from);
  const result = cylinder(radius, delta.length(), mat);
  result.position.copy(from).add(to).multiplyScalar(0.5);
  result.quaternion.setFromUnitVectors(Y, delta.normalize());
  return result;
}
function spring(
  radius: number,
  height: number,
  turns: number,
  mat: THREE.Material,
) {
  const points = Array.from({ length: 121 }, (_, i) => {
    const t = i / 120;
    return new THREE.Vector3(
      Math.cos(t * Math.PI * 2 * turns) * radius,
      t * height - height / 2,
      Math.sin(t * Math.PI * 2 * turns) * radius,
    );
  });
  return mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      120,
      0.017,
      6,
      false,
    ),
    mat,
  );
}
function instances(
  geometry: THREE.BufferGeometry,
  mat: THREE.Material,
  transforms: {
    position: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
  }[],
) {
  const result = new THREE.InstancedMesh(geometry, mat, transforms.length);
  const dummy = new THREE.Object3D();
  transforms.forEach((transform, i) => {
    dummy.position.copy(transform.position);
    dummy.rotation.copy(transform.rotation ?? new THREE.Euler());
    dummy.scale.copy(transform.scale ?? new THREE.Vector3(1, 1, 1));
    dummy.updateMatrix();
    result.setMatrixAt(i, dummy.matrix);
  });
  result.castShadow = true;
  result.receiveShadow = true;
  return result;
}
function disposeObject(object: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  object.traverse((item) => {
    if (item instanceof THREE.Mesh) {
      geometries.add(item.geometry);
      (Array.isArray(item.material) ? item.material : [item.material]).forEach(
        (mat) => materials.add(mat),
      );
    }
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((mat) => mat.dispose());
}

function rover(): AnimatedModel {
  const root = new THREE.Group();
  const chassis = new THREE.Group();
  root.add(chassis);
  const dark = material('#19292d', 0.75, 0.27),
    rubber = material('#192326', 0.03, 0.86),
    mint = material('#cbfbc4', 0.32, 0.35),
    alloy = material('#a1b7b6', 0.9, 0.26),
    orange = material('#ff603b', 0.45, 0.28),
    pale = material('#eff1e9', 0.5, 0.26),
    glass = new THREE.MeshPhysicalMaterial({
      color: '#203e41',
      metalness: 0.25,
      roughness: 0.08,
      clearcoat: 1,
    });
  chassis.add(
    box([2.5, 0.16, 1.25], dark, [0, 1.03, 0]),
    box([2.25, 0.4, 1.1], mint, [0, 1.3, 0], 0.09),
    box([1.65, 0.055, 0.9], pale, [0, 1.53, 0]),
    box([1.7, 0.14, 0.32], dark, [0, 1.62, 0]),
  );
  [-1, 1].forEach((side) => {
    chassis.add(
      box([2.63, 0.085, 0.075], alloy, [0, 0.98, side * 0.66]),
      box([0.12, 0.22, 1.36], orange, [side * 1.21, 1.12, 0]),
    );
  });
  // Panel vents, fasteners, a sensor mast, and a small service handle.
  for (let i = 0; i < 7; i++)
    chassis.add(
      box(
        [0.58, 0.015, 0.025],
        dark,
        [-0.35 + i * 0.025, 1.565, -0.32 + i * 0.105],
        0.005,
      ),
    );
  const screwTransforms = [-1, 1].flatMap((x) =>
    [-1, 1].map((z) => ({
      position: new THREE.Vector3(x * 0.98, 1.555, z * 0.43),
    })),
  );
  chassis.add(
    instances(
      new THREE.CylinderGeometry(0.037, 0.037, 0.018, 6),
      alloy,
      screwTransforms,
    ),
  );
  const sensorMast = cylinder(0.04, 0.55, alloy, [0.76, 1.82, 0]);
  chassis.add(sensorMast, box([0.44, 0.27, 0.32], dark, [0.76, 2.15, 0]));
  [-1, 1].forEach((side) => {
    const lens = cylinder(0.076, 0.032, glass, [1.001, 2.16, side * 0.083]);
    lens.rotation.z = Math.PI / 2;
    chassis.add(lens);
  });
  chassis.add(
    cylinder(0.15, 0.08, orange, [-0.68, 1.67, 0]),
    cylinder(0.11, 0.14, dark, [-0.68, 1.77, 0]),
  );
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.17, 0.022, 8, 24, Math.PI),
    alloy,
  );
  handle.position.set(-0.3, 1.68, 0);
  chassis.add(handle);
  const wheelStations: {
    assembly: THREE.Group;
    wheel: THREE.Group;
    coil: THREE.Mesh;
    x: number;
    side: number;
    arm: THREE.Group;
  }[] = [];
  [-1, 1].forEach((side) =>
    [-0.98, 0, 0.98].forEach((x, index) => {
      const assembly = new THREE.Group();
      assembly.position.set(x, 0.51, side * 0.96);
      root.add(assembly);
      const wheel = new THREE.Group();
      assembly.add(wheel);
      const tire = cylinder(0.46, 0.29, rubber);
      tire.rotation.x = Math.PI / 2;
      wheel.add(tire);
      const treadTransforms = Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2;
        return {
          position: new THREE.Vector3(
            Math.sin(a) * 0.456,
            Math.cos(a) * 0.456,
            0,
          ),
          rotation: new THREE.Euler(0, 0, -a),
          scale: new THREE.Vector3(1, 1, 1),
        };
      });
      wheel.add(
        instances(
          new THREE.BoxGeometry(0.091, 0.042, 0.32),
          rubber,
          treadTransforms,
        ),
      );
      [-1, 1].forEach((face) => {
        const rim = cylinder(0.28, 0.018, alloy, [0, 0, face * 0.151]);
        rim.rotation.x = Math.PI / 2;
        wheel.add(rim);
        const inner = cylinder(0.22, 0.022, dark, [0, 0, face * 0.168]);
        inner.rotation.x = Math.PI / 2;
        wheel.add(inner);
        const spokes = Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return {
            position: new THREE.Vector3(
              Math.sin(a) * 0.15,
              Math.cos(a) * 0.15,
              face * 0.186,
            ),
            rotation: new THREE.Euler(0, 0, -a),
          };
        });
        wheel.add(
          instances(new THREE.BoxGeometry(0.052, 0.19, 0.023), mint, spokes),
        );
        const hub = cylinder(0.085, 0.035, orange, [0, 0, face * 0.19]);
        hub.rotation.x = Math.PI / 2;
        wheel.add(hub);
      });
      const arm = new THREE.Group();
      root.add(arm);
      const pivot = new THREE.Vector3(
        x - (index === 0 ? -0.12 : 0.12),
        1.06,
        side * 0.6,
      );
      const endpoint = new THREE.Vector3(x, 0.52, side * 0.89);
      arm.add(
        rod(pivot, endpoint, 0.055, alloy),
        rod(
          pivot.clone().add(new THREE.Vector3(0.15, 0, 0)),
          endpoint.clone().add(new THREE.Vector3(0.15, 0, 0)),
          0.027,
          dark,
        ),
      );
      const coil = spring(0.073, 0.48, 7, orange);
      coil.position.set(x + 0.13, 0.84, side * 0.79);
      coil.rotation.x = side * 0.43;
      root.add(coil);
      const cap = cylinder(0.102, 0.065, dark, [x + 0.13, 1.075, side * 0.69]);
      root.add(cap);
      wheelStations.push({ assembly, wheel, coil, x, side, arm });
    }),
  );
  const baseYs = wheelStations.map((station) => station.assembly.position.y);
  let explosion = 0;
  let distance = 0;
  return {
    root,
    animate(time, options, dt) {
      explosion = THREE.MathUtils.damp(
        explosion,
        options.exploded ? 1 : 0,
        5,
        dt,
      );
      if (options.running) distance += dt * (1 + options.stiffness * 0.25);
      chassis.position.y = explosion * 0.63;
      chassis.rotation.z = options.running
        ? (Math.sin(distance * 2.2) * options.terrain * 0.045) /
          (1 + options.stiffness)
        : 0;
      wheelStations.forEach((station, i) => {
        const travel = options.running
          ? (Math.sin(distance * 2.8 + station.x * 1.8 + station.side * 0.6) *
              options.terrain *
              0.16) /
            (1 + options.stiffness * 0.5)
          : 0;
        station.assembly.position.y = baseYs[i] + travel;
        station.assembly.position.z = station.side * (0.96 + explosion * 0.56);
        station.wheel.rotation.z = -distance * 2;
        station.coil.scale.y = 1 - travel * 0.8 + explosion * 0.5;
        station.coil.position.y = 0.84 + travel * 0.4 + explosion * 0.2;
        station.coil.position.z = station.side * (0.79 + explosion * 0.25);
        station.arm.position.z = station.side * explosion * 0.28;
      });
    },
  };
}

function tensegrity(): AnimatedModel {
  const root = new THREE.Group();
  const lower = new THREE.Group(),
    upper = new THREE.Group();
  root.add(lower, upper);
  const metal = material('#8eaaa7', 0.85, 0.25),
    mint = material('#bfe9b9', 0.45, 0.3),
    orange = material('#ff603b', 0.4, 0.3),
    cable = material('#273c40', 0.5, 0.4);
  const struts: THREE.Mesh[] = [],
    cables: THREE.Mesh[] = [];
  const radius = 0.85;
  const lowerPoints = Array.from(
    { length: 3 },
    (_, i) =>
      new THREE.Vector3(
        Math.cos((i * 2 * Math.PI) / 3) * radius,
        0.22,
        Math.sin((i * 2 * Math.PI) / 3) * radius,
      ),
  );
  lower.add(
    cylinder(1.08, 0.12, metal, [0, 0.15, 0]),
    cylinder(0.6, 0.14, mint, [0, 0.1, 0]),
  );
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.94, 0.034, 8, 64),
    orange,
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.25;
  lower.add(ring);
  const topPlate = cylinder(1.08, 0.12, mint, [0, 0, 0]);
  upper.add(topPlate);
  const topRing = ring.clone();
  topRing.position.y = -0.1;
  upper.add(topRing);
  lowerPoints.forEach((point) =>
    lower.add(
      cylinder(0.07, 0.12, orange, point.toArray() as [number, number, number]),
    ),
  );
  for (let i = 0; i < 3; i++) {
    const strut = cylinder(0.055, 1, metal);
    root.add(strut);
    struts.push(strut);
  }
  for (let i = 0; i < 12; i++) {
    const wire = cylinder(0.009, 1, cable, undefined, 8);
    root.add(wire);
    cables.push(wire);
  }
  let phase = 0,
    explosion = 0;
  const updateRod = (
    object: THREE.Mesh,
    a: THREE.Vector3,
    b: THREE.Vector3,
  ) => {
    const delta = b.clone().sub(a);
    object.position.copy(a).add(b).multiplyScalar(0.5);
    object.scale.y = delta.length();
    object.quaternion.setFromUnitVectors(Y, delta.normalize());
  };
  return {
    root,
    animate(_time, options, dt) {
      if (options.running) phase += dt * 0.65;
      explosion = THREE.MathUtils.damp(
        explosion,
        options.exploded ? 1 : 0,
        5,
        dt,
      );
      const twist =
        0.6 +
        options.stiffness * 0.4 +
        (options.running ? Math.sin(phase) * 0.18 : 0);
      const height = 1.75 + explosion * 0.7;
      upper.position.y = height;
      upper.rotation.y = twist;
      const points = lowerPoints.map(
        (_, i) =>
          new THREE.Vector3(
            Math.cos((i * 2 * Math.PI) / 3 + twist) * radius,
            height - 0.06,
            Math.sin((i * 2 * Math.PI) / 3 + twist) * radius,
          ),
      );
      struts.forEach((strut, i) =>
        updateRod(strut, lowerPoints[i], points[(i + 1) % 3]),
      );
      let index = 0;
      for (let i = 0; i < 3; i++) {
        updateRod(cables[index++], lowerPoints[i], lowerPoints[(i + 1) % 3]);
        updateRod(cables[index++], points[i], points[(i + 1) % 3]);
        updateRod(cables[index++], lowerPoints[i], points[i]);
        updateRod(cables[index++], lowerPoints[i], points[(i + 2) % 3]);
      }
    },
  };
}

function knee(): AnimatedModel {
  const root = new THREE.Group();
  const upper = new THREE.Group(),
    lower = new THREE.Group();
  root.add(upper, lower);
  upper.position.y = 1.52;
  lower.position.y = 1.52;
  const alloy = material('#adbcbc', 0.82, 0.25),
    dark = material('#24383b', 0.65, 0.34),
    mint = material('#ceefc0', 0.3, 0.42),
    orange = material('#ff603b', 0.4, 0.33);
  [-1, 1].forEach((side) => {
    upper.add(
      box([0.11, 1.04, 0.13], alloy, [side * 0.38, 0.45, 0]),
      box([0.17, 0.67, 0.18], dark, [side * 0.38, 0.39, 0]),
    );
    lower.add(
      box([0.11, 1.12, 0.13], alloy, [side * 0.38, -0.53, 0]),
      box([0.17, 0.64, 0.18], dark, [side * 0.38, -0.63, 0]),
    );
    const joint = cylinder(0.18, 0.13, orange, [side * 0.38, 0, 0]);
    joint.rotation.x = Math.PI / 2;
    upper.add(joint);
    const bolt = cylinder(0.075, 0.17, alloy, [side * 0.38, 0, 0.04]);
    bolt.rotation.x = Math.PI / 2;
    upper.add(bolt);
    for (let i = 0; i < 4; i++) {
      const hole = cylinder(
        0.028,
        0.19,
        dark,
        [side * 0.38, 0.79 - i * 0.13, 0.01],
        12,
      );
      hole.rotation.x = Math.PI / 2;
      upper.add(hole);
    }
  });
  upper.add(
    box([0.9, 0.24, 0.4], mint, [0, 0.85, 0], 0.08),
    box([0.83, 0.07, 0.48], dark, [0, 0.75, 0]),
  );
  lower.add(
    box([0.9, 0.24, 0.4], mint, [0, -0.97, 0], 0.08),
    box([0.83, 0.07, 0.48], dark, [0, -0.86, 0]),
  );
  upper.add(
    box([0.32, 0.5, 0.32], dark, [0.53, 0.38, 0]),
    cylinder(0.13, 0.28, alloy, [0.53, 0.58, 0]),
  );
  const coil = spring(0.08, 0.47, 7, orange);
  coil.position.set(-0.5, -0.28, 0);
  lower.add(coil);
  const cable = rod(
    new THREE.Vector3(0.53, 0.6, 0.17),
    new THREE.Vector3(0.48, -0.62, 0.17),
    0.009,
    dark,
  );
  root.add(cable);
  let phase = 0,
    explosion = 0;
  return {
    root,
    animate(_time, options, dt) {
      if (options.running) phase += dt * 0.8;
      explosion = THREE.MathUtils.damp(
        explosion,
        options.exploded ? 1 : 0,
        5,
        dt,
      );
      lower.rotation.x = options.running
        ? -0.15 - Math.sin(phase) * 0.32
        : -0.22;
      upper.position.y = 1.52 + explosion * 0.5;
      lower.position.y = 1.52 - explosion * 0.35;
      coil.scale.y =
        1 +
        (options.running ? Math.sin(phase) * 0.15 : 0) /
          (options.stiffness + 1);
    },
  };
}

function satellite(): AnimatedModel {
  const root = new THREE.Group(),
    panel = new THREE.Group(),
    wheel = new THREE.Group(),
    camera = new THREE.Group();
  root.add(panel, wheel, camera);
  const dark = material('#152c39', 0.65, 0.35),
    gold = material('#ccb36b', 0.82, 0.27),
    alloy = material('#a9bec1', 0.85, 0.24),
    orange = material('#ff603b', 0.4, 0.3),
    glass = new THREE.MeshPhysicalMaterial({
      color: '#395261',
      metalness: 0.45,
      roughness: 0.12,
      clearcoat: 1,
    });
  panel.add(box([2.55, 0.09, 1.65], gold, [0, 0.65, 0]));
  for (let x = 0; x < 6; x++)
    for (let z = 0; z < 4; z++)
      panel.add(
        box(
          [0.38, 0.028, 0.37],
          dark,
          [-1.07 + x * 0.43, 0.71, -0.64 + z * 0.43],
          0.008,
        ),
      );
  [-1, 1].forEach((side) =>
    panel.add(box([2.5, 0.045, 0.025], alloy, [0, 0.735, side * 0.825])),
  );
  wheel.position.set(-0.68, 0.99, 0);
  wheel.add(
    cylinder(0.39, 0.3, alloy),
    cylinder(0.35, 0.02, orange, [0, 0.17, 0]),
    cylinder(0.25, 0.025, dark, [0, 0.19, 0]),
    cylinder(0.09, 0.1, gold, [0, 0.23, 0]),
  );
  const rotor = new THREE.Group();
  wheel.add(rotor);
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    rotor.add(
      box([0.045, 0.03, 0.22], gold, [
        Math.sin(a) * 0.16,
        0.21,
        Math.cos(a) * 0.16,
      ]),
    );
    rotor.children[i].rotation.y = a;
  }
  camera.position.set(0.63, 0.98, 0);
  camera.add(box([0.6, 0.5, 0.54], alloy));
  const lens = cylinder(0.21, 0.24, dark, [0.39, 0, 0]);
  lens.rotation.z = Math.PI / 2;
  camera.add(lens);
  const lensGlass = cylinder(0.17, 0.02, glass, [0.53, 0, 0]);
  lensGlass.rotation.z = Math.PI / 2;
  camera.add(lensGlass);
  camera.add(box([0.75, 0.08, 0.72], orange, [0, -0.3, 0]));
  for (const x of [-1, 1])
    for (const z of [-1, 1])
      panel.add(cylinder(0.037, 0.025, alloy, [x * 1.16, 0.72, z * 0.7], 6));
  let explosion = 0,
    phase = 0;
  return {
    root,
    animate(_time, options, dt) {
      explosion = THREE.MathUtils.damp(
        explosion,
        options.exploded ? 1 : 0,
        5,
        dt,
      );
      if (options.running) phase += dt * (2 + options.stiffness * 4);
      rotor.rotation.y = phase;
      wheel.position.y = 0.99 + explosion * 0.7;
      camera.position.y = 0.98 + explosion * 0.4;
      panel.rotation.z = options.running
        ? Math.sin(phase * 1.8) * 0.008 * (options.stiffness + 1)
        : 0;
    },
  };
}

const factories: Record<ModelKind, () => AnimatedModel> = {
  rover,
  tensegrity,
  knee,
  satellite,
};
export function createEngineeringScene(
  host: HTMLElement,
  getOptions: () => SceneOptions,
  settings: {
    thumbnail?: boolean;
    onRendered?: (image: string) => void;
    onError?: (message: string) => void;
  } = {},
): EngineeringScene {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
      preserveDrawingBuffer: !!settings.thumbnail,
    });
  } catch {
    throw new Error('WebGL 2 is required for the interactive workbench.');
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.24;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 80);
  camera.position.set(4.6, 3.25, 5.2);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.9, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 3.6;
  controls.maxDistance = 10;
  controls.minPolarAngle = 0.32;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.update();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight('#e6dcff', '#51455f', 2.1));
  const light = new THREE.DirectionalLight('#fff9ed', 4);
  light.position.set(3.5, 6, 4);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.left = -4;
  light.shadow.camera.right = 4;
  light.shadow.camera.top = 4;
  light.shadow.camera.bottom = -4;
  light.shadow.normalBias = 0.03;
  scene.add(light);
  const rim = new THREE.DirectionalLight('#b4a1ff', 3.2);
  rim.position.set(-4, 3, -3);
  scene.add(rim);
  const floor = mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.ShadowMaterial({ opacity: 0.18 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.02;
  floor.castShadow = false;
  scene.add(floor);
  const platform = mesh(
    new THREE.CylinderGeometry(2.05, 2.07, 0.055, 96),
    material('#252634', 0.25, 0.75),
    [0, -0.02, 0],
  );
  platform.castShadow = false;
  scene.add(platform);
  const guide = new THREE.Mesh(
    new THREE.TorusGeometry(1.91, 0.008, 6, 96),
    new THREE.MeshBasicMaterial({ color: '#5f576b' }),
  );
  guide.rotation.x = Math.PI / 2;
  guide.position.y = 0.019;
  scene.add(guide);
  let current = getOptions().model;
  let model = factories[current]();
  scene.add(model.root);
  let frame = 0,
    previous = performance.now(),
    elapsed = 0,
    visible = true,
    disposed = false;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let interactedUntil = 0;
  let captured = false;
  const onInteract = () => {
    interactedUntil = performance.now() + 6000;
  };
  controls.addEventListener('start', onInteract);
  function resize() {
    const width = host.clientWidth,
      height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  const visibility = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
  });
  visibility.observe(host);
  function animate(now: number) {
    if (disposed) return;
    frame = requestAnimationFrame(animate);
    const dt = Math.min((now - previous) / 1000, 0.05);
    previous = now;
    if (!visible || document.hidden) return;
    const options = getOptions();
    if (current !== options.model) {
      disposeObject(model.root);
      scene.remove(model.root);
      current = options.model;
      model = factories[current]();
      scene.add(model.root);
      elapsed = 0;
    }
    elapsed += dt;
    model.animate(elapsed, options, dt);
    controls.autoRotate =
      !settings.thumbnail &&
      !motion.matches &&
      !options.running &&
      now > interactedUntil;
    controls.autoRotateSpeed = 0.35;
    controls.update(dt);
    renderer.render(scene, camera);
    if (settings.thumbnail && !captured) {
      captured = true;
      settings.onRendered?.(renderer.domElement.toDataURL('image/webp', 0.92));
    }
  }
  frame = requestAnimationFrame(animate);
  const onLost = (event: Event) => {
    event.preventDefault();
    settings.onError?.(
      'The graphics context was interrupted. Reload the page to reopen the workbench.',
    );
  };
  renderer.domElement.addEventListener('webglcontextlost', onLost);
  return {
    resetView() {
      camera.position.set(4.6, 3.25, 5.2);
      controls.target.set(0, 0.9, 0);
      controls.update();
    },
    rotateView() {
      const offset = camera.position.clone().sub(controls.target);
      offset.applyAxisAngle(Y, Math.PI / 4);
      camera.position.copy(controls.target).add(offset);
      interactedUntil = performance.now() + 6000;
      controls.update();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      controls.removeEventListener('start', onInteract);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      disposeObject(scene);
      environment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
