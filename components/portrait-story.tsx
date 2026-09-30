'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
const objects = [
  'precision-ball-bearing',
  'steel-compression-spring',
  'rover-wheel',
  'compact-universal-joint',
];
export function PortraitStory() {
  const story = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = story.current;
    if (!element) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0,
      x = 0,
      y = 0;
    const draw = () => {
      frame = 0;
      const bounds = element.getBoundingClientRect();
      const offset = preference.matches
        ? 0
        : Math.max(0, Math.min(900, -bounds.top));
      element.style.setProperty('--portrait-drift', `${offset * 0.07}px`);
      element.style.setProperty('--study-drift', `${offset * -0.045}px`);
      element.style.setProperty(
        '--object-x',
        `${preference.matches ? 0 : x}px`,
      );
      element.style.setProperty(
        '--object-y',
        `${preference.matches ? 0 : y}px`,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      if (!pointer.matches || preference.matches) return;
      x = (event.clientX / window.innerWidth - 0.5) * 12;
      y = (event.clientY / window.innerHeight - 0.5) * 12;
      schedule();
    };
    const reset = () => {
      x = 0;
      y = 0;
      schedule();
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', reset);
    preference.addEventListener('change', reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', reset);
      preference.removeEventListener('change', reset);
      ['--portrait-drift', '--study-drift', '--object-x', '--object-y'].forEach(
        (property) => element.style.removeProperty(property),
      );
    };
  }, []);
  return (
    <section className="flow-opening" ref={story} aria-label="Meet Mithul">
      <div className="flow-statement shell">
        <p className="flow-opening-note">Mithul Sourav · NITK Surathkal</p>
        <h1>
          <span>Mechanical</span>
          <span>engineering</span>
          <span>& robotics.</span>
        </h1>
        <p className="flow-hero-aside">
          Final-year student working on mechanisms, vibration, and mobile
          robots.
        </p>
        <a className="flow-scroll-cue" href="#intro">
          About me <ArrowDown className="link-arrow" aria-hidden="true" />
        </a>
        <div className="flow-mechanical-objects" aria-hidden="true">
          {objects.map((name, index) => (
            <div className={`flow-object flow-object-${index + 1}`} key={name}>
              <Image
                src={`/images/mechanical/${name}.webp`}
                alt=""
                width={720}
                height={720}
                priority
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flow-portrait-stage shell">
        <figure className="flow-person">
          <Image
            src="/images/mithul-cutout.webp"
            alt="Mithul, wearing glasses and a black shirt, looking to his right"
            width={1024}
            height={1536}
            priority
            unoptimized
          />
          <figcaption>P S Mithul Sourav</figcaption>
        </figure>
        <figure className="flow-second-portrait">
          <Image
            src="/images/projects/tensegrity-joint-cad.webp"
            alt="Paper-based CAD reconstruction for the tensegrity joint study"
            width={1200}
            height={1200}
            unoptimized
          />
          <figcaption>Tensegrity joint · CAD reconstruction study</figcaption>
        </figure>
      </div>
      <div id="intro" className="flow-intro shell">
        <h2>
          Hi, I’m
          <br /> Mithul.
        </h2>
        <div>
          <p>
            I’m a final-year mechanical engineering student at{' '}
            <strong>NITK Surathkal</strong>. I’m interested in experimental and
            field robotics, especially how mobile robots move over rough
            terrain.
          </p>
          <p>
            My current work covers variable-stiffness mechanisms,
            vibration-aware suspension, and a leaf-collection robot. I use CAD,
            MATLAB, and finite element analysis to develop the designs and plan
            their tests.
          </p>
          <Link href="/about" className="flow-text-link">
            Background & experience{' '}
            <ArrowUpRight className="link-arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
