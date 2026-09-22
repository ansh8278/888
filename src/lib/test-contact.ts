/**
 * No phone number may ever be invented. With nothing configured, phoneOf()
 * returns null and every call button becomes a "Request Service" link.
 */
import assert from 'node:assert/strict'
import { phoneOf } from './contact'

assert.equal(phoneOf({}), null)
assert.equal(phoneOf({ phone: '', phoneHref: '' }), null)
assert.equal(phoneOf({ phone: '   ' }), null)
assert.deepEqual(phoneOf({ phone: '(408) 555-0100', phoneHref: '+14085550100' }), { display: '(408) 555-0100', href: '+14085550100' })
// Dial string derived from the display number when not given separately.
assert.deepEqual(phoneOf({ phone: '(408) 555-0100' }), { display: '(408) 555-0100', href: '4085550100' })
// A per-location number wins over the site-wide one.
assert.deepEqual(phoneOf({ phone: '(408) 555-0100' }, '(650) 555-0200'), { display: '(650) 555-0200', href: '6505550200' })

console.log('contact: all assertions passed')
