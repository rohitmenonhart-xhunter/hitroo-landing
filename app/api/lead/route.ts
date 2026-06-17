import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { esc, acknowledgmentEmail } from '@/lib/email';

// Where website messages are delivered. Override with LEAD_EMAIL_RECIPIENT.
const RECIPIENT = process.env.LEAD_EMAIL_RECIPIENT || 'info@hitroo.com';

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, context, leadType } = await request.json();

        if (!phone && !email) {
            return NextResponse.json({ error: 'Phone number or email is required' }, { status: 400 });
        }

        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.error('Lead email not configured: missing GMAIL_USER / GMAIL_APP_PASSWORD');
            return NextResponse.json(
                { error: 'Messaging is not configured yet. Please email us directly.' },
                { status: 500 }
            );
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
        const subject = labels[leadType as string] || 'New message from the HITROO website';
        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        // 1) Notify the HITROO team
        await transporter.sendMail({
            from: `HITROO Website <${process.env.GMAIL_USER}>`,
            to: RECIPIENT,
            replyTo: email || undefined,
            subject,
            html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#202124;">
          <h2 style="color:#4285F4;margin-bottom:4px;">${esc(subject)}</h2>
          <hr style="border:none;border-top:1px solid #eee;" />
          ${name ? `<p><strong>Name:</strong> ${esc(name)}</p>` : ''}
          ${email ? `<p><strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>` : ''}
          ${phone ? `<p><strong>Phone:</strong> <a href="tel:${esc(phone)}">${esc(phone)}</a></p>` : ''}
          <p style="margin-top:16px;"><strong>Message</strong></p>
          <div style="background:#f8f9fa;padding:15px;border-radius:12px;margin:8px 0;white-space:pre-wrap;">${esc(context || 'No details provided')}</div>
          <p style="color:#80868b;font-size:12px;margin-top:16px;">Sent from the HITROO website · ${timestamp}</p>
        </div>`,
            text: `${subject}\n\n${name ? `Name: ${name}\n` : ''}${email ? `Email: ${email}\n` : ''}${phone ? `Phone: ${phone}\n` : ''}\nMessage:\n${context || 'No details provided'}\n\nSent from the HITROO website · ${timestamp}`,
        });

        // 2) Send the visitor a friendly acknowledgment (best-effort)
        if (email) {
            try {
                await transporter.sendMail({
                    from: `HITROO <${process.env.GMAIL_USER}>`,
                    to: email,
                    subject: 'We\'ve received your message — HITROO',
                    html: acknowledgmentEmail({
                        heading: `Thanks${name ? `, ${esc(name)}` : ''} — your message<br/>is <span style="color:#4285F4;">in</span>.`,
                        intro: 'A member of the HITROO team will get back to you within a day. Here&rsquo;s a copy of what you sent us.',
                        recapLabel: 'Your message',
                        recapBody: esc(context || 'No details provided'),
                    }),
                    text: `Thanks${name ? `, ${name}` : ''} — we've received your message and will get back to you within a day.\n\nYour message:\n${context || 'No details provided'}\n\nNeed us sooner? info@hitroo.com · +91 7550000805\n\nHITROO — Intelligence, Unbound · Chennai, Tamil Nadu, India`,
                });
            } catch (ackErr) {
                console.error('Acknowledgment email failed (non-fatal):', ackErr);
            }
        }

        return NextResponse.json({ success: true, message: 'Submitted successfully' });
    } catch (error) {
        console.error('Email send error:', error);
        return NextResponse.json(
            { error: 'Failed to submit. Please email us directly at info@hitroo.com.' },
            { status: 500 }
        );
    }
}
