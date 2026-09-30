import RAPIER from '@dimforge/rapier3d-compat';

let initialization: Promise<void> | undefined;
export const HERO_ANCHORS = [-3.5, 0, 3.5] as const;
const SHAPES = [
  { half: [1.4, 0.8, 0.65], mass: 4 },
  { half: [1.4, 0.9, 0.8], mass: 8 },
  { half: [0.48, 1.65, 0.48], mass: 3 },
] as const;

export async function createHeroPhysics() {
  initialization ??= RAPIER.init();
  await initialization;
  // A gently suspended display, not an orbital or vehicle simulation.
  // Translational and torsional springs restore each rigid body to its slot.
  const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
  world.timestep = 1 / 120;
  const bodies = SHAPES.map(({ half, mass }, i) => {
    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(HERO_ANCHORS[i], i === 1 ? -0.12 : 0.08, 0)
        .setCanSleep(false),
    );
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(half[0], half[1], half[2]).setMass(mass),
      body,
    );
    body.setLinvel({ x: 0, y: i === 1 ? -0.08 : 0.08, z: 0 }, true);
    body.setAngvel({ x: 0.025, y: (i - 1) * 0.07, z: 0.025 }, true);
    return body;
  });
  let accumulator = 0;
  let drive = 0;

  return {
    drive(value: number) {
      drive = Math.max(-1, Math.min(1, value));
    },
    step(seconds: number) {
      accumulator += Math.max(0, Math.min(seconds, 0.1));
      while (accumulator >= world.timestep) {
        for (let i = 0; i < bodies.length; i++) {
          const body = bodies[i];
          const p = body.translation();
          const v = body.linvel();
          const q = body.rotation();
          const w = body.angvel();
          const mass = body.mass();
          const anchorY = i === 1 ? -0.12 : 0.08;
          body.resetForces(false);
          body.resetTorques(false);
          body.addForce(
            {
              x: mass * (-9 * (p.x - HERO_ANCHORS[i]) - 4 * v.x),
              y:
                mass *
                (-9 * (p.y - anchorY) -
                  4 * v.y +
                  drive * (i === 1 ? -0.8 : 0.8)),
              z: mass * (-9 * p.z - 4 * v.z),
            },
            true,
          );
          // Quaternion shortest-arc torsional spring; no angle interpolation.
          const sign = q.w < 0 ? -1 : 1;
          body.addTorque(
            {
              x: mass * (-1.8 * q.x * sign - 0.75 * w.x),
              y:
                mass *
                (-1.8 * q.y * sign - 0.75 * w.y + drive * (i - 1) * 0.05),
              z: mass * (-1.8 * q.z * sign - 0.75 * w.z + drive * 0.08),
            },
            true,
          );
        }
        world.step();
        drive *= Math.exp(-6 * world.timestep);
        accumulator -= world.timestep;
      }
    },
    states() {
      return bodies.map((body) => ({
        position: body.translation(),
        rotation: body.rotation(),
        velocity: body.linvel(),
      }));
    },
    dispose() {
      world.free();
    },
  };
}
