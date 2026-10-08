import * as THREE from 'three';

/** HTML is behind the canvas. Only its own depth-tested aperture can reveal it. */
export function createWorldCompositor(renderer: THREE.WebGLRenderer) {
  const target = new THREE.WebGLRenderTarget(1, 1, {
    samples: 4,
    depthTexture: new THREE.DepthTexture(1, 1, THREE.UnsignedIntType),
  });
  const size = new THREE.Vector2();
  const portals = new THREE.Scene();
  const geometry = new THREE.PlaneGeometry(1, 1);
  const copyScene = new THREE.Scene();
  const copyCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const copyMaterial = new THREE.ShaderMaterial({
    uniforms: {
      colorTexture: { value: target.texture },
      depthTexture: { value: target.depthTexture },
    },
    vertexShader,
    fragmentShader: `
      uniform sampler2D colorTexture;
      uniform sampler2D depthTexture;
      varying vec2 vUv;
      void main() {
        gl_FragColor = texture2D(colorTexture, vUv);
        gl_FragDepth = texture2D(depthTexture, vUv).r;
        #include <colorspace_fragment>
      }
    `,
    depthFunc: THREE.AlwaysDepth,
    blending: THREE.NoBlending,
    toneMapped: false,
  });
  const copyGeometry = new THREE.PlaneGeometry(2, 2);
  copyScene.add(new THREE.Mesh(copyGeometry, copyMaterial));
  const materials: THREE.ShaderMaterial[] = [];
  return {
    portal() {
      const material = new THREE.ShaderMaterial({
        uniforms: {
          colorTexture: { value: target.texture },
          resolution: { value: size },
          reveal: { value: 0 },
        },
        vertexShader,
        fragmentShader: `
          uniform sampler2D colorTexture;
          uniform vec2 resolution;
          uniform float reveal;
          void main() {
            vec3 background = texture2D(colorTexture, gl_FragCoord.xy / resolution).rgb;
            gl_FragColor = vec4(background, 1.0 - reveal);
            #include <colorspace_fragment>
            gl_FragColor.rgb *= gl_FragColor.a;
          }
        `,
        // Replace the canvas pixel, including alpha; normal blending cannot cut a hole.
        blending: THREE.NoBlending,
        depthTest: true,
        depthWrite: true,
        toneMapped: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      portals.add(mesh);
      materials.push(material);
      return {
        mesh,
        reveal: (opacity: number) => {
          material.uniforms.reveal.value = opacity;
        },
      };
    },
    render(scene: THREE.Scene, camera: THREE.Camera) {
      renderer.getDrawingBufferSize(size);
      if (target.width !== size.x || target.height !== size.y)
        target.setSize(size.x, size.y);
      // One world render supplies both colour and depth. The small second pass
      // reveals text only where that world has no nearer surface.
      renderer.setRenderTarget(target);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(copyScene, copyCamera);
      renderer.autoClear = false;
      renderer.render(portals, camera);
      renderer.autoClear = true;
    },
    dispose() {
      target.dispose();
      target.depthTexture?.dispose();
      geometry.dispose();
      copyGeometry.dispose();
      copyMaterial.dispose();
      materials.forEach((material) => material.dispose());
    },
  };
}
