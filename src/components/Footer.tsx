import Link from 'next/link'
import { Icon } from './Icon'
import { CallButton } from './CallButton'
import type { Phone } from '../lib/contact'

type Column = {
  heading: string
  links?: { label: string; href: string; id?: string | null }[] | null
}

type Props = {
  companyName: string
  tagline?: string | null
  phone: Phone | null
  email?: string | null
  licenseNumber?: string | null
  serviceAreaLine?: string | null
  hours?: string | null
  note?: string | null
  columns: Column[]
}

/**
 * Footer per the client prototype: brand + link columns (Services, one per
 * Bay Area region, Company — all editable under Navigation) + a contact pane.
 * Nothing here is hard-coded business data: licence, hours, rating and phone
 * all come from Site settings and are simply omitted when not yet supplied.
 */
export const Footer = ({ companyName, tagline, phone, email, licenseNumber, serviceAreaLine, hours, note, columns }: Props) => (
  <footer className="site-footer">
    <div className="wrap">
      <div className="footer-main-grid">
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

          <p className="footer-desc">{note || serviceAreaLine || 'Mobile locksmith serving San Jose & the Bay Area.'}</p>

          {licenseNumber ? (
            <div className="footer-trust-row">
              <div className="trust-pill">
                <span>🛡️ {licenseNumber}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="footer-cols">
          {columns.map((col) => (
            <div className="footer-nav-col" key={col.heading}>
              <h4 className="footer-heading">{col.heading}</h4>
              <ul className="footer-links">
                {(col.links ?? []).map((link) => (
                  <li key={link.id ?? link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-nav-col footer-contact-pane">
          <h4 className="footer-heading">Dispatch</h4>
          <div className="dispatch-box">
            <p className="dispatch-text">Mobile technicians dispatched across San Jose &amp; the Bay Area.</p>
            <CallButton phone={phone} className="btn-hero-primary dispatch-call" label="Call Now —" />
            {hours ? <p className="dispatch-text">{hours}</p> : null}
            {email ? (
              <a href={`mailto:${email}`} className="dispatch-email">
                {email}
              </a>
            ) : null}
            <div className="dispatch-guarantee">✓ Upfront pricing, confirmed before work begins</div>
          </div>
        </div>
      </div>

      <div className="footer-sub-bottom">
        <div className="sub-bottom-left">
          <span>
            © {new Date().getFullYear()} {companyName}
          </span>
          {licenseNumber ? (
            <>
              <span className="sub-sep">·</span>
              <span>{licenseNumber}</span>
            </>
          ) : null}
          {serviceAreaLine ? (
            <>
              <span className="sub-sep">·</span>
              <span>{serviceAreaLine}</span>
            </>
          ) : null}
        </div>
        <div className="sub-bottom-right">
          <Link href="/privacy">Privacy Policy</Link>
          <span className="sub-sep">·</span>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
