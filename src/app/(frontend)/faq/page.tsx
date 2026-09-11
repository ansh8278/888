import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { FaqList } from '../../../components/FaqList'
import { CtaBanner } from '../../../components/blocks'
import { getAllFaqs, getSiteSettings, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, faqSchema } from '../../../lib/schema'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: copy.faq?.title ?? 'Frequently Asked Questions',
    description: copy.faq?.intro ?? undefined,
    alternates: { canonical: '/faq' },
  }
}

const FaqPage = async () => {
  const [faqs, settings, copy] = await Promise.all([getAllFaqs(), getSiteSettings(), getPageCopy()])

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'FAQ', href: '/faq' }])} />
      <JsonLd data={faqSchema(faqs)} />

      <PageHero
        eyebrow={copy.faq?.eyebrow}
        title={copy.faq?.title ?? 'Frequently Asked Questions'}
        intro={copy.faq?.intro}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]}
      />

      <section className="sec">
        <div className="wrap narrow">
          <FaqList faqs={faqs} exclusive={false} />
        </div>
      </section>

      <CtaBanner phone={settings.phone} phoneHref={settings.phoneHref} heading={copy.ctaHeading} subtitle={copy.ctaSubtitle} />
    </>
  )
}

export default FaqPage
