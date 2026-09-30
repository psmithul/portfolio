'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  kind: 'toolbox' | 'folder';
  count: number;
  itemLabel: string;
  children: ReactNode;
};

export function ArchiveReveal({
  id,
  title,
  eyebrow,
  description,
  image,
  kind,
  count,
  itemLabel,
  children,
}: Props) {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const browse = (direction: number) => {
    const row = viewport.current;
    if (!row) return;
    const cards = Array.from(
      row.querySelectorAll<HTMLElement>('[data-archive-card]'),
    );
    const next = cards[Math.max(0, Math.min(count - 1, active + direction))];
    if (!next) return;
    row.scrollTo({
      left: next.offsetLeft - (cards[0]?.offsetLeft ?? 0),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  };

  useEffect(() => {
    const element = section.current;
    const row = viewport.current;
    if (!element || !row) return;
    const desktop = window.matchMedia('(min-width: 1240px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cards = Array.from(
      row.querySelectorAll<HTMLElement>('[data-archive-card]'),
    );
    let frame = 0;
    let fan = false;
    const draw = () => {
      frame = 0;
      const bounds = element.getBoundingClientRect();
      const focused = element.contains(document.activeElement);
      const progress =
        reduce.matches || focused
          ? 1
          : Math.max(
              0,
              Math.min(
                1,
                fan
                  ? (68 - bounds.top) / 520
                  : (window.innerHeight * 0.86 - bounds.top) /
                      (window.innerHeight * 0.66),
              ),
            );
      element.style.setProperty('--archive-progress', progress.toFixed(4));
      if (!fan) {
        let nearest = 0;
        let distance = Infinity;
        cards.forEach((card, index) => {
          const current = Math.abs(
            card.offsetLeft - (cards[0]?.offsetLeft ?? 0) - row.scrollLeft,
          );
          if (current < distance) {
            distance = current;
            nearest = index;
          }
        });
        setActive(nearest);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const configure = () => {
      fan = desktop.matches && !reduce.matches;
      element.dataset.mode = fan ? 'fan' : 'native';
      if (fan) row.scrollLeft = 0;
      schedule();
    };
    configure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', configure);
    row.addEventListener('scroll', schedule, { passive: true });
    element.addEventListener('focusin', schedule);
    element.addEventListener('focusout', schedule);
    desktop.addEventListener('change', configure);
    reduce.addEventListener('change', configure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', configure);
      row.removeEventListener('scroll', schedule);
      element.removeEventListener('focusin', schedule);
      element.removeEventListener('focusout', schedule);
      desktop.removeEventListener('change', configure);
      reduce.removeEventListener('change', configure);
      element.style.removeProperty('--archive-progress');
      delete element.dataset.mode;
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
        <div className="archive-navigation shell">
          <div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => browse(-1)}
              disabled={active === 0}
              aria-label={`Previous ${itemLabel}`}
            >
              <ArrowLeft aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => browse(1)}
              disabled={active === count - 1}
              aria-label={`Next ${itemLabel}`}
            >
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
          <p>
            {String(active + 1).padStart(2, '0')} /{' '}
            {String(count).padStart(2, '0')}
            <span>Swipe to browse</span>
          </p>
        </div>
        <div
          className="archive-cards"
          ref={viewport}
          role="group"
          aria-label={`${title} cards`}
          tabIndex={0}
        >
          {children}
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
      </div>
    </section>
  );
}
