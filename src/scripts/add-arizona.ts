/**
 * Adds (or refreshes) the Arizona service area: the eight Phoenix-metro city
 * pages, their cross-links, and the menu/footer entries.
 *
 *   npm run area:arizona
 *
 * Safe to run again — it matches on slug and updates rather than duplicating.
 * Neighborhood lists are deliberately empty: the client has not supplied them
 * and inventing local areas is not acceptable, so that section simply does
 * not render until they are filled in.
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CITY_CARDS } from '../seed/data'

type City = {
  slug: string
  city: string
  state: string
  stateAbbr: string
  seo_title: string
  meta_description: string
  h1: string
  intro: string
  neighborhoods: string[]
  nearby: string[]
}

const dirname = path.dirname(fileURLToPath(import.meta.url))
const cities: City[] = JSON.parse(readFileSync(path.join(dirname, '../seed/client/arizona-cities.json'), 'utf8')).cities

const payload = await getPayload({ config })

// The same eight service cards every city page shows.
const services = await payload.find({ collection: 'services', limit: 100, depth: 0 })
const cardIds = Object.keys(CITY_CARDS)
  .map((slug) => services.docs.find((s) => s.slug === slug)?.id)
  .filter((id): id is number => Boolean(id))

const existingCount = await payload.count({ collection: 'locations' })
const ids: Record<string, number> = {}

for (const [i, c] of cities.entries()) {
  const found = await payload.find({ collection: 'locations', where: { slug: { equals: c.slug } }, limit: 1, depth: 0 })
  const data = {
    _status: 'published' as const,
    slug: c.slug,
    city: c.city,
    state: c.state,
    stateAbbr: c.stateAbbr,
    subregion: 'phoenix-metro' as const,
    badge: 'Phoenix Metro Area',
    order: 100 + i,
    featured: true,
    intro: c.intro,
    neighbourhoods: c.neighborhoods.map((name) => ({ name })),
    services: cardIds,
    seo: { title: c.seo_title, description: c.meta_description },
  }
  const doc = found.docs[0]
    ? await payload.update({ collection: 'locations', id: found.docs[0].id, data })
    : await payload.create({ collection: 'locations', data })
  ids[c.slug] = doc.id as number
  console.log(`${c.city.padEnd(12)} ${found.docs[0] ? 'updated' : 'created'}`)
}

for (const c of cities) {
  await payload.update({
    collection: 'locations',
    id: ids[c.slug],
    data: { nearby: c.nearby.map((s) => ids[s]).filter(Boolean) },
  })
}

// Menu and footer: add Arizona once, without disturbing what is already there.
const nav: any = await payload.findGlobal({ slug: 'navigation', depth: 0 })
const header = [...(nav.header ?? [])]
if (!header.some((i: any) => i.href === '/arizona-locksmith')) {
  const at = header.findIndex((i: any) => i.href === '/bay-area-locksmith')
  header.splice(at === -1 ? 0 : at + 1, 0, { label: 'Arizona', href: '/arizona-locksmith' })
}
const columns = [...(nav.footerColumns ?? [])]
if (!columns.some((c: any) => c.heading === 'Arizona')) {
  const at = columns.findIndex((c: any) => c.heading === 'Company')
  columns.splice(at === -1 ? columns.length : at, 0, {
    heading: 'Arizona',
    links: cities.slice(0, 4).map((c) => ({ label: c.city, href: `/locations/${c.slug}` })),
  })
}
await payload.updateGlobal({ slug: 'navigation', data: { header, footerColumns: columns } })

console.log(`Locations: ${existingCount.totalDocs} before, ${(await payload.count({ collection: 'locations' })).totalDocs} now.`)
process.exit(0)
