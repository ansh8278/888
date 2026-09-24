/**
 * Re-attaches the right FAQs to each service page.
 *
 * An earlier seed attached two arbitrary questions to every service, which
 * put "Can you unlock my car without damaging it?" on the lock rekey page.
 * This matches them by keyword instead (see SERVICE_FAQ_MATCH).
 *
 *   npm run faqs:relink
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { SERVICE_FAQ_MATCH } from '../seed/data'

const payload = await getPayload({ config })
const faqs = await payload.find({ collection: 'faqs', limit: 100, depth: 0 })
const services = await payload.find({ collection: 'services', limit: 100, depth: 0 })

for (const service of services.docs) {
  const wanted = (SERVICE_FAQ_MATCH[service.slug ?? ''] ?? [])
    .map((needle) => faqs.docs.find((f) => f.question.toLowerCase().includes(needle.toLowerCase()))?.id)
    .filter((id): id is number => Boolean(id))
  await payload.update({ collection: 'services', id: service.id, data: { faqs: wanted } })
  console.log(`${(service.slug ?? '').padEnd(30)} ${wanted.length} questions`)
}
process.exit(0)
