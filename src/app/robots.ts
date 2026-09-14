import type { MetadataRoute } from 'next'
import { SITE_URL } from '../lib/schema'
import { withBase } from '../lib/base-path'

const robots = (): MetadataRoute.Robots => ({
  rules: [{ userAgent: '*', allow: '/', disallow: [withBase('/admin'), withBase('/api/')] }],
  sitemap: `${SITE_URL}/sitemap.xml`,
})

export default robots
