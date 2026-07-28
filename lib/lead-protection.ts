import { z } from 'zod';

export const MAX_LEAD_BODY_BYTES = 16 * 1024;
export const MIN_FORM_COMPLETION_MS = 1_200;
export const TURNSTILE_ACTION = 'contact';

const optionalText = (max: number) => z.string().trim().max(max).optional().default('');

const phoneSchema = optionalText(30).refine((phone) => {
  if (!phone) return true;
  if (!/^[+\d().\s-]+$/.test(phone)) return false;

  const digitCount = phone.replace(/\D/g, '').length;
  return digitCount >= 7 && digitCount <= 15;
}, 'Enter a valid phone number');

export const leadPayloadSchema = z
  .object({
    name: optionalText(100),
    email: optionalText(254).refine(
      (email) => !email || z.string().email().safeParse(email).success,
      'Enter a valid email address'
    ),
    phone: phoneSchema,
    interest: optionalText(120),
    message: optionalText(4_000),
    // Kept temporarily for already-open pages that still submit the previous shape.
    context: optionalText(4_000),
    leadType: z.enum(['contact', 'early_access', 'ai_chat']).optional().default('contact'),
    // Humans never see or complete this field.
    website: optionalText(200),
    formDurationMs: z.number().finite().nonnegative().optional(),
    turnstileToken: optionalText(2_048),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phone number or email is required',
        path: ['email'],
      });
    }
  });

export type LeadPayload = z.infer<typeof leadPayloadSchema>;

export type AutomationSignal = 'honeypot' | 'missing-timing' | 'too-fast';

export function getAutomationSignal(data: LeadPayload): AutomationSignal | null {
  if (data.website) return 'honeypot';
  if (data.formDurationMs === undefined) return 'missing-timing';
  if (data.formDurationMs < MIN_FORM_COMPLETION_MS) return 'too-fast';
  return null;
}

export type TurnstileConfiguration =
  | { state: 'disabled' }
  | { state: 'incomplete' }
  | { state: 'enabled'; siteKey: string; secretKey: string };

type TurnstileEnvironment = Partial<
  Record<'TURNSTILE_SITE_KEY' | 'TURNSTILE_SECRET_KEY', string | undefined>
>;

export function getTurnstileConfiguration(
  env: TurnstileEnvironment = process.env as TurnstileEnvironment
): TurnstileConfiguration {
  const siteKey = env.TURNSTILE_SITE_KEY?.trim() || '';
  const secretKey = env.TURNSTILE_SECRET_KEY?.trim() || '';

  if (!siteKey && !secretKey) return { state: 'disabled' };
  if (!siteKey || !secretKey) return { state: 'incomplete' };
  return { state: 'enabled', siteKey, secretKey };
}

interface TurnstileSiteverifyResponse {
  success?: boolean;
  action?: string;
  'error-codes'?: string[];
}

export type TurnstileVerification =
  | { status: 'verified' }
  | { status: 'rejected'; errorCodes: string[] }
  | { status: 'unavailable' };

export async function verifyTurnstileToken({
  token,
  secretKey,
  expectedAction = TURNSTILE_ACTION,
  remoteIp,
  fetchImpl = fetch,
}: {
  token: string;
  secretKey: string;
  expectedAction?: string;
  remoteIp?: string;
  fetchImpl?: typeof fetch;
}): Promise<TurnstileVerification> {
  if (!token || token.length > 2_048) {
    return { status: 'rejected', errorCodes: ['invalid-input-response'] };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetchImpl(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
          ...(remoteIp ? { remoteip: remoteIp } : {}),
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) return { status: 'unavailable' };

    const result = (await response.json()) as TurnstileSiteverifyResponse;
    if (result.success && result.action === expectedAction) {
      return { status: 'verified' };
    }

    return {
      status: 'rejected',
      errorCodes:
        result['error-codes']?.length ? result['error-codes'] : ['invalid-action-or-response'],
    };
  } catch {
    return { status: 'unavailable' };
  } finally {
    clearTimeout(timeout);
  }
}
