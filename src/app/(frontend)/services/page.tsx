import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { ServiceCard, CtaBanner } from '../../../components/blocks'
import { getServices, getSiteSettings, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, absolute } from '../../../lib/schema'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: copy.services?.title ?? 'Locksmith Services',
    description: copy.services?.intro ?? undefined,
    alternates: { canonical: absolute('/services') },
  }
}

const ServicesIndex = async () => {
  const [services, settings, copy] = await Promise.all([getServices(), getSiteSettings(), getPageCopy()])

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
        ])}
      />
      <PageHero
        eyebrow={copy.services?.eyebrow}
        title={copy.services?.title ?? 'Locksmith Services'}
        intro={copy.services?.intro}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
      />

      <section className="sec">
        <div className="wrap">
          <div className="services-grid-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <CtaBanner phone={settings.phone} phoneHref={settings.phoneHref} heading={copy.ctaHeading} subtitle={copy.ctaSubtitle} />
    </>
  )
}

export default ServicesIndex
