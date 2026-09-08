/**
 * Media URLs must stay relative. Absolute ones make next/image demand a host
 * allowlist, which broke every page with a 500 after `serverURL` was added.
 */
import assert from 'node:assert/strict'
import { mediaUrl } from '../components/blocks'

assert.equal(mediaUrl({ url: 'http://localhost:3000/api/media/file/hero.png' }), '/api/media/file/hero.png')
assert.equal(mediaUrl({ url: 'https://888lockandkey.com/api/media/file/hero.png' }), '/api/media/file/hero.png')
assert.equal(mediaUrl({ url: '/api/media/file/hero.png' }), '/api/media/file/hero.png')
assert.equal(mediaUrl({ url: 'https://cdn.example.com/x.png?v=2' }), '/x.png?v=2')
assert.equal(mediaUrl(null), null)
assert.equal(mediaUrl(7), null)
assert.equal(mediaUrl({ url: null }), null)
assert.equal(mediaUrl({}), null)

console.log('media urls: all assertions passed')
