// Rebuild the static mobile illustration from a real voxel model.
// Run with Node, serve the repo on localhost, then capture
// /outputs/railway-renderer/ at 880 × 680 using the browser screenshot tool.
// The renderer is tooling only. Phones download the finished image, never Three.js.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';

const directory = new URL('../outputs/railway-renderer/', import.meta.url);
await mkdir(directory, { recursive: true });
const materials = ts.transpileModule(
  await readFile(new URL('../lib/voxel-textures.ts', import.meta.url), 'utf8'),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
await writeFile(new URL('materials.mjs', directory), materials);
await writeFile(
  new URL('index.html', directory),
  `<!doctype html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Constructed voxel railway illustration</title>
<style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#dbe5da}canvas{display:block;width:100%;height:100%}#state{position:absolute;top:8px;left:8px;font:12px monospace;color:#253c32}#state[data-ready]{display:none}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js"}}</script>
</head><body><output id="state">Rendering railway…</output><script type="module" src="scene.mjs"></script></body></html>`,
);
await writeFile(
  new URL('scene.mjs', directory),
  `
import * as THREE from 'three';
import { createBlockMaterials } from './materials.mjs';
const scene = new THREE.Scene();
scene.background = new THREE.Color('#dbe5da');
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(1);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
document.body.prepend(renderer.domElement);
const aspect=innerWidth/innerHeight;
const camera=new THREE.OrthographicCamera(-11.4*aspect,11.4*aspect,11.4,-11.4,0.1,120);
camera.position.set(23,21,28);
camera.lookAt(-2,2,0);
scene.add(new THREE.HemisphereLight('#fff9e8','#738361',2.5));
const sun=new THREE.DirectionalLight('#fff3d8',2.8);
sun.position.set(-12,25,15); sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20,near:1,far:80});
sun.shadow.bias=-0.0003; scene.add(sun);
const cube=new THREE.BoxGeometry(1,1,1), mats=createBlockMaterials();
function block(parent,x,y,z,type,w=1,h=1,d=1){const m=new THREE.Mesh(cube,mats.get(type));m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
const island=new THREE.Group();scene.add(island);
// A continuous block grid. Grass over dirt, a stone foundation, and real rail gauge.
for(let x=-12;x<=8;x++)for(let z=-4;z<=4;z++){
  if((x===-12||x===8)&&Math.abs(z)===4)continue;
  block(island,x,-.5,z,'grass');
  block(island,x,-1.5,z,'dirt');
  block(island,x,-2.25,z,'stone',1,.5,1);
}
for(let x=-11.5;x<8;x+=.65){block(island,x,.12,0,'plank',.34,.24,2.7);}
for(const side of [-1,1]){
  block(island,-2,.32,side*.86,'iron',20,.19,.16);
  for(let x=-11;x<=7;x+=1.3) block(island,x,.23,side*.86,'dark',.36,.12,.3);
}
// Riveted copper engine with a stepped boiler, open cab, and visible connecting rods.
const train=new THREE.Group();train.position.set(3.1,.4,0);scene.add(train);
function wheel(parent,x,side,r=.64){
  const g=new THREE.Group();g.position.set(x,.68,side*1.25);parent.add(g);
  for(let j=0;j<16;j++){
    const a=j/16*Math.PI*2; const tooth=block(g,Math.cos(a)*r,Math.sin(a)*r,0,'dark',.3,.3,.24);tooth.rotation.z=a;
  }
  const face=new THREE.Mesh(new THREE.CylinderGeometry(r*.8,r*.8,.15,12),mats.get('copper'));face.rotation.x=Math.PI/2;g.add(face);
  block(g,0,0,side*.12,'iron',.24,.24,.16);
  for(let j=0;j<4;j++){const spoke=block(g,0,0,side*.08,'dark',r*1.3,.09,.05);spoke.rotation.z=j*Math.PI/4;}
}
block(train,0,1.03,0,'dark',7.5,.34,2.45);
for(const side of [-1,1])for(const x of [-2.35,0,2.35])wheel(train,x,side);
for(let x=-.5;x<2.6;x+=.75){
  block(train,x,2.03,0,'copper',.75,1.6,1.7);
  block(train,x,2.91,0,'copper',.75,.18,1.15);
}
for(const x of [-.7,.8,2.3]){block(train,x,2.05,0,'dark',.1,1.66,1.76);block(train,x,2.98,0,'dark',.14,.08,1.14);}
block(train,2.9,2.05,0,'dark',.25,1.6,1.8);
block(train,3.06,2.1,0,'gold',.16,.5,.5);
block(train,1.9,3.52,0,'dark',.55,1.05,.55);
block(train,1.9,4.09,0,'iron',.8,.18,.8);
block(train,-2.35,1.3,0,'plank',2.5,.18,2.1);
for(const side of [-1,1]){
  block(train,-2.35,1.7,side*1,'oxidized',2.4,.65,.2);
  for(const x of [-3.45,-1.35])block(train,x,2.65,side*1,'oxidized',.18,2.25,.18);
  block(train,-2.4,2.7,side*1,'glass',1.7,.95,.08);
  block(train,-2.5,2.55,side*1.08,'dark',.09,1.55,.08);
  block(train,.5,.72,side*1.51,'iron',4.9,.15,.12);
  for(const x of [-2.35,0,2.35])block(train,x,.72,side*1.62,'copper',.23,.23,.12);
  block(train,2.35,1.02,side*1.28,'dark',.9,.45,.42);
  block(train,.7,1.45,side*1,'gold',3.1,.12,.1);
  block(train,-3.1,1.15,side*1.4,'iron',.7,.14,.6);
}
block(train,-2.35,3.84,0,'dark',2.8,.28,2.7);
block(train,-2.35,4.06,0,'oxidized',2.45,.18,2.4);
block(train,3.55,1.12,0,'dark',.6,.34,2.75);
for(let j=0;j<3;j++)block(train,3.6+j*.17,.94-j*.13,0,'dark',.2,.2,2.6-j*.55);
// One carriage: separate bogies, oak framing, copper corners, and glass panes.
const car=new THREE.Group();car.position.set(-5.55,.4,0);scene.add(car);
block(car,0,1.03,0,'dark',7.2,.34,2.4);
for(const side of [-1,1])for(const x of [-2.3,2.3])wheel(car,x,side,.55);
block(car,0,1.3,0,'plank',6.8,.18,2.2);
for(const side of [-1,1]){
  block(car,0,1.73,side*1.04,'plank',6.8,.68,.22);
  block(car,0,2.52,side*1.04,'glass',6.7,.88,.08);
  for(const x of [-3.3,-1.1,1.1,3.3])block(car,x,2.46,side*1.06,'copper',.16,1.75,.18);
  block(car,0,3.15,side*1.05,'oxidized',6.9,.3,.2);
  for(const x of [-2.2,0,2.2])block(car,x,1.7,0,'plank',.6,.65,1.7);
}
block(car,0,3.5,0,'dark',7.2,.28,2.8);
block(car,0,3.72,0,'oxidized',6.9,.16,2.5);
block(scene,-.9,1.42,0,'iron',1.35,.16,.22);
// Oaks are built out of cubic crowns, logs and visible cross-grain end faces.
function oak(x,z,h){for(let y=.5;y<h;y++)block(island,x,y,z,'log');
  for(let yy=h-1;yy<=h+1;yy++)for(let xx=-1;xx<=1;xx++)for(let zz=-1;zz<=1;zz++){
    if(yy===h+1&&Math.abs(xx)+Math.abs(zz)>1)continue;
    block(island,x+xx,yy,z+zz,'leaf');
  }
}
oak(-10,-2.8,4);oak(-6,-3.4,5);oak(5,-3.4,3);
// Three small, separate exhaust cubes above the chimney; no fake painted cloud.
for(const [x,y,z,s] of [[4.98,5.2,0,.6],[4.25,6.05,0,.85],[3.4,6.8,0,1.05]]){
  const p=block(scene,x,y,z,'white',s,s,s);p.material=new THREE.MeshLambertMaterial({color:'#d0d6cf',transparent:true,opacity:.68});
}
renderer.render(scene,camera);
document.getElementById('state').dataset.ready='true';
document.body.dataset.ready='true';
`,
);
console.log('Railway renderer written to outputs/railway-renderer/.');
