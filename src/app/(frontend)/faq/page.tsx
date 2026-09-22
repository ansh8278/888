import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { FaqExplorer } from '../../../components/FaqExplorer'
import { CtaBanner } from '../../../components/blocks'
import { getAllFaqs, getSiteSettings, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, faqSchema, absolute } from '../../../lib/schema'
import { phoneOf } from '../../../lib/contact'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: copy.faq?.title ?? 'Frequently Asked Questions | 888 Lock & Key',
    description:
      copy.faq?.intro ??
      'Common questions about 888 Lock & Key locksmith services across San Jose and the Bay Area.',
    alternates: { canonical: absolute('/faq') },
  }
}

const FaqPage = async () => {
  const [faqs, settings, copy] = await Promise.all([getAllFaqs(), getSiteSettings(), getPageCopy()])

  const schemaFaqs = faqs

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'FAQ', href: '/faq' }])} />
      <JsonLd data={faqSchema(schemaFaqs)} />

      <PageHero
        eyebrow={copy.faq?.eyebrow ?? 'HELP & FAQ'}
        title={copy.faq?.title ?? 'Frequently Asked Questions'}
        intro={
          copy.faq?.intro ??
          'Clear answers to common questions about our mobile locksmith services across San Jose and the Bay Area.'
        }
        crumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]}
      />

      <section className="sec sec-faq-clean">
        <div className="wrap">
          <FaqExplorer initialFaqs={faqs} phone={phoneOf(settings)} />
        </div>
      </section>

      <CtaBanner
        phone={phoneOf(settings)}
        heading={copy.ctaHeading ?? 'Have a question not listed here?'}
        subtitle={copy.ctaSubtitle ?? 'Mobile technicians dispatched across San Jose and the Bay Area.'}
      />
    </>
  )
}

export default FaqPage
