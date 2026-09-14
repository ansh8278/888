import Link from 'next/link'
import { Icon } from './Icon'

type Column = {
  heading: string
  links?: { label: string; href: string; id?: string | null }[] | null
  id?: string | null
}

type Props = {
  companyName: string
  tagline?: string | null
  phone: string
  phoneHref: string
  email?: string | null
  licenseNumber?: string | null
  serviceAreaLine?: string | null
  note?: string | null
  columns?: Column[] | null
}

const DEFAULT_COLUMNS: Column[] = [
  {
    heading: 'Services',
    links: [
      { label: 'Car Lockout & Unlocking', href: '/services/car-lockout' },
      { label: 'Residential Door Lockout', href: '/services/residential-lockout' },
      { label: 'House Rekeying & Lock Change', href: '/services/house-rekey' },
      { label: 'Car Key & Fob Programming', href: '/services/car-key-and-fob-replacement' },
      { label: 'Smart Lock Installation', href: '/services/smart-lock-installation' },
      { label: 'Commercial Access Control', href: '/services/commercial-and-access-control' },
    ],
  },
  {
    heading: 'Locations',
    links: [
      { label: 'San Jose, CA', href: '/locations/san-jose' },
      { label: 'San Francisco, CA', href: '/locations/san-francisco' },
      { label: 'Los Angeles, CA', href: '/locations/los-angeles' },
      { label: 'Phoenix, AZ', href: '/locations/phoenix' },
      { label: 'Scottsdale, AZ', href: '/locations/scottsdale' },
      { label: 'New York City, NY', href: '/locations/new-york-city' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Pricing Guide', href: '/pricing' },
      { label: 'Customer Reviews', href: '/reviews' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
]

export const Footer = ({
  companyName,
  tagline,
  phone,
  phoneHref,
  email,
  licenseNumber,
  serviceAreaLine,
  note,
  columns,
}: Props) => {
  const activeColumns =
    columns && columns.length > 0 && columns.some((c) => c.links && c.links.length > 0)
      ? columns
      : DEFAULT_COLUMNS

  return (
    <footer className="site-footer">
      {/* Top emergency dispatch ribbon */}
      <div className="footer-status-bar">
        <div className="wrap footer-status-inner">
          <div className="footer-status-live">
            <span className="live-pulse-dot" />
            <span>24/7 Mobile Dispatch Active Now</span>
            <span className="footer-status-sep">·</span>
            <span className="footer-status-eta">Avg Arrival: 15–25 mins</span>
          </div>
          <div className="footer-status-call">
            <span>Locked out? Call direct:</span>
            <a href={`tel:${phoneHref}`} className="footer-status-phone">
              <Icon name="phone" />
              {phone}
            </a>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link href="/" className="logo">
              <div className="logo-icon-box footer-logo-box">
                <Icon name="lock" strokeWidth={2.2} />
              </div>
              <div className="logo-text-block">
                <span className="logo-title">{companyName}</span>
                {tagline ? <span className="logo-sub">{tagline}</span> : null}
              </div>
            </Link>

            <p className="footer-note">
              {note ||
                'Licensed, bonded, and insured mobile locksmith serving California, Arizona, and New York with 24/7 rapid roadside and on-site dispatch.'}
            </p>

            {/* Trust Badges */}
            <div className="footer-trust-chips">
              <div className="footer-chip">
                <span className="chip-star">★</span>
                <span><strong>4.9/5</strong> Rating (1,250+ Reviews)</span>
              </div>
              {licenseNumber ? (
                <div className="footer-chip">
                  <span>🛡️ {licenseNumber}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Navigation link columns */}
          {activeColumns.map((col) => (
            <div key={col.heading} className="footer-col">
              <h3>{col.heading}</h3>
              <ul>
                {(col.links ?? []).map((link) => (
                  <li key={`${col.heading}-${link.href}`}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Dedicated 24/7 Dispatch Card */}
          <div className="footer-col footer-dispatch-card">
            <h3>24/7 Emergency Dispatch</h3>
            <p className="dispatch-card-desc">
              Mobile technician vans stationed locally and equipped for on-site key making and emergency door opening.
            </p>
            <a href={`tel:${phoneHref}`} className="footer-cta-call">
              <Icon name="phone" />
              <span>
                <small>TAP TO CALL DISPATCH</small>
                <strong>{phone}</strong>
              </span>
            </a>
            <div className="dispatch-details">
              {email ? (
                <div className="dispatch-row">
                  <span className="dispatch-label">Email:</span>
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
              ) : null}
              <div className="dispatch-row">
                <span className="dispatch-label">Quotes:</span>
                <span>Upfront pricing · No surprise fees</span>
              </div>
              <div className="dispatch-row">
                <span className="dispatch-label">Payment:</span>
                <span>Cards, Apple Pay, Cash</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-copy">
            <span>
              © {new Date().getFullYear()} {companyName}. All rights reserved.
            </span>
            {licenseNumber ? <span className="footer-bottom-dot">·</span> : null}
            {licenseNumber ? <span>BSIS Licensed &amp; Insured</span> : null}
          </div>
          <div className="footer-bottom-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/contact">Support &amp; Dispatch</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
