import { NextResponse } from 'next/server'
import { campaignDb, campaignContactDb } from '@/lib/supabase-db'
import { CreateCampaignSchema, validateBody, formatZodErrors } from '@/lib/api-validation'
import { createErrorResponse } from '@/lib/middleware/error-handler'
import { logger } from '@/lib/logger'

// Force dynamic - NO caching at all
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/campaigns
 * List all campaigns from Supabase (NO CACHE - always fresh)
 */
export async function GET() {
  try {
    const campaigns = await campaignDb.getAll()
    return NextResponse.json(campaigns, {
      headers: {
        // Disable ALL caching
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

interface CreateCampaignBody {
  name: string
  templateName: string
  recipients: number
  scheduledAt?: string
  selectedContactIds?: string[]
  contacts?: { name: string; phone: string }[]
  templateVariables?: string[]  // Static values for {{2}}, {{3}}, etc.
}

/**
 * POST /api/campaigns
 * Create a new campaign with contacts
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validation = validateBody(CreateCampaignSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: formatZodErrors(validation.error) },
        { status: 400 }
      )
    }

    const data = validation.data

    // Create campaign with template variables
    const campaign = await campaignDb.create({
      name: data.name,
      templateName: data.templateName,
      recipients: data.recipients,
      scheduledAt: data.scheduledAt,
      templateVariables: data.templateVariables,  // Now properly validated by Zod
    })

    // If contacts were provided, add them to campaign_contacts
    if (data.contacts && data.contacts.length > 0) {
      await campaignContactDb.addContacts(
        campaign.id,
        data.contacts.map((c, index) => ({
          contactId: `temp_${index}`,
          phone: c.phone,
          name: c.name || '',
        }))
      )
    }

    logger.info('Campaign created', { campaignId: campaign.id, name: campaign.name })
    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    return createErrorResponse(error)
  }
}
