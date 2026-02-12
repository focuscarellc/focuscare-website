import { NextRequest, NextResponse } from "next/server"

export const runtime = 'edge'

// Lead capture endpoint for compliance kit downloads
// Stores leads and can forward to webhook/email service

interface LeadData {
  email: string
  name?: string
  company?: string
  timestamp: string
  source: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, company } = body

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      )
    }

    const leadData: LeadData = {
      email: email.toLowerCase().trim(),
      name: name?.trim() || "",
      company: company?.trim() || "",
      timestamp: new Date().toISOString(),
      source: "compliance-kit-download",
    }

    // Log for debugging (visible in Cloudflare Pages logs)
    console.log("[Lead Captured]", JSON.stringify(leadData))

    // Option 1: Forward to n8n webhook (if configured)
    const webhookUrl = process.env.LEAD_WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadData),
        })
      } catch (webhookError) {
        console.error("[Webhook Error]", webhookError)
        // Don't fail the request if webhook fails
      }
    }

    // Option 2: Send to Mailjet (if configured)
    const mailjetApiKey = process.env.MAILJET_API_KEY
    const mailjetSecretKey = process.env.MAILJET_SECRET_KEY
    if (mailjetApiKey && mailjetSecretKey) {
      try {
        // Add to Mailjet contact list
        const auth = btoa(`${mailjetApiKey}:${mailjetSecretKey}`)
        await fetch("https://api.mailjet.com/v3/REST/contact", {
          method: "POST",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Email: leadData.email,
            Name: leadData.name,
            IsExcludedFromCampaigns: false,
          }),
        })
      } catch (mailjetError) {
        console.error("[Mailjet Error]", mailjetError)
      }
    }

    // Return success with download link
    return NextResponse.json({
      success: true,
      message: "Thank you! Check your email for the download link.",
      downloadUrl: "https://focuscarellc.gumroad.com/l/free-inspection-checklist",
    })

  } catch (error) {
    console.error("[API Error]", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
