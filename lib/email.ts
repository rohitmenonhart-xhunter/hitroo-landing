// Shared email building blocks for HITROO transactional emails.
import { COMPANY, DIVISIONS } from './site-data';

export const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const SITE = 'https://www.hitroo.com';
/** Images live in public/email/ (JPEG: Outlook shows no WebP). hero.jpg is the glass wordmark, rendered by the film's engine. */
const IMG = `${SITE}/email`;

// The site's palette and faces (warm paper, char ink, one ember accent). Clients without web fonts fall back to the system sans.
const PAPER = '#FCF8F6';
const CHAR = '#12110B';
const EMBER = '#F5502F';
const SAND = '#F3EEE8';
const STONE = '#6F6A61';
const LINE = '#E7E0D8';
const DISPLAY = "'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const TEXT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

interface AckOptions {
  /** Small label above the headline, e.g. "Message received". */
  caption: string;
  /** The sender's name (escaped here), or empty. */
  name?: string;
  /** The headline's second line, set in ember, e.g. "We’ll reply within a day." */
  promise: string;
  /** Intro paragraph (HTML; the caller escapes user input). */
  intro: string;
  /** "What happens next", in order. Omit to leave the card out. */
  steps?: { title: string; text: string }[];
  /** Label above the copy of what they sent, e.g. "Your message". */
  recapLabel: string;
  /** The copy of what they sent (the caller escapes user input). */
  recapBody: string;
  /** Inbox preview text. */
  preheader: string;
}

/**
 * The acknowledgment a visitor gets after writing to HITROO, in the site's look: warm paper, the glass wordmark,
 * Plus Jakarta Sans headlines, ember as the only colour, white and sand cards. Table layout with inline styles so it
 * holds up in Gmail, Apple Mail and Outlook.
 */
export function acknowledgmentEmail({ caption, name, promise, intro, steps, recapLabel, recapBody, preheader }: AckOptions) {
  const hello = name ? `Thanks, ${esc(name)}.` : 'Thank you.';
  const stepRows = (steps ?? [])
    .map(
      (s, i) => `
                <tr>
                  <td valign="top" width="52" style="padding:${i ? '18px' : '0'} 0 0;font-family:${DISPLAY};font-size:20px;font-weight:800;letter-spacing:-0.03em;color:${EMBER};">${String(i + 1).padStart(2, '0')}</td>
                  <td valign="top" style="padding:${i ? '18px' : '0'} 0 0;">
                    <div style="font-family:${DISPLAY};font-size:18px;font-weight:800;letter-spacing:-0.02em;color:${CHAR};line-height:1.3;">${s.title}</div>
                    <div style="font-family:${TEXT};font-size:15px;line-height:1.55;color:${STONE};margin-top:2px;">${s.text}</div>
                  </td>
                </tr>`
    )
    .join('');
  const divisionCell = (d: (typeof DIVISIONS)[number]) => `
                  <td valign="top" width="50%" class="dcell" style="padding:0 8px 16px;">
                    <a href="${SITE}/${d.slug}" style="text-decoration:none;color:${CHAR};display:block;">
                      <img src="${IMG}/${d.slug}.jpg" width="252" alt="" style="display:block;width:100%;max-width:252px;height:auto;border:0;border-radius:18px;" />
                      <div style="font-family:${DISPLAY};font-size:18px;font-weight:800;letter-spacing:-0.03em;color:${CHAR};margin-top:12px;">${esc(d.name)}</div>
                      <div style="font-family:${TEXT};font-size:14px;line-height:1.5;color:${STONE};margin-top:2px;">${esc(d.line)}</div>
                    </a>
                  </td>`;
  const [a, b, c, d] = DIVISIONS;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light" />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />
<style>
  @media (max-width: 520px) {
    .pad { padding-left: 22px !important; padding-right: 22px !important; }
    .h1 { font-size: 32px !important; }
    .card { padding: 24px 22px !important; }
    .dcell { padding-left: 5px !important; padding-right: 5px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${PAPER};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${PAPER};">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${PAPER}" style="background:${PAPER};">
    <tr>
      <td align="center" style="padding:24px 12px 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
          <tr>
            <td align="center" style="padding:0;">
              <a href="${SITE}" style="display:block;"><img src="${IMG}/hero.jpg" width="600" alt="hitroo" style="display:block;width:100%;max-width:600px;height:auto;border:0;" /></a>
            </td>
          </tr>
          <tr>
            <td class="pad" style="padding:8px 44px 0;">
              <div style="font-family:${TEXT};font-size:13px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:${CHAR};"><span style="color:${EMBER};">&#9670;</span>&nbsp;&nbsp;${esc(caption)}</div>
              <h1 class="h1" style="margin:18px 0 0;font-family:${DISPLAY};font-size:42px;line-height:1.02;font-weight:800;letter-spacing:-0.045em;color:${CHAR};">${hello}<br /><span style="color:${EMBER};">${promise}</span></h1>
              <p style="margin:18px 0 0;font-family:${TEXT};font-size:17px;line-height:1.6;color:${STONE};">${intro}</p>
            </td>
          </tr>
          ${
            stepRows
              ? `<tr>
            <td class="pad" style="padding:30px 44px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="background:#FFFFFF;border-radius:28px;">
                <tr><td class="card" style="padding:30px 34px;">
                  <div style="font-family:${TEXT};font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${STONE};margin:0 0 18px;">What happens next</div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stepRows}
                  </table>
                </td></tr>
              </table>
            </td>
          </tr>`
              : ''
          }
          <tr>
            <td class="pad" style="padding:16px 44px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${SAND}" style="background:${SAND};border-radius:24px;">
                <tr><td class="card" style="padding:24px 30px;">
                  <div style="font-family:${TEXT};font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${STONE};margin:0 0 10px;">${esc(recapLabel)}</div>
                  <div style="font-family:${TEXT};font-size:15px;line-height:1.6;color:${CHAR};white-space:pre-wrap;">${recapBody}</div>
                </td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="pad" style="padding:30px 44px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td bgcolor="${EMBER}" style="border-radius:999px;background:${EMBER};">
                  <a href="${SITE}" style="display:inline-block;padding:15px 30px;font-family:${DISPLAY};font-size:16px;font-weight:800;letter-spacing:-0.01em;color:#FFFFFF;text-decoration:none;border-radius:999px;">Explore hitroo.com&nbsp;&rarr;</a>
                </td>
              </tr></table>
            </td>
          </tr>
          <tr>
            <td class="pad" style="padding:44px 36px 0;">
              <div style="font-family:${TEXT};font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${STONE};margin:0 8px 16px;">What we do</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>${divisionCell(a)}${divisionCell(b)}
                </tr>
                <tr>${divisionCell(c)}${divisionCell(d)}
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="pad" style="padding:20px 44px 0;">
              <p style="margin:0;font-family:${TEXT};font-size:15px;line-height:1.7;color:${STONE};">
                Need us sooner? <a href="mailto:${COMPANY.email}" style="color:${CHAR};font-weight:600;text-decoration:none;border-bottom:2px solid ${EMBER};">${COMPANY.email}</a>
                &nbsp;&middot;&nbsp; <a href="tel:${COMPANY.phone.replace(/\s/g, '')}" style="color:${CHAR};font-weight:600;text-decoration:none;border-bottom:2px solid ${EMBER};">${COMPANY.phone.replace(' ', '&nbsp;')}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td class="pad" style="padding:34px 44px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="border-top:1px solid ${LINE};padding-top:22px;">
                  <div style="font-family:${DISPLAY};font-size:26px;font-weight:800;letter-spacing:-0.05em;color:${CHAR};line-height:1;"><span style="color:${EMBER};">hi</span>troo</div>
                  <p style="margin:10px 0 0;font-family:${TEXT};font-size:13px;line-height:1.6;color:${STONE};">${esc(COMPANY.location)}</p>
                  <p style="margin:14px 0 0;font-family:${TEXT};font-size:12px;line-height:1.6;color:#A39C92;">You received this because you contacted HITROO.</p>
                </td>
              </tr></table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
