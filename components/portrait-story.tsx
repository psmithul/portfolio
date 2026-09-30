'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function PortraitStory() {
  const story = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = story.current;
    if (!element) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const draw = () => {
      frame = 0;
      if (preference.matches) return;
      const bounds = element.getBoundingClientRect();
      const progress = clamp(
        -bounds.top / Math.max(1, bounds.height - window.innerHeight),
      );
      const phase = clamp((progress - 0.32) / 0.42);
      const easedPhase = phase * phase * (3 - 2 * phase);
      element.style.setProperty('--story-progress', progress.toFixed(4));
      element.style.setProperty('--story-phase', easedPhase.toFixed(4));
    };
    const schedule = () => {
      if (!frame && !preference.matches) frame = requestAnimationFrame(draw);
    };
    const configure = () => {
      element.dataset.motion = preference.matches ? 'still' : 'scroll';
      element.style.setProperty('--story-progress', '0');
      element.style.setProperty('--story-phase', '0');
      schedule();
    };

    configure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', configure);
    const size = new ResizeObserver(schedule);
    size.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', configure);
      size.disconnect();
      delete element.dataset.motion;
      element.style.removeProperty('--story-progress');
      element.style.removeProperty('--story-phase');
    };
  }, []);

  return (
    <section className="flow-opening" ref={story} aria-label="Meet Mithul">
      <div className="flow-statement shell">
        <p className="flow-opening-note">
          A mechanical engineer
          <br />
          in the making.
        </p>
        <h1>
          Making things
          <br />
          <span>that move.</span>
        </h1>
      </div>
      <div className="flow-portrait-stage shell">
        <div className="flow-person">
          <Image
            src="/images/mithul-cutout.webp"
            alt="Portrait of Mithul, wearing glasses and a black shirt"
            width={1024}
            height={1536}
            priority
            unoptimized
          />
        </div>
        <figure className="flow-second-portrait">
          <Image
            src="/images/mithul-cafe.webp"
            alt="Mithul at a café, wearing glasses and a black sweater"
            width={1100}
            height={1375}
            unoptimized
          />
        </figure>
      </div>
      <div className="flow-intro shell">
        <h2>Hi, I’m Mithul!</h2>
        <p>
          I’m a final-year mechanical engineering student at{' '}
          <strong>NITK Surathkal</strong>. My work is in{' '}
          <strong>robotics, mechanisms, and control</strong>. Right now, I’m
          designing a rover with adjustable suspension and studying how a
          tensegrity joint changes stiffness.
        </p>
      </div>
    </section>
  );
}
