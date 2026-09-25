import { z } from 'zod';

const id = z.string().uuid();
const path = z.string().max(300).regex(/^\//);

/** A page view. Pages cached before visit/view ids existed send neither, nor a type. */
const view = z
  .object({
    type: z.literal('view').optional(),
    path,
    referrer: z.string().max(600).optional(),
    utm_source: z.string().max(100).optional(),
    utm_medium: z.string().max(100).optional(),
    utm_campaign: z.string().max(150).optional(),
    language: z.string().max(35).optional(),
    visitId: id.optional(),
    viewId: id.optional(),
    visitorId: id.optional(),
    sessionId: id.optional(),
  })
  .strict();

/** A click on a link or button. */
const click = z
  .object({
    type: z.literal('click'),
    path,
    visitId: id.optional(),
    viewId: id.optional(),
    visitorId: id.optional(),
    label: z.string().max(80).optional(),
    href: z.string().max(300).optional(),
  })
  .strict();

/** Visible time since the last report, and the furthest scroll so far. */
const engage = z
  .object({
    type: z.literal('engage'),
    path,
    visitId: id.optional(),
    viewId: id.optional(),
    visitorId: id.optional(),
    seconds: z.number().int().min(0).max(86_400),
    depth: z.number().int().min(0).max(100),
  })
  .strict();

export const trackPayloadSchema = z.union([view, click, engage]);
export type TrackPayload = z.infer<typeof trackPayloadSchema>;
