import { PostHog } from 'posthog-node'

export type AnalyticsEnv = { POSTHOG_PROJECT_TOKEN?: string; POSTHOG_HOST?: string }

// Aggregate API outcomes only. Never pass request bodies, visitor details or errors.
export async function captureChecklistOutcome(env: AnalyticsEnv, status: number): Promise<void> {
  if (!env.POSTHOG_PROJECT_TOKEN || !env.POSTHOG_HOST) return
  let client: PostHog | undefined
  try {
    client = new PostHog(env.POSTHOG_PROJECT_TOKEN, {
      host: env.POSTHOG_HOST, flushAt: 1, flushInterval: 0,
      requestTimeout: 2000, fetchRetryCount: 0
    })
    client.capture({
      distinctId: crypto.randomUUID(),
      event: status === 200 ? 'checklist request completed' : 'checklist request rejected',
      properties: { site: 'focuscare-services', source: 'server', status, $process_person_profile: false }
    })
  } catch { /* Analytics never changes the API result. */ }
  finally { try { await client?.shutdown(); } catch {} }
}
