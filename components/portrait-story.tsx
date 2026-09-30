'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

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
    <section className="portrait-story" ref={story} aria-label="Meet Mithul">
      <div className="portrait-sticky">
        <div className="portrait-layout shell">
          <div className="portrait-copy">
            <p className="eyebrow">MITHUL SOURAV · MECHANICAL ENGINEERING</p>
            <h1>
              A builder.
              <br />
              With a lot
              <br /> of <em>questions.</em>
            </h1>
            <p className="portrait-intro">
              I’m Mithul, a mechanical engineering student at NITK Surathkal. I
              build robots and mechanisms, and ask what makes them work.
            </p>
          </div>
          <div className="portrait-fieldnotes">
            <p className="eyebrow">WHAT I’M THINKING ABOUT</p>
            <h2>
              Questions I’m
              <br />
              <em>working through.</em>
            </h2>
            <p>
              How a rover adjusts to rough ground. How geometry changes a
              joint’s stiffness. How to isolate a flight controller from
              vibration.
            </p>
          </div>
          <div className="portrait-composition">
            <div className="portrait-backplate" aria-hidden="true" />
            <div className="portrait-outline" aria-hidden="true" />
            <div className="portrait-subject">
              <Image
                src="/images/mithul-courtyard.webp"
                alt="Mithul in a courtyard, wearing glasses and a black shirt"
                width={941}
                height={1672}
                priority
                unoptimized
              />
            </div>
            <p className="portrait-signature">
              Mithul <span>/ Mika</span>
            </p>
          </div>
          <div className="portrait-bottom">
            <div className="hero-actions">
              <a className="lab-button" href="#work">
                Explore my work <ArrowDown size={16} aria-hidden="true" />
              </a>
              <Link className="quiet-link" href="/about">
                A little about me <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <p className="hero-coordinate">
              SURATHKAL, INDIA <span>NITK · CLASS OF 2027</span>
            </p>
          </div>
          <div className="portrait-scroll-note" aria-hidden="true">
            <span /> SCROLL TO EXPLORE
          </div>
        </div>
      </div>
    </section>
  );
}
