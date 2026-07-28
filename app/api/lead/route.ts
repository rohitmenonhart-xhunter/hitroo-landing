import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { esc, acknowledgmentEmail } from '@/lib/email';
import {
    getAutomationSignal,
    getTurnstileConfiguration,
    leadPayloadSchema,
    MAX_LEAD_BODY_BYTES,
    verifyTurnstileToken,
} from '@/lib/lead-protection';
import {
    getClientIp,
    isSameOrigin,
    PayloadTooLargeError,
    readLimitedJson,
} from '@/lib/request-security';

// Where website messages are delivered. Override with LEAD_EMAIL_RECIPIENT.
const RECIPIENT = process.env.LEAD_EMAIL_RECIPIENT || 'info@hitroo.com';

function jsonError(error: string, status: number) {
    return NextResponse.json(
        { error },
        { status, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
}

export async function POST(request: NextRequest) {
    try {
        if (!request.headers.get('content-type')?.includes('application/json')) {
            return jsonError('Content-Type must be application/json', 415);
        }

        if (!isSameOrigin(request)) {
            return jsonError('Cross-origin submissions are not allowed', 403);
        }

        let rawData: unknown;
        try {
            rawData = await readLimitedJson(request, MAX_LEAD_BODY_BYTES);
        } catch (error) {
            if (error instanceof PayloadTooLargeError) {
                return jsonError('Submission is too large', 413);
            }
            return jsonError('Invalid JSON body', 400);
        }

        const parsed = leadPayloadSchema.safeParse(rawData);
        if (!parsed.success) {
            const message =
                parsed.error.issues[0]?.code === 'unrecognized_keys'
                    ? 'Invalid submission'
                    : parsed.error.issues[0]?.message || 'Invalid submission';
            return jsonError(message, 400);
        }

        const data = parsed.data;
        const automationSignal = getAutomationSignal(data);
        if (automationSignal) {
            console.warn(`Lead submission discarded (${automationSignal})`);
            // Do not teach simple bots which trap they triggered.
            return NextResponse.json(
                { success: true, message: 'Submitted successfully' },
                { headers: { 'Cache-Control': 'no-store, max-age=0' } }
            );
        }

        const turnstileConfiguration = getTurnstileConfiguration();
        if (turnstileConfiguration.state === 'incomplete') {
            console.error(
                'Turnstile is disabled: set both TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY'
            );
        } else if (turnstileConfiguration.state === 'enabled') {
            if (!data.turnstileToken) {
                return jsonError('Please complete the verification and try again.', 400);
            }

            const verification = await verifyTurnstileToken({
                token: data.turnstileToken,
                secretKey: turnstileConfiguration.secretKey,
                remoteIp: getClientIp(request),
            });

            if (verification.status === 'unavailable') {
                console.error('Turnstile verification service unavailable');
                return jsonError(
                    'Verification is temporarily unavailable. Please email us directly at info@hitroo.com.',
                    503
                );
            }
            if (verification.status === 'rejected') {
                console.warn(
                    `Turnstile rejected lead submission (${verification.errorCodes.join(',')})`
                );
                return jsonError('Please complete the verification and try again.', 400);
            }
        }

        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.error('Lead email not configured: missing GMAIL_USER / GMAIL_APP_PASSWORD');
            return jsonError('Messaging is not configured yet. Please email us directly.', 500);
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
        });

        const labels: Record<string, string> = {
            contact: 'New message from the HITROO website',
            early_access: 'New Early Access request — HITROO',
            ai_chat: 'New lead from HITROO',
        };
        const subject = labels[data.leadType] || 'New message from the HITROO website';
        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        const context =
            [
                data.interest ? `Interested in: ${data.interest}` : '',
                data.message || data.context,
            ]
                .filter(Boolean)
                .join('\n') || 'No details provided';

        // 1) Notify the HITROO team
        await transporter.sendMail({
            from: `HITROO Website <${process.env.GMAIL_USER}>`,
            to: RECIPIENT,
            replyTo: data.email || undefined,
            subject,
            html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#202124;">
          <h2 style="color:#4285F4;margin-bottom:4px;">${esc(subject)}</h2>
          <hr style="border:none;border-top:1px solid #eee;" />
          ${data.name ? `<p><strong>Name:</strong> ${esc(data.name)}</p>` : ''}
          ${data.email ? `<p><strong>Email:</strong> <a href="mailto:${esc(data.email)}">${esc(data.email)}</a></p>` : ''}
          ${data.phone ? `<p><strong>Phone:</strong> <a href="tel:${esc(data.phone)}">${esc(data.phone)}</a></p>` : ''}
          <p style="margin-top:16px;"><strong>Message</strong></p>
          <div style="background:#f8f9fa;padding:15px;border-radius:12px;margin:8px 0;white-space:pre-wrap;">${esc(context)}</div>
          <p style="color:#80868b;font-size:12px;margin-top:16px;">Sent from the HITROO website · ${timestamp}</p>
        </div>`,
            text: `${subject}\n\n${data.name ? `Name: ${data.name}\n` : ''}${data.email ? `Email: ${data.email}\n` : ''}${data.phone ? `Phone: ${data.phone}\n` : ''}\nMessage:\n${context}\n\nSent from the HITROO website · ${timestamp}`,
        });

        // 2) Send the visitor a friendly acknowledgment (best-effort)
        if (data.email) {
            try {
                await transporter.sendMail({
                    from: `HITROO <${process.env.GMAIL_USER}>`,
                    to: data.email,
                    subject: 'We\'ve received your message — HITROO',
                    html: acknowledgmentEmail({
                        heading: `Thanks${data.name ? `, ${esc(data.name)}` : ''} — your message<br/>is <span style="color:#4285F4;">in</span>.`,
                        intro: 'A member of the HITROO team will get back to you within a day. Here&rsquo;s a copy of what you sent us.',
                        recapLabel: 'Your message',
                        recapBody: esc(context),
                    }),
                    text: `Thanks${data.name ? `, ${data.name}` : ''} — we've received your message and will get back to you within a day.\n\nYour message:\n${context}\n\nNeed us sooner? info@hitroo.com · +91 7550000805\n\nHITROO — Intelligence, Unbound · Chennai, Tamil Nadu, India`,
                });
            } catch (ackErr) {
                console.error('Acknowledgment email failed (non-fatal):', ackErr);
            }
        }

        return NextResponse.json({ success: true, message: 'Submitted successfully' });
    } catch (error) {
        console.error('Email send error:', error);
        return jsonError('Failed to submit. Please email us directly at info@hitroo.com.', 500);
    }
}
