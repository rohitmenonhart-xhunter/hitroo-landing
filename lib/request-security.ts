import type { NextRequest } from 'next/server';

export class PayloadTooLargeError extends Error {}

export async function readLimitedJson(request: Request, maxBytes: number): Promise<unknown> {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > maxBytes) throw new PayloadTooLargeError();
  if (!request.body) return null;

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let body = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    bytesRead += value.byteLength;
    if (bytesRead > maxBytes) {
      await reader.cancel();
      throw new PayloadTooLargeError();
    }
    body += decoder.decode(value, { stream: true });
  }

  body += decoder.decode();
  return JSON.parse(body);
}

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const requestHost = [
      request.headers.get('host'),
      request.headers.get('x-forwarded-host')?.split(',')[0]?.trim(),
      request.nextUrl.host,
    ].find((host): host is string => Boolean(host));

    return Boolean(
      requestHost &&
        hostMatchesOrigin(requestHost, originUrl.hostname, originUrl.port)
    );
  } catch {
    return false;
  }
}

function hostMatchesOrigin(host: string, originHostname: string, originPort: string) {
  const parsedHost = parseHost(host);
  if (!parsedHost) return false;

  if (parsedHost.hostname === originHostname.toLowerCase() && parsedHost.port === originPort) {
    return true;
  }

  return (
    isLoopbackHost(parsedHost.hostname) &&
    isLoopbackHost(originHostname) &&
    parsedHost.port === originPort
  );
}

function parseHost(host: string) {
  try {
    const url = new URL(host.includes('://') ? host : `http://${host}`);
    return {
      hostname: url.hostname.replace(/^\[|\]$/g, '').toLowerCase(),
      port: url.port,
    };
  } catch {
    return null;
  }
}

function isLoopbackHost(hostname: string) {
  const host = hostname.replace(/^\[|\]$/g, '').toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

export function getClientIp(request: NextRequest) {
  return (
    request.headers.get('x-nf-client-connection-ip') ||
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    undefined
  );
}
