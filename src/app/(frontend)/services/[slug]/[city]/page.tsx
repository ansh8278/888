import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '../../../../../components/Hero'
import { FaqList } from '../../../../../components/FaqList'
import { CtaBanner, ReviewCard, SectionHead } from '../../../../../components/blocks'
import { Icon } from '../../../../../components/Icon'
import {
  getService,
  getLocation,
  getServices,
  getLocations,
  getSiteSettings,
  getComboTemplate,
  getComboPairs,
  getReviews,
  servicesForLocation,
} from '../../../../../lib/data'
import { JsonLd, serviceSchema, faqSchema, breadcrumbSchema, locationSchema, absolute } from '../../../../../lib/schema'
import { fillTemplate } from '../../../../../lib/template'
import type { Faq } from '../../../../../payload-types'
import { CallButton } from '../../../../../components/CallButton'
import { phoneOf } from '../../../../../lib/contact'

export const generateStaticParams = async () => {
  const pairs = await getComboPairs()
  return pairs.map(({ service, location }) => ({ slug: service.slug!, city: location.slug! }))
}

/** Shared by the metadata and the page so the two can never disagree. */
const load = async (slug: string, city: string) => {
  const [service, location, settings, template] = await Promise.all([
    getService(slug),
    getLocation(city),
    getSiteSettings(),
    getComboTemplate(),
  ])
  if (!service || !location || !template?.enabled) return null

  // A location may restrict which services it offers; do not invent a page for
  // a combination the business does not actually serve.
  const all = await getServices()
  const offered = servicesForLocation(location, all).some((s) => s.id === service.id)
  if (!offered) return null

  const vars = {
    service: service.title,
    city: location.city,
    state: location.state,
    phone: settings.phone,
    arrival: settings.averageArrival ?? '',
    price: service.startingPrice,
  }
  return { service, location, settings, template, vars }
}

export const generateMetadata = async (props: {
  params: Promise<{ slug: string; city: string }>
}): Promise<Metadata> => {
  const { slug, city } = await props.params
  const data = await load(slug, city)
  if (!data) return {}
  const { template, vars, service, location } = data
  return {
    title: fillTemplate(template.seoTitle, vars) || `${service.title} in ${location.city}`,
    description: fillTemplate(template.seoDescription, vars) || service.intro,
    alternates: { canonical: absolute(`/services/${slug}/${city}`) },
  }
}

const ComboPage = async (props: { params: Promise<{ slug: string; city: string }> }) => {
  const { slug, city } = await props.params
  const data = await load(slug, city)
  if (!data) notFound()

  const { service, location, settings, template, vars } = data
  const [allReviews, allServices] = await Promise.all([getReviews(), getServices()])

  const faqs = ((service.faqs ?? []) as (number | Faq)[]).filter(
    (f): f is Faq => typeof f === 'object',
  )

  // Prefer reviews actually left in this city, fall back to the general ones.
  const localReviews = allReviews.filter((r) =>
    (r.cityLabel ?? '').toLowerCase().includes(location.city.toLowerCase()),
  )
  const reviews = (localReviews.length > 0 ? localReviews : allReviews).slice(0, 3)

  const otherServices = servicesForLocation(location, allServices).filter((s) => s.id !== service.id)

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: service.title, href: `/services/${service.slug}` },
    { label: location.city, href: `/services/${service.slug}/${location.slug}` },
  ]

  return (
    <>
      <JsonLd data={serviceSchema(settings, service, location.city)} />
      <JsonLd data={locationSchema(settings, location)} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow={fillTemplate(template.eyebrow, vars)}
        title={fillTemplate(template.heading, vars) || `${service.title} in ${location.city}`}
        intro={fillTemplate(template.intro, vars)}
        image={location.image ?? service.heroImage ?? settings.defaultHeroImage}
        crumbs={crumbs.map((c, i) => (i === crumbs.length - 1 ? { label: c.label } : c))}
      />

      <section className="sec">
        <div className="wrap detail-layout">
          <div className="detail-main">
            {template.bodyHeading ? <h2>{fillTemplate(template.bodyHeading, vars)}</h2> : null}
            {template.body ? <p className="lead-para">{fillTemplate(template.body, vars)}</p> : null}

            {(service.bullets ?? []).length > 0 ? (
              <div className="bullet-card">
                <h2>
                  {service.title} in {location.city} covers
                </h2>
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

            {(location.neighbourhoods ?? []).length > 0 ? (
              <div className="area-card">
                <h2>Areas we cover in {location.city}</h2>
                <ul className="area-list">
                  {(location.neighbourhoods ?? []).map((n) => (
                    <li key={n.id ?? n.name}>{n.name}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="detail-aside">
            <div className="price-card">
              <div className="price-card-label">
                {service.title} in {location.city}
              </div>
              <div className="price-card-value">{service.startingPrice}</div>
              {service.priceNote ? <p className="price-card-note">{service.priceNote}</p> : null}
              <CallButton phone={phoneOf(settings, location.phone)} className="btn-hero-primary price-card-cta" primary />
              <Link href="/book" className="btn-hero-secondary price-card-cta">
                Request Service
              </Link>
              {location.addressLine ? (
                <div className="price-card-address">
                  <Icon name="pin" />
                  <span>
                    {location.addressLine}
                    <br />
                    {location.city}, {location.stateAbbr} {location.postcode}
                  </span>
                </div>
              ) : null}
              {location.hours ? (
                <div className="loc-open-status">
                  <span className="livedot" /> {location.hours}
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      {reviews.length > 0 ? (
        <section className="sec sec-sand">
          <div className="wrap">
            <SectionHead heading={`What ${location.city} customers say`} />
            <div className="review-static-grid">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {otherServices.length > 0 ? (
        <section className="sec">
          <div className="wrap">
            <SectionHead heading={`Other services in ${location.city}`} />
            <div className="city-link-grid">
              {otherServices.map((s) => (
                <Link key={s.id} href={`/services/${s.slug}/${location.slug}`} className="city-link">
                  <Icon name={(s.icon ?? 'lock') as 'car'} />
                  <span>
                    {s.title} in {location.city}
                  </span>
                  <Icon name="arrow" className="city-link-arrow" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {faqs.length > 0 ? (
        <section className="sec sec-sand">
          <div className="wrap narrow">
            <div className="sec-head-center">
              <div>
                <h2>Common questions</h2>
              </div>
            </div>
            <FaqList faqs={faqs} />
          </div>
        </section>
      ) : null}

      <CtaBanner
        phone={phoneOf(settings, location.phone)}
        heading={fillTemplate(template.ctaHeading, vars) || `Need ${service.title} in ${location.city}?`}
      />
    </>
  )
}

export default ComboPage
