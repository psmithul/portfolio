import * as THREE from 'three';

export type Block =
  | 'grass'
  | 'dirt'
  | 'stone'
  | 'cobble'
  | 'log'
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
  grass: ['#659b35', '#76ad40', '#5a892e', '#88b94c'],
  dirt: ['#805536', '#986b45', '#69452e', '#a67750'],
  stone: ['#777b7c', '#8c9191', '#666b6c', '#9c9f9f'],
  cobble: ['#5f6668', '#818989', '#a0a5a1', '#727975'],
  log: ['#634527', '#795332', '#4b341f', '#966a3d'],
  plank: ['#b48a50', '#c79a5c', '#a57c46', '#d5ad70'],
  leaf: ['#356f27', '#448a30', '#275d20', '#5a9a37'],
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
  let seed = 76126;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const textures: THREE.Texture[] = [];
  const materials: THREE.Material[] = [];
  function texture(type: Block, variant: 'side' | 'top' = 'side') {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    const colors = palette[type];
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        let color = colors[Math.floor(random() * colors.length)];
        if (type === 'grass' && variant === 'side')
          color =
            y < 3 + ((x * 7) % 3)
              ? palette.grass[(x + y) % 4]
              : palette.dirt[Math.floor(random() * 4)];
        if (type === 'log')
          color =
            variant === 'top'
              ? ['#b58751', '#c3975e', '#916333'][
                  Math.min(x, y, 15 - x, 15 - y) % 3
                ]
              : colors[Math.floor(x / 2) % 4];
        if (type === 'plank')
          color =
            y % 4 === 0 || (y % 4 === 3 && x % 8 === 0)
              ? '#87643b'
              : colors[Math.floor(random() * 4)];
        if (type === 'brick')
          color =
            y % 4 === 0 || (x + (Math.floor(y / 4) % 2) * 4) % 8 === 0
              ? '#c0a18b'
              : color;
        if (type === 'cobble')
          color =
            x % 5 === 0 || (y + Math.floor(x / 5) * 2) % 5 === 0
              ? '#505959'
              : color;
        if (type === 'iron' || type === 'copper' || type === 'oxidized')
          color =
            x === 0 || y === 0
              ? colors[2]
              : x === 1 || y === 1
                ? colors[3]
                : colors[Math.floor(random() * 2)];
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
    map.minFilter = THREE.NearestMipmapNearestFilter;
    textures.push(map);
    return map;
  }
  function material(type: Block, variant?: 'side' | 'top') {
    const m = new THREE.MeshLambertMaterial({
      map: texture(type, variant),
      emissive: type === 'redstone' ? '#a52812' : '#000000',
      emissiveIntensity: type === 'redstone' ? 0.35 : 0,
    });
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
