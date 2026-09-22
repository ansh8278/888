import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { rateLimit, clientKey } from '../../../lib/rate-limit'
import { enquirySchema, firstError } from '../../../lib/enquiry-schema'

/**
 * Public endpoint for the website forms.
 *
 * Deliberately NOT posting straight to Payload's /api/enquiries: the schema
 * only admits the fields a customer is allowed to set. Anything else in the
 * body (status, notes, id) is dropped rather than trusted.
 */

// A real customer submits once, maybe twice if they mistype something.
// Anything beyond this in ten minutes is a script, not a person in a lockout.
const MAX_PER_WINDOW = 5
const WINDOW_MS = 10 * 60 * 1000

export const POST = async (request: Request) => {
  const limit = rateLimit(`enquiry:${clientKey(request)}`, MAX_PER_WINDOW, WINDOW_MS)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please call us instead.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    )
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const parsed = enquirySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 })
  }
  const { company, ...data } = parsed.data

  // Honeypot: a real person never fills a hidden field. Answer 200 so bots
  // cannot tell they were caught and retry with a different shape.
  if (company) {
    return NextResponse.json({ ok: true })
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'enquiries',
      data: { ...data, status: 'new' },
    })
    return NextResponse.json({ ok: true })
  } catch {
    // Never leak internals to the public form.
    return NextResponse.json(
      { error: 'We could not save that. Please call us instead.' },
      { status: 500 },
    )
  }
}
