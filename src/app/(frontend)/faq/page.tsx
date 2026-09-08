import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { FaqList } from '../../../components/FaqList'
import { CtaBanner } from '../../../components/blocks'
import { getAllFaqs, getSiteSettings } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, faqSchema } from '../../../lib/schema'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Licensing, arrival times, proof of ownership, after-hours pricing and warranty — answered before you call.',
  alternates: { canonical: '/faq' },
}

const FaqPage = async () => {
  const [faqs, settings] = await Promise.all([getAllFaqs(), getSiteSettings()])

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'FAQ', href: '/faq' }])} />
      <JsonLd data={faqSchema(faqs)} />

      <PageHero
        eyebrow="Before You Call"
        title="Frequently Asked Questions"
        intro="Straight answers on pricing, arrival times, ID checks and warranty."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]}
      />

      <section className="sec">
        <div className="wrap narrow">
          <FaqList faqs={faqs} exclusive={false} />
        </div>
      </section>

      <CtaBanner phone={settings.phone} phoneHref={settings.phoneHref} heading="Still not sure?" />
    </>
  )
}

export default FaqPage
