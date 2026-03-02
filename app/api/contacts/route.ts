import { NextResponse } from 'next/server'
import { contactDb } from '@/lib/supabase-db'
import {
  CreateContactSchema,
  DeleteContactsSchema,
  validateBody,
  formatZodErrors
} from '@/lib/api-validation'
import { createErrorResponse } from '@/lib/middleware/error-handler'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/contacts
 * List all contacts from Turso
 */
export async function GET() {
  try {
    const contacts = await contactDb.getAll()
    return NextResponse.json(contacts, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * POST /api/contacts
 * Add a single contact
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validation = validateBody(CreateContactSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: formatZodErrors(validation.error) },
        { status: 400 }
      )
    }

    const contact = await contactDb.add(validation.data)
    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * DELETE /api/contacts
 * Delete multiple contacts by IDs
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validation = validateBody(DeleteContactsSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: formatZodErrors(validation.error) },
        { status: 400 }
      )
    }

    const deleted = await contactDb.deleteMany(validation.data.ids)
    return NextResponse.json({ deleted })
  } catch (error) {
    return createErrorResponse(error)
  }
}
