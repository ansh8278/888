/**
 * Loads the client's San Jose + Bay Area content into Payload.
 *
 * Source of truth: ./client/*.json (copied verbatim from the client package).
 * Everything created here is editable in the admin afterwards.
 *
 *   npm run seed                 first run on an empty database
 *   SEED_RESET=1 npm run seed    wipe the old content first (destructive)
 *
 * Business details (phone, licence, hours, rating, prices) are NOT set here —
 * they are unknown until the client confirms them, and the site renders safely
 * without them. See tracker.md → "Client Information Pending".
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import { randomBytes } from 'crypto'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import config from '@payload-config'

import { FAQS, CITY_CARDS, CATEGORY_CARDS, SERVICE_ICONS } from './data'
import { doc, para, heading } from '../lib/rich-text'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.resolve(dirname, '../../seed-assets')
const readJson = <T,>(file: string): T => JSON.parse(readFileSync(path.join(dirname, 'client', file), 'utf8'))

type City = {
  slug: string
  city: string
  subregion: string
  seo_title: string
  meta_description: string
  h1: string
  intro: string
  neighborhoods: string[] | string
  nearby: string[]
  parent_slug?: string
}
type Category = { slug: string; title: string; meta: string; h1: string; intro: string; subservices?: string[]; included?: string[]; related: string[] }
type SubService = { slug: string; parent: string; title: string; meta: string; h1: string; cta: string; content: string; related: string[] }
type Garage = Category & { disclaimer: string }
type CityContent = { cities: City[] }
type ServiceContent = { categories: Category[]; services: SubService[]; garage: Garage; hub: { title: string; meta: string; h1: string; intro: string } }

const cities = readJson<CityContent>('city-pages-content.json').cities
const content = readJson<ServiceContent>('services-content.json')

const SUBREGION: Record<string, 'south-bay' | 'peninsula' | 'east-bay' | 'tri-valley'> = {
  'South Bay / Silicon Valley': 'south-bay',
  'South Bay': 'south-bay',
  Peninsula: 'peninsula',
  'East Bay': 'east-bay',
  'Tri-Valley': 'tri-valley',
}

/** The 8 cards on every city page, in the client's order. */
const CITY_CARD_ORDER = Object.keys(CITY_CARDS)

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@888lockandkey.com'
// No fallback password on purpose: a literal here ends up in git history.
const generatedPassword = !process.env.SEED_ADMIN_PASSWORD
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || randomBytes(12).toString('base64url')

const firstSentence = (text: string) => text.split(/(?<=\.)\s/)[0]

const seed = async () => {
  const payload = await getPayload({ config })

  // ---------- users ----------
  const existingAdmins = await payload.find({ collection: 'users', where: { email: { equals: ADMIN_EMAIL } }, limit: 1 })
  if (existingAdmins.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { name: 'Site Owner', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' },
    })
    payload.logger.info(`Created admin ${ADMIN_EMAIL}`)
    if (generatedPassword) {
      payload.logger.warn(
        `No SEED_ADMIN_PASSWORD was set, so one was generated. Write it down now — it is not stored anywhere:\n\n    ${ADMIN_PASSWORD}\n`,
      )
    }
  }

  // ---------- existing content ----------
  const existing = await payload.count({ collection: 'services' })
  if (existing.totalDocs > 0) {
    if (process.env.SEED_RESET !== '1') {
      payload.logger.info('Content already present — skipping. Run with SEED_RESET=1 to replace it.')
      process.exit(0)
    }
    payload.logger.warn('SEED_RESET=1: removing existing services, locations, pages, FAQs, reviews and media.')
    for (const slug of ['services', 'locations', 'reviews', 'faqs', 'pages', 'media'] as const) {
      await payload.delete({ collection: slug, where: { id: { exists: true } } })
    }
  }

  // ---------- media ----------
  const upload = async (filePath: string, alt: string) => {
    const created = await payload.create({ collection: 'media', data: { alt }, filePath })
    return created.id as number
  }
  const heroImageId = await upload(path.join(ASSETS, 'hero.png'), '888 Lock & Key technician and mobile service van')
  const sanJoseImageId = await upload(path.join(ASSETS, 'cities', 'san-jose.jpg'), 'San Jose skyline')

  // ---------- faqs ----------
  const faqIds: number[] = []
  for (const [i, faq] of FAQS.entries()) {
    const created = await payload.create({ collection: 'faqs', data: { ...faq, order: i + 1 } })
    faqIds.push(created.id as number)
  }

  // ---------- services ----------
  // Two passes: create every service first, then wire up category/related
  // links once every id exists.
  const serviceIds: Record<string, number> = {}
  type ServiceData = Partial<RequiredDataFromCollectionSlug<'services'>> & {
    kind: 'category' | 'service' | 'standalone'
    title: string
    shortDescription: string
    intro: string
  }
  const createService = async (slug: string, data: ServiceData) => {
    const created = await payload.create({
      collection: 'services',
      data: {
        _status: 'published',
        slug,
        icon: (SERVICE_ICONS[slug] ?? 'lock') as 'lock',
        featured: true,
        showInPricingTable: false,
        cityCard: CITY_CARDS[slug],
        faqs: faqIds.slice(1, 3),
        ...data,
      },
    })
    serviceIds[slug] = created.id as number
  }

  for (const [i, cat] of content.categories.entries()) {
    await createService(cat.slug, {
      kind: 'category',
      title: cat.h1,
      shortDescription: CATEGORY_CARDS[cat.slug] ?? cat.intro,
      intro: cat.intro,
      bullets: (cat.included ?? []).map((text) => ({ text })),
      order: i + 1,
      seo: { title: cat.title, description: cat.meta },
    })
  }

  const garage = content.garage
  await createService(garage.slug, {
    kind: 'standalone',
    title: garage.h1,
    shortDescription: garage.intro,
    intro: garage.intro,
    disclaimer: garage.disclaimer,
    bullets: (garage.included ?? []).map((text) => ({ text })),
    order: 5,
    seo: { title: garage.title, description: garage.meta },
  })

  for (const [i, svc] of content.services.entries()) {
    await createService(svc.slug, {
      kind: 'service',
      title: svc.h1,
      shortDescription: firstSentence(svc.content),
      intro: svc.content,
      ctaLabel: svc.cta,
      order: 10 + i,
      featured: false,
      seo: { title: svc.title, description: svc.meta },
    })
  }

  const ids = (slugs: string[] | undefined) => (slugs ?? []).map((s) => serviceIds[s]).filter(Boolean)
  for (const cat of content.categories) {
    await payload.update({ collection: 'services', id: serviceIds[cat.slug], data: { related: ids(cat.related) } })
  }
  await payload.update({ collection: 'services', id: serviceIds[garage.slug], data: { related: ids(garage.related) } })
  for (const svc of content.services) {
    await payload.update({
      collection: 'services',
      id: serviceIds[svc.slug],
      data: { category: serviceIds[svc.parent], related: ids(svc.related) },
    })
  }

  // ---------- locations ----------
  const locationIds: Record<string, number> = {}
  for (const [i, c] of cities.entries()) {
    const region = SUBREGION[c.subregion]
    if (!region) throw new Error(`Unknown subregion "${c.subregion}" for ${c.slug}`)
    // The README flags a string here as "needs manual review"; never publish it as a pill.
    const neighbourhoods = Array.isArray(c.neighborhoods) ? c.neighborhoods : []
    if (!Array.isArray(c.neighborhoods)) payload.logger.warn(`${c.slug}: neighborhoods is a note, not a list — left empty for review`)

    const created = await payload.create({
      collection: 'locations',
      data: {
        _status: 'published',
        slug: c.slug,
        city: c.city,
        state: 'California',
        stateAbbr: 'CA',
        subregion: region,
        badge: c.subregion,
        order: i + 1,
        // Sub-areas are reached through San Jose, not from the home page/footer.
        featured: !c.parent_slug,
        image: c.slug === 'san-jose-locksmith' ? sanJoseImageId : undefined,
        intro: c.intro,
        neighbourhoods: neighbourhoods.map((name) => ({ name })),
        services: CITY_CARD_ORDER.map((s) => serviceIds[s]),
        seo: { title: c.seo_title, description: c.meta_description },
      },
    })
    locationIds[c.slug] = created.id as number
  }
  for (const c of cities) {
    await payload.update({
      collection: 'locations',
      id: locationIds[c.slug],
      data: {
        parent: c.parent_slug ? locationIds[c.parent_slug] : undefined,
        nearby: c.nearby.map((s) => locationIds[s]).filter(Boolean),
      },
    })
  }

  // ---------- standalone pages ----------
  await payload.create({
    collection: 'pages',
    data: {
      _status: 'published',
      title: 'About Us',
      slug: 'about',
      intro: 'A licensed mobile locksmith company serving San Jose and the entire Bay Area.',
      showCta: true,
      body: doc(
        heading('Who we are'),
        para(
          '888 Lock & Key is a California BSIS-licensed, bonded and insured mobile locksmith company. We dispatch technicians across San Jose and the Bay Area — South Bay, the Peninsula, the East Bay and the Tri-Valley — for automotive, residential, commercial and emergency locksmith work.',
        ),
        heading('How we work'),
        para(
          'We come to you. Our technicians are background-checked and carry the tools and hardware to finish most jobs on the first visit. Pricing is confirmed with you before any work begins.',
        ),
        heading('What we will not do'),
        para(
          'We will not open a lock for someone who cannot show the property or vehicle is theirs, and we will not quote one price on the phone and another at the door.',
        ),
      ),
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      _status: 'published',
      title: 'Privacy Policy',
      slug: 'privacy',
      intro: 'What we collect when you contact us, and what we do with it.',
      showCta: false,
      body: doc(
        heading('What we collect'),
        para(
          'When you submit a service request we collect your name, phone number, and the address or area where you need work done. We use this only to dispatch a technician and to contact you about that job.',
        ),
        heading('What we do not do'),
        para('We do not sell your details, and we do not pass them to third-party marketing companies.'),
        heading('Getting your data removed'),
        para('Contact us and we will delete your request record on request.'),
      ),
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      _status: 'published',
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
      ),
    },
  })

  // ---------- globals ----------
  // Business details deliberately left empty: see the file header.
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      companyName: '888 Lock & Key',
      tagline: 'AUTO · HOME · BUSINESS',
      serviceAreaLine: 'Serving San Jose & the Entire Bay Area',
      scriptLine: 'Your Security Our Priority',
      dispatchHubs: [{ name: 'Santa Clara dispatch hub', addressLine: '3315 Montgomery Dr', city: 'Santa Clara', stateAbbr: 'CA' }],
      defaultHeroImage: heroImageId,
      defaultSeoImage: heroImageId,
    },
  })

  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      eyebrow: 'Mobile Locksmith',
      headingLine1: 'Serving All of San Jose',
      headingLine2: '& the Entire Bay Area',
      lede: 'Automotive, residential, commercial and emergency locksmith services — dispatched to you across South Bay, the Peninsula, the East Bay and the Tri-Valley.',
      heroImage: heroImageId,
      primaryCtaLabel: 'Call Now',
      secondaryCtaLabel: 'Request Service',
      trustItems: [
        { icon: 'shield', value: 'CA BSIS Licensed & Insured', label: 'Bonded & insured' },
        { icon: 'people', value: 'Background-checked', label: 'Technicians' },
        { icon: 'star', value: 'Upfront pricing', label: 'Confirmed before work begins' },
      ],
      categories: [
        { icon: 'car', label: 'Automotive' },
        { icon: 'home', label: 'Residential' },
        { icon: 'building', label: 'Commercial' },
        { icon: 'shield', label: 'Emergency' },
      ],
      locationsEyebrow: 'Where We Dispatch',
      locationsHeading: 'Mobile Locksmith Coverage Across the Bay Area',
      servicesEyebrow: 'What We Do',
      servicesHeading: 'Locksmith Services Throughout the Bay Area',
      reviewsHeading: 'What Our Customers Say',
      reviewsSubtitle: 'Real people. Real reviews.',
      shopsEyebrow: 'Where We Are Based',
      shopsHeading: 'Dispatched from our hub, to you.',
      shopsSubtitle: 'Mobile technicians are dispatched from our Santa Clara hub to every city we serve.',
      pricingEyebrow: 'Transparent Pricing',
      pricingHeading: 'Starting prices, published up front.',
      pricingSubtitle: 'Your technician confirms the exact quote before any work begins — what we quote is what you pay.',
      faqEyebrow: 'Before You Call',
      faqHeading: 'Frequently Asked Questions',
      seo: { title: content.hub.title.replace('Bay Area Locksmith | ', ''), description: 'Licensed mobile locksmith serving San Jose and the entire San Francisco Bay Area — automotive, residential, commercial & emergency locksmith services.' },
    },
  })

  const cityLink = (slug: string) => ({ label: cities.find((c) => c.slug === slug)!.city, href: `/locations/${slug}` })
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      header: [
        { label: 'Bay Area', href: '/bay-area-locksmith' },
        { label: 'Services', href: '/services' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Reviews', href: '/reviews' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
      footerColumns: [
        {
          heading: 'Services',
          links: [...content.categories, garage].map((s) => ({ label: s.h1.replace(' Services', ''), href: `/services/${s.slug}` })),
        },
        { heading: 'South Bay', links: ['san-jose-locksmith', 'santa-clara-locksmith', 'sunnyvale-locksmith', 'cupertino-locksmith'].map(cityLink) },
        { heading: 'Peninsula', links: ['mountain-view-locksmith', 'palo-alto-locksmith', 'redwood-city-locksmith', 'san-mateo-locksmith'].map(cityLink) },
        { heading: 'East Bay', links: ['fremont-locksmith', 'oakland-locksmith', 'hayward-locksmith', 'san-leandro-locksmith'].map(cityLink) },
        { heading: 'Tri-Valley', links: ['pleasanton-locksmith', 'dublin-locksmith', 'san-ramon-locksmith', 'walnut-creek-locksmith'].map(cityLink) },
        {
          heading: 'Company',
          links: [
            { label: 'About Us', href: '/about' },
            { label: 'Reviews', href: '/reviews' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Contact', href: '/contact' },
            { label: 'All service areas', href: '/bay-area-locksmith' },
          ],
        },
      ],
      footerNote: 'Mobile locksmith serving San Jose & the San Francisco Bay Area.',
    },
  })

  // Service-in-city pages are not part of the client's site structure (D4).
  await payload.updateGlobal({ slug: 'combo-template', data: { enabled: false } })

  payload.logger.info(`Seed complete: ${Object.keys(serviceIds).length} services, ${Object.keys(locationIds).length} locations.`)
  process.exit(0)
}

await seed()
