'use client';

import { MinecraftLink as Link } from '@/components/minecraft-link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, TrainFront } from 'lucide-react';

export function WorldHeader() {
  const home = usePathname() === '/v1';
  if (home) return null;
  return (
    <header className={`world-header ${home ? 'world-header-home' : ''}`}>
      <Link
        className="world-brand"
        href="/v1"
        aria-label="Mithul Sourav — home"
      >
        <span className="brand-block">
          <TrainFront size={23} strokeWidth={2.5} />
        </span>
        <span>
          <strong>MITHUL SOURAV</strong>
          <small>MECHANICAL ENGINEERING · ROBOTICS</small>
        </span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/v1#about">About</Link>
        <Link href="/v1#work">Projects</Link>
        <Link href="/v1/blog">Journal</Link>
        <a
          className="world-resume"
          href="/v1/Mithul-Sourav-CV.pdf"
          target="_blank"
          rel="noreferrer"
        >
          My résumé <ArrowUpRight size={14} />
        </a>
      </nav>
    </header>
  );
}

export function WorldFooter() {
  const home = usePathname() === '/v1';
  if (home) return null;
  return (
    <footer className="world-footer">
      <Link href="/v1">← Back on the train</Link>
      <span>Mithul Sourav · Projects & notes.</span>
      <Link href="/v1/write">Writing desk</Link>
    </footer>
  );
}
