/**
 * Self-check for the placeholder substitution the combo pages depend on.
 * Run: npx tsx src/lib/test-template.ts
 */
import assert from 'node:assert/strict'
import { fillTemplate } from './template'

const vars = { service: 'Car Lockout', city: 'Phoenix', price: '$95', empty: '' }

assert.equal(fillTemplate('{service} in {city}', vars), 'Car Lockout in Phoenix')
assert.equal(fillTemplate('from {price}', vars), 'from $95')
// Repeated placeholders all get filled.
assert.equal(fillTemplate('{city}, {city}', vars), 'Phoenix, Phoenix')
// Unknown keys survive so mistakes are visible rather than silently blank.
assert.equal(fillTemplate('{nope} here', vars), '{nope} here')
// Empty and missing values are treated the same: leave the token visible.
assert.equal(fillTemplate('{empty}!', vars), '{empty}!')
assert.equal(fillTemplate(null, vars), '')
assert.equal(fillTemplate(undefined, vars), '')
assert.equal(fillTemplate('no placeholders', vars), 'no placeholders')

console.log('template: all assertions passed')
