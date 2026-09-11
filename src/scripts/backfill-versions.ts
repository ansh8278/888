/**
 * Gives every existing document its first version entry.
 *
 * Needed once after enabling `versions` on a collection that already has data:
 * the admin list reads from the versions table, so documents created before
 * versions existed simply do not appear — "No Results" even though the site
 * shows them fine. Re-saving each one as published writes that first entry
 * without changing any content. Safe to run repeatedly.
 *
 *   npm run versions:backfill
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const versioned = payload.config.collections
  .filter((c) => c.versions)
  .map((c) => c.slug)

for (const collection of versioned) {
  const { docs } = await payload.find({ collection, limit: 500, depth: 0, draft: false })
  for (const doc of docs) {
    await payload.update({ collection, id: doc.id, data: { _status: 'published' }, draft: false })
  }
  const visible = await payload.find({ collection, limit: 500, depth: 0, draft: true })
  console.log(`  ${collection.padEnd(12)} ${docs.length} documents → ${visible.totalDocs} visible in admin`)
}
process.exit(0)
