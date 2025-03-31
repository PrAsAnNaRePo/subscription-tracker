/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly disable Turbopack
  experimental: {
    turbo: {
      enabled: false
    }
  },
  // Disable type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure standalone output
  output: 'standalone',
  // Ensure we include the correct output directory
  outputFileTracing: true,
}

module.exports = nextConfig
