import { retryEnquiries, type ContactEnv } from './contact'
import { retryResourceRequests } from './resource'

export default {
  fetch() { return new Response('Not found.', { status: 404 }) },
  async scheduled(_event: unknown, env: ContactEnv) {
    await retryEnquiries(env)
    await retryResourceRequests(env)
  },
}
