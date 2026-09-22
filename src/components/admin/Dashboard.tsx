import { headers as nextHeaders } from 'next/headers'
import { Gutter } from '@payloadcms/ui'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { withBase } from '../../lib/base-path'
import { LogoutButton } from './LogoutButton'

/**
 * Replaces Payload's default dashboard entirely.
 *
 * The default view lists every collection as a card, which just repeats the
 * sidebar. This is ordered by what someone actually opens the CMS to do:
 * deal with new enquiries first (time-critical for an emergency locksmith),
 * then the edits that come up weekly, then the rest.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

type Tile = { href: string; label: string; hint: string; icon: string }

const SECTIONS: { title: string; tiles: Tile[] }[] = [
  {
    title: 'Edit pages & content',
    tiles: [
      { href: '/admin/globals/home-page', label: 'Home page', hint: 'Hero text, headings, buttons', icon: '🏠' },
      { href: '/admin/collections/pages', label: 'Standalone pages', hint: 'About Us, Privacy Policy, Terms', icon: '📃' },
      { href: '/admin/collections/services', label: 'Services', hint: 'Categories, individual services, FAQs', icon: '🔧' },
      { href: '/admin/collections/locations', label: 'Service areas', hint: 'Bay Area cities and San Jose districts', icon: '📍' },
      { href: '/admin/globals/page-copy', label: 'Page text', hint: 'Headings and intros on index pages', icon: '📄' },
      { href: '/admin/collections/reviews', label: 'Reviews', hint: 'Customer quotes shown on the site', icon: '⭐' },
      { href: '/admin/collections/faqs', label: 'FAQs', hint: 'Questions and answers', icon: '💬' },
    ],
  },
  {
    title: 'Settings & Media',
    tiles: [
      { href: '/admin/globals/site-settings', label: 'Site settings', hint: 'Phone, licence, hours, dispatch hub', icon: '⚙️' },
      { href: '/admin/globals/navigation', label: 'Menus', hint: 'Top menu and footer links', icon: '🧭' },
      { href: '/admin/collections/media', label: 'Images', hint: 'Photos used across the site', icon: '🖼️' },
      { href: '/admin/collections/users', label: 'Staff logins', hint: 'Who can sign in here', icon: '👤' },
    ],
  },
]

const count = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: 'enquiries' | 'services' | 'locations' | 'reviews' | 'faqs' | 'pages',
  where?: Where,
) => {
  try {
    const res = await payload.count({ collection, ...(where ? { where } : {}) })
    return res.totalDocs
  } catch {
    return 0
  }
}

type Lead = {
  id: number | string
  name?: string | null
  phone?: string | null
  serviceLabel?: string | null
  cityLabel?: string | null
  createdAt: string
}

const timeAgo = (iso: string) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
  const days = Math.round(hrs / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export const Dashboard = async () => {
  const payload = await getPayload({ config })

  // Payload's own log-out is an unlabelled icon in the corner of the sidebar,
  // which staff could not find. Surface it here with a name attached.
  let signedInAs: string | null = null
  try {
    const { user } = await payload.auth({ headers: await nextHeaders() })
    signedInAs = (user?.name as string) || user?.email || null
  } catch {
    signedInAs = null
  }

  const [newLeads, totalLeads, services, locations, reviews, standalonePages] = await Promise.all([
    count(payload, 'enquiries', { status: { equals: 'new' } }),
    count(payload, 'enquiries'),
    count(payload, 'services'),
    count(payload, 'locations'),
    count(payload, 'reviews'),
    count(payload, 'pages'),
  ])

  // Home, Bay Area hub, services index, pricing, reviews, FAQ, contact, request + every service, city and info page.
  const totalPages = 8 + services + locations + standalonePages

  // Business details the client still has to supply. Nothing fake is shown on
  // the site in their place, but the site cannot launch without them.
  let missing: { label: string; why: string }[] = []
  try {
    const st = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    const checks: [unknown, string, string][] = [
      [st.phone, 'Business phone number', 'Call buttons currently send visitors to the request form.'],
      [st.licenseNumber, 'California BSIS licence number', 'Legally required on all advertising before launch.'],
      [st.hours, 'Operating hours', 'No hours are shown; "24/7" must not be claimed unless true.'],
      [st.rating && st.reviewCount, 'Google rating & review count', 'Trust badges and star markup are hidden until verified.'],
      [(st.dispatchHubs ?? []).some((h) => h.postcode), 'ZIP code of the Santa Clara dispatch hub', 'Completes the business address for Google.'],
    ]
    missing = checks.filter(([v]) => !v).map(([, label, why]) => ({ label, why }))
  } catch {
    missing = []
  }

  let latest: Lead[] = []
  try {
    const res = await payload.find({
      collection: 'enquiries',
      where: { status: { equals: 'new' } },
      limit: 5,
      sort: '-createdAt',
      depth: 0,
    })
    latest = res.docs as Lead[]
  } catch {
    latest = []
  }

  return (
    <Gutter className="dash">
      <div className="dash__head">
        <div>
          <h1>888 Lock &amp; Key</h1>
          <p>Everything on the website is edited from here.</p>
        </div>
        <div className="dash__head-actions">
          <a className="dash__view-site" href={SITE_URL} target="_blank" rel="noopener noreferrer">
            View live site ↗
          </a>
          <LogoutButton signedInAs={signedInAs} />
        </div>
      </div>

      {/* Leads first — the only thing here that is time-critical. */}
      <a
        className={`dash__leads${newLeads > 0 ? ' dash__leads--active' : ''}`}
        href={withBase('/admin/collections/enquiries?where[status][equals]=new')}
      >
        <div className="dash__leads-num">{newLeads}</div>
        <div className="dash__leads-body">
          <strong>{newLeads === 1 ? 'New enquiry waiting' : 'New enquiries waiting'}</strong>
          <span>
            {newLeads > 0
              ? 'Submitted through the website and not yet contacted.'
              : `Nothing waiting. ${totalLeads} received in total.`}
          </span>
        </div>
        <span className="dash__leads-go">Open →</span>
      </a>

      {latest.length > 0 ? (
        <ul className="dash__recent">
          {latest.map((lead) => (
            <li key={lead.id}>
              <a href={withBase(`/admin/collections/enquiries/${lead.id}`)}>
                <span className="dash__recent-name">{lead.name}</span>
                <span className="dash__recent-meta">
                  {[lead.serviceLabel, lead.cityLabel].filter(Boolean).join(' · ') || 'No details given'}
                </span>
                <span className="dash__recent-phone">{lead.phone}</span>
                <span className="dash__recent-time">{timeAgo(lead.createdAt)}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      {missing.length > 0 ? (
        <section className="dash__missing">
          <h2 className="dash__title">Missing before launch</h2>
          <p>
            These come from the business and cannot be invented. Enter them under{' '}
            <a href={withBase('/admin/globals/site-settings')}>Site settings</a>.
          </p>
          <ul>
            {missing.map((m) => (
              <li key={m.label}>
                <strong>{m.label}</strong> — {m.why}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {SECTIONS.map((section) => (
        <section key={section.title}>
          <h2 className="dash__title">{section.title}</h2>
          <div className="dash__grid">
            {section.tiles.map((tile) => (
              <a className="dash__tile" key={tile.href} href={withBase(tile.href)}>
                <span className="dash__tile-icon" aria-hidden="true">
                  {tile.icon}
                </span>
                <strong>{tile.label}</strong>
                <span>{tile.hint}</span>
              </a>
            ))}
          </div>
        </section>
      ))}

      <h2 className="dash__title">Your website right now</h2>
      <div className="dash__stats">
        <div className="dash__stat">
          <b>{services}</b>
          <span>Services</span>
        </div>
        <div className="dash__stat">
          <b>{locations}</b>
          <span>Cities</span>
        </div>
        <div className="dash__stat">
          <b>{standalonePages}</b>
          <span>Info pages (About/Legal)</span>
        </div>
        <div className="dash__stat">
          <b>{totalPages}</b>
          <span>Total pages live</span>
        </div>
      </div>

      <p className="dash__note">
        Your website currently serves <b>{totalPages} live pages</b>. Adding a service or a city automatically creates its page and sitemap entry; add it to the menus under Menus.
      </p>
    </Gutter>
  )
}

export default Dashboard
