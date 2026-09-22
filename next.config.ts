import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // Serve the whole site under a sub-path (e.g. example.com/888) when set.
  // Baked in at build time. See src/lib/base-path.ts.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  /**
   * Next blocks cross-origin requests to dev assets by default, so opening the
   * dev server from a phone on the LAN (http://192.168.x.x:3000) served the
   * HTML but not the JavaScript — the page looked right and nothing was
   * clickable. Production (`next start`) is unaffected.
   */
  // Matching is dot-segment wildcards (like domain patterns), not CIDR.
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '172.*.*.*', '*.local'],
  /**
   * Security headers. No Content-Security-Policy here on purpose: Next injects
   * inline scripts and styles, so a strict policy needs per-request nonces and
   * would silently break the admin. These four are the high-value ones that
   * carry no such risk.
   */
  /**
   * Old URLs → the client's new structure. The five out-of-scope cities were
   * never launched publicly, so only renamed services and the old listing
   * page get redirects (see implementation_plan.md, decision D3).
   */
  async redirects() {
    return [
      { source: '/locations', destination: '/bay-area-locksmith', permanent: true },
      { source: '/locations/san-jose', destination: '/locations/san-jose-locksmith', permanent: true },
      { source: '/services/residential-lockout', destination: '/services/house-lockout', permanent: true },
      { source: '/services/house-rekey', destination: '/services/rekey-locks', permanent: true },
      { source: '/services/car-key-and-fob-replacement', destination: '/services/car-key-replacement', permanent: true },
      { source: '/services/commercial-and-access-control', destination: '/services/commercial-locksmith', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Stop the site being framed by a phishing page.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Stop browsers guessing a file is something it is not.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Do not leak the full URL to third parties.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Nothing here needs a camera, a microphone or a location.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          // Only meaningful over HTTPS; harmless in local development.
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ]
  },
  images: {
    dangerouslyAllowLocalIP: true,
    // Uploads live on Vercel Blob when deployed there.
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
    localPatterns: [
      {
        // The optimiser checks the full request path, which includes any
        // basePath the site is served under.
        pathname: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/media/file/**`,
      },
      {
        pathname: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/**`,
      },
      {
        pathname: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/**`,
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
