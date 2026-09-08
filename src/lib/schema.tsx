import type { SiteSetting, Location, Faq, Service, Review } from '../payload-types'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

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

export const localBusinessSchema = (settings: SiteSetting, locations: Location[]) => ({
  '@context': 'https://schema.org',
  '@type': 'Locksmith',
  name: settings.companyName,
  telephone: settings.phone,
  email: settings.email ?? undefined,
  url: SITE_URL,
  priceRange: '$$',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  aggregateRating: ratingBlock(settings),
  areaServed: locations.map((l) => ({
    '@type': 'City',
    name: l.city,
    address: { '@type': 'PostalAddress', addressRegion: l.stateAbbr, addressCountry: 'US' },
  })),
})

/** A single shop, used on location pages so each city can rank on its own. */
export const locationSchema = (settings: SiteSetting, location: Location) => ({
  '@context': 'https://schema.org',
  '@type': 'Locksmith',
  name: location.shopName ?? `${settings.companyName} — ${location.city}`,
  telephone: location.phone || settings.phone,
  url: `${SITE_URL}/locations/${location.slug}`,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: location.addressLine ?? undefined,
    addressLocality: location.city,
    addressRegion: location.stateAbbr,
    postalCode: location.postcode ?? undefined,
    addressCountry: 'US',
  },
  aggregateRating: ratingBlock(settings),
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
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
    telephone: settings.phone,
  },
  areaServed: city ? { '@type': 'City', name: city } : undefined,
  offers: {
    '@type': 'Offer',
    price: (service.startingPrice ?? '').replace(/[^\d.]/g, '') || undefined,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
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
