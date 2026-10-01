import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { SectionLink } from '@/components/section-link';

import './globals.css';
import './experience.css';
import './flow.css';
import 'katex/dist/katex.min.css';
import './reading.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://psmithul.com'),
  title: {
    default: 'Mithul Sourav — Projects & Notes',
    template: '%s — Mithul Sourav',
  },
  description:
    'Mithul Sourav’s projects in robotics, mechanisms, and sensing, alongside Mika’s Life, a personal journal. Final-year student at NITK Surathkal.',
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
        <header className="site-header shell">
          <nav aria-label="Main navigation">
            <SectionLink href="/#top">Home</SectionLink>
            <SectionLink href="/#work">Projects</SectionLink>
            <Link href="/about">About</Link>
            <Link href="/blog">Journal</Link>
            <a href="/Mithul-Sourav-CV.pdf" target="_blank" rel="noreferrer">
              Résumé <ArrowUpRight className="link-arrow" aria-hidden="true" />
            </a>
          </nav>
        </header>
        {children}
        <footer className="site-footer shell">
          <div>
            <Link href="/" className="footer-name">
              Mithul Sourav
            </Link>
            <p>NITK Surathkal · Projects, experiments & notes</p>
          </div>
          <div className="footer-links">
            <a
              href="https://github.com/psmithul"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a href="mailto:psmithul@gmail.com">Email</a>
            <a
              href="https://www.linkedin.com/in/psmithulsourav"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a href="/Mithul-Sourav-CV.pdf" target="_blank" rel="noreferrer">
              CV
            </a>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getUTCFullYear()} P S Mithul Sourav</span>
            <Link href="/write">Writing desk</Link>
            <a href="#top">
              Back to top <ArrowUp className="link-arrow" aria-hidden="true" />
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
