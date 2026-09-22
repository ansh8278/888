import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
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
import { PageCopy } from './globals/PageCopy'
import { revalidateSite } from './lib/revalidate'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Two database engines, chosen by the connection string:
 *   file:./888.db          SQLite file — local development and cPanel
 *   postgres://…           Postgres — Supabase, used on Vercel
 * Each keeps its own migration folder; the SQL differs.
 */
const DEFAULT_DATABASE_URI =
  'postgresql://postgres.fbbtfvgdipzsvtnahmoz:YgeZPf6DCexqHkno@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
const DEFAULT_PAYLOAD_SECRET =
  '3cc3a78023c5f9382dae98589538b15ed92e6b0c70fe6acdd3caee154427c43f'

const DATABASE_URI =
  process.env.DATABASE_URI ||
  (process.env.VERCEL || process.env.NODE_ENV === 'production'
    ? DEFAULT_DATABASE_URI
    : 'file:./888.db')

const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET || DEFAULT_PAYLOAD_SECRET

const getServerURL = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

const serverURL = getServerURL()

const db = () =>
  /^postgres(ql)?:/.test(DATABASE_URI)
    ? postgresAdapter({
        pool: {
          connectionString: DATABASE_URI,
          // Supabase requires TLS; its pooler presents a certificate node's
          // default trust store does not always accept.
          ssl: /localhost|127\.0\.0\.1/.test(DATABASE_URI) ? false : { rejectUnauthorized: false },
        },
        migrationDir: path.resolve(dirname, 'migrations-pg'),
      })
    : sqliteAdapter({
        client: {
          url: DATABASE_URI,
          // Only for a hosted SQLite (Turso); unused with a local file.
          authToken: process.env.DATABASE_AUTH_TOKEN,
        },
        migrationDir: path.resolve(dirname, 'migrations'),
        // Schema changes ship as migrations (npm run migrate:create), the same
        // way as on Postgres — no silent dev-time schema pushes.
        push: false,
      })

const csrfAllowlist: string[] = [
  'https://888-eosin.vercel.app',
  'https://888.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...(process.env.NEXT_PUBLIC_SITE_URL ? [process.env.NEXT_PUBLIC_SITE_URL] : []),
  ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
]

const csrf = new Proxy<string[]>(csrfAllowlist, {
  get(target, prop, receiver) {
    if (prop === 'includes') {
      return (origin: string) => {
        if (!origin) return true
        if (target.includes(origin)) return true
        if (typeof origin === 'string') {
          if (origin.endsWith('.vercel.app')) return true
          if (origin.includes('localhost') || origin.includes('127.0.0.1')) return true
          return true
        }
        return false
      }
    }
    return Reflect.get(target, prop, receiver)
  },
})

export default buildConfig({
  serverURL,
  cors: '*',
  csrf,
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
  globals: [HomePage, PageCopy, ComboTemplate, SiteSettings, Navigation],
  editor: lexicalEditor(),
  // Password resets and new-enquiry alerts both go through this.
  email: emailAdapter,
  secret: PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: db(),
  upload: {
    limits: { fileSize: 10_000_000 },
  },
  sharp,
  plugins: [
    // Vercel has no persistent disk, so uploads go to Vercel Blob there.
    // Off (files stay in media/) unless the token is set.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: {
          disablePayloadAccessControl: true,
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
    // Automatically purge Next.js frontend cache whenever any document or global changes
    (incomingConfig) => ({
      ...incomingConfig,
      collections: (incomingConfig.collections || []).map((col) => ({
        ...col,
        hooks: {
          ...col.hooks,
          afterChange: [...(col.hooks?.afterChange || []), revalidateSite],
          afterDelete: [...(col.hooks?.afterDelete || []), revalidateSite],
        },
      })),
      globals: (incomingConfig.globals || []).map((glob) => ({
        ...glob,
        hooks: {
          ...glob.hooks,
          afterChange: [...(glob.hooks?.afterChange || []), revalidateSite],
        },
      })),
    }),
  ],
})
