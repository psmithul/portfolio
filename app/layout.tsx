import type { Metadata } from 'next';
import { SiteChrome } from '@/components/academic/chrome';
import localFont from 'next/font/local';
import { profile } from '@/content/profile';

import 'katex/dist/katex.min.css';
import './academic.css';
import './portfolio.css';

const bodyFont = localFont({
  src: [
    { path: '../public/fonts/amarna-regular.woff2', weight: '400' },
    { path: '../public/fonts/amarna-bold.woff2', weight: '700' },
    {
      path: '../public/fonts/amarna-italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-portfolio-body',
  display: 'swap',
});
const displayFont = localFont({
  src: '../public/fonts/space-grotesk-latin-variable.woff2',
  weight: '300 700',
  variable: '--font-portfolio-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://psmithul.com'),
  title: {
    default: `${profile.fullName} — Projects & Notes`,
    template: `%s — ${profile.fullName}`,
  },
  description: profile.heroIntro,
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body id="top" className={`${bodyFont.variable} ${displayFont.variable}`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
