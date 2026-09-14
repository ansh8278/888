#!/usr/bin/env node
/**
 * Builds the zip to upload to cPanel: source code only.
 *
 * Deliberately excluded:
 *   node_modules/  — contains Mac binaries for sharp and libsql; the server
 *                    must install its own Linux ones ("Run NPM Install")
 *   .next/         — the server rebuilds it, or see Plan B in DEPLOY-CPANEL.md
 *   .env           — secrets go in cPanel's environment variables, never in a zip
 *   888.db, media/ — live data; never overwrite the server's copy with yours
 *   backups/, graphify-out/
 *
 *   npm run package:cpanel   ->  888-site.zip
 */
import { execSync } from 'node:child_process'
import { existsSync, rmSync, statSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const out = path.join(root, '888-site.zip')

if (existsSync(out)) rmSync(out)

const exclude = [
  'node_modules/*', '.next/*', '.git/*', 'backups/*', 'graphify-out/*', 'media/*',
  '.env', '888.db', '888.db-*', '*.zip', '.DS_Store', '*/.DS_Store',
]

execSync(
  `cd "${root}" && zip -qr "${out}" . ${exclude.map((e) => `-x "${e}"`).join(' ')}`,
  { stdio: 'inherit' },
)

const mb = (statSync(out).size / 1024 / 1024).toFixed(1)
console.log(`\n  ${path.basename(out)}  (${mb} MB)`)
console.log('  Upload this in cPanel > File Manager, then follow DEPLOY-CPANEL.md.\n')
