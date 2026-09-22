import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '../../../components/Hero'
import { LocationCard, CtaBanner, SectionHead } from '../../../components/blocks'
import { Icon } from '../../../components/Icon'
import { getLocations, getSiteSettings, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, absolute } from '../../../lib/schema'
import { phoneOf } from '../../../lib/contact'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: copy.locations?.title ?? 'Locations We Serve',
    description: copy.locations?.intro ?? undefined,
    alternates: { canonical: absolute('/locations') },
  }
}

const LocationsIndex = async () => {
  const [locations, settings, copy] = await Promise.all([getLocations(), getSiteSettings(), getPageCopy()])

  // Group by state so the page reads as coverage, not a flat list.
  const byState = locations.reduce<Record<string, typeof locations>>((acc, loc) => {
    ;(acc[loc.state] ||= []).push(loc)
    return acc
  }, {})

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Locations', href: '/locations' },
        ])}
      />
      <PageHero
        eyebrow={copy.locations?.eyebrow}
        title={copy.locations?.title ?? 'Find a locksmith near you'}
        intro={copy.locations?.intro ?? settings.serviceAreaLine}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Locations' }]}
      />

      <section className="sec">
        <div className="wrap">
          <div className="city-grid">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </div>
      </section>

      {Object.entries(byState).map(([state, locs]) => (
        <section className="sec sec-sand" key={state}>
          <div className="wrap">
            <SectionHead heading={state} />
            <div className="city-link-grid">
              {locs.map((loc) => (
                <Link key={loc.id} href={`/locations/${loc.slug}`} className="city-link">
                  <Icon name="pin" />
                  <span>
                    <strong>{loc.city}</strong>
                    <em>{loc.hours}</em>
                  </span>
                  <Icon name="arrow" className="city-link-arrow" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      <CtaBanner phone={phoneOf(settings)} heading={copy.ctaHeading} subtitle={copy.ctaSubtitle} />
    </>
  )
}

export default LocationsIndex
