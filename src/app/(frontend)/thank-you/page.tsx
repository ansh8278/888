import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '../../../components/Icon'
import { getSiteSettings, getLocations } from '../../../lib/data'

export const metadata: Metadata = {
  title: 'Request received',
  description: 'Your request has reached our dispatch team.',
  // Confirmation pages must stay out of search results: they would rank for
  // nothing useful and pollute the conversion numbers with organic landings.
  robots: { index: false, follow: false },
}

const ThankYouPage = async () => {
  const [settings, locations] = await Promise.all([getSiteSettings(), getLocations()])

  return (
    <>
      <section className="sec thanks">
        <div className="wrap narrow">
          <div className="thanks__mark" aria-hidden="true">
            <Icon name="check" />
          </div>

          <div className="hero-eyebrow">Request received</div>
          <h1>Thanks — a dispatcher is on it.</h1>
          <p className="page-hero-intro">
            Your details are with our {settings.hours?.toLowerCase().includes('24') ? '24/7 ' : ''}
            dispatch team and someone will call you back shortly to confirm the price and the
            arrival time.
          </p>

          {/* Anyone who just submitted a lockout form is standing outside. Calling
              is faster than waiting for a call back, so say so plainly. */}
          <div className="thanks__urgent">
            <div>
              <strong>Locked out right now?</strong>
              <p>Calling is faster. Someone answers day or night, and the van is dispatched while you are still on the line.</p>
            </div>
            <a href={`tel:${settings.phoneHref}`} className="btn-hero-primary" data-call-cta>
              <Icon name="phone" />
              Call {settings.phone}
            </a>
          </div>

          <h2 className="thanks__next-title">What happens next</h2>
          <ol className="thanks__steps">
            <li>
              <span className="thanks__step-num">1</span>
              <div>
                <strong>We call you back</strong>
                <p>A real dispatcher, not an automated system, to confirm what you need and where you are.</p>
              </div>
            </li>
            <li>
              <span className="thanks__step-num">2</span>
              <div>
                <strong>You get a firm price</strong>
                <p>Agreed on the phone before a van moves. No call-out surprises when the technician arrives.</p>
              </div>
            </li>
            <li>
              <span className="thanks__step-num">3</span>
              <div>
                <strong>A technician is dispatched</strong>
                <p>
                  From the nearest of our {locations.length} locations
                  {settings.averageArrival ? `, arriving in about ${settings.averageArrival.toLowerCase()} on average` : ''}.
                </p>
              </div>
            </li>
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
