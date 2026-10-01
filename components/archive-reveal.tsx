'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Image from 'next/image';
import {
  archiveFanPositions,
  DESKTOP_MOTION_QUERY,
} from '@/lib/portfolio-motion';

type Props = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  kind: 'toolbox' | 'folder';
  children: ReactNode;
};

export function ArchiveReveal({
  id,
  title,
  eyebrow,
  description,
  image,
  kind,
  children,
}: Props) {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const cards = Array.from(
      element.querySelectorAll<HTMLElement>('[data-archive-card]'),
    );
    const desktop = window.matchMedia(DESKTOP_MOTION_QUERY);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let fan = false;
    let disposed = false;
    let observer: IntersectionObserver | undefined;

    const draw = () => {
      frame = 0;
      if (fan) {
        const focused = element.contains(document.activeElement);
        element.dataset.open = String(
          focused ||
            element.getBoundingClientRect().top <= window.innerHeight * 0.62,
        );
        element.dataset.focused = String(focused);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const configure = () => {
      observer?.disconnect();
      fan = desktop.matches && !reduce.matches;
      element.dataset.layout = fan ? 'fan' : 'stack';
      element.style.removeProperty('--archive-card-height');
      if (fan) {
        const width = Math.max(220, element.clientWidth - 88);
        const cardWidth =
          kind === 'toolbox'
            ? Math.min(284, Math.max(210, (width - 128) / 5))
            : Math.min(350, Math.max(210, (width - 32) / 2));
        element.style.setProperty('--archive-card-width', `${cardWidth}px`);
        const height = Math.max(...cards.map((card) => card.offsetHeight));
        element.style.setProperty('--archive-card-height', `${height}px`);
        // Leave room for rotation at the outer edges of the arc.
        const positions = archiveFanPositions(
          width,
          cardWidth,
          height,
          cards.length,
        );
        cards.forEach((card, index) => {
          card.style.setProperty('--fan-x', `${positions[index].x}px`);
          card.style.setProperty('--fan-y', `${positions[index].y}px`);
        });
        const containerSize = kind === 'toolbox' ? 200 : 220;
        const singleRow = Math.max(...positions.map(({ y }) => y)) < height;
        const containerTop =
          158 +
          height +
          (kind === 'toolbox' && (singleRow || width >= cardWidth * 3 + 64)
            ? 44
            : Math.max(...positions.map(({ y }) => y)) + 44);
        const stageHeight = Math.max(
          158 + height + Math.max(...positions.map(({ y }) => y)) + 32,
          containerTop + containerSize + 28,
        );
        element.style.setProperty(
          '--archive-container-size',
          `${containerSize}px`,
        );
        element.style.setProperty(
          '--archive-container-top',
          `${containerTop}px`,
        );
        element.style.setProperty('--archive-stage-height', `${stageHeight}px`);
      } else {
        [
          '--archive-card-width',
          '--archive-container-size',
          '--archive-container-top',
          '--archive-stage-height',
        ].forEach((property) => element.style.removeProperty(property));
      }
      element.dataset.enhanced = String(!reduce.matches);
      element.dataset.focused = 'false';
      cards.forEach((card) => delete card.dataset.revealed);
      if (!fan && !reduce.matches) {
        observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const card = entry.target as HTMLElement;
              if (
                entry.isIntersecting ||
                card.contains(document.activeElement)
              ) {
                card.dataset.revealed = 'true';
              } else if (entry.boundingClientRect.top >= window.innerHeight) {
                card.dataset.revealed = 'false';
              }
            }
          },
          { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
        );
        cards.forEach((card) => {
          card.dataset.revealed =
            card.getBoundingClientRect().top < window.innerHeight * 0.9
              ? 'true'
              : 'false';
          observer?.observe(card);
        });
      }
      schedule();
    };
    const focus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      const card = target.closest<HTMLElement>('[data-archive-card]');
      if (card) card.dataset.revealed = 'true';
      schedule();
    };

    configure();
    void document.fonts.ready.then(() => {
      if (!disposed) configure();
    });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', configure);
    element.addEventListener('focusin', focus);
    element.addEventListener('focusout', schedule);
    desktop.addEventListener('change', configure);
    reduce.addEventListener('change', configure);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', configure);
      element.removeEventListener('focusin', focus);
      element.removeEventListener('focusout', schedule);
      desktop.removeEventListener('change', configure);
      reduce.removeEventListener('change', configure);
      ['layout', 'enhanced', 'open', 'focused'].forEach(
        (key) => delete element.dataset[key],
      );
      [
        '--archive-card-width',
        '--archive-card-height',
        '--archive-container-size',
        '--archive-container-top',
        '--archive-stage-height',
      ].forEach((property) => element.style.removeProperty(property));
      cards.forEach((card) => {
        delete card.dataset.revealed;
        card.style.removeProperty('--fan-x');
        card.style.removeProperty('--fan-y');
      });
    };
  }, [kind]);

  return (
    <section
      id={id}
      ref={section}
      className={`archive-reveal archive-${kind}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="archive-stage">
        <div className="archive-heading shell">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-heading`}>{title}</h2>
          <p className="archive-description">{description}</p>
        </div>
        <div className="archive-container" aria-hidden="true">
          <Image src={image} alt="" width={800} height={800} unoptimized />
          <Image
            className="archive-container-front"
            src={image}
            alt=""
            width={800}
            height={800}
            unoptimized
          />
        </div>
        <section className="archive-cards" aria-label={`${title} cards`}>
          {children}
        </section>
      </div>
    </section>
  );
}
