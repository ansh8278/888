import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '../../../../components/Hero'
import { FaqList } from '../../../../components/FaqList'
import { CtaBanner, SectionHead } from '../../../../components/blocks'
import { HeroActions } from '../../../../components/CallButton'
import { ServiceCardGrid, LinkPills, asDocs } from '../../../../components/ServiceBlocks'
import { getLocation, getLocations, getServices, getSiteSettings, getPageCopy, servicesForLocation, regionLabel } from '../../../../lib/data'
import { fillTemplate } from '../../../../lib/template'
import { phoneOf } from '../../../../lib/contact'
import { JsonLd, locationSchema, faqSchema, breadcrumbSchema, absolute } from '../../../../lib/schema'
import type { Faq, Location } from '../../../../payload-types'

export const generateStaticParams = async () => {
  const locations = await getLocations()
  return locations.map((l) => ({ slug: l.slug! }))
}

const parentOf = (location: Location): Location | null =>
  location.parent && typeof location.parent === 'object' ? location.parent : null

/**
 * The questions shown on every city page. They live in Page text (City pages)
 * so staff can edit them; {city} and {arrival} are filled in here, and any
 * question needing {arrival} is dropped until that verified figure exists.
 */
const cityFaqs = (items: { question: string; answer: string }[], vars: Record<string, string | undefined>): Faq[] => {
  const now = new Date().toISOString()
  return items
    .filter((f) => vars.arrival || !`${f.question}${f.answer}`.includes('{arrival}'))
    .map((f, i) => ({
      id: i + 1,
      question: fillTemplate(f.question, vars),
      answer: fillTemplate(f.answer, vars),
      updatedAt: now,
      createdAt: now,
    }))
}

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
  const { slug } = await props.params
  const location = await getLocation(slug)
  if (!location) return {}
  return {
    title: { absolute: location.seo?.title || `Locksmith ${location.city}, ${location.stateAbbr} | Mobile Automotive, Residential & Commercial | 888 Lock & Key` },
    description: location.seo?.description || location.intro || `Licensed mobile locksmith serving ${location.city}, ${location.stateAbbr}.`,
    alternates: { canonical: absolute(`/locations/${location.slug}`) },
    robots: location.seo?.noindex ? { index: false, follow: true } : undefined,
  }
}

/**
 * City page and San Jose district page, per the client's san-jose-locksmith
 * template: breadcrumb → H1 + intro + CTAs → neighborhood pills → 8 service
 * cards → emergency band → FAQs → "Also Serving" nearby links.
 */
const LocationPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params
  const [location, settings, allServices, copy] = await Promise.all([getLocation(slug), getSiteSettings(), getServices(), getPageCopy()])
  if (!location) notFound()

  const phone = phoneOf(settings, location.phone)
  const parent = parentOf(location)
  const services = servicesForLocation(location, allServices).filter((s) => s.cityCard?.text || s.cityCard?.title)
  const nearby = asDocs<Location>(location.nearby)
  const vars = { city: location.city, state: location.state, arrival: settings.averageArrival ?? undefined }
  const faqs = cityFaqs(copy.cityFaqs ?? [], vars)
  const label = (value: string | null | undefined, fallback: string) => fillTemplate(value || fallback, vars)

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Bay Area', href: '/bay-area-locksmith' },
    ...(parent ? [{ label: parent.city, href: `/locations/${parent.slug}` }] : []),
    { label: parent ? location.city : `${location.city} Locksmith`, href: `/locations/${location.slug}` },
  ]

  return (
    <>
      <JsonLd data={locationSchema(settings, location)} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow={location.badge ?? regionLabel(location.subregion)}
        title={`Mobile Locksmith in ${location.city}, ${location.stateAbbr}`}
        intro={location.intro}
        image={location.image ?? settings.defaultHeroImage}
        crumbs={crumbs.map((c, i) => (i === crumbs.length - 1 ? { label: c.label } : c))}
        actions={<HeroActions phone={phone} />}
      />

      {(location.neighbourhoods ?? []).length > 0 ? (
        <section className="sec">
          <div className="wrap">
            <SectionHead
              eyebrow={label(copy.cityNeighborhoodsEyebrow, 'Neighborhoods We Serve')}
              heading={label(copy.cityNeighborhoodsHeading, 'All of {city}')}
            />
            <ul className="pill-list">
              {(location.neighbourhoods ?? []).map((n) => (
                <li key={n.id ?? n.name}>{n.name}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="sec sec-sand">
        <div className="wrap">
          <SectionHead
            eyebrow={label(copy.cityServicesEyebrow, 'Services in {city}')}
            heading={label(copy.cityServicesHeading, 'Locksmith Services Available Here')}
          />
          <ServiceCardGrid services={services} city={location.city} />
        </div>
      </section>

      <CtaBanner
        phone={phone}
        heading={label(copy.cityCtaHeading, 'Locked out in {city} right now?')}
        subtitle={label(copy.cityCtaSubtitle, 'Mobile technicians dispatched across the city.')}
      />

      {faqs.length > 0 ? (
        <section className="sec">
          <div className="wrap narrow">
            <SectionHead eyebrow={label(copy.cityFaqEyebrow, 'Before You Call')} heading={label(copy.cityFaqHeading, '{city} Locksmith FAQs')} />
            <FaqList faqs={faqs} />
          </div>
        </section>
      ) : null}

      {nearby.length > 0 ? (
        <section className="sec sec-sand">
          <div className="wrap">
            <SectionHead eyebrow={label(copy.cityNearbyEyebrow, 'Nearby Areas')} heading={label(copy.cityNearbyHeading, 'Also Serving')} />
            <LinkPills items={nearby.map((n) => ({ href: `/locations/${n.slug}`, label: n.city }))} />
          </div>
        </section>
      ) : null}
    </>
  )
}

export default LocationPage
