'use client';
import { useEffect } from 'react';
import { DESKTOP_MOTION_QUERY } from '@/lib/portfolio-motion';
export function MotionDirector() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia(DESKTOP_MOTION_QUERY);
    const header = document.querySelector<HTMLElement>('.site-header');
    const reveals = document.querySelectorAll<HTMLElement>(
      '.flow-section-heading, .flow-intro',
    );
    const covers = document.querySelectorAll<HTMLElement>('.flow-project-card');
    let frame = 0;
    let observer: IntersectionObserver | undefined;
    const draw = () => {
      frame = 0;
      if (header) header.dataset.compact = String(window.scrollY > 64);
      covers.forEach((cover) => {
        if (preference.matches) {
          cover.style.removeProperty('--cover-progress');
          return;
        }
        const bounds =
          cover.querySelector('.flow-project-image')?.getBoundingClientRect() ??
          cover.getBoundingClientRect();
        const progress = Math.max(
          0,
          Math.min(
            1,
            (window.innerHeight - bounds.top) / (window.innerHeight * 0.95),
          ),
        );
        cover.style.setProperty('--cover-progress', progress.toFixed(4));
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const configure = () => {
      document.documentElement.dataset.motionProfile = preference.matches
        ? 'reduced'
        : desktop.matches
          ? 'desktop'
          : 'touch';
      observer?.disconnect();
      reveals.forEach((element) =>
        element.classList.remove('will-arrive', 'has-arrived'),
      );
      if (!preference.matches) {
        observer = new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('has-arrived');
                observer?.unobserve(entry.target);
              }
            }),
          { threshold: 0.15 },
        );
        reveals.forEach((element) => {
          element.classList.add('will-arrive');
          observer?.observe(element);
        });
      }
      schedule();
    };
    configure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', configure);
    desktop.addEventListener('change', configure);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', configure);
      desktop.removeEventListener('change', configure);
      delete document.documentElement.dataset.motionProfile;
      reveals.forEach((element) =>
        element.classList.remove('will-arrive', 'has-arrived'),
      );
      covers.forEach((element) =>
        element.style.removeProperty('--cover-progress'),
      );
      if (header) delete header.dataset.compact;
    };
  }, []);
  return null;
}
