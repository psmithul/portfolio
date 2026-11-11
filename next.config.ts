import type { NextConfig } from 'next';
import { sitePages } from './lib/site-paths';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: '/about', destination: '/#about', permanent: true },
      { source: '/work', destination: sitePages.projects, permanent: true },
      { source: '/blog', destination: sitePages.buildLog, permanent: true },
      { source: '/activities', destination: '/#activities', permanent: true },
      {
        source: '/work/neoleg-knee-mechanism',
        destination: '/work/kneeassist',
        permanent: true,
      },
      { source: '/v1/:path*', destination: '/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
