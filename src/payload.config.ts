import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { emailAdapter } from './lib/email'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Locations } from './collections/Locations'
import { Reviews } from './collections/Reviews'
import { Faqs } from './collections/Faqs'
import { Pages } from './collections/Pages'
import { Enquiries } from './collections/Enquiries'

import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'
import { HomePage } from './globals/HomePage'
import { ComboTemplate } from './globals/ComboTemplate'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Without this Payload cannot work out the request origin and warns on every
  // server-side operation; it is also used to build links in emails.
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — 888 Lock & Key',
      description: 'Content management for the 888 Lock & Key website.',
    },
    components: {
      graphics: {
        Logo: '/components/admin/Graphics#Logo',
        Icon: '/components/admin/Graphics#Icon',
      },
      views: {
        // Replaces the default dashboard outright: its card list just repeats
        // the sidebar, and pushed the actual work below the fold.
        dashboard: { Component: '/components/admin/Dashboard#Dashboard' },
      },
    },
  },
  // Enquiries first so the sidebar opens on the thing staff check daily.
  collections: [Enquiries, Services, Locations, Reviews, Faqs, Pages, Media, Users],
  globals: [HomePage, ComboTemplate, SiteSettings, Navigation],
  editor: lexicalEditor(),
  // Password resets and new-enquiry alerts both go through this.
  email: emailAdapter,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./888.db',
    },
  }),
  upload: {
    limits: { fileSize: 10_000_000 },
  },
  sharp,
  plugins: [],
})
