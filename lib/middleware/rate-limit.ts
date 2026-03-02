import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { isRedisAvailable } from '@/lib/redis'

// Initialize ratelimiter only if Redis is configured
const ratelimit = isRedisAvailable()
  ? new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      prefix: 'ratelimit:api',
    })
  : null

export interface RateLimitResult {
  success: boolean
  headers: Record<string, string>
  remaining: number
}

/**
 * Checks rate limit for a given identifier (usually IP).
 * If Redis is not configured, allows all requests (graceful degradation).
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  if (!ratelimit) {
    return { success: true, headers: {}, remaining: 100 }
  }

  const { success, limit, reset, remaining } = await ratelimit.limit(identifier)

  return {
    success,
    remaining,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': new Date(reset).toISOString(),
    },
  }
}

/**
 * Extracts client IP from Next.js request headers.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}
