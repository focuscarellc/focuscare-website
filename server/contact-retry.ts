import { retryEnquiries, type ContactEnv } from './contact'

export default {
  fetch() { return new Response('Not found.', { status: 404 }) },
  async scheduled(_event: unknown, env: ContactEnv) { await retryEnquiries(env) },
}
