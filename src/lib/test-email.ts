/**
 * Self-check for the two things staff depend on:
 *   1. a new enquiry sends an alert to the dispatcher
 *   2. "Forgot password?" produces a real reset email
 *
 * Nothing is actually sent: the transport is stubbed, so this proves the
 * messages are built and handed over. Run with `npm test`.
 */
import assert from 'node:assert/strict'

// Set before Payload loads: the notify hook reads this at send time, and the
// test must not depend on whatever happens to be in the developer's shell.
process.env.NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'test-dispatch@example.com'

const { getPayload } = await import('payload')
const { default: config } = await import('@payload-config')

const sent: { to: string; subject: string; html: string }[] = []

const run = async () => {
  const payload = await getPayload({ config })

  // The notify hook logs "alert sent to <address>" after every send. With the
  // transport stubbed below that is misleading — it reads as if the test just
  // emailed a real inbox — so keep the log quiet for the duration.
  const previousLevel = payload.logger.level
  payload.logger.level = 'error'
  console.log('email: transport stubbed — nothing is actually sent')

  // Two seams, deliberately: the enquiry hook calls payload.sendEmail (bound at
  // init), while Payload's forgot-password operation calls the adapter's
  // sendEmail directly. Stubbing only one silently misses the other.
  const capture = (async (message: { to: string; subject: string; html?: string }) => {
    sent.push({ to: message.to, subject: message.subject, html: message.html ?? '' })
    return { messageId: 'captured' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any
  const realSendEmail = payload.sendEmail
  const realAdapterSend = payload.email.sendEmail
  payload.sendEmail = capture
  payload.email.sendEmail = capture

  // Tracked so the finally block can clear up after a failed assertion too.
  let enquiryId: number | string | undefined

  try {
  // ---- 1. new enquiry alert ----
  const enquiry = await payload.create({
    collection: 'enquiries',
    data: {
      type: 'order',
      status: 'new',
      name: 'Email Test',
      phone: '(408) 555-0142',
      serviceLabel: 'Car Lockout',
      cityLabel: 'Phoenix, AZ',
      when: 'Right now — emergency',
      message: 'Testing <script>alert(1)</script> escaping',
    },
  })

  enquiryId = enquiry.id
  assert.equal(sent.length, 1, 'an enquiry with no email address alerts only the dispatcher')
  const alert = sent[0]
  assert.match(alert.subject, /Email Test/, 'subject names the customer')
  assert.match(alert.subject, /Car Lockout/, 'subject names the service')
  assert.match(alert.html, /\(408\) 555-0142/, 'phone number is in the body')
  assert.match(alert.html, /Phoenix, AZ/, 'city is in the body')
  assert.match(alert.html, new RegExp(`/admin/collections/enquiries/${enquiry.id}`), 'links to the record')
  // Customer text is untrusted: it must be escaped, not injected into the HTML.
  assert.ok(!alert.html.includes('<script>'), 'customer input must be escaped')
  assert.match(alert.html, /&lt;script&gt;/, 'escaped form is present')

  // ---- 1b. the customer gets a confirmation when they left an email ----
  const withEmail = await payload.create({
    collection: 'enquiries',
    data: {
      type: 'order',
      status: 'new',
      name: 'Casey Customer',
      phone: '(408) 555-0155',
      email: 'casey@example.com',
      serviceLabel: 'House Rekey',
      cityLabel: 'Phoenix, AZ',
    },
  })
  assert.equal(sent.length, 3, 'with an email address, both the dispatcher and the customer are written to')
  const confirmation = sent.find((m) => m.to === 'casey@example.com')
  assert.ok(confirmation, 'the customer is emailed at the address they gave')
  assert.match(confirmation.subject, /We've got your request/, 'confirmation subject reassures')
  assert.match(confirmation.html, /Hi Casey,/, 'greets them by first name')
  assert.match(confirmation.html, /\(408\) 555-0155/, 'repeats the number we will call')
  assert.match(confirmation.html, /House Rekey/, 'summarises what they asked for')
  // The customer must never be shown an admin link.
  assert.ok(!confirmation.html.includes('/admin/'), 'no admin link leaks to the customer')
  await payload.delete({ collection: 'enquiries', id: withEmail.id })

  // Updating must NOT re-alert, or every status change spams the dispatcher.
  await payload.update({
    collection: 'enquiries',
    id: enquiry.id,
    data: { status: 'contacted' },
  })
  assert.equal(sent.length, 3, 'updating an enquiry must not send another alert')

  // ---- 2. password reset ----
  const users = await payload.find({ collection: 'users', limit: 1 })
  assert.ok(users.docs.length > 0, 'need a user to test password reset')
  const email = users.docs[0].email

  await payload.forgotPassword({
    collection: 'users',
    data: { email },
    disableEmail: false,
  })

  assert.equal(sent.length, 4, 'forgot-password should send an email')
  const reset = sent[3]
  assert.match(reset.subject, /Reset your 888 Lock & Key password/, 'reset subject is branded')
  assert.match(reset.html, /\/admin\/reset\//, 'reset email contains a reset link')
  assert.match(reset.html, /888 Lock &amp; Key/, 'reset email is branded')

  console.log('email: all assertions passed')
  console.log(`  captured ${sent.length} messages, delivered 0`)
  console.log(`  alert  -> "${alert.subject}"`)
  console.log(`  reset  -> "${reset.subject}"`)
  } finally {
    // Never leave test data behind, even when an assertion above failed.
    if (enquiryId !== undefined) {
      await payload.delete({ collection: 'enquiries', id: enquiryId }).catch(() => {})
    }
    payload.sendEmail = realSendEmail
    payload.email.sendEmail = realAdapterSend
    payload.logger.level = previousLevel
  }
  process.exit(0)
}

await run()
