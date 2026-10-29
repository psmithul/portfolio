import type { Metadata } from 'next';
import { SiteChrome } from '@/components/academic/chrome';
import localFont from 'next/font/local';
import { profile } from '@/content/profile';

import 'katex/dist/katex.min.css';
import './academic.css';

const amarna = localFont({
  src: [
    {
      path: '../public/fonts/amarna-light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/amarna-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/amarna-bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/amarna-italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-amarna',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://psmithul.com'),
  title: {
    default: `${profile.fullName} — Projects & Notes`,
    template: `%s — ${profile.fullName}`,
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
      <body id="top" className={amarna.variable}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
