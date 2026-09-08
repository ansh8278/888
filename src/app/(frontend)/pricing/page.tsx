import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { PricingTable, CtaBanner } from '../../../components/blocks'
import { FaqList } from '../../../components/FaqList'
import { getServices, getSiteSettings, getHomeFaqs } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, faqSchema } from '../../../lib/schema'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Starting prices published up front. Your technician confirms the exact quote before any work begins — what we quote is what you pay.',
  alternates: { canonical: '/pricing' },
}

const PricingPage = async () => {
  const [services, settings, faqs] = await Promise.all([
    getServices(),
    getSiteSettings(),
    getHomeFaqs(),
  ])
  const priced = services.filter((s) => s.showInPricingTable)

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Pricing', href: '/pricing' }])} />
      <JsonLd data={faqSchema(faqs)} />

      <PageHero
        eyebrow="Transparent Pricing"
        title="Starting prices, published up front."
        intro="Your technician confirms the exact quote before any work begins. If a job needs more than what was quoted, we stop and tell you what it costs first."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Pricing' }]}
      />

      <section className="sec">
        <div className="wrap">
          <PricingTable services={priced} />
          <p className="table-note">
            Prices are starting points for standard work during normal hours. After-hours call-outs
            carry a flat fee quoted on the phone before we dispatch.
          </p>
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

      <CtaBanner phone={settings.phone} phoneHref={settings.phoneHref} heading="Want a firm price?" />
    </>
  )
}

export default PricingPage
