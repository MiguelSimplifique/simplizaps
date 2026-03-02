import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { CreateTemplateSchema } from '@/lib/whatsapp/validators/template.schema'
import { templateService } from '@/lib/whatsapp/template.service'
import { MetaAPIError } from '@/lib/whatsapp/errors'
import { createErrorResponse } from '@/lib/middleware/error-handler'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[API CREATE TEMPLATE] Incoming Payload Category:', body.category);

    // 1. Validate Body do Payload (Single vs Bulk)
    let templatesData: z.infer<typeof CreateTemplateSchema>[] = []

    if (Array.isArray(body)) {
      templatesData = body
    } else if (body.templates && Array.isArray(body.templates)) {
      templatesData = body.templates
    } else {
      templatesData = [body]
    }

    // 2. Validação Inicial (Zod) e Processamento
    const results = []
    const errors = []

    for (const temp of templatesData) {
      try {
        // Valida estrutura
        const parsed = CreateTemplateSchema.parse(temp)

        // Chama Serviço ("A Fábrica")
        const result = await templateService.create(parsed)
        results.push(result)

      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Erro desconhecido'
        logger.error('Template creation failed', { name: temp.name, error: errMsg })
        errors.push({
          name: temp.name,
          error: errMsg,
        })
      }
    }

    // 3. Resposta
    if (errors.length > 0 && results.length === 0) {
      // Falha total
      return NextResponse.json({
        error: 'Falha ao criar templates',
        details: errors
      }, { status: 400 })
    }

    if (errors.length > 0) {
      // Sucesso parcial
      return NextResponse.json({
        message: 'Alguns templates foram criados, outros falharam',
        created: results,
        failed: errors
      }, { status: 207 })
    }

    // Sucesso total
    // Retorna formato compatível com frontend (single object ou array)
    if (results.length === 1) {
      return NextResponse.json(results[0], { status: 200 })
    }

    return NextResponse.json({ templates: results }, { status: 200 })

  } catch (error) {
    return createErrorResponse(error)
  }
}
