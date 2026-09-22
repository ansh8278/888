import { phoneOf, type Phone } from './contact'
import type { CollectionAfterChangeHook } from 'payload'
import { notifyRecipients } from './email'

const esc = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const row = (label: string, value: unknown) =>
  value
    ? `<tr>
         <td style="padding:6px 14px 6px 0;color:#64748b;font-size:14px;white-space:nowrap">${esc(label)}</td>
         <td style="padding:6px 0;color:#0f172a;font-size:15px;font-weight:600">${esc(value)}</td>
       </tr>`
    : ''

const shell = (inner: string) => `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#faf8f5;padding:28px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
      ${inner}
    </div>
  </div>`

type Doc = Record<string, unknown> & { id: number | string }

const kindOf = (doc: Doc) =>
  doc.type === 'quote' ? 'Quote request' : doc.type === 'contact' ? 'Contact message' : 'Service request'

/** What the dispatcher receives: everything needed to call the customer back. */
const dispatcherEmail = (doc: Doc, adminLink: string) => {
  const kind = kindOf(doc)
  return {
    subject: `${kind}: ${doc.name} — ${doc.serviceLabel || 'no service given'}${
      doc.cityLabel ? ` (${doc.cityLabel})` : ''
    }`,
    html: shell(`
      <div style="background:#ea580c;color:#fff;padding:18px 24px">
        <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.9">New ${esc(kind)}</div>
        <div style="font-size:20px;font-weight:800;margin-top:2px">888 Lock &amp; Key</div>
      </div>
      <div style="padding:22px 24px">
        <table style="border-collapse:collapse;width:100%">
          ${row('Name', doc.name)}
          ${row('Phone', doc.phone)}
          ${row('Email', doc.email)}
          ${row('Service', doc.serviceLabel)}
          ${row('City', doc.cityLabel)}
          ${row('When', doc.when)}
          ${row('From page', doc.sourcePage)}
        </table>
        ${
          doc.message
            ? `<div style="margin-top:16px;padding:14px 16px;background:#f8fafc;border-radius:10px;color:#334155;font-size:14px;line-height:1.6">${esc(
                doc.message,
              )}</div>`
            : ''
        }
        <div style="margin-top:22px">
          <a href="tel:${esc(doc.phone)}" style="display:inline-block;background:#ea580c;color:#fff;text-decoration:none;padding:13px 26px;border-radius:100px;font-weight:700">Call ${esc(doc.name)}</a>
          <a href="${esc(adminLink)}" style="display:inline-block;margin-left:10px;padding:13px 22px;border-radius:100px;border:1px solid #e2e8f0;color:#0f172a;text-decoration:none;font-weight:600">Open in admin</a>
        </div>
      </div>`),
    text: [
      `New ${kind}`,
      `Name:    ${doc.name}`,
      `Phone:   ${doc.phone}`,
      doc.email ? `Email:   ${doc.email}` : '',
      doc.serviceLabel ? `Service: ${doc.serviceLabel}` : '',
      doc.cityLabel ? `City:    ${doc.cityLabel}` : '',
      doc.when ? `When:    ${doc.when}` : '',
      doc.message ? `\n${doc.message}` : '',
      `\nOpen: ${adminLink}`,
    ]
      .filter(Boolean)
      .join('\n'),
  }
}

/**
 * What the customer receives: proof their request landed, what happens next,
 * and the phone number — because someone locked out should not sit waiting on
 * a callback when calling is faster.
 */
const customerEmail = (doc: Doc, company: string, phone: Phone | null, arrival?: string) => {
  const firstName = String(doc.name ?? '').trim().split(/\s+/)[0] || 'there'
  return {
    subject: `We've got your request — ${company}`,
    html: shell(`
      <div style="background:#ea580c;color:#fff;padding:20px 24px">
        <div style="font-size:20px;font-weight:800">${esc(company)}</div>
        <div style="font-size:13px;opacity:.9;margin-top:2px">Request received</div>
      </div>
      <div style="padding:24px">
        <p style="margin:0 0 14px;font-size:16px;color:#0f172a">Hi ${esc(firstName)},</p>
        <p style="margin:0 0 20px;color:#334155;font-size:15px;line-height:1.6">
          Thanks — we have your request and a dispatcher is looking at it now.
          We will call you on <strong>${esc(doc.phone)}</strong> shortly to confirm
          the price and the arrival time.
        </p>

        <div style="padding:16px 18px;background:#faf8f5;border:1px solid #eee5d8;border-radius:12px;margin-bottom:22px">
          <div style="font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#64748b;margin-bottom:8px">What you asked for</div>
          <table style="border-collapse:collapse;width:100%">
            ${row('Service', doc.serviceLabel)}
            ${row('Area', doc.cityLabel)}
            ${row('When', doc.when)}
          </table>
        </div>

        ${
          phone
            ? `<p style="margin:0 0 14px;color:#334155;font-size:15px;line-height:1.6">
          <strong>Locked out right now?</strong> Calling is faster than waiting for us
          to ring back${arrival ? `, and our average arrival is ${esc(arrival.toLowerCase())}` : ''}.
        </p>
        <a href="tel:${esc(phone.href)}" style="display:inline-block;background:#ea580c;color:#fff;text-decoration:none;padding:14px 30px;border-radius:100px;font-weight:700">Call ${esc(phone.display)}</a>`
            : ''
        }

        <p style="margin:24px 0 0;color:#94a3b8;font-size:13px;line-height:1.6">
          You are getting this because you submitted a request on our website.
          If that was not you, ignore this email and nothing will happen.
        </p>
      </div>`),
    text: [
      `Hi ${firstName},`,
      '',
      `Thanks — we have your request and a dispatcher is looking at it now.`,
      `We will call you on ${doc.phone} shortly to confirm the price and arrival time.`,
      '',
      doc.serviceLabel ? `Service: ${doc.serviceLabel}` : '',
      doc.cityLabel ? `Area:    ${doc.cityLabel}` : '',
      doc.when ? `When:    ${doc.when}` : '',
      '',
      phone ? `Locked out right now? Calling is faster: ${phone.display}` : undefined,
    ]
      .filter((l) => l !== undefined)
      .join('\n'),
  }
}

/**
 * Emails on a new website enquiry: the dispatcher always, and the customer
 * when they gave an email address (the field is optional on the form).
 *
 * Never throws. The enquiry is already saved by the time this runs, and a mail
 * provider having a bad day must not turn a captured lead into an error for
 * the customer. Each send is isolated so one failing cannot stop the other.
 */
export const notifyOnNewEnquiry: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req: { payload },
}) => {
  if (operation !== 'create') return doc

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const adminLink = `${siteUrl}/admin/collections/enquiries/${doc.id}`

  // ---- the dispatcher ----
  const to = notifyRecipients()
  if (to.length === 0) {
    payload.logger.warn(
      `New enquiry #${doc.id} from ${doc.name} (${doc.phone}) — NOTIFY_EMAIL is not set, so no alert was sent.`,
    )
  } else {
    try {
      await payload.sendEmail({ to: to.join(','), ...dispatcherEmail(doc, adminLink) })
      payload.logger.info(`Enquiry #${doc.id}: alert sent to ${to.join(', ')}`)
    } catch (err) {
      payload.logger.error(
        `Enquiry #${doc.id} was SAVED but the alert email failed: ${
          err instanceof Error ? err.message : String(err)
        }`,
      )
    }
  }

  // ---- the customer ----
  // Deliberately outside the block above: the customer should still be
  // confirmed even if the business has not set a notification address.
  if (doc.email) {
    try {
      const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
      await payload.sendEmail({
        to: doc.email,
        ...customerEmail(
          doc,
          settings.companyName ?? '888 Lock & Key',
          phoneOf(settings),
          settings.averageArrival ?? undefined,
        ),
      })
      payload.logger.info(`Enquiry #${doc.id}: confirmation sent to ${doc.email}`)
    } catch (err) {
      payload.logger.error(
        `Enquiry #${doc.id}: confirmation to the customer failed: ${
          err instanceof Error ? err.message : String(err)
        }`,
      )
    }
  }

  return doc
}
