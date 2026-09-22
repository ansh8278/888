#!/usr/bin/env node
/**
 * Crawls a running copy of the site and reports:
 *   - broken internal links / images (non-200)
 *   - pages in the sitemap nobody links to (orphans)
 *   - pages linked to but missing from the sitemap
 *   - leftover placeholders or claims that must never ship
 *
 *   node scripts/crawl.mjs http://localhost:3000
 * Exits 1 on any finding, so it can gate a deploy.
 */
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
const FORBIDDEN = [/24\/7/i, /Arizona/, /New York/, /XXX\) XXX/, /REALPHONE/, /REAL LICENSE/, /LCO-000000/, /555-0888/, /tel:null/, /Insert real/i, /lorem ipsum/i, /Services Services/]

const seen = new Map() // path -> status
const linkedFrom = new Map() // path -> first referrer
const queue = ['/']
const findings = []

const norm = (href, from) => {
  try {
    const u = new URL(href, base)
    if (u.origin !== new URL(base).origin) return null
    if (/^(tel|mailto):/.test(href)) return null
    if (u.pathname.startsWith('/_next/')) return null // build assets; the image optimizer needs its query string
    return u.pathname.replace(/\/$/, '') || '/'
  } catch {
    return null
  }
}

while (queue.length) {
  const path = queue.shift()
  if (seen.has(path)) continue
  const res = await fetch(base + path, { redirect: 'manual' })
  seen.set(path, res.status)
  if (res.status >= 300 && res.status < 400) {
    const to = norm(res.headers.get('location') ?? '', path)
    if (to && !seen.has(to)) { linkedFrom.set(to, path); queue.push(to) }
    continue
  }
  if (res.status !== 200) { findings.push(`${res.status} ${path}  (linked from ${linkedFrom.get(path) ?? '-'})`); continue }
  const type = res.headers.get('content-type') ?? ''
  if (!type.includes('text/html')) continue
  const html = await res.text()
  for (const re of FORBIDDEN) if (re.test(html)) findings.push(`forbidden text ${re} on ${path}`)
  for (const m of html.matchAll(/(?:href|src)="([^"#?]+)[^"]*"/g)) {
    const to = norm(m[1], path)
    if (to && !seen.has(to) && !linkedFrom.has(to)) { linkedFrom.set(to, path); queue.push(to) }
  }
}

// Sitemap vs crawl
const sm = await (await fetch(base + '/sitemap.xml')).text()
const inSitemap = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => norm(m[1], '/')).filter(Boolean)
for (const p of inSitemap) if (!seen.has(p)) findings.push(`sitemap page never linked (orphan): ${p}`)
const pages = [...seen.entries()].filter(([p, s]) => s === 200 && !p.startsWith('/_next') && !/\.(png|jpg|jpeg|webp|svg|ico|css|js|xml|txt)$/.test(p) && !p.startsWith('/api') && !p.startsWith('/admin'))
for (const [p] of pages) if (!inSitemap.includes(p) && !['/book', '/thank-you', '/contact'].includes(p)) findings.push(`page not in sitemap: ${p}`)

console.log(`crawled ${seen.size} urls, ${pages.length} html pages, sitemap ${inSitemap.length} urls`)
if (findings.length) { console.log('\nFINDINGS:'); for (const f of findings) console.log(' -', f); process.exit(1) }
console.log('no broken links, no orphans, no forbidden text')
