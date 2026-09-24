/**
 * Uploads the four category photos and attaches them to the matching service.
 *
 *   npm run images:services
 *
 * Safe to run again: an existing upload with the same name is replaced, and
 * a service that already has its own photo set in the admin is left alone
 * unless you pass "force".
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.resolve(dirname, '../../seed-assets/services')

const IMAGES: Record<string, string> = {
  'automotive-locksmith': 'Locksmith opening a car door beside the 888 Lock & Key van at sunset',
  'residential-locksmith': 'Locksmith fitting a front-door lock at a Bay Area home',
  'commercial-locksmith': 'Locksmith servicing a glass office door lock',
  'emergency-locksmith': 'Locksmith opening a front door for a customer at night',
}

const force = process.argv.includes('force')
const payload = await getPayload({ config })

for (const [slug, alt] of Object.entries(IMAGES)) {
  const found = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  const service = found.docs[0]
  if (!service) {
    console.log(`${slug.padEnd(24)} no such service — skipped`)
    continue
  }
  if (service.heroImage && !force) {
    console.log(`${slug.padEnd(24)} already has a photo — skipped (pass "force" to replace)`)
    continue
  }

  const filename = `${slug}.webp`
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1, depth: 0 })
  for (const old of existing.docs) await payload.delete({ collection: 'media', id: old.id })

  const media = await payload.create({ collection: 'media', data: { alt }, filePath: path.join(ASSETS, filename) })
  await payload.update({ collection: 'services', id: service.id, data: { heroImage: media.id } })
  console.log(`${slug.padEnd(24)} photo attached`)
}

process.exit(0)
