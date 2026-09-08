import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { ServiceCard, CtaBanner } from '../../../components/blocks'
import { getServices, getSiteSettings } from '../../../lib/data'
import { JsonLd, breadcrumbSchema } from '../../../lib/schema'

export const metadata: Metadata = {
  title: 'Locksmith Services',
  description:
    'Car lockouts, home lockouts, rekeying, car keys and fobs, smart locks and commercial access control. 24/7 mobile service with upfront pricing.',
  alternates: { canonical: '/services' },
}

const ServicesIndex = async () => {
  const [services, settings] = await Promise.all([getServices(), getSiteSettings()])

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
        ])}
      />
      <PageHero
        eyebrow="One call. Every solution."
        title="Locksmith Services"
        intro="Cars, homes and businesses — handled by our own background-checked technicians, 24 hours a day, at a price agreed before we set off."
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

      <CtaBanner phone={settings.phone} phoneHref={settings.phoneHref} />
    </>
  )
}

export default ServicesIndex
