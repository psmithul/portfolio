import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: '/about', destination: '/#about', permanent: true },
      { source: '/work', destination: '/#research', permanent: true },
      { source: '/blog', destination: '/#journal', permanent: true },
      { source: '/activities', destination: '/#activities', permanent: true },
      { source: '/v1/:path*', destination: '/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
