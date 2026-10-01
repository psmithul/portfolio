'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Minus, Plus } from 'lucide-react';

export function JournalReader({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const prose = root.current?.querySelector('.article-prose');
      if (!prose) return;
      const bounds = prose.getBoundingClientRect();
      const start = window.innerHeight * 0.35;
      const distance = Math.max(1, bounds.height - window.innerHeight * 0.5);
      setProgress(
        Math.round(
          Math.max(0, Math.min(1, (start - bounds.top) / distance)) * 100,
        ),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    if (root.current) observer.observe(root.current);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
  return (
    <div
      ref={root}
      className="journal-reader"
      style={{ '--reader-adjust': `${size * 2}px` } as CSSProperties}
    >
      <div className="journal-reader-tools">
        <div className="journal-reading-progress">
          <progress
            className="journal-progress-track"
            aria-label="Reading progress"
            value={progress}
            max={100}
          />
          <span>{progress}% read</span>
        </div>
        <fieldset className="journal-text-controls">
          <legend className="sr-only">Reading text size</legend>
          <span>Text size</span>
          <button
            type="button"
            aria-label="Decrease text size"
            disabled={size === 0}
            onClick={() => setSize((value) => value - 1)}
          >
            <Minus size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Increase text size"
            disabled={size === 2}
            onClick={() => setSize((value) => value + 1)}
          >
            <Plus size={16} aria-hidden="true" />
          </button>
        </fieldset>
      </div>
      {children}
    </div>
  );
}
