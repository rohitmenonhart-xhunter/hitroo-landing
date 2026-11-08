#!/usr/bin/env node
// Export frames of a post page to PNG with the system Chrome (headless), no npm packages needed.
//   node media/tools/render.mjs <posts.html> <frame-id>=<width>x<height> [...]
// Writes <post folder>/export/<frame-id>.png at exactly that size. Stills only: Reels are HyperFrames projects.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const CHROME = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [page, ...frames] = process.argv.slice(2);
if (!page || frames.length === 0) {
  console.error('usage: render.mjs <posts.html> <frame-id>=<width>x<height> [...]');
  process.exit(2);
}
const file = resolve(page);
const outDir = join(dirname(file), 'export');
mkdirSync(outDir, { recursive: true });

for (const spec of frames) {
  const [name, size] = spec.split('=');
  const [id, layer] = name.split('@');
  const [w, h] = size.split('x').map(Number);
  const out = join(outDir, layer ? `${id}-${layer}.png` : `${id}.png`);
  const profile = mkdtempSync(join(tmpdir(), 'hitroo-render-'));
  const url = `${pathToFileURL(file).href}?f=${encodeURIComponent(id)}${layer ? `&layer=${layer}` : ''}`;
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    '--allow-file-access-from-files', `--user-data-dir=${profile}`, '--force-device-scale-factor=1',
    `--window-size=${w},${h}`, '--virtual-time-budget=6000', `--screenshot=${out}`,
    ...(layer === 'fg' ? ['--default-background-color=00000000'] : []), url,
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  rmSync(profile, { recursive: true, force: true });
  console.log(`${out}  ${w}x${h}`);
}
