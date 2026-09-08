/**
 * Sliding-window rate limiter for public endpoints.
 *
 * ponytail: in-memory, so it resets on restart and is per-instance. That is
 * the right trade for a single-server deploy — it stops someone scripting
 * thousands of fake leads, which is the actual threat. If this ever runs on
 * more than one instance, move the counter to the database or Redis.
 */

type Hit = { count: number; resetAt: number }

const buckets = new Map<string, Hit>()

/** Stop the map growing without bound on a long-running server. */
const sweep = (now: number) => {
  if (buckets.size < 5000) return
  for (const [key, hit] of buckets) {
    if (hit.resetAt <= now) buckets.delete(key)
  }
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  /** Seconds until the window resets — for the Retry-After header. */
  retryAfter: number
}

export const rateLimit = (key: string, limit: number, windowMs: number): RateLimitResult => {
  const now = Date.now()
  sweep(now)

  const hit = buckets.get(key)
  if (!hit || hit.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfter: 0 }
  }

  hit.count += 1
  const retryAfter = Math.ceil((hit.resetAt - now) / 1000)
  if (hit.count > limit) {
    return { allowed: false, remaining: 0, retryAfter }
  }
  return { allowed: true, remaining: limit - hit.count, retryAfter }
}

/**
 * Best-effort client address. Behind a proxy (every managed host) the socket
 * address is the proxy, so the forwarded headers are what identify the caller.
 */
export const clientKey = (request: Request): string => {
  const headers = request.headers
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return headers.get('x-real-ip') || headers.get('cf-connecting-ip') || 'unknown'
}

/** Exposed for tests. */
export const _resetRateLimits = () => buckets.clear()
