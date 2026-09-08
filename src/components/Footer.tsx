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
  columns: Column[]
}

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
}: Props) => (
  <footer className="site-footer">
    <div className="wrap">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo">
            <div className="logo-icon-box footer-logo-box">
              <Icon name="lock" strokeWidth={2.2} />
            </div>
            <div className="logo-text-block">
              <span className="logo-title">{companyName}</span>
              {tagline ? <span className="logo-sub">{tagline}</span> : null}
            </div>
          </div>
          {note ? <p className="footer-note">{note}</p> : null}
        </div>

        {columns.map((col) => (
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

        <div className="footer-col">
          <h3>24/7 Dispatch</h3>
          <ul>
            <li>
              <a href={`tel:${phoneHref}`} className="footer-phone">
                {phone}
              </a>
            </li>
            {email ? (
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            ) : null}
            {licenseNumber ? <li className="footer-muted">{licenseNumber}</li> : null}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </span>
        {serviceAreaLine ? <span>{serviceAreaLine}</span> : null}
      </div>
    </div>
  </footer>
)
