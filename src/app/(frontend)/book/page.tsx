import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { EnquiryForm } from './EnquiryForm'
import { Icon } from '../../../components/Icon'
import { getServices, getLocations, getSiteSettings } from '../../../lib/data'
import { JsonLd, breadcrumbSchema } from '../../../lib/schema'

export const metadata: Metadata = {
  title: 'Request Service',
  description: 'Book a locksmith or request a free quote. A real dispatcher calls you back.',
  alternates: { canonical: '/book' },
}

const BookPage = async () => {
  const [services, locations, settings] = await Promise.all([
    getServices(),
    getLocations(),
    getSiteSettings(),
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Request Service', href: '/book' }])} />

      <PageHero
        eyebrow="Book Online"
        title="Request service or a free quote"
        intro="Tell us where you are and what you need. A dispatcher calls you back with a firm price — usually within minutes."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Request Service' }]}
      />

      <section className="sec">
        <div className="wrap form-layout">
          <div className="form-main">
            <EnquiryForm
              type="order"
              submitLabel="Submit Service Request"
              services={services.map((s) => ({ label: s.title, value: s.title }))}
              cities={locations.map((l) => ({
                label: `${l.city}, ${l.stateAbbr}`,
                value: `${l.city}, ${l.stateAbbr}`,
              }))}
            />
          </div>

          <aside className="form-aside">
            <div className="price-card">
              <div className="price-card-label">Faster than a form</div>
              <div className="price-card-value small">{settings.phone}</div>
              <p className="price-card-note">
                If you are locked out right now, call. Someone answers 24 hours a day and the van is
                dispatched while you are still on the line.
              </p>
              <a href={`tel:${settings.phoneHref}`} className="btn-hero-primary price-card-cta" data-call-cta>
                <Icon name="phone" />
                Call now
              </a>
              <ul className="check-list tight">
                <li>
                  <Icon name="check" /> Average arrival {settings.averageArrival}
                </li>
                <li>
                  <Icon name="check" /> Price agreed before we set off
                </li>
                <li>
                  <Icon name="check" /> Licensed &amp; insured technicians
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

export default BookPage
