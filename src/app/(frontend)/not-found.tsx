import Link from 'next/link'
import { getSiteSettings } from '../../lib/data'
import { Icon } from '../../components/Icon'

const NotFound = async () => {
  const settings = await getSiteSettings()
  return (
    <section className="sec notfound">
      <div className="wrap narrow">
        <div className="hero-eyebrow">404</div>
        <h1>We could not find that page.</h1>
        <p className="page-hero-intro">
          It may have moved. If you are locked out right now, calling is faster than looking.
        </p>
        <div className="hero-cta">
          <a href={`tel:${settings.phoneHref}`} className="btn-hero-primary" data-call-cta>
            <Icon name="phone" />
            Call {settings.phone}
          </a>
          <Link href="/" className="btn-hero-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NotFound
