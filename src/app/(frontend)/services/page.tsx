import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { ServiceCard, CtaBanner, SectionHead } from '../../../components/blocks'
import { getServices, getSiteSettings, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, absolute } from '../../../lib/schema'
import { phoneOf } from '../../../lib/contact'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: { absolute: `Locksmith Services | San Jose & Bay Area | ${(await getSiteSettings()).companyName}` },
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
          <div className="services-grid-4">
            {services
              .filter((s) => s.kind === 'category')
              .map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
          </div>
        </div>
      </section>

      {services.some((s) => s.kind === 'standalone') ? (
        <section className="sec sec-sand">
          <div className="wrap">
            <SectionHead eyebrow="Also" heading="Specialist services" />
            <div className="services-grid-4">
              {services
                .filter((s) => s.kind === 'standalone')
                .map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBanner phone={phoneOf(settings)} heading={copy.ctaHeading} subtitle={copy.ctaSubtitle} />
    </>
  )
}

export default ServicesIndex
