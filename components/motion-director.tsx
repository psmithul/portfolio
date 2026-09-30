'use client';
import { useEffect } from 'react';
export function MotionDirector() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    const elements = document.querySelectorAll<HTMLElement>(
      '.flow-project-card, .flow-section, .flow-intro',
    );
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('has-arrived');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    elements.forEach((element) => {
      element.classList.add('will-arrive');
      observer.observe(element);
    });
    const board = document.querySelector<HTMLElement>('.flow-experience-board');
    let frame = 0;
    const draw = () => {
      frame = 0;
      if (!board || preference.matches) return;
      const bounds = board.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(
          1,
          (window.innerHeight - bounds.top) / (window.innerHeight * 0.8),
        ),
      );
      board.style.setProperty('--fan-open', progress.toFixed(4));
    };
    const schedule = () => {
      if (!frame && !preference.matches) frame = requestAnimationFrame(draw);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    const reset = () => {
      if (preference.matches) {
        elements.forEach((element) => element.classList.add('has-arrived'));
        observer.disconnect();
        board?.style.removeProperty('--fan-open');
      }
    };
    preference.addEventListener('change', reset);
    return () => {
      preference.removeEventListener('change', reset);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
      board?.style.removeProperty('--fan-open');
      observer.disconnect();
      elements.forEach((element) =>
        element.classList.remove('will-arrive', 'has-arrived'),
      );
    };
  }, []);
  return null;
}
