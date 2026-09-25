# Public-surface anti-bot protection

The site's public write endpoints are protected in layers. The site runs on Vercel, which
never applied the old Netlify edge rules, so every limit lives in the code.

1. **Per-visitor rate limits** (`submissionLimited` in `lib/lead-protection.ts`): enquiries
   5 a minute and 20 an hour per IP, applications 3 a minute and 10 an hour. Over the limit
   the API answers 429 before reading the body. Counts are kept in memory per server
   instance, so they blunt floods rather than set a hard global ceiling.
2. **Request checks**: same-origin JSON only, size limits (16 KiB for enquiries, a verified
   PDF of at most 3 MB for applications), strict field schemas, email syntax and
   international phone formats.
3. **Traps**: a visually hidden honeypot, a minimum form-completion time and a narrow check
   for the observed second-phone-number spam pattern silently discard common automated
   submissions without storing or emailing them. The reason is logged without the contact
   details.
4. **Email caps** (`mayAcknowledge`, `mayNotify`): the acknowledgment email goes to each
   address at most once an hour and 30 an hour in all, so the forms can't be used to send
   HITROO emails to someone else's inbox in bulk. Team notifications stop at 60 an hour.
   Past a cap the submission is still stored and shows in the admin.
5. **Cloudflare Turnstile** (optional, recommended): server-verified bot detection. Tokens
   are checked for the `contact` or `careers` action, expire after Cloudflare's validity
   window and cannot be reused.

Analytics (`/api/track`) and consent (`/api/consent`) accept 120 and 20 requests a minute
per IP, drop known bots and never store IP addresses.

## Enable Turnstile

A distributed or browser-driven bot can get past rate limits and simple traps; Turnstile
stops most of them.

1. In Cloudflare Turnstile, create a widget for `hitroo.com` and `www.hitroo.com`.
2. Set both keys on the Vercel project `hitroo-landing`, then push to `main` to redeploy:

   ```bash
   vercel env add TURNSTILE_SITE_KEY production --project hitroo-landing
   vercel env add TURNSTILE_SECRET_KEY production --project hitroo-landing --sensitive
   ```

3. Submit one real enquiry and one application; confirm the emails arrive and that
   Turnstile Analytics shows successful server-side validations.

Both keys must be set. With neither (or only one), the widget and verification stay off so
a configuration mistake can't take the forms offline; the other layers still apply and the
server logs the incomplete configuration. If Turnstile is configured but Cloudflare can't
be reached, the API fails closed and asks the visitor to email info@hitroo.com.

For local testing use Cloudflare's documented test keys; never deploy them.
