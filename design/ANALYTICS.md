# Focus Care website analytics

Scope: the services website at focuscarellc.com. The SaaS application and other websites are excluded.

## Configuration

Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` as both build and runtime environment variables for the intended PostHog project. The browser project token is public configuration; never add a personal API key to the site. No real token belongs in source or `.env.example`.

Missing configuration leaves the website working with analytics disabled. The build emits a development warning. Preview hostnames and the 404 page do not collect events.

## Collection

Visitors choose Allow analytics or Decline. The SDK loads only after consent. Analytics preferences in the footer can withdraw or restore consent. DNT and Global Privacy Control disable collection. Cookie names and scope are isolated from the SaaS subdomain.

Autocapture, session recordings, surveys, heatmaps and automatic exception collection are disabled. Only approved event properties are retained. URLs lose query strings and fragments. Contact fields are never included. There are no identify calls or person profiles.

Events:

| Event | Meaning |
| --- | --- |
| `$pageview`, `$pageleave` | Consented visits and page engagement |
| `service link clicked`, `workflow selected` | Interest in one of the six services |
| `contact CTA clicked` | Contact intent, with service and placement |
| `contact draft prepared` | Valid local draft, not an enquiry sent |
| `email app opened`, `email link clicked`, `phone link clicked` | Contact-channel intent, not delivery |
| `checklist link clicked`, `software link clicked` | Resource/product interest |
| `checklist request completed`, `checklist request rejected` | Aggregate API outcomes, with explicit analytics-consent header |

Browser events include `site: focuscare-services`. Dashboard and daily-report queries must filter this site, the exact website hostname, and `is_test != true`. SDK bot filtering remains enabled for normal visits. `?analytics_test=1` permits deliberate automated verification and marks those events as test traffic.

Server events contain only the status, site and source. They use a random anonymous ID and never receive the request body or care records. Analytics failures are handled in background work and cannot change the API response.

## Daily report

Suggested scope: previous complete Dubai calendar day, compared with the preceding day and a recent baseline. Include consenting visitors, pageviews, popular service pages, traffic sources, contact CTA clicks and drafts prepared. Explicitly distinguish intent from confirmed enquiries. Show zero or missing data honestly, with no historical backfill claim.

The target project, delivery time and optional first test delivery must be confirmed before activation. Check for an existing report before creating one. Native PostHog subscriptions require subscription read/write access; a separately authorized email schedule can deliver from the connected account when those tools are unavailable. Never change another subscription or use paid AI summaries without authorization.

## Verification

Build with dummy environment values, then run `node scripts/check-analytics.cjs` and `node scripts/check-analytics-server.mjs`. The browser harness intercepts all third-party traffic; it does not send real events. Typecheck with `npm run typecheck`. Finally rebuild without dummy values, configure the intended live project, and verify one explicitly marked test event in PostHog before enabling daily delivery.

PostHog references: [JavaScript configuration](https://posthog.com/docs/libraries/js/config), [Cloudflare Workers SDK](https://posthog.com/docs/libraries/cloudflare-workers), [bot filtering](https://posthog.com/docs/web-analytics/troubleshooting#do-stats-include-bots-and-crawlers).
