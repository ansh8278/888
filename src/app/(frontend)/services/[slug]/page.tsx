import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '../../../../components/Hero'
import { FaqList } from '../../../../components/FaqList'
import { Prose, CtaBanner, SectionHead } from '../../../../components/blocks'
import { Icon } from '../../../../components/Icon'
import { getService, getServices, getLocations, getSiteSettings, getPageCopy } from '../../../../lib/data'
import { JsonLd, serviceSchema, faqSchema, breadcrumbSchema, absolute } from '../../../../lib/schema'
import type { Faq } from '../../../../payload-types'
import { CallButton } from '../../../../components/CallButton'
import { phoneOf } from '../../../../lib/contact'

export const generateStaticParams = async () => {
  const services = await getServices()
  return services.map((s) => ({ slug: s.slug! }))
}

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> => {
  const { slug } = await props.params
  const service = await getService(slug)
  if (!service) return {}
  return {
    title: service.seo?.title || `${service.title} — 24/7 Mobile Locksmith`,
    description: service.seo?.description || service.intro,
    alternates: { canonical: absolute(`/services/${service.slug}`) },
    robots: service.seo?.noindex ? { index: false, follow: true } : undefined,
  }
}

const ServicePage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params
  const [service, settings, locations, copy] = await Promise.all([
    getService(slug),
    getSiteSettings(),
    getLocations(),
    getPageCopy(),
  ])

  if (!service) notFound()

  const faqs = ((service.faqs ?? []) as (number | Faq)[]).filter(
    (f): f is Faq => typeof f === 'object',
  )

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: service.title, href: `/services/${service.slug}` },
  ]

  return (
    <>
      <JsonLd data={serviceSchema(settings, service)} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow={`From ${service.startingPrice}`}
        title={service.title}
        intro={service.intro}
        image={service.heroImage ?? settings.defaultHeroImage}
        crumbs={crumbs.map((c, i) => (i === crumbs.length - 1 ? { label: c.label } : c))}
      />

      <section className="sec">
        <div className="wrap detail-layout">
          <div className="detail-main">
            <Prose data={service.body} />

            {(service.bullets ?? []).length > 0 ? (
              <div className="bullet-card">
                <h2>What&rsquo;s included</h2>
                <ul className="check-list">
                  {(service.bullets ?? []).map((b) => (
                    <li key={b.id ?? b.text}>
                      <Icon name="check" />
                      {b.text}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="detail-aside">
            <div className="price-card">
              <div className="price-card-label">Starting at</div>
              <div className="price-card-value">{service.startingPrice}</div>
              {service.priceNote ? <p className="price-card-note">{service.priceNote}</p> : null}
              <CallButton phone={phoneOf(settings)} className="btn-hero-primary price-card-cta" primary />
              <Link href="/book" className="btn-hero-secondary price-card-cta">
                Request Service
              </Link>
              <div className="price-card-note">
                {settings.hours} · Average arrival {settings.averageArrival}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* The combo pages: this is the internal linking that makes them findable. */}
      <section className="sec sec-sand">
        <div className="wrap">
          <SectionHead
            heading={`${service.title} near you`}
            subtitle={copy.serviceCitySubtitle}
          />
          <div className="city-link-grid">
            {locations.map((location) => (
              <Link
                key={location.id}
                href={`/services/${service.slug}/${location.slug}`}
                className="city-link"
              >
                <Icon name="pin" />
                <span>
                  {service.title} in {location.city}
                </span>
                <Icon name="arrow" className="city-link-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {faqs.length > 0 ? (
        <section className="sec">
          <div className="wrap narrow">
            <div className="sec-head-center">
              <div>
                <h2>Questions about {service.title.toLowerCase()}</h2>
              </div>
            </div>
            <FaqList faqs={faqs} />
          </div>
        </section>
      ) : null}

      <CtaBanner
        phone={phoneOf(settings)}
        heading={`Need ${service.title.toLowerCase()} now?`}
      />
    </>
  )
}

export default ServicePage
