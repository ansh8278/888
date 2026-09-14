import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { FaqExplorer, AUTHENTIC_FAQS } from '../../../components/FaqExplorer'
import { CtaBanner } from '../../../components/blocks'
import { getAllFaqs, getSiteSettings, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, faqSchema, absolute } from '../../../lib/schema'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: copy.faq?.title ?? 'Frequently Asked Questions | 888 Lock & Key',
    description:
      copy.faq?.intro ??
      'Common questions and answers regarding 888 Lock & Key services, pricing, response times, and policies.',
    alternates: { canonical: absolute('/faq') },
  }
}

const FaqPage = async () => {
  const [faqs, settings, copy] = await Promise.all([getAllFaqs(), getSiteSettings(), getPageCopy()])

  const schemaFaqs = faqs.length > 0 ? faqs : AUTHENTIC_FAQS.map((f, i) => ({
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
        eyebrow={copy.faq?.eyebrow ?? 'HELP & FAQ'}
        title={copy.faq?.title ?? 'Frequently Asked Questions'}
        intro={
          copy.faq?.intro ??
          'Find clear answers to common questions about our locksmith services, pricing, and 24/7 mobile dispatch.'
        }
        crumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]}
      />

      <section className="sec sec-faq-clean">
        <div className="wrap">
          <FaqExplorer initialFaqs={faqs} phone={settings.phone} phoneHref={settings.phoneHref} />
        </div>
      </section>

      <CtaBanner
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        heading={copy.ctaHeading ?? 'Have a question not listed here?'}
        subtitle={copy.ctaSubtitle ?? 'Call our 24/7 live dispatch team anytime for assistance.'}
      />
    </>
  )
}

export default FaqPage
