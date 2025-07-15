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
    // Add domains for images (NO protocol here)
    domains: [
      'localhost',
      'cannabis-shopping-cart.vercel.app', // Your Vercel domain (NO https://)
    ],
    // Allow Vercel Blob storage and local images
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'cannabis-shopping-cart.vercel.app', // Your actual domain (NO https://)
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com', // Vercel Blob storage
      },
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com', // Alternative Vercel Blob pattern
      }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig