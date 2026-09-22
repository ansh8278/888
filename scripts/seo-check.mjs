#!/usr/bin/env node
/**
 * SEO check over every URL in the sitemap of a running copy of the site.
 * Writes seo-qa-report.md and exits 1 on any failure.
 *
 *   node scripts/seo-check.mjs http://localhost:3000
 */
import { writeFileSync } from 'node:fs'

const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
const sm = await (await fetch(base + '/sitemap.xml')).text()
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

const rows = []
const problems = []
const titles = new Map()
const descs = new Map()
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')

for (const url of urls) {
  const path = new URL(url).pathname
  const res = await fetch(url)
  const html = await res.text()
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '')
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '')
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? ''
  const h1s = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gs)].map((m) => decode(m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()))
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html)
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => {
    try { return JSON.parse(m[1])['@type'] } catch { return 'INVALID' }
  })
  const imgsNoAlt = [...html.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/g)].length
  const flags = []
  if (res.status !== 200) flags.push(`status ${res.status}`)
  const warnings = []
  if (!title) flags.push('no title'); else if (title.length > 70) warnings.push(`title ${title.length} chars`)
  if (!desc) flags.push('no description'); else if (desc.length > 165) warnings.push(`description ${desc.length} chars`)
  const same = (a, b) => a.replace(/\/$/, '') === b.replace(/\/$/, '')
  if (!same(canonical, url)) flags.push(`canonical mismatch (${canonical || 'none'})`)
  if (h1s.length !== 1) flags.push(`${h1s.length} h1`)
  if (noindex) flags.push('NOINDEX')
  if (schemas.includes('INVALID')) flags.push('invalid JSON-LD')
  if (imgsNoAlt) flags.push(`${imgsNoAlt} img without alt`)
  if (titles.has(title)) flags.push(`duplicate title of ${titles.get(title)}`); else titles.set(title, path)
  if (desc && descs.has(desc)) flags.push(`duplicate description of ${descs.get(desc)}`); else if (desc) descs.set(desc, path)
  rows.push({ path, title, desc, h1: h1s[0] ?? '', schemas: schemas.join(', '), flags: [...flags, ...warnings.map((w) => `warn: ${w}`)] })
  if (flags.length) problems.push(`${path}: ${flags.join('; ')}`)
}

const md = [
  '# SEO QA report',
  '',
  `Generated ${new Date().toISOString()} against ${base}. ${urls.length} URLs from the sitemap.`,
  '',
  problems.length ? `## Problems (${problems.length})\n\n${problems.map((p) => `- ${p}`).join('\n')}` : '## Problems\n\nNone — every page has a unique title and description, one H1, a matching canonical, valid JSON-LD and alt text on every image.',
  '',
  '## Warnings\n\nLength warnings only (Google may truncate). Titles/descriptions over the limit are the client-supplied ones, kept verbatim.\n',
  ...rows.filter((r) => r.flags.some((f) => f.startsWith('warn'))).map((r) => `- ${r.path}: ${r.flags.filter((f) => f.startsWith('warn')).join('; ')}`),
  '',
  '## Pages',
  '',
  '| Path | Title | H1 | Schema | Flags |',
  '|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.path} | ${r.title.replace(/\|/g, '\\|')} | ${r.h1.replace(/\|/g, '\\|')} | ${r.schemas} | ${r.flags.join('; ')} |`),
  '',
].join('\n')
writeFileSync('seo-qa-report.md', md)
console.log(`${urls.length} pages checked, ${problems.length} problems → seo-qa-report.md`)
for (const p of problems) console.log(' -', p)
if (problems.length) process.exit(1)
