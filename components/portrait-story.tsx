'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { HeroModels } from '@/components/hero-models';
import { DESKTOP_MOTION_QUERY } from '@/lib/portfolio-motion';
export function PortraitStory({
  staticLayout = false,
  introId = 'intro',
}: {
  staticLayout?: boolean;
  introId?: string;
}) {
  const story = useRef<HTMLElement>(null);
  useEffect(() => {
    if (staticLayout) return;
    const element = story.current;
    if (!element) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia(DESKTOP_MOTION_QUERY);
    let frame = 0;
    const draw = () => {
      frame = 0;
      const bounds = element.getBoundingClientRect();
      const offset = preference.matches
        ? 0
        : Math.max(0, Math.min(900, -bounds.top));
      element.style.setProperty(
        '--portrait-drift',
        `${offset * (desktop.matches ? 0.07 : 0.025)}px`,
      );
      element.style.setProperty(
        '--note-drift',
        `${offset * (desktop.matches ? -0.045 : -0.015)}px`,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    desktop.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', schedule);
      desktop.removeEventListener('change', schedule);
      ['--portrait-drift', '--note-drift'].forEach((property) =>
        element.style.removeProperty(property),
      );
    };
  }, [staticLayout]);
  return (
    <section className="flow-opening" ref={story} aria-label="Meet Mithul">
      <div className="flow-statement shell">
        <h1>
          <span>Hi, I’m Mithul.</span>
          <span>Building and learning along the way, </span>
          <span>driven by an endless curiosity.</span>
        </h1>
        <div className="flow-hero-details">
          <div>
            <p className="flow-hero-aside">
              I’m a final-year mechanical engineering student at NITK Surathkal.
              I like learning new technologies and using them to build things.
              I’m especially interested in robotics, control systems, and space.
            </p>
            <a className="flow-scroll-cue" href={`#${introId}`}>
              About me <ArrowDown className="link-arrow" aria-hidden="true" />
            </a>
          </div>
          {!staticLayout && <HeroModels />}
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
      <div id={introId} className="flow-intro shell">
        <h2>
          A little
          <br /> about me.
        </h2>
        <div>
          <p>
            I’m a final-year mechanical engineering student at NITK Surathkal. I
            like learning new things and using what I learn to build something.
            When an idea interests me, I want to understand how it works and how
            people came up with it.
          </p>
          <p>
            Right now, I’m working on a rover and a robot for collecting leaves,
            both meant to move over rough ground. I’m also exploring ways to
            make a mechanical joint more or less flexible.
          </p>
          <p>
            I like working on hard problems, even when I don’t know where to
            start. Building things helps me see what I’ve understood and what I
            still need to learn. I also love space and spend a lot of time
            reading about how we explore it.
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
