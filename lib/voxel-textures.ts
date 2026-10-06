import * as THREE from 'three';

export type Block =
  | 'grass'
  | 'dirt'
  | 'stone'
  | 'cobble'
  | 'log'
  | 'birch'
  | 'plank'
  | 'leaf'
  | 'brick'
  | 'copper'
  | 'oxidized'
  | 'iron'
  | 'dark'
  | 'glass'
  | 'redstone'
  | 'gold'
  | 'moon'
  | 'purple'
  | 'white'
  | 'water';
const palette: Record<Block, string[]> = {
  grass: ['#678d3c', '#739d43', '#5c8135', '#83a64b'],
  dirt: ['#805536', '#986b45', '#69452e', '#a67750'],
  stone: ['#777b7c', '#8c9191', '#666b6c', '#9c9f9f'],
  cobble: ['#5f6668', '#818989', '#a0a5a1', '#727975'],
  log: ['#634527', '#795332', '#4b341f', '#966a3d'],
  birch: ['#dadac5', '#efedda', '#b7bba9', '#30352d'],
  plank: ['#b48a50', '#c79a5c', '#a57c46', '#d5ad70'],
  leaf: ['#3b702d', '#488237', '#2d5d24', '#598d3e'],
  brick: ['#98543d', '#ac6449', '#783d30', '#bd795b'],
  copper: ['#ac603b', '#c57649', '#8e482d', '#dc9062'],
  oxidized: ['#397e68', '#4b9480', '#306653', '#65a28e'],
  iron: ['#c4c8c4', '#e5e5dc', '#9ba4a1', '#d6d9d2'],
  dark: ['#252b30', '#343d40', '#1d2326', '#485257'],
  glass: ['#699fbc', '#83bed0', '#5487a2', '#b0dce0'],
  redstone: ['#7e2025', '#b3302c', '#d8432f', '#e66c44'],
  gold: ['#d0a233', '#e6bb46', '#b58227', '#f4d15f'],
  moon: ['#a5a8b1', '#c3c6cc', '#898d98', '#b4b7c1'],
  purple: ['#6c5386', '#8b6ba9', '#534164', '#a786c0'],
  white: ['#e5ded0', '#f6efe1', '#ccc9be', '#fff9ed'],
  water: ['#2e77ae', '#3a8ec1', '#296ca5', '#56a5cd'],
};

/** Original 16 × 16 pixel textures; no external game assets. */
export function createBlockMaterials() {
  const textures: THREE.Texture[] = [];
  const materials: THREE.Material[] = [];
  function texture(type: Block, variant: 'side' | 'top' = 'side') {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    const colors = palette[type];
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        // Small clusters give the pixel surfaces structure rather than TV noise.
        const cluster = (Math.floor(x / 2) * 13 + Math.floor(y / 2) * 7) % 19;
        let color =
          colors[cluster < 13 ? 0 : cluster < 16 ? 1 : cluster < 18 ? 2 : 3];
        if (type === 'grass' && variant === 'side')
          color =
            y < 3 + ((x * 7) % 3)
              ? palette.grass[cluster % 4]
              : palette.dirt[cluster < 13 ? 0 : cluster % 4];
        if (type === 'log')
          color =
            variant === 'top'
              ? ['#b58751', '#c3975e', '#916333'][
                  Math.min(x, y, 15 - x, 15 - y) % 3
                ]
              : colors[Math.floor(x / 2) % 4];
        if (type === 'birch')
          color =
            y % 6 === 2 && (x + Math.floor(y / 6) * 5) % 11 < 5
              ? colors[3]
              : colors[cluster > 14 ? 1 : 0];
        if (type === 'plank')
          color =
            y % 4 === 0 || (y % 4 === 3 && x % 8 === 0)
              ? '#87643b'
              : colors[
                  Math.floor(y / 4) % 2 === 0
                    ? cluster > 16
                      ? 1
                      : 0
                    : cluster > 16
                      ? 3
                      : 1
                ];
        if (type === 'brick')
          color =
            y % 4 === 0 || (x + (Math.floor(y / 4) % 2) * 4) % 8 === 0
              ? '#c0a18b'
              : color;
        if (type === 'cobble') {
          const row = Math.floor(y / 4),
            xx = (x + (row % 2) * 3) % 8;
          color =
            y % 4 === 0 || xx === 0
              ? '#454a46'
              : y % 4 === 1 || xx === 1
                ? '#93988c'
                : colors[(row + Math.floor(x / 8)) % 2];
        }
        if (type === 'iron' || type === 'copper' || type === 'oxidized')
          color =
            x === 0 || y === 0
              ? colors[2]
              : x === 1 || y === 1
                ? colors[3]
                : (x === 3 || x === 12) && (y === 3 || y === 12)
                  ? colors[2]
                  : colors[cluster > 16 ? 1 : 0];
        if (type === 'glass')
          color =
            x === 0 || y === 0 || x === 15 || y === 15
              ? '#b0dce0'
              : x === y || x === y + 1
                ? '#90c5d1'
                : '#56839c';
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.magFilter = THREE.NearestFilter;
    map.minFilter = THREE.NearestMipmapLinearFilter;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    textures.push(map);
    return map;
  }
  function material(type: Block, variant?: 'side' | 'top') {
    const m = new THREE.MeshLambertMaterial({
      map: texture(type, variant),
      emissive: type === 'redstone' ? '#a52812' : '#000000',
      emissiveIntensity: type === 'redstone' ? 0.35 : 0,
    });
    // Repeat one 16px tile per block on stretched beams, columns and instanced terrain.
    m.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <uv_vertex>',
        `
        #include <uv_vertex>
        #ifdef USE_MAP
          vec3 blockScale = vec3(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz), length(modelMatrix[2].xyz));
          #ifdef USE_INSTANCING
            blockScale *= vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
          #endif
          vec2 faceScale = abs(normal.y) > 0.5 ? blockScale.xz : (abs(normal.x) > 0.5 ? blockScale.zy : blockScale.xy);
          vMapUv *= faceScale;
        #endif
      `,
      );
    };
    m.customProgramCacheKey = () => 'block-face-tiles-v1';
    materials.push(m);
    return m;
  }
  const blocks = new Map<Block, THREE.Material | THREE.Material[]>();
  for (const type of Object.keys(palette) as Block[]) {
    const side = material(type);
    blocks.set(
      type,
      type === 'grass'
        ? [side, side, material('grass', 'top'), material('dirt'), side, side]
        : type === 'log'
          ? [
              side,
              side,
              material('log', 'top'),
              material('log', 'top'),
              side,
              side,
            ]
          : side,
    );
  }
  const solids = new Map<string, THREE.MeshLambertMaterial>();
  return {
    get(type: string): THREE.Material | THREE.Material[] {
      if (blocks.has(type as Block)) return blocks.get(type as Block)!;
      if (!solids.has(type)) {
        const m = new THREE.MeshLambertMaterial({ color: type });
        solids.set(type, m);
        materials.push(m);
      }
      return solids.get(type)!;
    },
    dispose() {
      textures.forEach((t) => t.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
