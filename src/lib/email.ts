import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

/**
 * Email for the CMS: staff password resets, and the alert sent when a new
 * enquiry arrives.
 *
 * Works with any SMTP provider (Resend, Postmark, SendGrid, Gmail, a mailbox
 * at your host). Set the SMTP_* variables and it sends for real.
 *
 * With nothing configured it falls back to nodemailer's JSON transport, which
 * renders the message and logs it instead of sending. That is deliberate: the
 * previous behaviour silently dropped password-reset emails, so a developer
 * running locally could not tell whether the feature worked at all.
 */

export const FROM_ADDRESS = process.env.SMTP_FROM || 'dispatch@888lockandkey.com'
export const FROM_NAME = process.env.SMTP_FROM_NAME || '888 Lock & Key'

/** Where new-enquiry alerts are sent. Comma-separated for several recipients. */
export const notifyRecipients = (): string[] =>
  (process.env.NOTIFY_EMAIL || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

export const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER)

export const emailAdapter = nodemailerAdapter({
  defaultFromAddress: FROM_ADDRESS,
  defaultFromName: FROM_NAME,
  transportOptions: smtpConfigured
    ? {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        // Port 465 is implicit TLS; 587 upgrades with STARTTLS.
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      }
    : { jsonTransport: true },
})
