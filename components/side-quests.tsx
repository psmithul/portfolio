'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/content/projects';
export function SideQuests({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = section.current,
      windowElement = viewport.current,
      rail = track.current;
    if (!element || !windowElement || !rail) return;
    const desktop = window.matchMedia(
      '(min-width: 980px) and (hover: hover) and (pointer: fine)',
    );
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cards = Array.from(rail.querySelectorAll<HTMLElement>('.quest-card'));
    const cardOffset = (card: HTMLElement) =>
      card.offsetLeft - (cards[0]?.offsetLeft ?? 0);
    let frame = 0,
      travel = 0,
      pinned = false;
    const draw = () => {
      frame = 0;
      const offset = pinned
        ? Math.max(0, Math.min(travel, -element.getBoundingClientRect().top))
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
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const configure = () => {
      pinned = desktop.matches && !reduce.matches;
      rail.style.removeProperty('transform');
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
      const card = event.target.closest<HTMLElement>('.quest-card');
      if (!card) return;
      windowElement.scrollLeft = 0;
      const start = window.scrollY + element.getBoundingClientRect().top;
      window.scrollTo({
        top: start + Math.min(travel, cardOffset(card)),
        behavior: 'instant',
      });
    };
    configure();
    const size = new ResizeObserver(configure);
    size.observe(windowElement);
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
      delete element.dataset.mode;
    };
  }, []);
  return (
    <section
      ref={section}
      className="flow-side-quests"
      aria-labelledby="quest-heading"
    >
      <div className="quest-sticky">
        <div className="flow-section-heading shell">
          <div>
            <p className="eyebrow">02 — The smaller builds</p>
            <h2 id="quest-heading">Side quests</h2>
          </div>
          <p>
            Small mechanisms, prototypes, and experiments that started with
            “what if?”
          </p>
        </div>
        <div
          ref={viewport}
          className="quest-viewport"
          aria-label="Side projects. Swipe horizontally on touch screens, or continue down the page on desktop."
        >
          <div ref={track} className="quest-track">
            {projects.map((project, index) => (
              <Link
                href={`/work/${project.slug}`}
                className={`quest-card quest-card-${index % 3}`}
                data-cursor="project"
                key={project.slug}
              >
                <figure className="quest-image">
                  {project.image && (
                    <Image
                      src={project.image.src}
                      alt={project.image.alt}
                      width={project.image.width}
                      height={project.image.height}
                      unoptimized
                    />
                  )}
                </figure>
                <div className="quest-copy">
                  <span className="flow-project-date">
                    {project.period.match(/\d{4}/)?.[0]}
                  </span>
                  <div>
                    <h3>
                      {project.slug === 'four-bar-door-mechanism'
                        ? 'Four-bar door linkage'
                        : project.slug === 'easy-access-wallet'
                          ? 'Accessible wallet mechanism'
                          : project.title}
                    </h3>
                    <div className="flow-tags">
                      <span>{project.discipline}</span>
                      <span>{project.tools[0]}</span>
                    </div>
                    <p>{project.summary}</p>
                  </div>
                  <span className="quest-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="quest-progress shell">
          <span ref={count}>01</span>
          <div>
            <i />
          </div>
          <span>{String(projects.length).padStart(2, '0')}</span>
          <p className="quest-hint">
            Keep scrolling <span aria-hidden="true">↓</span>
          </p>
        </div>
      </div>
    </section>
  );
}
