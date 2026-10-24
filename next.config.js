/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Served on Vercel: automatic AVIF/WebP resizing for next/image (faster LCP). Encoded images are cached for 30 days
  // (the default is 60 s, so visitors kept waiting for fresh AVIF encodes). Replace an image under a new file name.
  images: { formats: ['image/avif', 'image/webp'], minimumCacheTTL: 60 * 60 * 24 * 30 },
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
      // The Creatives library is served as static files whose URLs carry a content fingerprint (?v=): cache for a year.
      {
        source: '/photos/library/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/video/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  // Uploaded images are served from our own origin, then cached on Vercel's CDN for a year (see vercel.json). Only the
  // pre-sized folder is exposed; uploads in progress (orig/) are not. Videos stream from the bucket (lib/media.ts).
  async rewrites() {
    return [{ source: '/media/img/:path*', destination: 'https://hitroo-media.fly.storage.tigris.dev/img/:path*' }];
  },
  async redirects() {
    return [
      // Division subdomains (software., automation., ai., creatives.hitroo.com) land on their page on www.
      ...['software', 'automation', 'ai', 'creatives'].flatMap((d) => [
        { source: '/', has: [{ type: 'host', value: `${d}.hitroo.com` }], destination: `https://www.hitroo.com/${d}`, permanent: false },
        { source: '/:path+', has: [{ type: 'host', value: `${d}.hitroo.com` }], destination: 'https://www.hitroo.com/:path+', permanent: false },
      ]),
      // Old file-CMS article ids → clean slugs.
      { source: '/articles/1766601625775', destination: '/articles/a-subtle-shift-a-big-impact', permanent: true },
      // Old file-CMS news ids (long numbers) → the blog. /news itself is now the newsroom.
      { source: '/news/:id(\\d{6,})', destination: '/blog', permanent: true },
      { source: '/llm.txt', destination: '/llms.txt', permanent: true },
    ];
  },
};

module.exports = nextConfig;
