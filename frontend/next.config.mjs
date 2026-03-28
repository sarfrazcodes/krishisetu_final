/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ignore TypeScript errors during build (yes, we are being reckless)
    ignoreBuildErrors: true,
  },
  eslint: {
    // ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;