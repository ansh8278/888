import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { EnquiryForm } from './EnquiryForm'
import { ContactCard } from '../../../components/ContactCard'
import { phoneOf } from '../../../lib/contact'
import { getServices, getLocations, getSiteSettings, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, absolute } from '../../../lib/schema'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: copy.book?.title ?? 'Request Service',
    description: copy.book?.intro ?? undefined,
    alternates: { canonical: absolute('/book') },
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
            <ContactCard settings={settings} phone={phoneOf(settings)} title={copy.bookSideTitle} note={copy.bookSideText} />
          </aside>
        </div>
      </section>
    </>
  )
}

export default BookPage
