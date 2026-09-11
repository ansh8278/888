import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { EnquiryForm } from './EnquiryForm'
import { Icon } from '../../../components/Icon'
import { getServices, getLocations, getSiteSettings, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema } from '../../../lib/schema'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: copy.book?.title ?? 'Request Service',
    description: copy.book?.intro ?? undefined,
    alternates: { canonical: '/book' },
  }
}

const BookPage = async () => {
  const [services, locations, settings, copy] = await Promise.all([
    getServices(),
    getLocations(),
    getSiteSettings(),
    getPageCopy(),
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Request Service', href: '/book' }])} />

      <PageHero
        eyebrow={copy.book?.eyebrow}
        title={copy.book?.title ?? 'Request service'}
        intro={copy.book?.intro}
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
              <div className="price-card-label">{copy.bookSideTitle ?? 'Faster than a form'}</div>
              <div className="price-card-value small">{settings.phone}</div>
              {copy.bookSideText ? <p className="price-card-note">{copy.bookSideText}</p> : null}
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
