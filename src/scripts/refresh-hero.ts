/**
 * Re-uploads the default hero photo and points Site settings at it.
 *
 *   npm run images:hero
 *
 * Needed when the picture itself changes — the copy already in the media
 * library keeps serving until it is replaced.
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const file = path.resolve(dirname, '../../seed-assets/hero.webp')
const payload = await getPayload({ config })

const old = await payload.find({ collection: 'media', where: { filename: { contains: 'hero' } }, limit: 20, depth: 0 })
const media = await payload.create({
  collection: 'media',
  data: { alt: '888 Lock & Key technician and mobile service van' },
  filePath: file,
})
await payload.updateGlobal({ slug: 'site-settings', data: { defaultHeroImage: media.id, defaultSeoImage: media.id } })

for (const doc of old.docs) {
  try {
    await payload.delete({ collection: 'media', id: doc.id })
  } catch {
    // Still referenced somewhere — leaving it is harmless.
  }
}
console.log(`Hero replaced (removed ${old.docs.length} old copies).`)
process.exit(0)
