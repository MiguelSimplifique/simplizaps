import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { AppError, ErrorType } from '@/lib/errors'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

// Maps AppError types to HTTP status codes
const ERROR_STATUS_MAP: Partial<Record<ErrorType, number>> = {
  [ErrorType.VALIDATION_ERROR]: 400,
  [ErrorType.AUTHENTICATION_ERROR]: 401,
  [ErrorType.AUTHORIZATION_ERROR]: 403,
  [ErrorType.NOT_FOUND_ERROR]: 404,
  [ErrorType.RATE_LIMIT_ERROR]: 429,
  [ErrorType.SERVER_ERROR]: 500,
  [ErrorType.NETWORK_ERROR]: 502,
  [ErrorType.TIMEOUT_ERROR]: 504,
}

/**
 * Converts any thrown error into a safe JSON Response.
 * Never exposes stack traces. Always logs unexpected errors.
 */
export function createErrorResponse(error: unknown): NextResponse<ApiResponse> {
  if (error instanceof AppError) {
    const status = error.statusCode ?? ERROR_STATUS_MAP[error.type] ?? 500

    // Log 5xx errors
    if (status >= 500) {
      logger.error('API error', {
        type: error.type,
        message: error.message,
        context: error.context,
      })
    }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: error.type,
          message: error.userMessage || 'Ocorreu um erro inesperado.',
        },
      },
      { status }
    )
  }

  // Unknown/unexpected error — never expose details to client
  const err = error as { message?: string; stack?: string }
  logger.error('Unexpected error', {
    message: err.message,
    stack: err.stack,
  })

  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: {
        code: ErrorType.UNKNOWN_ERROR,
        message: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
      },
    },
    { status: 500 }
  )
}

/**
 * Wraps an API route handler with rate limiting and error handling.
 *
 * Usage:
 *   export const POST = withApiMiddleware(async (request) => {
 *     // your logic
 *     return NextResponse.json({ success: true, data: result })
 *   })
 */
import { checkRateLimit, getClientIp } from '@/lib/middleware/rate-limit'

type RouteHandler = (request: Request, context?: unknown) => Promise<NextResponse>

export function withApiMiddleware(handler: RouteHandler): RouteHandler {
  return async (request: Request, context?: unknown) => {
    const ip = getClientIp(request)
    const { success, headers, remaining } = await checkRateLimit(ip)

    if (!success) {
      logger.warn('Rate limit exceeded', { ip, remaining })
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: ErrorType.RATE_LIMIT_ERROR,
            message: 'Limite de requisições excedido. Aguarde antes de tentar novamente.',
          },
        },
        { status: 429, headers }
      )
    }

    try {
      return await handler(request, context)
    } catch (error) {
      return createErrorResponse(error)
    }
  }
}
