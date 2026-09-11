import Link from 'next/link'
import { getSiteSettings, getPageCopy } from '../../lib/data'
import { Icon } from '../../components/Icon'

const NotFound = async () => {
  const [settings, copy] = await Promise.all([getSiteSettings(), getPageCopy()])
  return (
    <section className="sec notfound">
      <div className="wrap narrow">
        <div className="hero-eyebrow">{copy.notFound?.eyebrow ?? '404'}</div>
        <h1>{copy.notFound?.title ?? 'We could not find that page.'}</h1>
        {copy.notFound?.intro ? <p className="page-hero-intro">{copy.notFound.intro}</p> : null}
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
