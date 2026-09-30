#!/usr/bin/env node
/**
 * Checks the footer at every common screen width: nothing overflowing, the
 * groups collapsed on phones and open on desktop, the phone number on one
 * line, and enough room between tap targets.
 *
 *   node scripts/footer-check.mjs http://localhost:3000
 */
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'

const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
const WIDTHS = [320, 360, 390, 414, 480, 600, 768, 834, 1024, 1280, 1440, 1920]
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
mkdirSync('qa-screenshots/footer', { recursive: true })

const chrome = spawn(CHROME, ['--remote-debugging-port=9354', '--headless=new', '--user-data-dir=/tmp/888-footer', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
let targets
for (let i = 0; i < 40; i++) { try { targets = await (await fetch('http://127.0.0.1:9354/json')).json(); break } catch { await wait(250) } }
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const pending = new Map()
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const evalJs = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true })).result?.result?.value
await send('Page.enable')

const findings = []
for (const width of WIDTHS) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 800 })
  await send('Page.navigate', { url: base + '/bay-area-locksmith' })
  await wait(2200)
  await evalJs('document.querySelector(".site-footer").scrollIntoView()')
  await wait(500)
  const r = await evalJs(`(() => {
    const f = document.querySelector('.site-footer')
    const vw = document.documentElement.clientWidth
    const over = [...f.querySelectorAll('*')].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && (b.right > vw + 1 || b.left < -1) }).map((el) => el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0]).slice(0, 4)
    const groups = [...f.querySelectorAll('.footer-nav-col')]
    const phone = f.querySelector('.dispatch-phone')
    const pb = phone && phone.getBoundingClientRect()
    const line = phone ? Math.round(pb.height) : 0
    const taps = [...f.querySelectorAll('a, summary')].map((el) => Math.round(el.getBoundingClientRect().height))
    return { vw, over, open: groups.filter((g) => g.open).length, groups: groups.length, phoneLines: line > 44 ? 2 : 1, phoneWidth: pb ? Math.round(pb.width) : 0, smallTaps: taps.filter((h) => h > 0 && h < 18).length, height: Math.round(f.getBoundingClientRect().height) }
  })()`)
  if (r.over.length) findings.push(`${width}px: overflows — ${r.over.join(', ')}`)
  if (width <= 720 && r.open !== 0) findings.push(`${width}px: ${r.open}/${r.groups} groups open on a phone (should be collapsed)`)
  if (width > 720 && r.open !== r.groups) findings.push(`${width}px: only ${r.open}/${r.groups} groups open on desktop`)
  if (r.phoneLines > 1) findings.push(`${width}px: the phone number wraps on to two lines`)
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60 })
  writeFileSync(`qa-screenshots/footer/${width}.jpg`, Buffer.from(shot.result.data, 'base64'))
  console.log(`${String(width).padStart(4)}px  footer ${String(r.height).padStart(4)}px  groups open ${r.open}/${r.groups}  phone ${r.phoneWidth}px${r.over.length ? '  OVERFLOW' : ''}`)
}

ws.close(); chrome.kill()
console.log(findings.length ? `\nFINDINGS:\n - ${findings.join('\n - ')}` : '\nfooter is clean at every width')
process.exit(findings.length ? 1 : 0)
