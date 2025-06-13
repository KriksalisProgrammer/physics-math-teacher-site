/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Убираем output: 'export' для возможности использования API routes
  // output: 'export', 
  trailingSlash: true,
  images: {
    domains: [
      'localhost', 
      'example.com',
      'your-supabase-storage-url.supabase.co',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com'
    ],
    formats: ['image/avif', 'image/webp']
    // Убираем unoptimized: true для лучшей оптимизации изображений
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  }
}

export default nextConfig
