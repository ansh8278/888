import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'
import { cache } from 'react'
import type { Service, Location, Review, Faq, Page } from '../payload-types'

const client = async () => getPayload({ config })

/**
 * Collections with drafts enabled keep unpublished work in the same table, so
 * every public query must exclude it — otherwise a half-written edit would
 * appear on the live site the moment it was saved.
 */
const published: Where = { _status: { equals: 'published' } }

/**
 * All reads are wrapped in React's `cache` so a page that needs the phone
 * number in the header, the hero and the footer still only hits the DB once.
 */

export const getSiteSettings = cache(async () => {
  const payload = await client()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getNavigation = cache(async () => {
  const payload = await client()
  return payload.findGlobal({ slug: 'navigation', depth: 1 })
})

export const getHomePage = cache(async () => {
  const payload = await client()
  return payload.findGlobal({ slug: 'home-page', depth: 1 })
})

export const getPageCopy = cache(async () => {
  const payload = await client()
  return payload.findGlobal({ slug: 'page-copy', depth: 0 })
})

export const getComboTemplate = cache(async () => {
  const payload = await client()
  return payload.findGlobal({ slug: 'combo-template', depth: 0 })
})

export const getServices = cache(async (): Promise<Service[]> => {
  const payload = await client()
  const res = await payload.find({
    collection: 'services',
    where: published,
    limit: 100,
    sort: 'order',
    depth: 1,
  })
  return res.docs
})

export const getService = cache(async (slug: string): Promise<Service | null> => {
  const payload = await client()
  const res = await payload.find({
    collection: 'services',
    where: { and: [published, { slug: { equals: slug } }] },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
})

export const getLocations = cache(async (): Promise<Location[]> => {
  const payload = await client()
  const res = await payload.find({
    collection: 'locations',
    where: published,
    limit: 100,
    sort: 'order',
    depth: 1,
  })
  return res.docs
})

export const getLocation = cache(async (slug: string): Promise<Location | null> => {
  const payload = await client()
  const res = await payload.find({
    collection: 'locations',
    where: { and: [published, { slug: { equals: slug } }] },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
})

export const getReviews = cache(async (featuredOnly = false): Promise<Review[]> => {
  const payload = await client()
  const res = await payload.find({
    collection: 'reviews',
    limit: 100,
    sort: 'order',
    depth: 0,
    ...(featuredOnly ? { where: { featured: { equals: true } } } : {}),
  })
  return res.docs
})

export const getHomeFaqs = cache(async (): Promise<Faq[]> => {
  const payload = await client()
  const res = await payload.find({
    collection: 'faqs',
    where: { showOnHome: { equals: true } },
    limit: 100,
    sort: 'order',
    depth: 0,
  })
  return res.docs
})

export const getAllFaqs = cache(async (): Promise<Faq[]> => {
  const payload = await client()
  const res = await payload.find({ collection: 'faqs', limit: 200, sort: 'order', depth: 0 })
  return res.docs
})

export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const payload = await client()
  const res = await payload.find({
    collection: 'pages',
    where: { and: [published, { slug: { equals: slug } }] },
    limit: 1,
    depth: 1,
  })
  return res.docs[0] ?? null
})

export const getPages = cache(async (): Promise<Page[]> => {
  const payload = await client()
  const res = await payload.find({ collection: 'pages', where: published, limit: 100, depth: 0 })
  return res.docs
})

/**
 * Which services are offered in a given city. A location with no services
 * selected offers everything — that way adding a new service does not require
 * editing all six locations.
 */
export const servicesForLocation = (location: Location, all: Service[]): Service[] => {
  const picked = location.services
  if (!picked || (Array.isArray(picked) && picked.length === 0)) return all
  const ids = (picked as (number | Service)[]).map((s) => (typeof s === 'object' ? s.id : s))
  return all.filter((s) => ids.includes(s.id))
}

/** Every service-in-city pair the site should generate a page for. */
export const getComboPairs = cache(async () => {
  const [services, locations, template] = await Promise.all([
    getServices(),
    getLocations(),
    getComboTemplate(),
  ])
  if (!template?.enabled) return []
  return locations.flatMap((location) =>
    servicesForLocation(location, services).map((service) => ({ location, service })),
  )
})

/**
 * The service areas the business covers. Each has its own hub page and its own
 * regions; a city belongs to one through its state. Adding a third state is a
 * new entry here plus its cities — no page needs to change.
 */
export const SERVICE_AREAS = [
  {
    key: 'bay-area',
    stateAbbr: 'CA',
    label: 'San Jose & the Bay Area',
    short: 'Bay Area',
    hub: '/bay-area-locksmith',
    regions: [
      { key: 'south-bay', label: 'South Bay / Silicon Valley', short: 'South Bay' },
      { key: 'peninsula', label: 'Peninsula', short: 'Peninsula' },
      { key: 'east-bay', label: 'East Bay', short: 'East Bay' },
      { key: 'tri-valley', label: 'Tri-Valley', short: 'Tri-Valley' },
    ],
  },
  {
    key: 'arizona',
    stateAbbr: 'AZ',
    label: 'Arizona — Phoenix Metro Area',
    short: 'Arizona',
    hub: '/arizona-locksmith',
    regions: [{ key: 'phoenix-metro', label: 'Phoenix Metro Area', short: 'Phoenix Metro' }],
  },
] as const

export type ServiceArea = (typeof SERVICE_AREAS)[number]
export type Region = ServiceArea['regions'][number]

export const REGIONS: readonly Region[] = SERVICE_AREAS.flatMap((a) => a.regions as readonly Region[])

/** Cities only — districts (which have a parent) are reached via their city. */
export const cityLocations = (all: Location[]): Location[] => all.filter((l) => !l.parent)

/** The service area a city belongs to, by state. Falls back to the first area. */
export const areaOf = (location: Pick<Location, 'stateAbbr'> | null | undefined): ServiceArea =>
  SERVICE_AREAS.find((a) => a.stateAbbr === location?.stateAbbr) ?? SERVICE_AREAS[0]

/** Cities of one service area, grouped by region; empty regions dropped. */
export const regionsOf = (area: ServiceArea, all: Location[]) =>
  (area.regions as readonly Region[])
    .map((r) => ({ ...r, cities: cityLocations(all).filter((l) => l.stateAbbr === area.stateAbbr && l.subregion === r.key) }))
    .filter((r) => r.cities.length > 0)

/** Every service area that actually has cities, with those cities grouped. */
export const serviceAreasWithCities = (all: Location[]) =>
  SERVICE_AREAS.map((area) => ({ area, regions: regionsOf(area, all) })).filter((a) => a.regions.length > 0)

export const regionLabel = (key: string | null | undefined): string =>
  REGIONS.find((r) => r.key === key)?.label ?? 'Service area'
