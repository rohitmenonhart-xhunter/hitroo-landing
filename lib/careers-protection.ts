import { z } from 'zod';

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
export const MAX_CAREERS_BODY_BYTES = 7 * 1024 * 1024;

export const CAREER_POSITIONS = {
  fullstack: 'Full Stack Developer',
  frontend: 'Frontend Developer',
  backend: 'Backend Developer',
  'hardware-mech': 'Hardware — Mechanical',
  'hardware-elec': 'Hardware — Electronics',
  'ml-ai': 'ML / AI Engineer',
} as const;

const requiredText = (min: number, max: number) => z.string().trim().min(min).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().default('');
const optionalUrl = optionalText(500).refine((value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}, 'Enter a valid URL');

export const careerPayloadSchema = z
  .object({
    name: requiredText(2, 100),
    email: requiredText(3, 254).email(),
    phone: requiredText(7, 30).refine((phone) => {
      if (!/^[+\d().\s-]+$/.test(phone)) return false;
      const digitCount = phone.replace(/\D/g, '').length;
      return digitCount >= 7 && digitCount <= 15;
    }, 'Enter a valid phone number'),
    linkedin: optionalUrl,
    portfolio: optionalUrl,
    whyHitroo: requiredText(10, 2_000),
    whyPosition: requiredText(10, 2_000),
    experience: z.enum(['', 'student', '0-1', '1-3', '3+']).optional().default(''),
    availability: z
      .enum(['', 'immediate', '2weeks', '1month', 'later'])
      .optional()
      .default(''),
    position: z.enum([
      'fullstack',
      'frontend',
      'backend',
      'hardware-mech',
      'hardware-elec',
      'ml-ai',
    ]),
    resumeName: requiredText(1, 150).refine(
      (name) => name.toLowerCase().endsWith('.pdf') && !/[/\\\0]/.test(name),
      'Resume must be a PDF'
    ),
    resumeData: requiredText(32, Math.ceil((MAX_RESUME_BYTES * 4) / 3) + 64).refine(
      (data) => data.startsWith('data:application/pdf;base64,'),
      'Resume must be a PDF'
    ),
    website: optionalText(200),
    formDurationMs: z.number().finite().nonnegative().optional(),
    turnstileToken: optionalText(2_048),
  })
  .strict();

export type CareerPayload = z.infer<typeof careerPayloadSchema>;

export function decodeResume(dataUrl: string) {
  const resume = Buffer.from(dataUrl.replace(/^data:application\/pdf;base64,/, ''), 'base64');
  if (
    resume.length === 0 ||
    resume.length > MAX_RESUME_BYTES ||
    resume.subarray(0, 5).toString('ascii') !== '%PDF-'
  ) {
    return null;
  }
  return resume;
}
