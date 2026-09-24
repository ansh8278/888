/**
 * Puts EXAMPLE prices on the services so the pricing page can be seen with
 * real content in it.
 *
 *   npm run prices:example          add them
 *   npm run prices:example -- clear remove them again
 *
 * These are NOT the business's prices. Every row is marked "Example price"
 * in the Notes column, the table carries a warning line above it, and the
 * admin dashboard shows a reminder until they are replaced. Nothing is sent
 * to Google — see src/lib/schema.tsx.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

export const EXAMPLE_NOTE = 'Example price — replace before launch'

const PRICES: Record<string, string> = {
  'car-lockout': 'From $65',
  'car-key-replacement': 'From $120',
  'key-fob-programming': 'From $90',
  'transponder-key-programming': 'From $110',
  'ignition-repair': 'From $150',
  'house-lockout': 'From $65',
  'rekey-locks': 'From $25 / lock',
  'lock-change': 'From $75',
  'smart-lock-installation': 'From $110',
  'garage-locksmith': 'From $75',
}

const clear = process.argv.includes('clear')
const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'services', limit: 100, depth: 0 })

let changed = 0
for (const service of docs) {
  const price = PRICES[service.slug ?? '']
  if (!price) continue
  await payload.update({
    collection: 'services',
    id: service.id,
    data: clear
      ? { startingPrice: '', priceNote: '', showInPricingTable: false }
      : { startingPrice: price, priceNote: EXAMPLE_NOTE, showInPricingTable: true },
  })
  changed++
}

await payload.updateGlobal({
  slug: 'page-copy',
  data: {
    pricingNote: clear
      ? 'Prices are starting points for standard work. Your technician confirms the exact price before any work begins.'
      : '⚠ The prices in this table are EXAMPLES for layout only — they are not 888 Lock & Key’s prices. Replace them under Services before the site goes live.',
  },
})

console.log(`${clear ? 'Cleared' : 'Set'} example prices on ${changed} services.`)
process.exit(0)
