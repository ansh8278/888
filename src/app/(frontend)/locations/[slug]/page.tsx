import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '../../../../components/Hero'
import { FaqList } from '../../../../components/FaqList'
import { CtaBanner, SectionHead } from '../../../../components/blocks'
import { CallButton } from '../../../../components/CallButton'
import { ServiceCardGrid, LinkPills, asDocs } from '../../../../components/ServiceBlocks'
import { getLocation, getLocations, getServices, getSiteSettings, servicesForLocation, regionLabel } from '../../../../lib/data'
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
 * The FAQ block from the client's city template. The arrival-time question
 * only appears once a verified figure has been entered in Site settings —
 * the client's brief is explicit that an untracked estimate must not be
 * published.
 */
const cityFaqs = (city: string, arrival?: string | null): Faq[] => {
  const now = new Date().toISOString()
  const faqs = [
    arrival
      ? { question: `How fast can a technician reach me in ${city}?`, answer: `Our tracked average arrival time for ${city} dispatch is ${arrival}.` }
      : null,
    { question: `Do you cover all of ${city}?`, answer: `Yes — our mobile technicians are dispatched throughout ${city} and the surrounding area.` },
    { question: 'Can you unlock my car without damaging it?', answer: 'Yes. We use non-destructive entry tools designed for modern vehicles, including luxury and imported models.' },
    { question: 'What ID do you need to unlock my home or car?', answer: 'A photo ID matching the address, or for vehicles, a registration, title, or insurance card.' },
  ]
  return faqs.filter(Boolean).map((f, i) => ({ id: i + 1, ...f!, updatedAt: now, createdAt: now }))
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
  const [location, settings, allServices] = await Promise.all([getLocation(slug), getSiteSettings(), getServices()])
  if (!location) notFound()

  const phone = phoneOf(settings, location.phone)
  const parent = parentOf(location)
  const services = servicesForLocation(location, allServices).filter((s) => s.cityCard?.text || s.cityCard?.title)
  const nearby = asDocs<Location>(location.nearby)
  const faqs = cityFaqs(location.city, settings.averageArrival)

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
        actions={
          <>
            <CallButton phone={phone} label="Call Now —" primary />
            <Link href="/book" className="btn-hero-secondary">
              Request Service
            </Link>
          </>
        }
      />

      {(location.neighbourhoods ?? []).length > 0 ? (
        <section className="sec">
          <div className="wrap">
            <SectionHead eyebrow="Neighborhoods We Serve" heading={`All of ${location.city}`} />
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
          <SectionHead eyebrow={`Services in ${location.city}`} heading="Locksmith Services Available Here" />
          <ServiceCardGrid services={services} city={location.city} />
        </div>
      </section>

      <CtaBanner
        phone={phone}
        heading={`Locked out in ${location.city} right now?`}
        subtitle={parent ? 'Mobile technicians dispatched across the area.' : 'Mobile technicians dispatched across the city.'}
      />

      <section className="sec">
        <div className="wrap narrow">
          <SectionHead eyebrow="Before You Call" heading={`${location.city} Locksmith FAQs`} />
          <FaqList faqs={faqs} />
        </div>
      </section>

      {nearby.length > 0 ? (
        <section className="sec sec-sand">
          <div className="wrap">
            <SectionHead eyebrow="Nearby Areas" heading="Also Serving" />
            <LinkPills items={nearby.map((n) => ({ href: `/locations/${n.slug}`, label: n.city }))} />
          </div>
        </section>
      ) : null}
    </>
  )
}

export default LocationPage
