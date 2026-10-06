import type { Metadata } from 'next';
import { WorldHeader, WorldFooter } from '@/components/world-chrome';

import './globals.css';
import './experience.css';
import './flow.css';
import 'katex/dist/katex.min.css';
import './reading.css';
import './journal.css';
import './world.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://psmithul.com'),
  title: {
    default: 'Mithul Sourav — Projects & Notes',
    template: '%s — Mithul Sourav',
  },
  description:
    'Mithul Sourav, Mechanical Engineering at NITK Surathkal. Projects in robotics, mechanisms, vibration, and control.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <WorldHeader />
        {children}
        <WorldFooter />
      </body>
    </html>
  );
}
