# Public-surface anti-bot protection

The site's public, bot-abusable server endpoints are protected in layers:

1. Netlify blocks more than five requests to `/api/lead` per IP and domain in
   a 60-second window before the server function runs.
2. The API accepts only same-origin JSON requests up to 16 KiB and validates
   field types, lengths, email syntax, and international phone formatting.
3. A visually hidden honeypot, a minimum form-completion signal, and a narrow
   content check for the observed second-phone-number spam pattern silently
   discard common automated submissions without sending either email. The
   discard reason is recorded in server logs without logging the submitted
   contact details.
4. Cloudflare Turnstile can be enabled for server-verified bot detection.
   Tokens are checked for the `contact` action, expire after Cloudflare's
   validity window, and cannot be reused.

The careers form uses the same honeypot, timing, Turnstile, origin, and payload
controls, plus strict application fields and a verified PDF-only 5 MB upload
limit. Netlify permits three career submissions per IP per minute.

The legacy AI chat endpoint is same-origin, accepts at most 500 characters,
times out upstream calls, and is limited to ten requests per IP per minute.
Admin content mutations use bounded schemas, constant-time password comparison,
same-origin enforcement, and a fifteen-request-per-minute edge limit; public
content reads are cached briefly to reduce origin load.

## Enable Turnstile on Netlify

Turnstile is optional in code but recommended for production because a
distributed or browser-driven bot can bypass rate limits and simple traps.

1. In Cloudflare Turnstile, create a widget for `hitroo.com` and every hostname
   that should accept the contact and careers forms (for example
   `www.hitroo.com`). Use a separate test widget for previews if preview forms
   must work.
2. In the Netlify project's environment variables, set:

   - `TURNSTILE_SITE_KEY` to the widget's public site key.
   - `TURNSTILE_SECRET_KEY` to the corresponding private secret key.

3. Redeploy the site so the Next.js functions receive the variables.
4. Check the deploy log's post-processing stage and confirm Netlify reports the
   `/api/lead`, `/api/careers`, `/api/chat`, and `/api/content` rate-limit
   rules. Netlify documents that an invalid rate-limit rule may not fail the
   deployment.
5. Submit one real enquiry and confirm both the team notification and visitor
   acknowledgment arrive. Then check Turnstile Analytics for a successful
   server-side token validation.

Both Turnstile variables must be present. With neither (or only one) configured,
the widget and verification are disabled so a configuration mistake does not
take the contact form offline; the other defenses remain active and the server
logs incomplete configuration. If Turnstile is configured but Cloudflare's
verification service cannot be reached, the API fails closed and asks the
visitor to use `info@hitroo.com`.

For local automated testing, use Cloudflare's documented test site key and
matching test secret. Never deploy test keys to production.
