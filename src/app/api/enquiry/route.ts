import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { rateLimit, clientKey } from '../../../lib/rate-limit'

/**
 * Public endpoint for the website forms.
 *
 * Deliberately NOT posting straight to Payload's /api/enquiries: this only
 * accepts the fields a customer is allowed to set. Anything else in the body
 * (status, notes, id) is dropped rather than trusted.
 */

const MAX = { name: 120, phone: 40, email: 200, label: 120, message: 2000 }

const clean = (value: unknown, max: number): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

const TYPES = new Set(['order', 'quote', 'contact'])

// Deliberately loose: real phone numbers arrive in many shapes and a rejected
// booking costs far more than a badly formatted one.
const looksLikePhone = (v: string) => (v.match(/\d/g) ?? []).length >= 7

// A real customer submits once, maybe twice if they mistype something.
// Anything beyond this in ten minutes is a script, not a person in a lockout.
const MAX_PER_WINDOW = 5
const WINDOW_MS = 10 * 60 * 1000

export const POST = async (request: Request) => {
  const limit = rateLimit(`enquiry:${clientKey(request)}`, MAX_PER_WINDOW, WINDOW_MS)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please call us instead — we answer 24/7.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    )
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: a real person never fills a hidden field. Answer 200 so bots
  // cannot tell they were caught and retry with a different shape.
  if (clean(body.company, 100) !== '') {
    return NextResponse.json({ ok: true })
  }

  const name = clean(body.name, MAX.name)
  const phone = clean(body.phone, MAX.phone)
  const email = clean(body.email, MAX.email)

  if (name.length < 2) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
  }
  if (!looksLikePhone(phone)) {
    return NextResponse.json({ error: 'Please enter a phone number we can reach you on.' }, { status: 400 })
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'That email address does not look right.' }, { status: 400 })
  }

  const type = TYPES.has(String(body.type)) ? (String(body.type) as 'order') : 'order'

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'enquiries',
      data: {
        type,
        status: 'new',
        name,
        phone,
        email: email || undefined,
        serviceLabel: clean(body.serviceLabel, MAX.label) || undefined,
        cityLabel: clean(body.cityLabel, MAX.label) || undefined,
        when: clean(body.when, MAX.label) || undefined,
        message: clean(body.message, MAX.message) || undefined,
        sourcePage: clean(body.sourcePage, 200) || undefined,
      },
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
