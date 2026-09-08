/** Self-check for the limiter guarding the public enquiry form. */
import assert from 'node:assert/strict'
import { rateLimit, clientKey, _resetRateLimits } from './rate-limit'

_resetRateLimits()

// Five through, sixth blocked.
for (let i = 1; i <= 5; i++) {
  assert.equal(rateLimit('a', 5, 60_000).allowed, true, `request ${i} should pass`)
}
const blocked = rateLimit('a', 5, 60_000)
assert.equal(blocked.allowed, false, 'sixth request is blocked')
assert.ok(blocked.retryAfter > 0, 'blocked responses say when to retry')

// One noisy caller must not affect anyone else.
assert.equal(rateLimit('b', 5, 60_000).allowed, true, 'a different caller is unaffected')

// The window expires.
_resetRateLimits()
assert.equal(rateLimit('c', 1, 1).allowed, true)
await new Promise((r) => setTimeout(r, 10))
assert.equal(rateLimit('c', 1, 1).allowed, true, 'a new window lets them through again')

// Caller identity comes from the proxy headers, first entry in the chain.
const req = (h: Record<string, string>) => new Request('http://x', { headers: h })
assert.equal(clientKey(req({ 'x-forwarded-for': '1.2.3.4, 10.0.0.1' })), '1.2.3.4')
assert.equal(clientKey(req({ 'x-real-ip': '5.6.7.8' })), '5.6.7.8')
assert.equal(clientKey(req({})), 'unknown')

console.log('rate limit: all assertions passed')
