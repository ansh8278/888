#!/usr/bin/env node
/**
 * Renders key pages in headless Chrome at phone / tablet / desktop widths and
 * checks what a person would notice: horizontal overflow, the sticky bar on
 * phones, the mobile menu opening on a real tap, and console errors.
 * Screenshots land in ./qa-screenshots/. Exits 1 on any finding.
 *
 *   node scripts/responsive-check.mjs http://localhost:3000
 */
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'

const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PAGES = ['/', '/bay-area-locksmith', '/locations/san-jose-locksmith', '/locations/north-san-jose-locksmith', '/services/automotive-locksmith', '/services/car-lockout', '/services/garage-locksmith', '/book', '/about']
const WIDTHS = [360, 390, 768, 1024, 1440]
const OUT = 'qa-screenshots'
mkdirSync(OUT, { recursive: true })

const port = 9333
const chrome = spawn(CHROME, [`--remote-debugging-port=${port}`, '--headless=new', '--no-first-run', '--no-default-browser-check', '--user-data-dir=/tmp/888-qa-profile', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
let targets
for (let i = 0; i < 40; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break } catch { await wait(250) } }
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const pending = new Map()
const events = []
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id) } else if (d.method) events.push(d) }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const evalJs = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value

await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable')
const findings = []

for (const width of WIDTHS) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 800 })
  if (width < 800) await send('Emulation.setTouchEmulationEnabled', { enabled: true })
  for (const path of PAGES) {
    events.length = 0
    await send('Page.navigate', { url: base + path })
    // Wait for the page to actually load (remote sites are slower than localhost).
    for (let i = 0; i < 40; i++) { if ((await evalJs('document.readyState')) === 'complete' && (await evalJs('!!document.querySelector("main")'))) break; await wait(250) }
    await wait(600)
    const r = await evalJs(`(() => {
      const w = document.documentElement.clientWidth
      // A wide table or marquee inside its own scrolling box is fine — only
      // report elements that actually push the page sideways.
      const clipped = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden') return true } return false }
      const wide = [...document.querySelectorAll('body *')].filter(el => { const b = el.getBoundingClientRect(); return b.width > 0 && b.right > w + 1 && !clipped(el) }).map(el => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '')).slice(0, 5)
      const bar = document.querySelector('.stickybar'); const barShown = bar && getComputedStyle(bar).display !== 'none'
      const burger = document.querySelector('.burger'); const burgerShown = burger && getComputedStyle(burger).display !== 'none'
      const h1 = document.querySelector('h1')?.textContent?.trim() || ''
      // Footer must stay a grid of readable columns, and its call button must not
      // become a tall blob (a pill squeezed into a narrow column).
      const foot = document.querySelector('.site-footer')
      const call = document.querySelector('.dispatch-call')
      const cb = call && call.getBoundingClientRect()
      const footer = foot ? { tall: cb ? cb.height > 80 : false, narrow: cb ? cb.width < 150 : false, cols: document.querySelectorAll('.footer-nav-col').length } : null
      const smallText = [...document.querySelectorAll('p, li, a, span')].filter(el => el.textContent.trim().length > 20 && parseFloat(getComputedStyle(el).fontSize) < 12 && getComputedStyle(el).display !== 'none').length
      return { wide, footer, barShown: !!barShown, burgerShown: !!burgerShown, h1, smallText, scrollW: document.documentElement.scrollWidth, w }
    })()`)
    const errors = events.filter((e) => (e.method === 'Runtime.exceptionThrown') || (e.method === 'Log.entryAdded' && e.params.entry.level === 'error' && !/favicon/.test(e.params.entry.text))).map((e) => e.params.exceptionDetails?.text || e.params.entry?.text)
    const tag = `${width}${path.replace(/\//g, '_') || '_home'}`
    if (!r) { findings.push(`${tag}: page did not render`); continue }
    if (r.wide.length) findings.push(`${tag}: overflow ${r.wide.join(', ')}`)
    if (r.scrollW > r.w + 1) findings.push(`${tag}: page scrolls sideways (${r.scrollW}px in a ${r.w}px window)`)
    if (width < 800 && !r.barShown) findings.push(`${tag}: sticky bar not visible on phone`)
    if (width >= 800 && r.barShown) findings.push(`${tag}: sticky bar visible on desktop`)
    if (width < 800 && !r.burgerShown) findings.push(`${tag}: menu button not visible on phone`)
    if (!r.h1) findings.push(`${tag}: no h1`)
    if (r.footer?.tall) findings.push(`${tag}: footer call button is a blob (too tall)`)
    if (r.footer?.narrow) findings.push(`${tag}: footer call button squeezed (< 150px wide)`)
    if (errors.length) findings.push(`${tag}: console ${errors[0]}`)
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60, captureBeyondViewport: false })
    writeFileSync(`${OUT}/${tag}.jpg`, Buffer.from(shot.result.data, 'base64'))
  }
  // Real tap on the burger, on the home page, at phone widths.
  if (width < 800) {
    await send('Page.navigate', { url: base + '/' }); await wait(1500)
    const box = await evalJs(`(() => { const b = document.querySelector('.burger').getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 } })()`)
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x, y: box.y }] })
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await wait(400)
    const open = await evalJs(`(() => { const n = document.querySelector('#mobile-nav'); return n && !n.hidden && getComputedStyle(n).display !== 'none' && n.getBoundingClientRect().height > 100 })()`)
    if (!open) findings.push(`${width}: mobile menu did not open on tap`)
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60 })
    writeFileSync(`${OUT}/${width}_menu-open.jpg`, Buffer.from(shot.result.data, 'base64'))
  }
}

// Admin dashboard (client-rendered): log in, open, look for the launch checklist.
if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url: base + '/admin/login' }); await wait(2500)
  await evalJs(`(async () => { await fetch('/api/users/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: ${JSON.stringify(process.env.ADMIN_EMAIL)}, password: ${JSON.stringify(process.env.ADMIN_PASSWORD)} }) }) })()`)
  await send('Page.navigate', { url: base + '/admin' }); await wait(4000)
  const dash = await evalJs(`(() => ({ missing: !!document.querySelector('.dash__missing'), items: [...document.querySelectorAll('.dash__missing li strong')].map(e => e.textContent), title: document.querySelector('.dash h1')?.textContent }))()`)
  if (!dash.title) findings.push('admin: dashboard did not render')
  else if (!dash.missing) findings.push('admin: "Missing before launch" panel not shown')
  else console.log('admin dashboard OK — missing:', dash.items.join(' | '))
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60 })
  writeFileSync(`${OUT}/admin-dashboard.jpg`, Buffer.from(shot.result.data, 'base64'))
}

ws.close(); chrome.kill()
console.log(`${WIDTHS.length * PAGES.length} page renders checked → ${OUT}/`)
if (findings.length) { console.log('FINDINGS:'); for (const f of findings) console.log(' -', f); process.exit(1) }
console.log('no overflow, sticky bar + menu behave, no console errors')
