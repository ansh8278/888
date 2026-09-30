/**
 * Regroups the footer links.
 *
 *   npm run footer:tidy
 *
 * Seven columns (Services, four Bay Area regions, Arizona, Company) wrapped on
 * to a second row and left a gap. Cities are grouped by state instead —
 * Services, Bay Area, Arizona, Company — which fits one row and matches how
 * the business describes itself. Regions are still shown on the hub pages.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { SERVICE_AREAS } from '../lib/data'

const payload = await getPayload({ config })

const services = await payload.find({ collection: 'services', limit: 100, depth: 0, sort: 'order' })
const locations = await payload.find({ collection: 'locations', limit: 100, depth: 0, sort: 'order' })
const cities = (abbr: string) => locations.docs.filter((l) => l.stateAbbr === abbr && !l.parent)

const columns = [
  {
    heading: 'Services',
    links: services.docs
      .filter((s) => s.kind === 'category' || s.kind === 'standalone')
      .map((s) => ({ label: s.title.replace(/ Services?$/i, ''), href: `/services/${s.slug}` })),
  },
  ...SERVICE_AREAS.map((area) => ({
    heading: area.short,
    links: [
      ...cities(area.stateAbbr)
        .slice(0, 8)
        .map((l) => ({ label: l.city, href: `/locations/${l.slug}` })),
      { label: `All ${area.short} areas`, href: area.hub },
    ],
  })),
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Contact', href: '/contact' },
      { label: 'Request Service', href: '/book' },
    ],
  },
]

const nav: any = await payload.findGlobal({ slug: 'navigation', depth: 0 })
await payload.updateGlobal({ slug: 'navigation', data: { header: nav.header, footerColumns: columns } })
console.log(`Footer regrouped into ${columns.length} columns: ${columns.map((c) => `${c.heading} (${c.links.length})`).join(', ')}`)
process.exit(0)
