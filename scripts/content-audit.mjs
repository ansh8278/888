#!/usr/bin/env node
/**
 * Walks every page in the sitemap and reports anything that is not a real,
 * client-supplied fact: unverified claims, leftover placeholders, and the
 * example prices/reviews that exist only to show the layout.
 *
 *   node scripts/content-audit.mjs https://example.com
 */
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')

const BANNED = [
  ['unverified claim "24/7"', /24\s*\/\s*7/i],
  ['out-of-scope city (New York)', /New York/],
  ['out-of-scope city (Los Angeles)', /Los Angeles/],
  ['out-of-scope city (San Francisco) as a service area', /San Francisco Locksmith/],
  ['placeholder phone', /\(XXX\)|REALPHONE|555-0888|555-01\d\d/],
  ['placeholder licence', /REAL LICENSE|LCO-000000/],
  ['unfinished text', /lorem ipsum|\[Insert|\bTBD\b|\bTODO\b/i],
  ['dead phone link', /tel:null|tel:undefined|tel:"/],
  ['template left unfilled', /\{city\}|\{state\}|\{arrival\}|\{price\}|\{service\}|\{area\}|\{count\}/],
  ['duplicated word in a heading', /Services Services|Locksmith Locksmith/],
]
const FLAGGED = [
  ['EXAMPLE PRICES on the page', /Example price/],
  ['EXAMPLE REVIEWS on the page', /Example — not a real review|Example &mdash; not a real review/],
]

const get = async (u) => { for (let i = 0; i < 3; i++) { try { return await (await fetch(u, { signal: AbortSignal.timeout(30000) })).text() } catch {} } return '' }
const sm = await get(base + '/sitemap.xml')
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

const problems = []
const flagged = new Map()
for (const url of urls) {
  const html = await get(url)
  const text = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ')
  const path = new URL(url).pathname
  for (const [label, re] of BANNED) if (re.test(text)) problems.push(`${path}: ${label}`)
  for (const [label, re] of FLAGGED) if (re.test(text)) flagged.set(label, (flagged.get(label) ?? 0) + 1)
}

console.log(`checked ${urls.length} pages`)
if (problems.length === 0) console.log('\nNo fake or placeholder content found.')
else { console.log(`\nPROBLEMS (${problems.length}):`); for (const p of problems) console.log(' -', p) }

if (flagged.size) {
  console.log('\nDeliberate placeholders, clearly labelled on the page (remove before launch):')
  for (const [label, count] of flagged) console.log(` - ${label} — on ${count} page(s)`)
}
process.exit(problems.length ? 1 : 0)
