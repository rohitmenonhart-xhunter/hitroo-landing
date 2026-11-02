/** The client area's host, and the delivery system behind it (design boards are proxied to it). */
const CLIENT_HOST = 'my.hitroo.com';
const FACTORY_ORIGIN = (process.env.FACTORY_ORIGIN || 'https://console.factory.hitroo.com').replace(/\/+$/, '');

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
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Every page refuses framing by other sites, except the design boards' live canvases (/r/…/canvas/), which
      // the delivery system serves sandboxed and which frame their own screens from that sandbox. The boards set
      // their own framing rules.
      { source: '/', headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }] },
      { source: '/:path((?!r/|static/).+)', headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }] },
      // The client area (my.hitroo.com): private pages behind secret links (after the site-wide rule, so these win). Never indexed, never cached, and the
      // link never leaves in a Referer header.
      ...['/d/:path*', '/q/:path*'].map((source) => ({
        source,
        headers: [
          // The chat can call the Project Lead, so the client area may use the microphone (and nothing else may).
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'Cache-Control', value: 'private, no-store' },
        ],
      })),
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
    return [
      { source: '/media/img/:path*', destination: 'https://hitroo-media.fly.storage.tigris.dev/img/:path*' },
      // The client area's design boards are served by the delivery system itself, under the client host, with the
      // assets their pages load (/static/: the stylesheets, fonts and wordmark; the site itself has no /static).
      ...['/r/:path*', '/static/:path*'].map((source) => ({ source, destination: `${FACTORY_ORIGIN}${source}` })),
    ];
  },
  async redirects() {
    const client = { type: 'host', value: CLIENT_HOST };
    return [
      // The client area lives on my.hitroo.com: client links on the main site move there, and my.hitroo.com
      // serves nothing but the client area (and the assets its pages load).
      ...['www.hitroo.com', 'hitroo.com'].flatMap((h) =>
        ['/d', '/d/:path*', '/q/:path*', '/r/:path*'].map((source) => ({ source, has: [{ type: 'host', value: h }], destination: `https://${CLIENT_HOST}${source}`, permanent: false }))
      ),
      { source: '/', has: [client], destination: '/d', permanent: false },
      { source: '/:path((?!d$|d/|q/|r/|static/|_next/|favicon|glass/|fonts/|robots\\.txt).*)', has: [client], destination: 'https://www.hitroo.com/:path', permanent: false },
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
