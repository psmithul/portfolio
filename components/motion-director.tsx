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
    const reset = () => {
      if (preference.matches) {
        elements.forEach((element) => element.classList.add('has-arrived'));
        observer.disconnect();
      }
    };
    preference.addEventListener('change', reset);
    return () => {
      preference.removeEventListener('change', reset);
      observer.disconnect();
      elements.forEach((element) =>
        element.classList.remove('will-arrive', 'has-arrived'),
      );
    };
  }, []);
  return null;
}
