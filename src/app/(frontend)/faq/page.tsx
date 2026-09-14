import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { FaqExplorer, COMPREHENSIVE_FAQS } from '../../../components/FaqExplorer'
import { CtaBanner } from '../../../components/blocks'
import { getAllFaqs, getSiteSettings, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, faqSchema, absolute } from '../../../lib/schema'
import { Icon } from '../../../components/Icon'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: copy.faq?.title ?? 'Frequently Asked Questions | 888 Lock & Key',
    description:
      copy.faq?.intro ??
      'Everything you need to know about our 24/7 mobile locksmith services, upfront flat pricing, arrival times, automotive key programming, and non-destructive entry.',
    alternates: { canonical: absolute('/faq') },
  }
}

const FaqPage = async () => {
  const [faqs, settings, copy] = await Promise.all([getAllFaqs(), getSiteSettings(), getPageCopy()])

  // Merge for JSON-LD schema so search engines see the full comprehensive knowledge base
  const schemaFaqs = faqs.length > 0 ? faqs : COMPREHENSIVE_FAQS.map((f, i) => ({
    id: i + 1,
    question: f.question,
    answer: f.answer,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }))

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'FAQ', href: '/faq' }])} />
      <JsonLd data={faqSchema(schemaFaqs)} />

      <PageHero
        eyebrow={copy.faq?.eyebrow ?? 'HELP & KNOWLEDGE BASE'}
        title={copy.faq?.title ?? 'Frequently Asked Questions'}
        intro={
          copy.faq?.intro ??
          'Clear, upfront answers on service pricing, emergency response times, vehicle key replacement, and our strict non-destructive entry policy.'
        }
        crumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]}
      />

      {/* Trust Highlights Bar */}
      <section className="faq-trust-strip">
        <div className="wrap">
          <div className="faq-trust-strip-inner">
            <div className="faq-trust-pill">
              <Icon name="clock" />
              <span><strong>15–25 Min</strong> Avg Arrival</span>
            </div>
            <div className="faq-trust-pill">
              <Icon name="shield" />
              <span><strong>100% Upfront</strong> Firm Quotes</span>
            </div>
            <div className="faq-trust-pill">
              <Icon name="key" />
              <span><strong>96%+ Non-Destructive</strong> Entry</span>
            </div>
            <div className="faq-trust-pill">
              <Icon name="check" />
              <span><strong>90-Day</strong> Full Warranty</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec-faq-main">
        <div className="wrap">
          <FaqExplorer initialFaqs={faqs} phone={settings.phone} phoneHref={settings.phoneHref} />
        </div>
      </section>

      <CtaBanner
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        heading={copy.ctaHeading ?? 'Need immediate emergency assistance?'}
        subtitle={copy.ctaSubtitle ?? 'Our mobile locksmith vans are staged and ready to roll across your area right now.'}
      />
    </>
  )
}

export default FaqPage
