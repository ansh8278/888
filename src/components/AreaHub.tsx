import Link from 'next/link'
import { PageHero } from './Hero'
import { RegionGrid } from './RegionGrid'
import { CtaBanner, SectionHead } from './blocks'
import { HeroActions } from './CallButton'
import { LinkPills } from './ServiceBlocks'
import { phoneOf } from '../lib/contact'
import { getLocations, getServices, getSiteSettings, getPageCopy, type ServiceArea } from '../lib/data'
import { JsonLd, localBusinessSchema, breadcrumbSchema } from '../lib/schema'

/**
 * A service-area hub: every city in that area grouped by region, then the
 * service categories. Shared by the Bay Area and Arizona pages so a new area
 * needs only a route file.
 */
export const AreaHub = async ({ area, title, intro, eyebrow }: { area: ServiceArea; title: string; intro?: string | null; eyebrow?: string | null }) => {
  const [locations, services, settings, copy] = await Promise.all([
    getLocations(),
    getServices(),
    getSiteSettings(),
    getPageCopy(),
  ])
  const phone = phoneOf(settings)
  const categories = services.filter((s) => s.kind === 'category')
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: `${area.short} Locksmith`, href: area.hub },
  ]

  return (
    <>
      <JsonLd data={localBusinessSchema(settings, locations)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow={eyebrow ?? 'Coverage Area'}
        title={title}
        intro={intro}
        image={settings.defaultHeroImage}
        crumbs={[crumbs[0], { label: crumbs[1].label }]}
        actions={<HeroActions phone={phone} />}
      />

      <section className="sec">
        <div className="wrap">
          <SectionHead
            eyebrow={copy.hubRegionsEyebrow ?? 'Find Your Area'}
            heading={copy.hubRegionsHeading ?? 'Service Regions'}
          />
          <RegionGrid locations={locations} area={area} showBlurb={false} />
        </div>
      </section>

      <CtaBanner phone={phone} heading={copy.hubCtaHeading ?? 'Need a locksmith right now?'} subtitle={copy.serviceCtaSubtitle} />

      {categories.length > 0 ? (
        <section className="sec sec-sand">
          <div className="wrap">
            <SectionHead
              eyebrow={copy.serviceRelatedEyebrow ?? 'Related Services'}
              heading={copy.serviceRelatedHeading ?? 'You May Also Need'}
            />
            <LinkPills items={categories.map((c) => ({ href: `/services/${c.slug}`, label: c.title }))} />
          </div>
        </section>
      ) : null}

      <section className="sec">
        <div className="wrap narrow">
          <p className="muted">
            Also serving{' '}
            <Link href={area.key === 'arizona' ? '/bay-area-locksmith' : '/arizona-locksmith'}>
              {area.key === 'arizona' ? 'San Jose & the Bay Area' : 'Arizona — Phoenix Metro Area'}
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
