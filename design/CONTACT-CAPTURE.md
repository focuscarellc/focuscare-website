# Services enquiry capture

`/contact` submits to `/api/contact` in the existing Pages worker. It no longer prepares an email draft. Email and phone alternatives remain available. The client retains fields on failure and only shows a receipt after the server confirms a durable write. JavaScript failure leaves direct contact options visible. Contact JS, shared CSS and the analytics entry module use content fingerprints in their URLs so returning visitors cannot combine new HTML with cached pre-release handlers.

The server validates bounded JSON, same-origin requests, a honeypot and a signed challenge at least three seconds old. A challenge's UUID is the submission ID. Matching retries return the original receipt; concurrent retries cannot create duplicate records. Changing a saved payload requires a fresh challenge. Requests are limited to five accepted enquiries per derived network key per hour and 80 accepted enquiries per UTC day. These operational limits return an explicit error with the visitor's entries retained. No third-party captcha or paid plan was added.

`CONTACT_DB` stores the name, normalized email, workflow, message, test/internal flags and delivery state. It stores a daily keyed network hash instead of the visitor's IP. Contact fields never enter analytics or logs. New enquiries do not join a marketing list.

Resend delivers a plain-text owner notification from the existing verified `mail.focuscarellc.com` sender to the fixed recipient `jovanie@focuscarellc.com`, with the visitor address as Reply-To. D1 is authoritative for acceptance and counts. A provider failure cannot discard an accepted enquiry or cause a false delivery claim.

The separate `focuscare-contact-retry` worker has no public routes, returns 404 for fetch, and retries the durable outbox every five minutes. It atomically leases each row, uses the same `focuscare-enquiry/<id>` provider idempotency key, and backs off transient failures. Permanent errors, twelve failed attempts, or a 23-hour retry window require operator review. This stops automatic resend before Resend's 24-hour idempotency window expires. Inspect `delivery_status='failed'`; do not blindly resend after that window without checking provider/mailbox delivery.

## Release

Non-secret resource identifiers are in `server/contact-release.json`; the schema is in `server/contact-schema.sql`. Configure production Pages bindings `CONTACT_DB`, server-only `CONTACT_FORM_SECRET`, and the existing `RESEND_API_KEY`. Preview environments must not have these production bindings. The handler also rejects preview hostnames. Keep the existing PostHog variables and Pages compatibility settings.

Build and deploy Pages through the existing GitHub main release using `npm run pages:build`. Build the retry worker with `node scripts/build-contact-retry.mjs`; upload that ESM module through the Cloudflare Workers API with the same D1 binding and server-only Resend secret. Use the compatibility date in the release file, enable logs/traces, disable workers.dev/preview URLs and attach the recorded cron. Never copy secrets into source, command arguments or reports.

Run `npm run typecheck`, build Pages, then `scripts/check-contact.mjs` with `MINIFLARE_MODULE` pointing to the installed Miniflare package and `EVIDENCE_DIR` pointing to the task's report folder. Its workerd/D1 fixtures block all real outbound traffic. `check-analytics.cjs` uses a dummy configured build and intercepts all traffic; it verifies the optional accepted-enquiry event contains no fields. Existing route and content checks also cover the replacement form.

Verify production with one clearly marked owner-address test: confirm a visible receipt, exactly one D1 row marked test/internal, and actual arrival in the owner mailbox. Exclude it from all counts. Never count `contact draft prepared`, CTA clicks or a provider send response as a real delivered enquiry.

## Count

Count distinct normalized emails for the requested UTC window, excluding `is_test`, `is_internal` and reviewed spam. Pending/failed delivery rows still represent saved enquiries and must appear separately in delivery-health checks.

```sql
SELECT count(DISTINCT lower(trim(email))) AS real_leads
FROM contact_enquiries
WHERE created_at >= '2026-11-12T21:30:00.000Z'
  AND created_at < :observed_at_utc
  AND is_test = 0 AND is_internal = 0 AND is_spam = 0;
```

## Rollback

Roll Pages back to its recorded prior deployment, then revert the release commit through GitHub so later pushes do not restore the form. Keep the database and captured enquiries. Disable the retry cron only when required; preserve rows for review. Removing capture bindings or deleting the database is not part of rollback and can lose enquiries. A code rollback does not roll back D1 data or secrets. Existing dashboards and report subscriptions are untouched.
