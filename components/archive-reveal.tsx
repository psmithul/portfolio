'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Image from 'next/image';

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
    const wide = window.matchMedia('(min-width: 1580px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let fan = false;
    let observer: IntersectionObserver | undefined;

    const draw = () => {
      frame = 0;
      if (fan) {
        const focused = element.contains(document.activeElement);
        element.dataset.open = String(
          focused || element.getBoundingClientRect().top <= 108,
        );
        element.dataset.focused = String(focused);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const configure = () => {
      observer?.disconnect();
      fan = wide.matches && window.innerHeight >= 960 && !reduce.matches;
      element.dataset.layout = fan ? 'fan' : 'stack';
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
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', configure);
    element.addEventListener('focusin', focus);
    element.addEventListener('focusout', schedule);
    wide.addEventListener('change', configure);
    reduce.addEventListener('change', configure);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', configure);
      element.removeEventListener('focusin', focus);
      element.removeEventListener('focusout', schedule);
      wide.removeEventListener('change', configure);
      reduce.removeEventListener('change', configure);
      ['layout', 'enhanced', 'open', 'focused'].forEach(
        (key) => delete element.dataset[key],
      );
      cards.forEach((card) => delete card.dataset.revealed);
    };
  }, []);

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
