import type { MetadataRoute } from 'next'
import { getServices, getLocations, getPages, getComboPairs } from '../../lib/data'
import { SITE_URL } from '../../lib/schema'

/** Every generated page, including the service-in-city combinations. */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [services, locations, pages, combos] = await Promise.all([
    getServices(),
    getLocations(),
    getPages(),
    getComboPairs(),
  ])

  const url = (path: string) => `${SITE_URL}${path}`
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: url('/'), priority: 1, changeFrequency: 'weekly', lastModified: now },
    { url: url('/services'), priority: 0.9, changeFrequency: 'monthly', lastModified: now },
    { url: url('/locations'), priority: 0.9, changeFrequency: 'monthly', lastModified: now },
    { url: url('/pricing'), priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    { url: url('/reviews'), priority: 0.6, changeFrequency: 'weekly', lastModified: now },
    { url: url('/faq'), priority: 0.6, changeFrequency: 'monthly', lastModified: now },
    { url: url('/contact'), priority: 0.7, changeFrequency: 'yearly', lastModified: now },
    { url: url('/book'), priority: 0.8, changeFrequency: 'yearly', lastModified: now },
  ]

  return [
    ...staticPages,
    ...services
      .filter((s) => !s.seo?.noindex)
      .map((s) => ({
        url: url(`/services/${s.slug}`),
        priority: 0.8,
        changeFrequency: 'monthly' as const,
        lastModified: new Date(s.updatedAt),
      })),
    ...locations
      .filter((l) => !l.seo?.noindex)
      .map((l) => ({
        url: url(`/locations/${l.slug}`),
        priority: 0.8,
        changeFrequency: 'monthly' as const,
        lastModified: new Date(l.updatedAt),
      })),
    ...combos.map(({ service, location }) => ({
      url: url(`/services/${service.slug}/${location.slug}`),
      priority: 0.7,
      changeFrequency: 'monthly' as const,
      lastModified: new Date(service.updatedAt),
    })),
    ...pages
      .filter((p) => !p.seo?.noindex)
      .map((p) => ({
        url: url(`/${p.slug}`),
        priority: 0.4,
        changeFrequency: 'yearly' as const,
        lastModified: new Date(p.updatedAt),
      })),
  ]
}

export default sitemap
