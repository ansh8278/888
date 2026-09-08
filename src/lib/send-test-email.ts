/**
 * Sends one REAL email using whatever is in .env, so you can confirm the
 * settings work before trusting them with customer leads.
 *
 *   npm run email:check
 *
 * Unlike `npm test`, this does not stub anything — if it says sent, a message
 * genuinely left the server.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { smtpConfigured, notifyRecipients, FROM_ADDRESS } from './email'

const run = async () => {
  const payload = await getPayload({ config })
  const to = notifyRecipients()

  console.log('')
  console.log('  SMTP host    :', process.env.SMTP_HOST || '(not set)')
  console.log('  SMTP user    :', process.env.SMTP_USER || '(not set)')
  console.log('  SMTP password:', process.env.SMTP_PASSWORD ? `set (${process.env.SMTP_PASSWORD.length} chars)` : '(not set)')
  console.log('  Sending from :', FROM_ADDRESS)
  console.log('  Sending to   :', to.join(', ') || '(NOTIFY_EMAIL not set)')
  console.log('')

  if (!smtpConfigured) {
    console.log('  ✗ SMTP is not configured, so nothing would actually be sent.')
    console.log('    Fill in SMTP_HOST, SMTP_USER and SMTP_PASSWORD in .env.')
    process.exit(1)
  }
  if (to.length === 0) {
    console.log('  ✗ NOTIFY_EMAIL is empty, so there is nobody to send to.')
    process.exit(1)
  }

  try {
    await payload.sendEmail({
      to: to.join(','),
      subject: 'Test from your 888 Lock & Key website',
      text: 'If you are reading this, lead alerts and password resets will both work.',
      html: `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;padding:24px">
        <h2 style="color:#ea580c;margin:0 0 12px">It works.</h2>
        <p style="color:#334155;line-height:1.6;margin:0">
          Your website can now send email. New enquiries will be sent to this address,
          and staff can reset their admin passwords.
        </p>
      </div>`,
    })
    console.log(`  ✓ Sent. Check the inbox for ${to.join(', ')} (look in spam too).`)
    process.exit(0)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.log('  ✗ Could not send:', message)
    console.log('')
    if (/invalid login|username and password not accepted|535/i.test(message)) {
      console.log('    That looks like a rejected username or password.')
      console.log('    With Gmail you must use a 16-character App Password, not your')
      console.log('    normal password, and 2-Step Verification must be switched on.')
    } else if (/ECONNREFUSED|ETIMEDOUT|ENOTFOUND|getaddrinfo/i.test(message)) {
      console.log('    The server could not be reached. Check SMTP_HOST and SMTP_PORT.')
    }
    process.exit(1)
  }
}

await run()
