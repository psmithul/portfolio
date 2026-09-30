'use client';
import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
export function PortfolioCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = cursor.current;
    if (!element) return;
    const desktop = window.matchMedia(
      '(min-width: 980px) and (hover: hover) and (pointer: fine)',
    );
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0,
      x = -100,
      y = -100,
      visible = false;
    const enabled = () => desktop.matches && !reduce.matches;
    const draw = () => {
      frame = 0;
      const target = document.elementFromPoint(x, y);
      element.dataset.kind = target?.closest('[data-cursor="project"]')
        ? 'project'
        : target?.closest('a, button')
          ? 'link'
          : 'dot';
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      element.dataset.visible = String(
        visible && enabled() && Boolean(target?.closest('.flow-home')),
      );
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const hide = () => {
      visible = false;
      document.documentElement.removeAttribute('data-portfolio-cursor');
      draw();
    };
    const move = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (
        !enabled() ||
        !target?.closest('.flow-home') ||
        target.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        hide();
        return;
      }
      x = event.clientX;
      y = event.clientY;
      visible = true;
      document.documentElement.dataset.portfolioCursor = 'active';
      const project = target.closest('[data-cursor="project"]');
      element.dataset.kind = project
        ? 'project'
        : target.closest('a, button')
          ? 'link'
          : 'dot';
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Tab') hide();
    };
    document.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('pointerleave', hide);
    document.addEventListener('keydown', keyboard);
    window.addEventListener('blur', hide);
    desktop.addEventListener('change', hide);
    reduce.addEventListener('change', hide);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', scroll);
      document.removeEventListener('pointerleave', hide);
      document.removeEventListener('keydown', keyboard);
      window.removeEventListener('blur', hide);
      desktop.removeEventListener('change', hide);
      reduce.removeEventListener('change', hide);
      hide();
    };
  }, []);
  return (
    <div ref={cursor} className="portfolio-cursor" aria-hidden="true">
      <span>
        View <ArrowUpRight className="link-arrow" />
      </span>
    </div>
  );
}
