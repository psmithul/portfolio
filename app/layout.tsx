import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Mithul Sourav — Mechanical Engineering & Robotics',
    template: '%s — Mithul Sourav',
  },
  description:
    'Mechanical engineering, robotics, and intelligent physical systems. Selected research and projects by P S Mithul Sourav, NITK Surathkal.',
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
          <Link href="/" className="wordmark" aria-label="Mithul Sourav home">
            <span className="brand-mark" aria-hidden="true">
              m<span>.</span>
            </span>
            <span>
              Mithul Sourav
              <span className="wordmark-caption">ENGINEER & EXPLORER</span>
            </span>
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/#work">Work</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">
              Journal <span className="nav-dot" />
            </Link>
            <a
              href="/Mithul-Sourav-CV.pdf"
              target="_blank"
              rel="noreferrer"
              className="cv-link"
            >
              Résumé <ArrowUpRight size={15} />
            </a>
          </nav>
        </header>
        {children}
        <footer className="site-footer shell">
          <div>
            <Link href="/" className="footer-name">
              Mithul Sourav<span>.</span>
            </Link>
            <p>Mechanisms. Motion. An open mind.</p>
          </div>
          <div className="footer-links">
            <a href="mailto:psmithul@gmail.com">
              Email <ArrowUpRight size={15} />
            </a>
            <a
              href="https://www.linkedin.com/in/psmithulsourav"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <ArrowUpRight size={15} />
            </a>
            <a href="/Mithul-Sourav-CV.pdf" target="_blank" rel="noreferrer">
              CV <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getUTCFullYear()} P S Mithul Sourav</span>
            <span>Surathkal, India · Always learning</span>
            <a href="#top">Back to top ↑</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
