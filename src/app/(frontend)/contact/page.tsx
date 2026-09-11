import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { EnquiryForm } from '../book/EnquiryForm'
import { Icon } from '../../../components/Icon'
import { getServices, getLocations, getSiteSettings, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema } from '../../../lib/schema'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: copy.contact?.title ?? 'Contact Us',
    description: copy.contact?.intro ?? undefined,
    alternates: { canonical: '/contact' },
  }
}

const ContactPage = async () => {
  const [services, locations, settings, copy] = await Promise.all([
    getServices(),
    getLocations(),
    getSiteSettings(),
    getPageCopy(),
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }])} />

      <PageHero
        eyebrow={copy.contact?.eyebrow}
        title={copy.contact?.title ?? 'Contact us'}
        intro={copy.contact?.intro || `${settings.hours} · ${settings.serviceAreaLine ?? ''}`}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <section className="sec">
        <div className="wrap form-layout">
          <div className="form-main">
            <h2>{copy.contactFormHeading ?? 'Send us a message'}</h2>
            <EnquiryForm
              type="contact"
              submitLabel="Send message"
              services={services.map((s) => ({ label: s.title, value: s.title }))}
              cities={locations.map((l) => ({
                label: `${l.city}, ${l.stateAbbr}`,
                value: `${l.city}, ${l.stateAbbr}`,
              }))}
            />
          </div>

          <aside className="form-aside">
            <div className="price-card">
              <div className="price-card-label">24/7 dispatch</div>
              <div className="price-card-value small">{settings.phone}</div>
              <a href={`tel:${settings.phoneHref}`} className="btn-hero-primary price-card-cta" data-call-cta>
                <Icon name="phone" />
                Call now
              </a>
              {settings.email ? (
                <a href={`mailto:${settings.email}`} className="btn-hero-secondary price-card-cta">
                  {settings.email}
                </a>
              ) : null}
              {settings.licenseNumber ? (
                <p className="price-card-note">{settings.licenseNumber}</p>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      <section className="sec sec-sand">
        <div className="wrap">
          <h2>{copy.contactShopsHeading ?? 'Our shops'}</h2>
          <div className="contact-grid">
            {locations.map((loc) => (
              <div className="contact-card" key={loc.id}>
                <h3>{loc.shopName ?? loc.city}</h3>
                {loc.addressLine ? (
                  <p>
                    {loc.addressLine}
                    <br />
                    {loc.city}, {loc.stateAbbr} {loc.postcode}
                  </p>
                ) : null}
                <a href={`tel:${loc.phone || settings.phoneHref}`}>{loc.phone || settings.phone}</a>
                {loc.hours ? (
                  <div className="loc-open-status">
                    <span className="livedot" /> {loc.hours}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPage
