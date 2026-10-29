import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Leave the archived stylesheet and scene behind on a full document navigation. */
import { WorldHeader, WorldFooter } from '@/components/world-chrome';
import '../globals.css';
import '../experience.css';
import '../flow.css';
import 'katex/dist/katex.min.css';
import '../reading.css';
import '../journal.css';
import '../world.css';
import '../minecraft.css';
import '../classic-portfolio.css';
import './version.css';

export const metadata: Metadata = {
  icons: { icon: '/v1/favicon.svg' },
  robots: { index: false, follow: true },
  title: {
    default: 'Minecraft portfolio · v1',
    template: '%s — Mithul Sourav · v1',
  },
};

export default function V1Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WorldHeader />
      {children}
      <WorldFooter />
      <a className="legacy-version-link" href="/">
        v1 · Current website ↗
      </a>
    </>
  );
}
