// Shared email building blocks for HITROO transactional emails.

export const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const SITE = 'https://hitroo.com';

interface AckOptions {
  /** HTML for the headline (caller escapes any user input; may include a styled <span>). */
  heading: string;
  /** Plain intro paragraph text. */
  intro: string;
  /** Uppercase label above the recap panel, e.g. "Your message". */
  recapLabel: string;
  /** Recap body (caller escapes user input). */
  recapBody: string;
}

/**
 * A polished, email-client-safe (table-based, inline styles) acknowledgment
 * email matching the HITROO site design. Renders across Gmail / Apple Mail / Outlook.
 */
export function acknowledgmentEmail({ heading, intro, recapLabel, recapBody }: AckOptions) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border:1px solid #ededed;border-radius:24px;overflow:hidden;">
          <tr>
            <td style="font-size:0;line-height:0;padding:0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td width="25%" height="6" style="background:#0a0a0a;font-size:0;line-height:0;">&nbsp;</td>
                <td width="25%" height="6" style="background:#2a2a2a;font-size:0;line-height:0;">&nbsp;</td>
                <td width="25%" height="6" style="background:#5a5a5a;font-size:0;line-height:0;">&nbsp;</td>
                <td width="25%" height="6" style="background:#8a8a8a;font-size:0;line-height:0;">&nbsp;</td>
              </tr></table>
            </td>
          </tr>
          <tr>
            <td style="padding:42px 42px 38px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <div style="font-size:18px;font-weight:700;letter-spacing:-0.01em;color:#0a0a0a;margin:0 0 30px;">HITROO</div>

              <h1 style="margin:0 0 14px;font-size:28px;line-height:1.15;font-weight:700;letter-spacing:-0.02em;color:#0a0a0a;">${heading}</h1>
              <p style="margin:0 0 26px;font-size:15px;line-height:1.65;color:#4a4a4a;">${intro}</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;border-radius:16px;margin:0 0 30px;">
                <tr><td style="padding:18px 20px;">
                  <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#8a8a8a;font-weight:600;margin:0 0 8px;">${recapLabel}</div>
                  <div style="font-size:14px;line-height:1.6;color:#2a2a2a;white-space:pre-wrap;">${recapBody}</div>
                </td></tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 32px;"><tr>
                <td align="center" bgcolor="#0a0a0a" style="border-radius:999px;">
                  <a href="${SITE}" style="display:inline-block;padding:14px 30px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Explore HITROO &rarr;</a>
                </td>
              </tr></table>

              <p style="margin:0;font-size:14px;line-height:1.6;color:#4a4a4a;">
                Need us sooner? <a href="mailto:info@hitroo.com" style="color:#0a0a0a;text-decoration:none;font-weight:600;">info@hitroo.com</a>
                &nbsp;&middot;&nbsp; <a href="tel:+917550000805" style="color:#0a0a0a;text-decoration:none;font-weight:600;">+91&nbsp;7550000805</a>
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;"><tr>
                <td style="border-top:1px solid #ededed;padding-top:20px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 10px;"><tr>
                    <td width="11" style="font-size:0;"><div style="width:7px;height:7px;border-radius:9px;background:#0a0a0a;"></div></td>
                    <td width="11" style="font-size:0;"><div style="width:7px;height:7px;border-radius:9px;background:#2a2a2a;"></div></td>
                    <td width="11" style="font-size:0;"><div style="width:7px;height:7px;border-radius:9px;background:#5a5a5a;"></div></td>
                    <td width="11" style="font-size:0;"><div style="width:7px;height:7px;border-radius:9px;background:#8a8a8a;"></div></td>
                  </tr></table>
                  <p style="margin:0;font-size:13px;line-height:1.6;color:#8a8a8a;">
                    <strong style="color:#0a0a0a;">HITROO</strong> &mdash; Intelligence, Unbound<br/>
                    Chennai, Tamil Nadu, India
                  </p>
                </td>
              </tr></table>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-size:12px;color:#b0b0b0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">You received this because you contacted HITROO.</p>
      </td>
    </tr>
  </table>`;
}
