import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
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
    localPatterns: [
      {
        pathname: '/api/media/file/**',
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
