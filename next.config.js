/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Served on Vercel: automatic AVIF/WebP resizing for next/image (faster LCP).
  images: { formats: ['image/avif', 'image/webp'] },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Old file-CMS article ids → clean slugs.
      { source: '/articles/1766601625775', destination: '/articles/a-subtle-shift-a-big-impact', permanent: true },
      { source: '/news/:path*', destination: '/blog', permanent: true },
      { source: '/llm.txt', destination: '/llms.txt', permanent: true },
    ];
  },
};

module.exports = nextConfig;
