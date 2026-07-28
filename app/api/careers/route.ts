import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { esc, acknowledgmentEmail } from '@/lib/email';
import {
    CAREER_POSITIONS,
    careerPayloadSchema,
    decodeResume,
    MAX_CAREERS_BODY_BYTES,
} from '@/lib/careers-protection';
import {
    getTurnstileConfiguration,
    MIN_FORM_COMPLETION_MS,
    verifyTurnstileToken,
} from '@/lib/lead-protection';
import {
    getClientIp,
    isSameOrigin,
    PayloadTooLargeError,
    readLimitedJson,
} from '@/lib/request-security';

export async function POST(request: NextRequest) {
    try {
        if (!request.headers.get('content-type')?.includes('application/json')) {
            return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
        }
        if (!isSameOrigin(request)) {
            return NextResponse.json({ error: 'Cross-origin submissions are not allowed' }, { status: 403 });
        }

        let rawData: unknown;
        try {
            rawData = await readLimitedJson(request, MAX_CAREERS_BODY_BYTES);
        } catch (error) {
            return NextResponse.json(
                { error: error instanceof PayloadTooLargeError ? 'Application is too large' : 'Invalid JSON body' },
                { status: error instanceof PayloadTooLargeError ? 413 : 400 }
            );
        }

        const parsed = careerPayloadSchema.safeParse(rawData);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || 'Invalid application' },
                { status: 400 }
            );
        }

        const data = parsed.data;
        const {
            name,
            email,
            phone,
            linkedin,
            portfolio,
            whyHitroo,
            whyPosition,
            experience,
            availability,
            position,
            resumeName,
            resumeData
        } = data;
        const positionTitle = CAREER_POSITIONS[position];

        if (
            data.website ||
            data.formDurationMs === undefined ||
            data.formDurationMs < MIN_FORM_COMPLETION_MS
        ) {
            console.warn('Career application discarded (automation signal)');
            return NextResponse.json({ success: true });
        }

        const turnstileConfiguration = getTurnstileConfiguration();
        if (turnstileConfiguration.state === 'incomplete') {
            console.error(
                'Turnstile is disabled: set both TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY'
            );
        } else if (turnstileConfiguration.state === 'enabled') {
            const verification = await verifyTurnstileToken({
                token: data.turnstileToken,
                secretKey: turnstileConfiguration.secretKey,
                expectedAction: 'careers',
                remoteIp: getClientIp(request),
            });
            if (verification.status === 'unavailable') {
                return NextResponse.json(
                    { error: 'Verification is temporarily unavailable. Please email careers information to info@hitroo.com.' },
                    { status: 503 }
                );
            }
            if (verification.status === 'rejected') {
                return NextResponse.json(
                    { error: 'Please complete the verification and try again.' },
                    { status: 400 }
                );
            }
        }

        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            return NextResponse.json(
                { error: 'Applications are not configured yet. Please email info@hitroo.com.' },
                { status: 500 }
            );
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // Prepare attachment if resume exists
        const resume = decodeResume(resumeData);
        if (!resume) {
            return NextResponse.json({ error: 'Resume must be a valid PDF under 5 MB' }, { status: 400 });
        }
        const attachments = [{ filename: resumeName, content: resume }];

        const mailOptions = {
            from: `HITROO Careers <${process.env.GMAIL_USER}>`,
            to: process.env.LEAD_EMAIL_RECIPIENT || 'info@hitroo.com',
            replyTo: email || undefined,
            subject: `New Job Application: ${positionTitle} - ${name}`,
            attachments,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <h2 style="color: #4285F4;">New Job Application</h2>
          <hr style="border: 1px solid #eee;" />
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold; width: 150px;">Position</td>
              <td style="padding: 10px;">${esc(positionTitle)} (${esc(position)})</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Name</td>
              <td style="padding: 10px;">${esc(name)}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold;">Email</td>
              <td style="padding: 10px;"><a href="mailto:${esc(email)}">${esc(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Phone</td>
              <td style="padding: 10px;"><a href="tel:${esc(phone)}">${esc(phone)}</a></td>
            </tr>
            ${linkedin ? `
            <tr style="background: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold;">LinkedIn</td>
              <td style="padding: 10px;"><a href="${esc(linkedin)}">${esc(linkedin)}</a></td>
            </tr>
            ` : ''}
            ${portfolio ? `
            <tr>
              <td style="padding: 10px; font-weight: bold;">Portfolio/GitHub</td>
              <td style="padding: 10px;"><a href="${esc(portfolio)}">${esc(portfolio)}</a></td>
            </tr>
            ` : ''}
            <tr style="background: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold;">Experience</td>
              <td style="padding: 10px;">${esc(experience || 'Not specified')}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Availability</td>
              <td style="padding: 10px;">${esc(availability || 'Not specified')}</td>
            </tr>
          </table>
          
          <h3 style="color: #333; margin-top: 20px;">Why HITROO?</h3>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
            ${esc(whyHitroo || 'Not provided')}
          </div>
          
          <h3 style="color: #333; margin-top: 20px;">Why This Position?</h3>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
            ${esc(whyPosition || 'Not provided')}
          </div>
          
          ${resumeName ? `
          <p style="margin-top: 20px;"><strong>📎 Resume attached:</strong> ${esc(resumeName)}</p>
          ` : '<p style="color: #888;">No resume attached</p>'}
          
          <hr style="border: 1px solid #eee; margin-top: 30px;" />
          <p style="color: #888; font-size: 12px;">
            Submitted on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            <br/>This application was submitted via the HITROO Careers page.
          </p>
        </div>
      `,
            text: `
New Job Application - ${positionTitle}

Name: ${name}
Email: ${email}
Phone: ${phone}
LinkedIn: ${linkedin || 'Not provided'}
Portfolio: ${portfolio || 'Not provided'}
Experience: ${experience || 'Not specified'}
Availability: ${availability || 'Not specified'}

Why HITROO?
${whyHitroo || 'Not provided'}

Why This Position?
${whyPosition || 'Not provided'}

Resume: ${resumeName ? 'Attached' : 'Not provided'}

Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      `,
        };

        await transporter.sendMail(mailOptions);

        // Send the applicant a branded acknowledgment (best-effort)
        if (email) {
            try {
                await transporter.sendMail({
                    from: `HITROO Careers <${process.env.GMAIL_USER}>`,
                    to: email,
                    subject: 'We\'ve received your application — HITROO',
                    html: acknowledgmentEmail({
                        heading: `Thanks${name ? `, ${esc(name)}` : ''} — your application<br/>is <span style="color:#34A853;">in</span>.`,
                        intro: `We&rsquo;ve received your application${positionTitle ? ` for <strong style="color:#202124;">${esc(positionTitle)}</strong>` : ''}. Our team reviews every application within 7 days and we&rsquo;ll be in touch.`,
                        recapLabel: 'Applied for',
                        recapBody: esc(positionTitle || 'HITROO'),
                    }),
                    text: `Thanks${name ? `, ${name}` : ''} — we've received your application${positionTitle ? ` for ${positionTitle}` : ''}. Our team reviews every application within 7 days and we'll be in touch.\n\nNeed us sooner? info@hitroo.com · +91 7550000805\n\nHITROO — Intelligence, Unbound · Chennai, Tamil Nadu, India`,
                });
            } catch (ackErr) {
                console.error('Careers acknowledgment email failed (non-fatal):', ackErr);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Career application error:', error);
        return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }
}
