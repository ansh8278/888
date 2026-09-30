#!/usr/bin/env node
/**
 * Full-page screenshot of one URL, for reviewing a layout change.
 *   node scripts/page-shot.mjs http://localhost:3000 /contact out.jpg 1440
 */
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const [base, path, out, width = '1440'] = process.argv.slice(2)
const w = Number(width)
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const chrome = spawn(CHROME, ['--remote-debugging-port=9351', '--headless=new', '--user-data-dir=/tmp/888-shot', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
let targets
for (let i = 0; i < 40; i++) { try { targets = await (await fetch('http://127.0.0.1:9351/json')).json(); break } catch { await wait(250) } }
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const pending = new Map()
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const evalJs = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true })).result?.result?.value
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 800 })
await send('Page.navigate', { url: base + path })
await wait(2500)
const h = await evalJs('document.body.scrollHeight')
await send('Emulation.setDeviceMetricsOverride', { width: w, height: Math.min(h, 6000), deviceScaleFactor: 1, mobile: w < 800 })
await wait(800)
const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 62, captureBeyondViewport: true })
writeFileSync(out, Buffer.from(shot.result.data, 'base64'))
console.log(`${path} → ${out} (${h}px tall)`)
ws.close()
chrome.kill()
