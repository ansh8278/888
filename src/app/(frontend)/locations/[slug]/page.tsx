import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '../../../../components/Hero'
import { FaqList } from '../../../../components/FaqList'
import { Prose, CtaBanner, SectionHead, ReviewCard, PricingTable } from '../../../../components/blocks'
import { Icon } from '../../../../components/Icon'
import {
  getLocation,
  getLocations,
  getServices,
  getSiteSettings,
  getReviews,
  getHomeFaqs,
  servicesForLocation,
} from '../../../../lib/data'
import { JsonLd, locationSchema, faqSchema, breadcrumbSchema } from '../../../../lib/schema'

export const generateStaticParams = async () => {
  const locations = await getLocations()
  return locations.map((l) => ({ slug: l.slug! }))
}

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> => {
  const { slug } = await props.params
  const location = await getLocation(slug)
  if (!location) return {}
  return {
    title: location.seo?.title || `Locksmith in ${location.city}, ${location.stateAbbr} — 24/7 Mobile`,
    description:
      location.seo?.description ||
      location.intro ||
      `24/7 mobile locksmith serving ${location.city}, ${location.state}. Cars, homes and businesses.`,
    alternates: { canonical: `/locations/${location.slug}` },
    robots: location.seo?.noindex ? { index: false, follow: true } : undefined,
  }
}

const LocationPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params
  const [location, settings, allServices, allReviews, faqs] = await Promise.all([
    getLocation(slug),
    getSiteSettings(),
    getServices(),
    getReviews(),
    getHomeFaqs(),
  ])

  if (!location) notFound()

  const services = servicesForLocation(location, allServices)
  const localReviews = allReviews.filter((r) =>
    (r.cityLabel ?? '').toLowerCase().includes(location.city.toLowerCase()),
  )
  const reviews = (localReviews.length > 0 ? localReviews : allReviews).slice(0, 3)

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Locations', href: '/locations' },
    { label: location.city, href: `/locations/${location.slug}` },
  ]

  return (
    <>
      <JsonLd data={locationSchema(settings, location)} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow={location.badge ?? location.state}
        title={`Locksmith in ${location.city}`}
        intro={location.intro}
        image={location.image ?? settings.defaultHeroImage}
        crumbs={crumbs.map((c, i) => (i === crumbs.length - 1 ? { label: c.label } : c))}
      />

      <section className="sec">
        <div className="wrap detail-layout">
          <div className="detail-main">
            <Prose data={location.body} />
          </div>

          <aside className="detail-aside">
            <div className="price-card">
              <div className="price-card-label">{location.shopName ?? location.city}</div>
              {location.shopSubtitle ? (
                <p className="price-card-note">{location.shopSubtitle}</p>
              ) : null}

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

              <a href={`tel:${location.phone || settings.phoneHref}`} className="btn-hero-primary price-card-cta" data-call-cta>
                <Icon name="phone" />
                Call {location.phone || settings.phone}
              </a>
              <Link href="/book" className="btn-hero-secondary price-card-cta">
                Request Service
              </Link>

              {location.hours ? (
                <div className="loc-open-status">
                  <span className="livedot" /> {location.hours}
                </div>
              ) : null}

              {location.mapUrl ? (
                <a href={location.mapUrl} target="_blank" rel="noopener noreferrer" className="map-link">
                  Get directions <Icon name="arrow" />
                </a>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      <section className="sec sec-sand">
        <div className="wrap">
          <SectionHead
            heading={`Services in ${location.city}`}
            subtitle={`Everything we do, available across ${location.city} and the surrounding area.`}
          />
          <div className="city-link-grid">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}/${location.slug}`}
                className="city-link"
              >
                <Icon name={(service.icon ?? 'lock') as 'car'} />
                <span>
                  <strong>{service.title}</strong>
                  <em>{service.startingPrice}</em>
                </span>
                <Icon name="arrow" className="city-link-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {(location.neighbourhoods ?? []).length > 0 ? (
        <section className="sec">
          <div className="wrap">
            <SectionHead heading={`Areas we cover around ${location.city}`} />
            <ul className="area-list wide">
              {(location.neighbourhoods ?? []).map((n) => (
                <li key={n.id ?? n.name}>{n.name}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="sec sec-sand">
        <div className="wrap">
          <SectionHead heading="Pricing" subtitle="Starting prices. Your technician confirms the exact quote first." />
          <PricingTable services={services.filter((s) => s.showInPricingTable)} />
        </div>
      </section>

      {reviews.length > 0 ? (
        <section className="sec">
          <div className="wrap">
            <SectionHead heading={`Reviews from ${location.city}`} link={{ href: '/reviews', label: 'All reviews' }} />
            <div className="review-static-grid">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
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
                <h2>Questions</h2>
              </div>
            </div>
            <FaqList faqs={faqs} />
          </div>
        </section>
      ) : null}

      <CtaBanner
        phone={location.phone || settings.phone}
        phoneHref={location.phone || settings.phoneHref}
        heading={`Need a locksmith in ${location.city}?`}
      />
    </>
  )
}

export default LocationPage
