/**
 * Our own media URLs must stay relative: absolute ones made next/image demand
 * a host allowlist and broke every page after `serverURL` was added. URLs on
 * other hosts (Vercel Blob) are the exception and stay as they are.
 */
import assert from 'node:assert/strict'
import { mediaUrl } from '../components/blocks'

assert.equal(mediaUrl({ url: 'http://localhost:3000/api/media/file/hero.png' }), '/api/media/file/hero.png')
assert.equal(mediaUrl({ url: '/api/media/file/hero.png' }), '/api/media/file/hero.png')
// Files on another host (Vercel Blob, a CDN) are served from there.
assert.equal(mediaUrl({ url: 'https://abc.public.blob.vercel-storage.com/hero-x1.png' }), 'https://abc.public.blob.vercel-storage.com/hero-x1.png')
assert.equal(mediaUrl(null), null)
assert.equal(mediaUrl(7), null)
assert.equal(mediaUrl({ url: null }), null)
assert.equal(mediaUrl({}), null)

console.log('media urls: all assertions passed')
