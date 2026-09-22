import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '../../../../components/Hero'
import { FaqList } from '../../../../components/FaqList'
import { Prose, CtaBanner, SectionHead } from '../../../../components/blocks'
import { CallButton } from '../../../../components/CallButton'
import { Icon } from '../../../../components/Icon'
import { ServiceCardGrid, AreasWeServe, LinkPills, asDocs } from '../../../../components/ServiceBlocks'
import { getService, getServices, getLocations, getSiteSettings } from '../../../../lib/data'
import { phoneOf } from '../../../../lib/contact'
import { JsonLd, serviceSchema, faqSchema, breadcrumbSchema, absolute } from '../../../../lib/schema'
import type { Faq, Service } from '../../../../payload-types'

export const generateStaticParams = async () => {
  const services = await getServices()
  return services.map((s) => ({ slug: s.slug! }))
}

const categoryOf = (service: Service): Service | null =>
  service.category && typeof service.category === 'object' ? service.category : null

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
  const { slug } = await props.params
  const service = await getService(slug)
  if (!service) return {}
  return {
    title: { absolute: service.seo?.title || `${service.title} | San Jose & Bay Area | 888 Lock & Key` },
    description: service.seo?.description || service.intro,
    alternates: { canonical: absolute(`/services/${service.slug}`) },
    robots: service.seo?.noindex ? { index: false, follow: true } : undefined,
  }
}

/**
 * One route, three renderings from the client's prototypes:
 *  - category (Automotive, Residential): its services as cards
 *  - category (Commercial, Emergency) / standalone (Garage): "What's
 *    included" checklist — Garage also carries its lock-only disclaimer
 *  - service (Car Lockout…): nested under its category in the breadcrumb
 * then, on every page: emergency band → Areas We Serve → Related Services.
 */
const ServicePage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params
  const [service, allServices, locations, settings] = await Promise.all([getService(slug), getServices(), getLocations(), getSiteSettings()])
  if (!service) notFound()

  const phone = phoneOf(settings)
  const category = categoryOf(service)
  const subservices = service.kind === 'category' ? allServices.filter((s) => categoryOf(s)?.id === service.id) : []
  const related = asDocs<Service>(service.related)
  const faqs = asDocs<Faq>(service.faqs)

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    ...(category ? [{ label: category.title, href: `/services/${category.slug}` }] : []),
    { label: service.title, href: `/services/${service.slug}` },
  ]
  const eyebrow = category ? category.title : service.kind === 'category' ? 'Service Category' : 'Service'
  const shortName = service.title.replace(/ Services?$/i, '').toLowerCase()

  return (
    <>
      <JsonLd data={serviceSchema(settings, service)} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow={eyebrow}
        title={service.title}
        intro={service.intro}
        image={service.heroImage ?? settings.defaultHeroImage}
        crumbs={crumbs.map((c, i) => (i === crumbs.length - 1 ? { label: c.label } : c))}
        actions={
          <>
            <CallButton phone={phone} label={service.ctaLabel || 'Call Now —'} hideNumber={Boolean(service.ctaLabel)} primary />
            <Link href="/book" className="btn-hero-secondary">
              Request Service
            </Link>
          </>
        }
      />

      {service.disclaimer ? (
        <section className="sec sec-tight">
          <div className="wrap">
            <p className="disclaimer-box">⚠ {service.disclaimer}</p>
          </div>
        </section>
      ) : null}

      {subservices.length > 0 ? (
        <section className="sec">
          <div className="wrap">
            <SectionHead eyebrow={service.title} heading="What's included" />
            <ServiceCardGrid services={subservices} />
          </div>
        </section>
      ) : null}

      {(service.bullets ?? []).length > 0 ? (
        <section className="sec">
          <div className="wrap">
            <SectionHead eyebrow={service.title} heading="What's included" />
            <ul className="check-grid">
              {(service.bullets ?? []).map((b) => (
                <li key={b.id ?? b.text}>
                  <Icon name="check" />
                  {b.text}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {service.body ? (
        <section className="sec">
          <div className="wrap narrow">
            <Prose data={service.body} />
          </div>
        </section>
      ) : null}

      <CtaBanner
        phone={phone}
        heading={`Need ${shortName} right now?`}
        subtitle="Mobile technicians dispatched across San Jose & the Bay Area."
        label={service.ctaLabel}
      />

      <section className="sec">
        <div className="wrap">
          <SectionHead eyebrow="Where We Cover This Service" heading="Areas We Serve" />
          <AreasWeServe locations={locations} />
        </div>
      </section>

      {faqs.length > 0 ? (
        <section className="sec sec-sand">
          <div className="wrap narrow">
            <SectionHead eyebrow="Before You Call" heading={`Questions about ${shortName}`} />
            <FaqList faqs={faqs} />
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="sec">
          <div className="wrap">
            <SectionHead eyebrow="Related Services" heading="You May Also Need" />
            <LinkPills items={related.map((r) => ({ href: `/services/${r.slug}`, label: r.title }))} />
          </div>
        </section>
      ) : null}
    </>
  )
}

export default ServicePage
