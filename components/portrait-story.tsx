'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
        <p className="flow-opening-note">
          Mechanical engineering / experimental robotics
        </p>
        <h1>
          Building machines
          <br />
          to understand
          <br />
          <span>how they behave.</span>
        </h1>
        <p className="flow-hero-aside">
          physics + prototypes +<br />
          questionable amounts of testing
        </p>
        <a className="flow-scroll-cue" href="#intro">
          A little about me <span aria-hidden="true">↓</span>
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
          <figcaption>Mithul / usually asking one more question.</figcaption>
        </figure>
        <figure className="flow-second-portrait">
          <Image
            src="/images/projects/tensegrity-joint-cad.webp"
            alt="Paper-based CAD reconstruction for the tensegrity joint study"
            width={1200}
            height={1200}
            unoptimized
          />
          <figcaption>On the desk / a tensegrity mechanism study.</figcaption>
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
            <strong>NITK Surathkal</strong>, interested in experimental
            robotics, mechatronics, and intelligent physical systems.
          </p>
          <p>
            I like working through a machine’s behaviour: model it, build what I
            can, measure what happens, and figure out where the prediction went
            wrong.
          </p>
          <Link href="/about" className="flow-text-link">
            More about me <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      <div
        className="flow-principles shell"
        aria-label="Build. Measure. Question. Iterate."
      >
        {['Build.', 'Measure.', 'Question.', 'Iterate.'].map((word, index) => (
          <span className="flow-reveal-word" key={word}>
            <small aria-hidden="true">0{index + 1}</small>
            {word}
          </span>
        ))}
        <p>I want to understand machines deeply enough to build better ones.</p>
      </div>
    </section>
  );
}
