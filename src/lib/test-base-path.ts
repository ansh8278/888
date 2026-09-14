/** withBase must prefix root-relative paths exactly once, and leave others alone. */
import assert from 'node:assert/strict'

// Set before the module loads: BASE_PATH is read once at import time, exactly
// as it would be in the built app.
process.env.NEXT_PUBLIC_BASE_PATH = '/888'
const { withBase } = await import('./base-path')

assert.equal(withBase('/services'), '/888/services')
assert.equal(withBase('/api/media/file/x.png'), '/888/api/media/file/x.png')
assert.equal(withBase('/888/services'), '/888/services', 'never double-prefixes')
assert.equal(withBase('/888'), '/888')
assert.equal(withBase('https://x.com/a'), 'https://x.com/a', 'absolute URLs untouched')
assert.equal(withBase('#main'), '#main', 'fragments untouched')
assert.equal(withBase('tel:+1408'), 'tel:+1408')

console.log('base path: all assertions passed')
