#!/usr/bin/env node
/**
 * Backs up everything that cannot be rebuilt from the code: the database
 * (leads, content, logins) and the uploaded images.
 *
 *   npm run backup                    -> ./backups/
 *   BACKUP_DIR=/mnt/vol npm run backup
 *
 * Schedule it daily on the server, e.g. a cron entry:
 *   0 3 * * * cd /app && npm run backup >> /var/log/888-backup.log 2>&1
 *
 * ponytail: plain local copies, no cloud upload. A copy on the same disk still
 * saves you from the common cases (a bad edit, a wrong delete, a broken
 * migration) but not from losing the disk. Sync `backups/` off-box for that.
 */
/**
 * NOTE: this backs up a SQLite database file (local / cPanel installs).
 * On Vercel the data lives in Supabase Postgres, which takes its own daily
 * backups — see Supabase → Database → Backups, and DEPLOY-VERCEL.md.
 */
import { createClient } from '@libsql/client'
import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const outRoot = process.env.BACKUP_DIR || path.join(root, 'backups')
const keep = Number(process.env.BACKUP_KEEP || 14)

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const dest = path.join(outRoot, stamp)

const dbFile = (process.env.DATABASE_URI || 'file:./888.db').replace(/^file:/, '')
const dbPath = path.isAbsolute(dbFile) ? dbFile : path.join(root, dbFile)
const mediaPath = path.join(root, 'media')

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

const run = async () => {
  await mkdir(dest, { recursive: true })

  // VACUUM INTO gives a consistent snapshot even while the site is serving —
  // a plain file copy of a live SQLite database can capture a torn write.
  if (existsSync(dbPath)) {
    const db = createClient({ url: `file:${dbPath}` })
    await db.execute(`VACUUM INTO '${path.join(dest, 'database.db').replace(/'/g, "''")}'`)
    const { size } = await stat(path.join(dest, 'database.db'))
    console.log(`  database  ${mb(size)}`)
  } else {
    console.log('  database  (not found — nothing to back up)')
  }

  if (existsSync(mediaPath)) {
    await cp(mediaPath, path.join(dest, 'media'), { recursive: true })
    const files = await readdir(path.join(dest, 'media'))
    console.log(`  media     ${files.length} files`)
  } else {
    console.log('  media     (none yet)')
  }

  // Keep the last N, drop the rest.
  const all = (await readdir(outRoot, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()
  const stale = all.slice(0, Math.max(0, all.length - keep))
  for (const dir of stale) await rm(path.join(outRoot, dir), { recursive: true, force: true })

  console.log(`  saved to  ${dest}`)
  if (stale.length) console.log(`  pruned    ${stale.length} old backup(s), keeping ${keep}`)
}

run().catch((err) => {
  console.error('  backup FAILED:', err.message)
  process.exit(1)
})
