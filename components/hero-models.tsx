'use client';

import { useEffect, useRef, useState } from 'react';

export function HeroModels() {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    const current = host.current;
    if (!current) return;
    const element: HTMLDivElement = current;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    async function load() {
      const [
        THREE,
        { RoomEnvironment },
        { buildHeroModels },
        { createHeroPhysics },
      ] = await Promise.all([
        import('three'),
        import('three/addons/environments/RoomEnvironment.js'),
        import('@/lib/hero-models'),
        import('@/lib/hero-physics'),
      ]);
      if (cancelled) return;
      const physics = await createHeroPhysics();
      if (cancelled) {
        physics.dispose();
        return;
      }
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'low-power',
        });
      } catch (error) {
        physics.dispose();
        throw error;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-5.5, 5.5, 2, -2, 0.1, 40);
      camera.position.set(0, 0, 16);
      const generator = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const environment = generator.fromScene(room, 0.03);
      scene.environment = environment.texture;
      room.dispose();
      generator.dispose();
      scene.add(new THREE.HemisphereLight(0xfff9ed, 0x8296a5, 1.1));
      const key = new THREE.DirectionalLight(0xfff9ee, 2.2);
      key.position.set(-3, 5, 7);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xc4d5e1, 0.7);
      fill.position.set(4, 1, -3);
      scene.add(fill);
      const models = buildHeroModels();
      scene.add(...models);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
      let visible = true;
      let frame = 0;
      let last = performance.now();
      let lastScroll = window.scrollY;
      const sync = () => {
        physics.states().forEach(({ position, rotation }, i) => {
          models[i].position.set(position.x, position.y, position.z);
          models[i].quaternion.set(
            rotation.x,
            rotation.y,
            rotation.z,
            rotation.w,
          );
        });
      };
      const render = () => {
        sync();
        renderer.render(scene, camera);
      };
      const resize = () => {
        const { width, height } = element.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        const halfHeight = Math.max(1.95, (5.5 * height) / width);
        camera.top = halfHeight;
        camera.bottom = -halfHeight;
        camera.updateProjectionMatrix();
        render();
      };
      const tick = (now: number) => {
        frame = 0;
        if (cancelled || !visible || document.hidden || reduce.matches) return;
        physics.step((now - last) / 1000);
        last = now;
        render();
        frame = requestAnimationFrame(tick);
      };
      const resume = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        last = performance.now();
        render();
        if (visible && !document.hidden && !reduce.matches)
          frame = requestAnimationFrame(tick);
      };
      const scroll = () => {
        const delta = window.scrollY - lastScroll;
        lastScroll = window.scrollY;
        if (visible && !reduce.matches) physics.drive(delta / 90);
      };
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        resume();
      });
      observer.observe(element);
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(element);
      window.addEventListener('scroll', scroll, { passive: true });
      document.addEventListener('visibilitychange', resume);
      reduce.addEventListener('change', resume);
      element.appendChild(renderer.domElement);
      resize();
      resume();
      setState('ready');
      dispose = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        resizeObserver.disconnect();
        window.removeEventListener('scroll', scroll);
        document.removeEventListener('visibilitychange', resume);
        reduce.removeEventListener('change', resume);
        const geometries = new Set<InstanceType<typeof THREE.BufferGeometry>>();
        const materials = new Set<InstanceType<typeof THREE.Material>>();
        scene.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          geometries.add(object.geometry);
          (Array.isArray(object.material)
            ? object.material
            : [object.material]
          ).forEach((mat) => materials.add(mat));
        });
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((mat) => mat.dispose());
        environment.dispose();
        physics.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }
    load().catch((error: unknown) => {
      if (cancelled) return;
      console.error('Hero 3D display failed to initialize:', error);
      setState('error');
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);
  return (
    <div className="flow-hero-objects" data-state={state} aria-hidden="true">
      <div ref={host} className="flow-hero-canvas" />
      {state === 'error' && (
        <p className="flow-hero-model-error">
          The 3D models couldn’t load. Please refresh to try again.
        </p>
      )}
    </div>
  );
}
