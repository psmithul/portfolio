'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { DESKTOP_MOTION_QUERY } from '@/lib/portfolio-motion';

type Props = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  itemLabel: string;
  count: number;
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
};
export function ScrollRail({
  id,
  title,
  eyebrow,
  description,
  itemLabel,
  count: total,
  children,
  aside,
  className = '',
}: Props) {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const browse = (direction: number) => {
    const element = section.current;
    const windowElement = viewport.current;
    const rail = track.current;
    if (!element || !windowElement || !rail) return;
    const cards = Array.from(
      rail.querySelectorAll<HTMLElement>('[data-rail-card]'),
    );
    const active = cards.findIndex((card) => card.dataset.active === 'true');
    const next =
      cards[Math.max(0, Math.min(cards.length - 1, active + direction))];
    if (!next) return;
    const offset = next.offsetLeft - (cards[0]?.offsetLeft ?? 0);
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches
      ? 'instant'
      : 'smooth';
    if (element.dataset.mode === 'pinned') {
      window.scrollTo({
        top:
          window.scrollY +
          element.getBoundingClientRect().top +
          Number(element.dataset.scrollLead ?? 0) +
          offset,
        behavior,
      });
    } else {
      windowElement.scrollTo({ left: offset, behavior });
    }
  };
  useEffect(() => {
    const element = section.current,
      windowElement = viewport.current,
      rail = track.current;
    if (!element || !windowElement || !rail) return;
    const desktop = window.matchMedia(DESKTOP_MOTION_QUERY);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cards = Array.from(
      rail.querySelectorAll<HTMLElement>('[data-rail-card]'),
    );
    const cardOffset = (card: HTMLElement) =>
      card.offsetLeft - (cards[0]?.offsetLeft ?? 0);
    let frame = 0,
      travel = 0,
      lead = 0,
      pinned = false;
    const draw = () => {
      frame = 0;
      const offset = pinned
        ? Math.max(
            0,
            Math.min(travel, -element.getBoundingClientRect().top - lead),
          )
        : windowElement.scrollLeft;
      const progress = travel > 0 ? offset / travel : 0;
      if (pinned) rail.style.transform = `translate3d(${-offset}px, 0, 0)`;
      element.style.setProperty('--quest-progress', progress.toFixed(4));
      let active = 0,
        nearest = Infinity;
      cards.forEach((card, index) => {
        const distance = Math.abs(
          card.offsetLeft +
            card.offsetWidth / 2 -
            offset -
            windowElement.clientWidth / 2,
        );
        if (distance < nearest) {
          nearest = distance;
          active = index;
        }
      });
      cards.forEach((card, index) => {
        card.dataset.active = String(index === active);
      });
      if (count.current)
        count.current.textContent = String(active + 1).padStart(2, '0');
      const buttons = element.querySelectorAll<HTMLButtonElement>(
        '.quest-navigation button',
      );
      if (buttons[0]) buttons[0].disabled = active === 0;
      if (buttons[1]) buttons[1].disabled = active === cards.length - 1;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const configure = () => {
      pinned = desktop.matches && !reduce.matches;
      rail.style.removeProperty('transform');
      element.dataset.mode = pinned ? 'pinned' : 'native';
      element.style.setProperty(
        '--quest-stage-height',
        `${window.innerHeight}px`,
      );
      // A short laptop scrolls into the full card before horizontal travel starts.
      // It keeps the same scroll interaction instead of switching to phone swipe.
      lead = pinned
        ? Math.max(0, rail.scrollHeight - windowElement.clientHeight)
        : 0;
      element.style.setProperty(
        '--quest-stage-height',
        `${window.innerHeight + lead}px`,
      );
      element.dataset.scrollLead = String(lead);
      // The final card reaches the same inset as the first before the page releases.
      const last = cards.at(-1);
      travel =
        pinned && last
          ? cardOffset(last)
          : Math.max(0, rail.scrollWidth - windowElement.clientWidth);
      element.dataset.mode = pinned ? 'pinned' : 'native';
      element.style.setProperty('--quest-travel', `${travel}px`);
      if (pinned) windowElement.scrollLeft = 0;
      schedule();
    };
    const focus = (event: FocusEvent) => {
      if (!pinned || !(event.target instanceof Element)) return;
      const card = event.target.closest<HTMLElement>('[data-rail-card]');
      if (!card) return;
      windowElement.scrollLeft = 0;
      const start = window.scrollY + element.getBoundingClientRect().top;
      window.scrollTo({
        top: start + lead + Math.min(travel, cardOffset(card)),
        behavior: 'instant',
      });
    };
    configure();
    const size = new ResizeObserver(configure);
    size.observe(windowElement);
    cards.forEach((card) => {
      const copy = card.querySelector('.quest-copy');
      if (copy) size.observe(copy);
    });
    window.addEventListener('scroll', schedule, { passive: true });
    windowElement.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', configure);
    rail.addEventListener('focusin', focus);
    desktop.addEventListener('change', configure);
    reduce.addEventListener('change', configure);
    return () => {
      cancelAnimationFrame(frame);
      size.disconnect();
      window.removeEventListener('scroll', schedule);
      windowElement.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', configure);
      rail.removeEventListener('focusin', focus);
      desktop.removeEventListener('change', configure);
      reduce.removeEventListener('change', configure);
      rail.style.removeProperty('transform');
      element.style.removeProperty('--quest-travel');
      element.style.removeProperty('--quest-progress');
      element.style.removeProperty('--quest-stage-height');
      delete element.dataset.scrollLead;
      delete element.dataset.mode;
    };
  }, []);
  return (
    <section
      ref={section}
      id={id}
      className={`flow-side-quests ${className}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="quest-sticky">
        <div className="flow-section-heading shell">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id={`${id}-heading`}>{title}</h2>
          </div>
          <div className={`rail-introduction ${aside ? 'has-aside' : ''}`}>
            <p>{description}</p>
            {aside}
          </div>
        </div>
        <div className="quest-navigation shell">
          <button
            type="button"
            onClick={() => browse(-1)}
            aria-label={`Previous ${itemLabel}`}
          >
            <ArrowLeft className="link-arrow" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => browse(1)}
            aria-label={`Next ${itemLabel}`}
          >
            <ArrowRight className="link-arrow" aria-hidden="true" />
          </button>
        </div>
        <section
          ref={viewport}
          className="quest-viewport"
          aria-label={`${title}. Swipe or use the previous and next buttons to browse.`}
        >
          <div ref={track} className="quest-track">
            {children}
          </div>
        </section>
        <div className="quest-progress shell">
          <span ref={count}>01</span>
          <div>
            <i />
          </div>
          <span>{String(total).padStart(2, '0')}</span>
          <p className="quest-hint">
            <span className="quest-hint-desktop">
              Scroll to browse{' '}
              <ArrowDown className="link-arrow" aria-hidden="true" />
            </span>
            <span className="quest-hint-mobile">
              Swipe to browse{' '}
              <ArrowRight className="link-arrow" aria-hidden="true" />
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
