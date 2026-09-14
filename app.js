/**
 * Startup file for cPanel's "Setup Node.js App" (Phusion Passenger).
 *
 * Passenger does not run `npm start`; it loads this file and expects it to
 * listen on the port it provides in process.env.PORT. This boots the built
 * Next.js app (which contains the Payload admin and API) the same way
 * `next start` would.
 *
 * Run `npm run build` before starting, and `npx payload migrate` once after
 * each deploy so the database schema matches the code.
 */
import { createServer } from 'http'
import next from 'next'

const port = Number(process.env.PORT) || 3000
const hostname = process.env.HOSTNAME || '0.0.0.0'

const app = next({ dev: false, hostname, port })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    // Passenger strips the sub-path it mounts us on ("/888") before the
    // request reaches us, but the app is built to expect it. Put it back.
    // Map "/" to "/888" (no slash) so Next's own trailing-slash redirect
    // cannot ping-pong with Apache's.
    const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
    createServer((req, res) => {
      if (base && req.url !== base && !req.url.startsWith(`${base}/`) && !req.url.startsWith(`${base}?`)) {
        req.url = req.url.startsWith('/?') || req.url === '/' ? base + req.url.slice(1) : base + req.url
      }
      handle(req, res)
    }).listen(port, hostname, () => {
      console.log(`888 Lock & Key ready on ${hostname}:${port}`)
    })
  })
  .catch((err) => {
    console.error('Failed to start:', err)
    process.exit(1)
  })
