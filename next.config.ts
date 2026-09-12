import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/phan-mem/phan-mem/:slug*',
        destination: '/phan-mem/:slug*',
        permanent: true,
      },
      {
        source: '/blog/blog/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
