import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '../../../components/Hero'
import { EnquiryForm } from '../book/EnquiryForm'
import { ContactCard, DispatchHubs } from '../../../components/ContactCard'
import { SectionHead } from '../../../components/blocks'
import { Icon } from '../../../components/Icon'
import { RegionGrid } from '../../../components/RegionGrid'
import { phoneOf } from '../../../lib/contact'
import { getServices, getLocations, getSiteSettings, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, localBusinessSchema, absolute } from '../../../lib/schema'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: copy.contact?.title ?? 'Contact Us',
    description:
      copy.contact?.intro || 'Contact 888 Lock & Key — mobile locksmith dispatched across San Jose and the Bay Area. Send a request or call.',
    alternates: { canonical: absolute('/contact') },
  }
}

/**
 * Contact page: the three ways to reach dispatch up front, then the form,
 * then where we dispatch from and the areas covered. Every route shown here
 * is one the business actually has — a missing phone or email simply drops
 * out rather than showing a dead link.
 */
const ContactPage = async () => {
  const [services, locations, settings, copy] = await Promise.all([
    getServices(),
    getLocations(),
    getSiteSettings(),
    getPageCopy(),
  ])
  const phone = phoneOf(settings)
  const hub = settings.dispatchHubs?.[0]

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }])} />
      <JsonLd data={localBusinessSchema(settings, locations)} />

      <PageHero
        eyebrow={copy.contact?.eyebrow}
        title={copy.contact?.title ?? 'Contact us'}
        intro={copy.contact?.intro || settings.serviceAreaLine || undefined}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      {/* The quickest routes, before the form. */}
      <section className="sec sec-tight">
        <div className="wrap">
          <div className="contact-ways">
            {phone ? (
              <a className="contact-way contact-way--primary" href={`tel:${phone.href}`} data-call-cta>
                <span className="contact-way-icon">
                  <Icon name="phone" />
                </span>
                <span className="contact-way-body">
                  <strong>Call dispatch</strong>
                  <em>{phone.display}</em>
                  <small>Fastest if you are locked out right now.</small>
                </span>
              </a>
            ) : null}

            <Link className="contact-way" href="/book">
              <span className="contact-way-icon">
                <Icon name="check" />
              </span>
              <span className="contact-way-body">
                <strong>Request service</strong>
                <em>Send the details</em>
                <small>A dispatcher calls you back to confirm the price.</small>
              </span>
            </Link>

            {settings.email ? (
              <a className="contact-way" href={`mailto:${settings.email}`}>
                <span className="contact-way-icon">
                  <Icon name="mail" />
                </span>
                <span className="contact-way-body">
                  <strong>Email us</strong>
                  <em>{settings.email}</em>
                  <small>For quotes and non-urgent questions.</small>
                </span>
              </a>
            ) : null}

            {hub ? (
              <div className="contact-way contact-way--static">
                <span className="contact-way-icon">
                  <Icon name="pin" />
                </span>
                <span className="contact-way-body">
                  <strong>Dispatch hub</strong>
                  <em>
                    {hub.addressLine}, {hub.city}
                  </em>
                  <small>We come to you — there is no need to visit.</small>
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

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
            {/* The call button lives in the "Call dispatch" card above. */}
            <ContactCard settings={settings} phone={phone} showCallButton={false} />
          </aside>
        </div>
      </section>

      <DispatchHubs settings={settings} heading={copy.contactShopsHeading} />

      <section className="sec">
        <div className="wrap">
          <SectionHead
            eyebrow={copy.locations?.eyebrow ?? 'Coverage Area'}
            heading="Where we come to you"
            link={{ href: '/bay-area-locksmith', label: 'All service areas' }}
          />
          <RegionGrid locations={locations} limit={4} showBlurb={false} />
        </div>
      </section>
    </>
  )
}

export default ContactPage
