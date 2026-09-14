/** Self-check for the schema guarding the public enquiry form. */
import assert from 'node:assert/strict'
import { enquirySchema, firstError } from './enquiry-schema'

const ok = (input: unknown) => {
  const r = enquirySchema.safeParse(input)
  assert.ok(r.success, `expected to pass: ${JSON.stringify(input)} → ${r.success ? '' : firstError(r.error)}`)
  return r.data
}
const fail = (input: unknown, messageMatch: RegExp) => {
  const r = enquirySchema.safeParse(input)
  assert.ok(!r.success, `expected to fail: ${JSON.stringify(input)}`)
  if (!r.success) assert.match(firstError(r.error), messageMatch)
}

// ---- the happy path ----
const full = ok({
  type: 'quote',
  name: '  Priya M.  ',
  phone: '(408) 555-0199',
  email: 'priya@example.com',
  serviceLabel: 'Car Lockout',
  cityLabel: 'San Jose, CA',
  when: 'Right now',
  message: 'Blue Honda, driver side.',
  sourcePage: '/book',
})
assert.equal(full.name, 'Priya M.', 'whitespace is trimmed')
assert.equal(full.type, 'quote')
assert.equal(full.email, 'priya@example.com')

// ---- minimum viable lead: name + phone is enough ----
const minimal = ok({ name: 'Al', phone: '4085550199' })
assert.equal(minimal.type, 'order', 'type defaults to order')
assert.equal(minimal.email, undefined, 'missing optional fields are undefined, not empty strings')
assert.equal(minimal.message, undefined)

// ---- empty strings from blank inputs become "absent" ----
const blanks = ok({ name: 'Al', phone: '4085550199', email: '', message: '   ', when: '' })
assert.equal(blanks.email, undefined, "'' email is treated as not given, not as invalid")
assert.equal(blanks.message, undefined)

// ---- rejections, with the message the form will show ----
fail({ name: '', phone: '4085550199' }, /enter your name/i)
fail({ name: 'A', phone: '4085550199' }, /enter your name/i)
fail({ name: 'Al', phone: 'call me' }, /phone number/i)
fail({ name: 'Al', phone: '12345' }, /phone number/i)
fail({ name: 'Al', phone: '4085550199', email: 'nope' }, /email address/i)
fail({ name: 'Al', phone: '4085550199', email: 'a@b' }, /email address/i)
fail({ phone: '4085550199' }, /name/i)
fail({ name: 'Al' }, /phone|expected/i)
fail('not an object', /expected|invalid/i)
fail(null, /expected|invalid/i)

// ---- phone formats real people actually type ----
for (const p of ['408-555-0199', '408.555.0199', '+1 408 555 0199', '(408)5550199', '4085550199']) {
  ok({ name: 'Al', phone: p })
}

// ---- length caps: over-long input is rejected, not silently truncated ----
fail({ name: 'x'.repeat(121), phone: '4085550199' }, /.+/)
fail({ name: 'Al', phone: '4085550199', message: 'x'.repeat(2001) }, /.+/)
ok({ name: 'Al', phone: '4085550199', message: 'x'.repeat(2000) })

// ---- privilege escalation: fields a customer must never set are dropped ----
const sneaky = ok({
  name: 'Sneaky',
  phone: '4085550199',
  status: 'booked',
  notes: 'internal note injection',
  id: 999,
  createdAt: '1999-01-01',
}) as Record<string, unknown>
assert.equal(sneaky.status, undefined, 'status is stripped')
assert.equal(sneaky.notes, undefined, 'notes is stripped')
assert.equal(sneaky.id, undefined, 'id is stripped')
assert.equal(sneaky.createdAt, undefined, 'createdAt is stripped')

// ---- unknown type falls back rather than failing the whole submission ----
assert.equal(ok({ name: 'Al', phone: '4085550199', type: 'hack' }).type, 'order')

// ---- honeypot passes through so the route can act on it ----
assert.equal(ok({ name: 'Bot', phone: '4085550199', company: 'Spam Co' }).company, 'Spam Co')
assert.equal(ok({ name: 'Al', phone: '4085550199', company: '' }).company, undefined)

console.log('enquiry schema: all assertions passed')
