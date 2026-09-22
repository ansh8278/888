import type { SiteSetting, Location, Faq, Service, Review } from '../payload-types'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

/**
 * Absolute URL for a site path. Use this for canonicals: a relative canonical
 * like '/faq' is resolved by Next against the domain root, which drops any
 * sub-path the site is served under.
 */
export const absolute = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`

/** Renders JSON-LD. Skipped entirely when there is nothing to describe. */
export const JsonLd = ({ data }: { data: object | null }) =>
  data ? (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped below; this is our own data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  ) : null

const ratingBlock = (settings: SiteSetting) => {
  const value = parseFloat((settings.rating ?? '').replace(/[^\d.]/g, ''))
  if (!value || !settings.reviewCount) return undefined
  return {
    '@type': 'AggregateRating',
    ratingValue: value,
    reviewCount: settings.reviewCount,
    bestRating: 5,
  }
}

/**
 * The business as Google should understand it: a mobile Service Area
 * Business. One real address (the dispatch hub), the cities it serves, and
 * only the facts the client has actually supplied — no opening hours or
 * rating unless entered in Site settings.
 */
const hubAddress = (settings: SiteSetting) => {
  const hub = settings.dispatchHubs?.[0]
  if (!hub) return undefined
  return {
    '@type': 'PostalAddress',
    streetAddress: hub.addressLine,
    addressLocality: hub.city,
    addressRegion: hub.stateAbbr,
    postalCode: hub.postcode ?? undefined,
    addressCountry: 'US',
  }
}

const areaServed = (locations: Location[]) =>
  locations
    .filter((l) => !l.parent)
    .map((l) => ({
      '@type': 'City',
      name: l.city,
      address: { '@type': 'PostalAddress', addressRegion: l.stateAbbr, addressCountry: 'US' },
    }))

export const localBusinessSchema = (settings: SiteSetting, locations: Location[]) => ({
  '@context': 'https://schema.org',
  '@type': 'Locksmith',
  name: settings.companyName,
  telephone: settings.phone || undefined,
  email: settings.email ?? undefined,
  url: SITE_URL,
  address: hubAddress(settings),
  areaServed: areaServed(locations),
  aggregateRating: ratingBlock(settings),
})

/**
 * A city page: the same business, described as serving that city. Never a
 * per-city PostalAddress — there is no shop there (see plan §Phase 2).
 */
export const locationSchema = (settings: SiteSetting, location: Location) => ({
  '@context': 'https://schema.org',
  '@type': 'Locksmith',
  name: `${settings.companyName} — ${location.city} Locksmith`,
  telephone: location.phone || settings.phone || undefined,
  url: `${SITE_URL}/locations/${location.slug}`,
  address: hubAddress(settings),
  areaServed: {
    '@type': 'City',
    name: location.city,
    address: { '@type': 'PostalAddress', addressRegion: location.stateAbbr, addressCountry: 'US' },
  },
  aggregateRating: ratingBlock(settings),
})

export const serviceSchema = (settings: SiteSetting, service: Service, city?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: service.title,
  name: city ? `${service.title} in ${city}` : service.title,
  description: service.intro,
  provider: {
    '@type': 'Locksmith',
    name: settings.companyName,
    telephone: settings.phone || undefined,
    address: hubAddress(settings),
  },
  areaServed: city ? { '@type': 'City', name: city } : { '@type': 'Place', name: 'San Jose & the San Francisco Bay Area' },
  // Only when the client has confirmed a starting price.
  offers: service.startingPrice
    ? {
        '@type': 'Offer',
        price: service.startingPrice.replace(/[^\d.]/g, '') || undefined,
        priceCurrency: 'USD',
      }
    : undefined,
})

export const faqSchema = (faqs: Faq[]) =>
  faqs.length === 0
    ? null
    : {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }

export const reviewSchema = (settings: SiteSetting, reviews: Review[]) =>
  reviews.length === 0
    ? null
    : {
        '@context': 'https://schema.org',
        '@type': 'Locksmith',
        name: settings.companyName,
        aggregateRating: ratingBlock(settings),
        review: reviews.slice(0, 20).map((r) => ({
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: r.rating ?? 5, bestRating: 5 },
          author: { '@type': 'Person', name: r.author },
          reviewBody: r.quote,
        })),
      }

export const breadcrumbSchema = (crumbs: { label: string; href: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.label,
    item: `${SITE_URL}${c.href}`,
  })),
})
