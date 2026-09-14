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

const DEFAULT_SERVICES = [
  { label: 'Car Lockout & Unlocking', href: '/services/car-lockout' },
  { label: 'Residential Door Lockout', href: '/services/residential-lockout' },
  { label: 'House Rekey & Lock Change', href: '/services/house-rekey' },
  { label: 'Car Key & Fob Replacement', href: '/services/car-key-and-fob-replacement' },
  { label: 'Smart Lock Installation', href: '/services/smart-lock-installation' },
  { label: 'Commercial & Access Control', href: '/services/commercial-and-access-control' },
]

const DEFAULT_LOCATIONS = [
  { label: 'San Jose, CA', href: '/locations/san-jose' },
  { label: 'San Francisco, CA', href: '/locations/san-francisco' },
  { label: 'Los Angeles, CA', href: '/locations/los-angeles' },
  { label: 'Phoenix, AZ', href: '/locations/phoenix' },
  { label: 'Scottsdale, AZ', href: '/locations/scottsdale' },
  { label: 'New York City, NY', href: '/locations/new-york-city' },
]

const DEFAULT_COMPANY = [
  { label: 'About Us', href: '/about' },
  { label: 'Pricing Guide', href: '/pricing' },
  { label: 'Customer Reviews', href: '/reviews' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Request Service', href: '/book' },
  { label: 'Contact Us', href: '/contact' },
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
  // Extract custom columns from CMS if available, otherwise use defaults
  const servicesCol = columns?.find((c) => /service/i.test(c.heading))?.links?.length
    ? columns.find((c) => /service/i.test(c.heading))!.links!
    : DEFAULT_SERVICES

  const locationsCol = columns?.find((c) => /location|city|area/i.test(c.heading))?.links?.length
    ? columns.find((c) => /location|city|area/i.test(c.heading))!.links!
    : DEFAULT_LOCATIONS

  const companyCol = columns?.find((c) => /company|about/i.test(c.heading))?.links?.length
    ? columns.find((c) => /company|about/i.test(c.heading))!.links!
    : DEFAULT_COMPANY

  return (
    <footer className="site-footer">
      {/* Sleek top live dispatch bar */}
      <div className="footer-top-bar">
        <div className="wrap footer-top-inner">
          <div className="footer-live-status">
            <span className="live-dot" />
            <span className="live-text">24/7 Mobile Dispatch Active</span>
            <span className="dot-sep">•</span>
            <span className="live-eta">Avg Arrival 15–25 Mins</span>
          </div>
          <div className="footer-quick-call">
            <span className="quick-call-label">Need immediate service?</span>
            <a href={`tel:${phoneHref}`} className="footer-call-pill">
              <Icon name="phone" />
              <span>{phone}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="footer-main-grid">
          {/* Brand Info */}
          <div className="footer-brand-pane">
            <Link href="/" className="logo">
              <div className="logo-icon-box footer-logo-box">
                <Icon name="lock" strokeWidth={2.2} />
              </div>
              <div className="logo-text-block">
                <span className="logo-title">{companyName}</span>
                {tagline ? <span className="logo-sub">{tagline}</span> : null}
              </div>
            </Link>

            <p className="footer-desc">
              {note ||
                'Licensed, bonded, and insured 24/7 mobile locksmith service. On-site vehicle unlocking, residential rekeying, and commercial access control with upfront pricing.'}
            </p>

            <div className="footer-trust-row">
              <div className="trust-pill">
                <span className="star-icon">★</span>
                <span><strong>4.9/5</strong> Rating (1,250+ Reviews)</span>
              </div>
              {licenseNumber ? (
                <div className="trust-pill">
                  <span>🛡️ {licenseNumber}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Services Column */}
          <div className="footer-nav-col">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              {servicesCol.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations Column */}
          <div className="footer-nav-col">
            <h4 className="footer-heading">Locations</h4>
            <ul className="footer-links">
              {locationsCol.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Support Column */}
          <div className="footer-nav-col">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              {companyCol.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Direct Dispatch Column */}
          <div className="footer-nav-col footer-contact-pane">
            <h4 className="footer-heading">24/7 Dispatch</h4>
            <div className="dispatch-box">
              <p className="dispatch-text">
                Mobile locksmith units on call 24 hours a day, 7 days a week including holidays.
              </p>
              <a href={`tel:${phoneHref}`} className="dispatch-phone-btn">
                <div className="dispatch-phone-icon">
                  <Icon name="phone" />
                </div>
                <div className="dispatch-phone-info">
                  <span className="dispatch-phone-label">24/7 DISPATCH LINE</span>
                  <span className="dispatch-phone-val">{phone}</span>
                </div>
              </a>
              {email ? (
                <a href={`mailto:${email}`} className="dispatch-email">
                  {email}
                </a>
              ) : null}
              <div className="dispatch-guarantee">
                ✓ Upfront Pricing &amp; No Hidden Fees
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="footer-sub-bottom">
          <div className="sub-bottom-left">
            <span>© {new Date().getFullYear()} {companyName}. All rights reserved.</span>
            {serviceAreaLine ? <span className="sub-sep">·</span> : null}
            {serviceAreaLine ? <span>{serviceAreaLine}</span> : null}
          </div>
          <div className="sub-bottom-right">
            <span>Licensed, Bonded &amp; Insured Locksmith Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
