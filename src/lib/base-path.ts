/**
 * Sub-path the whole site lives under, e.g. "/888" when served at
 * example.com/888. Empty (the default) means the site is at the domain root.
 *
 * Next's <Link>, <Image> optimisation routes and router.push add this
 * automatically. Anything that builds a URL by hand — plain <a> tags, fetch
 * calls, canonical tags, media paths handed to next/image — must go through
 * withBase().
 *
 * NEXT_PUBLIC_ so it is available in the browser as well as on the server,
 * and it must be set at BUILD time: Next bakes basePath into the output.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

export const withBase = (path: string): string =>
  BASE_PATH && path.startsWith('/') && !path.startsWith(`${BASE_PATH}/`) && path !== BASE_PATH
    ? `${BASE_PATH}${path}`
    : path
