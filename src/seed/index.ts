import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'

import { SERVICES, LOCATIONS, REVIEWS, FAQS } from './data'
import { doc, para, heading, list } from '../lib/rich-text'

const dirname = path.dirname(fileURLToPath(import.meta.url))
/** Images still live in the original site folder, two levels up from web/src. */
const ASSETS = path.resolve(dirname, '../../seed-assets')

import { randomBytes } from 'crypto'

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@888lockandkey.com'

/**
 * No fallback password on purpose: a literal here ends up in git history and
 * in every copy of the code. With SEED_ADMIN_PASSWORD unset, a random one is
 * generated and printed exactly once, at seed time.
 */
const generatedPassword = !process.env.SEED_ADMIN_PASSWORD
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || randomBytes(12).toString('base64url')

const seed = async () => {
  const payload = await getPayload({ config })

  // Wipe content collections so the seed is repeatable. Users are left alone
  // so re-seeding never locks anyone out of the admin.
  for (const slug of ['services', 'locations', 'reviews', 'faqs', 'pages', 'media'] as const) {
    await payload.delete({ collection: slug, where: { id: { exists: true } } })
  }

  // ---------- users ----------
  const existingAdmins = await payload.find({
    collection: 'users',
    where: { email: { equals: ADMIN_EMAIL } },
    limit: 1,
  })
  if (existingAdmins.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        name: 'Site Owner',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
      },
    })
    payload.logger.info(`Created admin ${ADMIN_EMAIL}`)
    if (generatedPassword) {
      payload.logger.warn(
        `No SEED_ADMIN_PASSWORD was set, so one was generated. Write it down now — it is not stored anywhere:\n\n    ${ADMIN_PASSWORD}\n`,
      )
    }
  }

  // Safe to run twice: never duplicate the starter content.
  const existing = await payload.count({ collection: 'services' })
  if (existing.totalDocs > 0) {
    payload.logger.info('Content already present — skipping the starter content.')
    return
  }

  // ---------- media ----------
  const upload = async (filePath: string, alt: string) => {
    const created = await payload.create({
      collection: 'media',
      data: { alt },
      filePath,
    })
    return created.id as number
  }

  const heroImageId = await upload(path.join(ASSETS, 'hero.png'), '888 Lock & Key technician and mobile service van')

  const cityImages: Record<string, number> = {}
  for (const loc of LOCATIONS) {
    cityImages[loc.image] = await upload(
      path.join(ASSETS, 'cities', `${loc.image}.jpg`),
      `${loc.city} skyline`,
    )
  }

  // ---------- faqs ----------
  const faqIds: number[] = []
  for (const [i, faq] of FAQS.entries()) {
    const created = await payload.create({
      collection: 'faqs',
      data: { ...faq, order: i + 1 },
    })
    faqIds.push(created.id as number)
  }

  // ---------- services ----------
  const serviceIds: number[] = []
  for (const svc of SERVICES) {
    const created = await payload.create({
      collection: 'services',
      data: {
        title: svc.title,
        icon: svc.icon as 'car',
        order: svc.order,
        featured: true,
        startingPrice: svc.startingPrice,
        priceNote: svc.priceNote,
        showInPricingTable: true,
        shortDescription: svc.shortDescription,
        intro: svc.intro,
        bullets: svc.bullets.map((text) => ({ text })),
        body: doc(...svc.body.map((p) => para(p))),
        // Every service shows the four most universal questions.
        faqs: faqIds.slice(0, 4),
      },
    })
    serviceIds.push(created.id as number)
  }

  // ---------- locations ----------
  for (const loc of LOCATIONS) {
    await payload.create({
      collection: 'locations',
      data: {
        city: loc.city,
        state: loc.state,
        stateAbbr: loc.stateAbbr,
        badge: loc.badge,
        shopName: loc.shopName,
        shopSubtitle: loc.shopSubtitle,
        addressLine: loc.addressLine,
        postcode: loc.postcode,
        hours: loc.hours,
        order: loc.order,
        featured: true,
        image: cityImages[loc.image],
        intro: loc.intro,
        neighbourhoods: loc.neighbourhoods.map((name) => ({ name })),
        services: serviceIds,
        body: doc(
          heading(`Locksmith services in ${loc.city}`),
          para(
            `Our ${loc.city} team covers cars, homes and businesses around the clock. Vans are stocked as mobile workshops, so most jobs are finished on the first visit rather than booked in for a return trip.`,
          ),
          para('Areas we cover most often:'),
          list(loc.neighbourhoods),
        ),
      },
    })
  }

  // ---------- reviews ----------
  for (const [i, review] of REVIEWS.entries()) {
    await payload.create({
      collection: 'reviews',
      data: { ...review, rating: 5, source: 'google', featured: true, order: i + 1 },
    })
  }

  // ---------- standalone pages ----------
  await payload.create({
    collection: 'pages',
    data: {
      title: 'About Us',
      slug: 'about',
      intro:
        'A licensed locksmith company with real shops, real technicians and prices we publish before you call.',
      showCta: true,
      body: doc(
        heading('Who we are'),
        para(
          '888 Lock & Key is a licensed locksmith company operating across California, Arizona and New York. We run physical shops rather than a call centre, and every technician who turns up is our own employee — background-checked, fingerprinted and badged.',
        ),
        heading('How we price'),
        para(
          'You get a firm price on the phone before a van moves. If a job turns out to need more than what was quoted, we stop and tell you what it costs before continuing. There are no call-out surprises and no mystery service fees at the door.',
        ),
        heading('What we will not do'),
        para(
          'We will not open a lock for someone who cannot show the property is theirs, we will not drill a cylinder that can be picked, and we will not quote one price on the phone and another on your doorstep.',
        ),
      ),
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Privacy Policy',
      slug: 'privacy',
      intro: 'What we collect when you contact us, and what we do with it.',
      showCta: false,
      body: doc(
        heading('What we collect'),
        para(
          'When you submit a service order or quote request we collect your name, phone number, and the address or area where you need work done. We use this only to dispatch a technician and to contact you about that job.',
        ),
        heading('What we do not do'),
        para('We do not sell your details, and we do not pass them to third-party marketing companies.'),
        heading('Getting your data removed'),
        para('Contact us and we will delete your enquiry record on request.'),
      ),
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Terms of Service',
      slug: 'terms',
      intro: 'The terms you agree to when you book work with us.',
      showCta: false,
      body: doc(
        heading('Proof of ownership'),
        para(
          'We require proof that you own or lawfully occupy the property or vehicle before opening any lock. Our technician may refuse the job if that proof cannot be established.',
        ),
        heading('Pricing'),
        para(
          'Quoted prices cover the work described at the time of quoting. Additional work is quoted separately and only carried out with your agreement.',
        ),
        heading('Warranty'),
        para(
          'Installations carry a 90-day workmanship warranty. Hardware we supply carries the manufacturer warranty in addition to that.',
        ),
      ),
    },
  })

  // ---------- globals ----------
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      companyName: '888 Lock & Key',
      tagline: 'AUTO · HOME · BUSINESS',
      phone: '(408) 555-0888',
      phoneHref: '+14085550888',
      email: 'dispatch@888lockandkey.com',
      licenseNumber: 'BSIS #LCO-000000',
      hours: '24/7 Emergency Service',
      serviceAreaLine: 'Across California, Arizona & New York',
      rating: '4.9/5',
      reviewCount: 214,
      averageArrival: '24 MIN',
      scriptLine: 'Your Security Our Priority',
      defaultHeroImage: heroImageId,
      defaultSeoImage: heroImageId,
    },
  })

  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      eyebrow: 'Fast • Reliable • Professional',
      headingLine1: 'Locked Out?',
      headingLine2: "We're Already On The Way.",
      lede: '888 Lock & Key provides professional locksmith services across California, Arizona and New York. 24/7 mobile service, real pricing, background-checked technicians.',
      heroImage: heroImageId,
      primaryCtaLabel: 'Call',
      secondaryCtaLabel: 'Get a Free Quote',
      trustItems: [
        { icon: 'clock', value: '24/7', label: 'Emergency Service' },
        { icon: 'shield', value: 'Licensed & Insured', label: 'BSIS #LCO-000000' },
        { icon: 'people', value: '4.9/5', label: '214+ Google Reviews' },
      ],
      categories: [
        { icon: 'car', label: 'Cars' },
        { icon: 'home', label: 'Homes' },
        { icon: 'building', label: 'Businesses' },
        { icon: 'key', label: 'Keys & Fobs' },
        { icon: 'shield', label: 'Access Control' },
      ],
      locationsEyebrow: 'We Serve Multiple Cities',
      locationsHeading: 'Find a locksmith near you',
      servicesEyebrow: 'One call. Every solution.',
      servicesHeading: 'Our Locksmith Services',
      reviewsHeading: 'What Our Customers Say',
      reviewsSubtitle: 'Real people. Real reviews.',
      shopsEyebrow: 'Three Shops, One Dispatch',
      shopsHeading: 'Walk in, or we drive to you.',
      shopsSubtitle: 'GPS-dispatched vans across California, Arizona, and New York for rapid arrival.',
      pricingEyebrow: 'Transparent Pricing',
      pricingHeading: 'Starting prices, published up front.',
      pricingSubtitle:
        'Your technician confirms the exact quote before any work begins — what we quote is what you pay.',
      faqEyebrow: 'Before You Call',
      faqHeading: 'Frequently Asked Questions',
    },
  })

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      header: [
        { label: 'Services', href: '/services' },
        { label: 'Locations', href: '/locations' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Reviews', href: '/reviews' },
        { label: 'About', href: '/about' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Contact', href: '/contact' },
      ],
      footerColumns: [
        {
          heading: 'Services',
          links: SERVICES.map((s) => ({
            label: s.title,
            href: `/services/${s.title.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
          })),
        },
        {
          heading: 'Locations',
          links: LOCATIONS.map((l) => ({
            label: `${l.city}, ${l.stateAbbr}`,
            href: `/locations/${l.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          })),
        },
        {
          heading: 'Company',
          links: [
            { label: 'About Us', href: '/about' },
            { label: 'Reviews', href: '/reviews' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Contact', href: '/contact' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
          ],
        },
      ],
      footerNote: 'Licensed, insured mobile locksmith serving California, Arizona and New York with 24/7 mobile dispatch.',
    },
  })

  await payload.updateGlobal({ slug: 'combo-template', data: { enabled: true } })

  payload.logger.info('Seed complete.')
  process.exit(0)
}

await seed()
