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
    // Add domains for images
    domains: [
      'cannabis-shopping-cart.vercel.app', // Your Vercel domain
    ],
    // Allow Vercel Blob storage for both local and production
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cannabis-shopping-cart.vercel.app', // Your actual domain
        pathname: '/**',
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