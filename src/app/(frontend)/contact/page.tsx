import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { EnquiryForm } from '../book/EnquiryForm'
import { ContactCard, DispatchHubs } from '../../../components/ContactCard'
import { phoneOf } from '../../../lib/contact'
import { getServices, getLocations, getSiteSettings, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, absolute } from '../../../lib/schema'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: copy.contact?.title ?? 'Contact Us',
    description: copy.contact?.intro ?? undefined,
    alternates: { canonical: absolute('/contact') },
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
        intro={copy.contact?.intro || settings.serviceAreaLine || undefined}
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
            <ContactCard settings={settings} phone={phoneOf(settings)} />
          </aside>
        </div>
      </section>

      <DispatchHubs settings={settings} heading={copy.contactShopsHeading} />
    </>
  )
}

export default ContactPage
