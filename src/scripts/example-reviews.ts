/**
 * Adds EXAMPLE reviews so the reviews section can be seen with content in it.
 *
 *   npm run reviews:example          add them
 *   npm run reviews:example -- clear remove them again
 *
 * These are NOT real customer reviews. Each card carries an "Example — not a
 * real review" badge, they are excluded from the structured data sent to
 * Google, and the admin dashboard shows a reminder until they are gone.
 * Publishing invented testimonials as genuine is deceptive (and regulated in
 * the US), so they must be replaced or cleared before launch.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const EXAMPLES = [
  { quote: 'Locked out at 11pm with my toddler asleep in the car seat. The technician was calm, quick, and did not leave a mark on the door.', author: 'Example A.', cityLabel: 'San Jose, CA' },
  { quote: 'Rekeyed our whole house the day we closed. The price we were quoted on the phone was the price we paid.', author: 'Example B.', cityLabel: 'Santa Clara, CA' },
  { quote: 'Lost the only key to my van. They cut and programmed a new one in the car park and I was back at work the same afternoon.', author: 'Example C.', cityLabel: 'Fremont, CA' },
  { quote: 'Our storefront lock failed on a Saturday. They arrived, fixed the cylinder and we opened on time.', author: 'Example D.', cityLabel: 'Oakland, CA' },
  { quote: 'Smart lock fitted and set up on my phone before they left. Explained the app properly instead of rushing off.', author: 'Example E.', cityLabel: 'Palo Alto, CA' },
  { quote: 'Locked myself out of the house in the rain. Someone was with me quickly and opened the door without damage.', author: 'Example F.', cityLabel: 'Sunnyvale, CA' },
]

const clear = process.argv.includes('clear')
const payload = await getPayload({ config })

const existing = await payload.find({ collection: 'reviews', where: { source: { equals: 'example' } }, limit: 100, depth: 0 })
for (const review of existing.docs) await payload.delete({ collection: 'reviews', id: review.id })

if (clear) {
  console.log(`Removed ${existing.docs.length} example reviews.`)
  process.exit(0)
}

for (const [i, review] of EXAMPLES.entries()) {
  await payload.create({
    collection: 'reviews',
    data: { ...review, rating: 5, source: 'example', featured: true, order: i + 1 },
  })
}
console.log(`Added ${EXAMPLES.length} example reviews (replaced ${existing.docs.length}).`)
process.exit(0)
