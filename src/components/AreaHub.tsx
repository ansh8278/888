import Link from 'next/link'
import { PageHero } from './Hero'
import { RegionGrid } from './RegionGrid'
import { CtaBanner, SectionHead } from './blocks'
import { HeroActions } from './CallButton'
import { LinkPills } from './ServiceBlocks'
import { phoneOf } from '../lib/contact'
import { fillTemplate } from '../lib/template'
import { SERVICE_AREAS, getLocations, getServices, getSiteSettings, getPageCopy, type ServiceArea } from '../lib/data'
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
        image={
          area.heroImage ? { url: area.heroImage, alt: area.heroAlt } : settings.defaultHeroImage
        }
        crumbs={[crumbs[0], { label: crumbs[1].label }]}
        actions={<HeroActions phone={phone} />}
      />

      <section className="sec">
        <div className="wrap">
          <SectionHead
            eyebrow={copy.hubRegionsEyebrow ?? 'Find Your Area'}
            heading={fillTemplate(copy.hubRegionsHeading || '{area} Service Regions', { area: area.short })}
          />
          <RegionGrid locations={locations} area={area} showBlurb={false} />
        </div>
      </section>

      <CtaBanner
        phone={phone}
        heading={copy.hubCtaHeading ?? 'Need a locksmith right now?'}
        subtitle={`Mobile technicians dispatched across ${area.phrase}.`}
      />

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

      {/* Slim cross-link strip: a full section put one muted sentence in the
          middle of a screenful of white space. */}
      <div className="area-crosslink">
        <div className="wrap">
          <p>
            Also serving{' '}
            {SERVICE_AREAS.filter((a) => a.key !== area.key).map((other, i, arr) => (
              <span key={other.key}>
                <Link href={other.hub}>{other.label}</Link>
                {i < arr.length - 2 ? ', ' : i === arr.length - 2 ? ' and ' : ''}
              </span>
            ))}
            .
          </p>
        </div>
      </div>
    </>
  )
}
