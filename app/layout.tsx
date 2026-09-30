import type { Metadata } from 'next';
import Link from 'next/link';

import './globals.css';
import './experience.css';
import './flow.css';

export const metadata: Metadata = {
  title: {
    default: 'Mithul Sourav — Mechanical Engineering & Robotics',
    template: '%s — Mithul Sourav',
  },
  description:
    'Mechanical engineering and robotics by Mithul Sourav, a final-year student at NITK Surathkal. Project studies, CAD, and Mika’s Life, a personal journal.',
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
          <Link href="/#top" className="header-name">
            Mithul Sourav
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/#top">Home</Link>
            <Link href="/#work">Projects</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Journal</Link>
            <a href="/Mithul-Sourav-CV.pdf" target="_blank" rel="noreferrer">
              Résumé <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </header>
        {children}
        <footer className="site-footer shell">
          <div>
            <Link href="/" className="footer-name">
              Mithul Sourav
            </Link>
            <p>Mechanical engineering & robotics · NITK Surathkal</p>
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
            <a href="#top">Back to top</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
