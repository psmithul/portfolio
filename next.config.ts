import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { unoptimized: true },
  async redirects() {
    return [{ source: '/v1/:path*', destination: '/:path*', permanent: true }];
  },
};

export default nextConfig;
