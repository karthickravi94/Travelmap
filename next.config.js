/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
}

module.exports = nextConfig
