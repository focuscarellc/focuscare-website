import { handleComplianceKit } from "@/server/compliance-kit"
export const runtime = "edge"

// Thin wrapper: the shared handler owns the guards and response contract.
export function POST(req: Request) {
  return handleComplianceKit(req, {
    LEAD_WEBHOOK_URL: process.env.LEAD_WEBHOOK_URL,
    MAILJET_API_KEY: process.env.MAILJET_API_KEY,
    MAILJET_SECRET_KEY: process.env.MAILJET_SECRET_KEY,
  })
}
