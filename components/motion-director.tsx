'use client';
import { useEffect } from 'react';
export function MotionDirector() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
    return () => {
      observer.disconnect();
      elements.forEach((element) =>
        element.classList.remove('will-arrive', 'has-arrived'),
      );
    };
  }, []);
  return null;
}
