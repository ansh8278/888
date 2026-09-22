import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { PricingTable, CtaBanner } from '../../../components/blocks'
import { FaqList } from '../../../components/FaqList'
import { getServices, getSiteSettings, getHomeFaqs, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, faqSchema, absolute } from '../../../lib/schema'
import { phoneOf } from '../../../lib/contact'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: copy.pricing?.title ?? 'Pricing',
    description: copy.pricing?.intro ?? undefined,
    alternates: { canonical: absolute('/pricing') },
  }
}

const PricingPage = async () => {
  const [services, settings, faqs, copy] = await Promise.all([
    getServices(),
    getSiteSettings(),
    getHomeFaqs(),
    getPageCopy(),
  ])
  const priced = services.filter((s) => s.showInPricingTable && s.startingPrice)

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Pricing', href: '/pricing' }])} />
      <JsonLd data={faqSchema(faqs)} />

      <PageHero
        eyebrow={copy.pricing?.eyebrow}
        title={copy.pricing?.title ?? 'Pricing'}
        intro={copy.pricing?.intro}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Pricing' }]}
      />

      <section className="sec">
        <div className="wrap">
          {priced.length > 0 ? (
            <>
              <PricingTable services={priced} />
              {copy.pricingNote ? <p className="table-note">{copy.pricingNote}</p> : null}
            </>
          ) : (
            // Honest empty state until the client confirms starting prices (D6).
            <div className="empty-state">
              <h2>{copy.pricingEmptyHeading ?? 'Pricing is confirmed on the phone'}</h2>
              <p>{copy.pricingEmptyText}</p>
            </div>
          )}
        </div>
      </section>

      <section className="sec sec-sand">
        <div className="wrap narrow">
          <div className="sec-head-center">
            <div>
              <h2>Pricing questions</h2>
            </div>
          </div>
          <FaqList faqs={faqs} />
        </div>
      </section>

      <CtaBanner phone={phoneOf(settings)} heading={copy.ctaHeading} subtitle={copy.ctaSubtitle} />
    </>
  )
}

export default PricingPage
