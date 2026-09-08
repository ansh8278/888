import type { MetadataRoute } from 'next'
import { SITE_URL } from '../lib/schema'

const robots = (): MetadataRoute.Robots => ({
  rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
  sitemap: `${SITE_URL}/sitemap.xml`,
})

export default robots
