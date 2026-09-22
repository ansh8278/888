import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '../../../components/Icon'
import { getSiteSettings, getLocations, getPageCopy } from '../../../lib/data'
import { fillTemplate } from '../../../lib/template'
import { CallButton } from '../../../components/CallButton'
import { phoneOf } from '../../../lib/contact'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: copy.thankYou?.title ?? 'Request received',
    description: copy.thankYou?.intro ?? undefined,
    // Confirmation pages must stay out of search results: they would rank for
    // nothing useful and pollute the conversion numbers with organic landings.
    robots: { index: false, follow: false },
  }
}

const ThankYouPage = async () => {
  const [settings, locations, copy] = await Promise.all([getSiteSettings(), getLocations(), getPageCopy()])
  const vars = { arrival: settings.averageArrival?.toLowerCase() ?? '', count: String(locations.length) }

  return (
    <>
      <section className="sec thanks">
        <div className="wrap narrow">
          <div className="thanks__mark" aria-hidden="true">
            <Icon name="check" />
          </div>

          {copy.thankYou?.eyebrow ? <div className="hero-eyebrow">{copy.thankYou.eyebrow}</div> : null}
          <h1>{copy.thankYou?.title ?? 'Thanks — a dispatcher is on it.'}</h1>
          {copy.thankYou?.intro ? <p className="page-hero-intro">{copy.thankYou.intro}</p> : null}

          {/* Anyone who just submitted a lockout form is standing outside. Calling
              is faster than waiting for a call back, so say so plainly. */}
          <div className="thanks__urgent">
            <div>
              <strong>{copy.thankYouUrgentTitle ?? 'Locked out right now?'}</strong>
              {copy.thankYouUrgentText ? <p>{copy.thankYouUrgentText}</p> : null}
            </div>
            <CallButton phone={phoneOf(settings)} className="btn-hero-primary" primary />
          </div>

          <h2 className="thanks__next-title">What happens next</h2>
          <ol className="thanks__steps">
            {(copy.thankYouSteps ?? []).map((step, i) => (
              <li key={step.id ?? i}>
                <span className="thanks__step-num">{i + 1}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{fillTemplate(step.text, vars)}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="thanks__trust">
            {settings.licenseNumber ? (
              <span>
                <Icon name="shield" /> Licensed &amp; insured · {settings.licenseNumber}
              </span>
            ) : null}
            {settings.rating ? (
              <span>
                <Icon name="star" /> {settings.rating} from {settings.reviewCount}+ reviews
              </span>
            ) : null}
          </div>

          <div className="thanks__links">
            <Link href="/">Back to home</Link>
            <Link href="/services">Our services</Link>
            <Link href="/locations">Locations</Link>
            <Link href="/faq">Common questions</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default ThankYouPage
