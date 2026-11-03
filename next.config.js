/**
 * my.hitroo.com serves only the design review boards the Software Factory publishes (my.hitroo.com/r/<token>), which
 * Rohit forwards to clients. They're proxied to the factory (FACTORY_ORIGIN) with the assets their pages load
 * (/static/…); every other path there goes to www.hitroo.com. The client area that lived on this host (dashboards,
 * quotes, chat, calls) was removed on 2026-11-03: clients now reach Rohit or their project manager by phone.
 */
const BOARDS_HOST = 'my.hitroo.com';
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
      // the factory serves sandboxed and which frame their own screens from that sandbox. The boards set their own
      // framing rules (and their own CSP and robots headers).
      { source: '/', headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }] },
      { source: '/:path((?!r/|static/).+)', headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }] },
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
      // The design review boards are served by the Software Factory itself, under my.hitroo.com, with the assets
      // their pages load (/static/: the stylesheets, script, fonts and wordmark; the site itself has no /static).
      ...['/r/:path*', '/static/:path*'].map((source) => ({ source, destination: `${FACTORY_ORIGIN}${source}` })),
    ];
  },
  async redirects() {
    const boards = { type: 'host', value: BOARDS_HOST };
    return [
      // A board link opened on the main site moves to the boards' host.
      ...['www.hitroo.com', 'hitroo.com'].map((h) => ({ source: '/r/:path*', has: [{ type: 'host', value: h }], destination: `https://${BOARDS_HOST}/r/:path*`, permanent: false })),
      // my.hitroo.com serves nothing but the boards (/r/…) and their assets (/static/…). Old client-area links
      // (dashboards /d/…, quotes /q/…) land on the home page, so their tokens never reach www's address bar or
      // analytics; any other path keeps its place on www.
      ...['/', '/d/:path*', '/q/:path*'].map((source) => ({ source, has: [boards], destination: 'https://www.hitroo.com/', permanent: false })),
      { source: '/:path((?!r$|r/|static/).*)', has: [boards], destination: 'https://www.hitroo.com/:path', permanent: false },
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
