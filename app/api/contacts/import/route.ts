import { NextResponse } from 'next/server'
import { contactDb } from '@/lib/supabase-db'
import { ImportContactsSchema, validateBody, formatZodErrors } from '@/lib/api-validation'
import { ContactStatus } from '@/types'
import { createErrorResponse } from '@/lib/middleware/error-handler'
import { logger } from '@/lib/logger'

/**
 * POST /api/contacts/import
 * Import multiple contacts from CSV/file
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validation = validateBody(ImportContactsSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: formatZodErrors(validation.error) },
        { status: 400 }
      )
    }

    const { contacts } = validation.data

    // Map to proper format with default status
    const contactsWithDefaults = contacts.map(c => ({
      name: c.name || '',
      phone: c.phone,
      status: ContactStatus.OPT_IN,
      tags: c.tags || [],
    }))

    const imported = await contactDb.import(contactsWithDefaults)

    logger.info('Contacts imported', { imported, total: contacts.length })
    return NextResponse.json({
      imported,
      total: contacts.length,
      duplicates: contacts.length - imported
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}
