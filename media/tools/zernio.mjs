#!/usr/bin/env node
// hitroo's Instagram and LinkedIn through the Zernio API (https://docs.zernio.com). No npm packages needed.
// The API key is read from the macOS keychain (service "zernio-api-key", account "hitroo"), or ZERNIO_API_KEY.
//
//   node media/tools/zernio.mjs accounts                 connected accounts and follower counts
//   node media/tools/zernio.mjs recent <accountId>       the account's latest posts on the platform, with likes and comments
//   node media/tools/zernio.mjs upload <file> [...]      upload files, print their public URLs
//   node media/tools/zernio.mjs post <spec.json> [--dry] create a post from a spec (see below); --dry prints the body only
//   node media/tools/zernio.mjs get <postId>             a post's status and live URLs
//
// A spec is the body of POST /v1/posts, except that any media item may give a local "file" (relative to the spec)
// instead of a "url"; it is uploaded first. Never post without the owner's approval of the exact images and text.
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { basename, dirname, extname, resolve } from 'node:path';

const API = 'https://zernio.com/api/v1';
const TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.mov': 'video/quicktime' };

function key() {
  if (process.env.ZERNIO_API_KEY) return process.env.ZERNIO_API_KEY;
  return execFileSync('security', ['find-generic-password', '-s', 'zernio-api-key', '-a', 'hitroo', '-w'], { encoding: 'utf8' }).trim();
}

async function api(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${key()}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok && res.status !== 207) {
    throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(data).slice(0, 1200)}`);
  }
  return { status: res.status, data };
}

async function upload(file) {
  const contentType = TYPES[extname(file).toLowerCase()];
  if (!contentType) throw new Error(`unknown file type: ${file}`);
  const size = statSync(file).size;
  const { data } = await api('POST', '/media/presign', { filename: basename(file), contentType, size });
  const put = await fetch(data.uploadUrl, { method: 'PUT', headers: { 'Content-Type': contentType }, body: readFileSync(file) });
  if (!put.ok) throw new Error(`upload of ${file} failed: ${put.status} ${await put.text()}`);
  return data.publicUrl;
}

async function resolveMedia(items, base) {
  if (!items) return items;
  return Promise.all(items.map(async ({ file, ...rest }) => (file ? { ...rest, url: await upload(resolve(base, file)) } : rest)));
}

const [cmd, ...args] = process.argv.slice(2);

if (cmd === 'accounts') {
  const { data } = await api('GET', '/accounts');
  for (const a of data.accounts) {
    console.log(`${a._id}  ${a.platform.padEnd(10)} @${a.username}  followers ${a.followersCount ?? '?'}  ${a.metadata?.accountType ?? ''}`);
  }
} else if (cmd === 'recent') {
  const { data } = await api('GET', `/accounts/${args[0]}/posts`);
  for (const p of data.posts ?? []) {
    console.log(`${p.createdTime?.slice(0, 10)}  ${p.mediaType ?? ''}  likes ${p.likeCount ?? 0}  comments ${p.commentCount ?? 0}  ${p.reactionCount != null ? `reactions ${p.reactionCount}  ` : ''}${p.permalink}`);
    console.log(`    ${(p.message ?? '').replace(/\s+/g, ' ').slice(0, 140)}`);
  }
} else if (cmd === 'upload') {
  for (const f of args) console.log(`${f}  →  ${await upload(f)}`);
} else if (cmd === 'post') {
  const specPath = resolve(args[0]);
  const base = dirname(specPath);
  const spec = JSON.parse(readFileSync(specPath, 'utf8'));
  delete spec.$comment;
  if (args.includes('--dry')) {
    console.log(JSON.stringify(spec, null, 2));
    process.exit(0);
  }
  spec.mediaItems = await resolveMedia(spec.mediaItems, base);
  for (const p of spec.platforms ?? []) if (p.customMedia) p.customMedia = await resolveMedia(p.customMedia, base);
  const { status, data } = await api('POST', '/posts', spec);
  const post = data.post ?? data;
  console.log(`HTTP ${status}  post ${post._id}  status ${post.status}  scheduledFor ${post.scheduledFor ?? '-'}`);
  for (const p of post.platforms ?? []) {
    console.log(`  ${p.platform}${p.platformSpecificData?.contentType ? ` (${p.platformSpecificData.contentType})` : ''}: ${p.status ?? ''} ${p.platformPostUrl ?? ''} ${p.errorMessage ?? p.error ?? ''}`);
  }
} else if (cmd === 'get') {
  const { data } = await api('GET', `/posts/${args[0]}`);
  const post = data.post ?? data;
  console.log(`post ${post._id}  status ${post.status}  scheduledFor ${post.scheduledFor ?? '-'}`);
  for (const p of post.platforms ?? []) {
    console.log(`  ${p.platform}${p.platformSpecificData?.contentType ? ` (${p.platformSpecificData.contentType})` : ''}: ${p.status ?? ''} ${p.platformPostUrl ?? ''} ${p.errorMessage ?? p.error ?? ''}`);
  }
} else {
  console.log(readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 14).join('\n'));
}
