import { notFound } from 'next/navigation';
import { api, isAccessToken, isProjectId, isQuoteToken, orNull } from './api';

/** A page's data, or the "not found" page when the link is wrong, replaced or someone else's. */
export async function loadOverview(token: string) {
  if (!isAccessToken(token)) notFound();
  return (await orNull(api.overview(token))) ?? notFound();
}

export async function loadProject(token: string, id: string) {
  if (!isAccessToken(token) || !isProjectId(id)) notFound();
  return (await orNull(api.project(token, id))) ?? notFound();
}

export async function loadQuote(token: string) {
  if (!isQuoteToken(token)) notFound();
  return (await orNull(api.quote(token))) ?? notFound();
}

/** A payment's number from the address (1, 2, 3…). */
export function paymentNumber(n: string): number {
  if (!/^[1-9]\d?$/.test(n)) notFound();
  return Number(n);
}
