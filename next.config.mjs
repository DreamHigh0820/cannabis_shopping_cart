/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // Add local domain for uploaded images
    domains: ['localhost', 'https://cannabis-shopping-cart.vercel.app'],
    // Allow local file system images
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'https://cannabis-shopping-cart.vercel.app', // Replace with your actual domain
        pathname: '/images/**',
      }
    ]
  },
  // Handle large file uploads
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig