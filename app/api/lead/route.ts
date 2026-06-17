import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Where website messages are delivered. Override with LEAD_EMAIL_RECIPIENT.
const RECIPIENT = process.env.LEAD_EMAIL_RECIPIENT || 'info@hitroo.com';
const SITE = 'https://hitroo.com';

const esc = (s: unknown) =>
    String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Beautiful, email-client-safe acknowledgment for the visitor (table-based).
function acknowledgmentHtml(name: string, context: string) {
    const msg = esc(context || 'No details provided');
    const hi = name ? `, ${esc(name)}` : '';
    return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border:1px solid #ececf0;border-radius:24px;overflow:hidden;">
          <tr>
            <td style="font-size:0;line-height:0;padding:0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td width="25%" height="6" style="background:#4285F4;font-size:0;line-height:0;">&nbsp;</td>
                <td width="25%" height="6" style="background:#EA4335;font-size:0;line-height:0;">&nbsp;</td>
                <td width="25%" height="6" style="background:#FBBC05;font-size:0;line-height:0;">&nbsp;</td>
                <td width="25%" height="6" style="background:#34A853;font-size:0;line-height:0;">&nbsp;</td>
              </tr></table>
            </td>
          </tr>
          <tr>
            <td style="padding:42px 42px 38px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <div style="font-size:18px;font-weight:700;letter-spacing:-0.01em;color:#202124;margin:0 0 30px;">HITROO</div>

              <h1 style="margin:0 0 14px;font-size:28px;line-height:1.15;font-weight:700;letter-spacing:-0.02em;color:#202124;">
                Thanks${hi} — your message<br/>is <span style="color:#4285F4;">in</span>.
              </h1>
              <p style="margin:0 0 26px;font-size:15px;line-height:1.65;color:#5f6368;">
                A member of the HITROO team will get back to you within a day. Here&rsquo;s a copy of what you sent us.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f8fa;border-radius:16px;margin:0 0 30px;">
                <tr><td style="padding:18px 20px;">
                  <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9aa0a6;font-weight:600;margin:0 0 8px;">Your message</div>
                  <div style="font-size:14px;line-height:1.6;color:#3c4043;white-space:pre-wrap;">${msg}</div>
                </td></tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 32px;"><tr>
                <td align="center" bgcolor="#202124" style="border-radius:999px;">
                  <a href="${SITE}" style="display:inline-block;padding:14px 30px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Explore HITROO &rarr;</a>
                </td>
              </tr></table>

              <p style="margin:0;font-size:14px;line-height:1.6;color:#5f6368;">
                Need us sooner? <a href="mailto:info@hitroo.com" style="color:#4285F4;text-decoration:none;font-weight:600;">info@hitroo.com</a>
                &nbsp;&middot;&nbsp; <a href="tel:+917550000805" style="color:#4285F4;text-decoration:none;font-weight:600;">+91&nbsp;7550000805</a>
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;"><tr>
                <td style="border-top:1px solid #ececf0;padding-top:20px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 10px;"><tr>
                    <td width="9" style="font-size:0;"><div style="width:7px;height:7px;border-radius:9px;background:#4285F4;"></div></td>
                    <td width="9" style="font-size:0;"><div style="width:7px;height:7px;border-radius:9px;background:#EA4335;"></div></td>
                    <td width="9" style="font-size:0;"><div style="width:7px;height:7px;border-radius:9px;background:#FBBC05;"></div></td>
                    <td width="9" style="font-size:0;"><div style="width:7px;height:7px;border-radius:9px;background:#34A853;"></div></td>
                  </tr></table>
                  <p style="margin:0;font-size:13px;line-height:1.6;color:#9aa0a6;">
                    <strong style="color:#202124;">HITROO</strong> &mdash; Intelligence, Unbound<br/>
                    Chennai, Tamil Nadu, India
                  </p>
                </td>
              </tr></table>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-size:12px;color:#b0b4ba;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">You received this because you contacted HITROO.</p>
      </td>
    </tr>
  </table>`;
}

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
                    html: acknowledgmentHtml(name, context),
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
