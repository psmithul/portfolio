'use client';
import { useEffect } from 'react';
export function MotionDirector() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    const elements = document.querySelectorAll<HTMLElement>(
      '.lab-project-card, .lab-archive-heading, .lab-about, .lab-journal, .lab-contact',
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
    const artworks = Array.from(
      document.querySelectorAll<HTMLElement>('.project-art'),
    );
    let frame = 0;
    const draw = () => {
      frame = 0;
      for (const artwork of artworks) {
        const bounds = artwork.parentElement?.getBoundingClientRect();
        if (!bounds) continue;
        if (bounds.bottom < -100 || bounds.top > window.innerHeight + 100)
          continue;
        const progress = Math.max(
          -1,
          Math.min(
            1,
            (bounds.top + bounds.height / 2 - window.innerHeight / 2) /
              window.innerHeight,
          ),
        );
        artwork.style.setProperty(
          '--art-progress',
          preference.matches ? '0' : progress.toFixed(4),
        );
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const reset = () => {
      if (preference.matches) {
        elements.forEach((element) => element.classList.add('has-arrived'));
        artworks.forEach((element) =>
          element.style.setProperty('--art-progress', '0'),
        );
      } else schedule();
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', reset);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', reset);
      artworks.forEach((element) =>
        element.style.removeProperty('--art-progress'),
      );
      observer.disconnect();
      elements.forEach((element) =>
        element.classList.remove('will-arrive', 'has-arrived'),
      );
    };
  }, []);
  return null;
}
