import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '../../../components/Hero'
import { RegionGrid } from '../../../components/RegionGrid'
import { CtaBanner, SectionHead } from '../../../components/blocks'
import { HeroActions } from '../../../components/CallButton'
import { LinkPills } from '../../../components/ServiceBlocks'
import { getLocations, getServices, getSiteSettings, getPageCopy } from '../../../lib/data'
import { phoneOf } from '../../../lib/contact'
import { JsonLd, localBusinessSchema, breadcrumbSchema, absolute } from '../../../lib/schema'

const HUB_TITLE = 'Mobile Locksmith Serving San Jose & the Entire Bay Area'

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSiteSettings()
  return {
    // The client's exact title; description adds Tri-Valley to the client's meta (their own city list includes it — KI-2).
    title: { absolute: `Bay Area Locksmith | Mobile Locksmith Serving San Jose & the Bay Area | ${settings.companyName}` },
    description: `${settings.companyName} provides mobile locksmith services throughout San Jose and the Bay Area — South Bay, Peninsula, East Bay & Tri-Valley.`,
    alternates: { canonical: absolute('/bay-area-locksmith') },
  }
}

/**
 * The Bay Area hub (client: bay-area-locksmith.html): every city grouped by
 * region, then the four service categories. The San Jose districts are
 * deliberately left out — they are reached through the San Jose page.
 */
const BayAreaPage = async () => {
  const [locations, services, settings, copy] = await Promise.all([getLocations(), getServices(), getSiteSettings(), getPageCopy()])
  const phone = phoneOf(settings)
  const categories = services.filter((s) => s.kind === 'category')
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Bay Area Locksmith', href: '/bay-area-locksmith' },
  ]

  return (
    <>
      <JsonLd data={localBusinessSchema(settings, locations)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow={copy.locations?.eyebrow ?? 'Coverage Area'}
        title={copy.locations?.title ?? HUB_TITLE}
        intro={copy.locations?.intro}
        image={settings.defaultHeroImage}
        crumbs={[crumbs[0], { label: crumbs[1].label }]}
        actions={<HeroActions phone={phone} />}
      />

      <section className="sec">
        <div className="wrap">
          <SectionHead
            eyebrow={copy.hubRegionsEyebrow ?? 'Find Your Area'}
            heading={copy.hubRegionsHeading ?? 'Bay Area Service Regions'}
          />
          <RegionGrid locations={locations} showBlurb={false} />
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
    </>
  )
}

export default BayAreaPage
