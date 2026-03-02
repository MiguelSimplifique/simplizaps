import { NextResponse } from 'next/server'
import { campaignDb } from '@/lib/supabase-db'
import { createErrorResponse } from '@/lib/middleware/error-handler'

// Force dynamic rendering (no caching)
export const dynamic = 'force-dynamic'

interface Params {
  params: Promise<{ id: string }>
}

/**
 * GET /api/campaigns/[id]
 * Get a single campaign
 */
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const campaign = await campaignDb.getById(id)

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campanha não encontrada' },
        { status: 404 }
      )
    }

    // No cache for campaign data (needs real-time updates)
    return NextResponse.json(campaign, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * PATCH /api/campaigns/[id]
 * Update a campaign
 */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const campaign = await campaignDb.updateStatus(id, body)

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campanha não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(campaign)
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * DELETE /api/campaigns/[id]
 * Delete a campaign
 */
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params
    await campaignDb.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return createErrorResponse(error)
  }
}
