'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { HeroModels } from '@/components/hero-models';
export function PortraitStory() {
  const story = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = story.current;
    if (!element) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const draw = () => {
      frame = 0;
      const bounds = element.getBoundingClientRect();
      const offset = preference.matches
        ? 0
        : Math.max(0, Math.min(900, -bounds.top));
      element.style.setProperty('--portrait-drift', `${offset * 0.07}px`);
      element.style.setProperty('--note-drift', `${offset * -0.045}px`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', schedule);
      ['--portrait-drift', '--note-drift'].forEach((property) =>
        element.style.removeProperty(property),
      );
    };
  }, []);
  return (
    <section className="flow-opening" ref={story} aria-label="Meet Mithul">
      <div className="flow-statement shell">
        <p className="flow-opening-note">Mithul Sourav · NITK Surathkal</p>
        <h1>
          <span>Hi, I’m Mithul.</span>
          <span>I like understanding things deeply</span>
          <span>and building with what I learn.</span>
        </h1>
        <div className="flow-hero-details">
          <div>
            <p className="flow-hero-aside">
              I’m a final-year mechanical engineering student at NITK Surathkal.
              I like learning new technologies and using them to build things.
              I’m especially interested in robotics, control systems, and space.
            </p>
            <a className="flow-scroll-cue" href="#intro">
              About me <ArrowDown className="link-arrow" aria-hidden="true" />
            </a>
          </div>
          <HeroModels />
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
        <aside className="flow-quote-note" aria-label="A favourite quote">
          <p className="eyebrow">A favourite quote</p>
          <blockquote>
            {
              "Satisfaction of one's curiosity is one of the greatest sources of happiness in life"
            }
          </blockquote>
        </aside>
      </div>
      <div id="intro" className="flow-intro shell">
        <h2>
          A little
          <br /> about me.
        </h2>
        <div>
          <p>
            I like understanding how something works, then trying to make it
            work myself. That’s what draws me to hard problems: there’s always
            something I haven’t figured out yet.
          </p>
          <p>
            Right now, I’m designing robots for uncertain terrain: a rover with
            adjustable suspension and a robot for collecting leaves on uneven
            ground. I’m also studying a tensegrity joint and how its stiffness
            can be changed.
          </p>
          <p>
            These projects bring together mechanical design, electronics, and
            software. I like going deep: where an idea came from, why it works,
            and how people figured it out in the first place. Building gives me
            a way to test what I’ve understood. I also spend a lot of time
            reading about space and how we explore it.
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
