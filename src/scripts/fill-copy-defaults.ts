/**
 * Fills blank text on the editable globals with the default wording.
 *
 * Payload only applies a field's default when a row is first created, so
 * fields added later stay empty on an existing site — the section simply does
 * not render. This walks the field definitions, collects those defaults and
 * writes them only where the stored value is still empty.
 *
 * Never overwrites anything an editor has typed. Safe to run repeatedly.
 *
 *   npm run copy:defaults
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Field } from 'payload'

const isEmpty = (value: unknown) =>
  value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)

/** The defaults declared on a group of fields, as a plain object. */
const defaultsOf = (fields: Field[]): Record<string, unknown> => {
  const out: Record<string, unknown> = {}
  for (const field of fields) {
    if ('fields' in field && !('name' in field)) {
      // Rows, tabs and collapsibles have no name of their own.
      Object.assign(out, defaultsOf(field.fields as Field[]))
      continue
    }
    if ('tabs' in field) {
      for (const tab of field.tabs) Object.assign(out, defaultsOf(tab.fields as Field[]))
      continue
    }
    if (!('name' in field)) continue
    if (field.type === 'group') {
      const nested = defaultsOf(field.fields as Field[])
      if (Object.keys(nested).length > 0) out[field.name] = nested
      continue
    }
    const fallback = (field as { defaultValue?: unknown }).defaultValue
    if (fallback !== undefined && typeof fallback !== 'function') out[field.name] = fallback
  }
  return out
}

/** Only the keys whose current value is empty (recursing into groups). */
const missing = (defaults: Record<string, unknown>, current: Record<string, unknown>): Record<string, unknown> => {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(defaults)) {
    const now = current?.[key]
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nested = missing(value as Record<string, unknown>, (now ?? {}) as Record<string, unknown>)
      if (Object.keys(nested).length > 0) out[key] = { ...(now as object), ...nested }
    } else if (isEmpty(now)) {
      out[key] = value
    }
  }
  return out
}

const payload = await getPayload({ config })

for (const global of payload.config.globals) {
  // Business details are deliberately left blank until the client supplies
  // them — never fill those in with sample values.
  if (global.slug === 'site-settings') continue
  const current = (await payload.findGlobal({ slug: global.slug, depth: 0 })) as unknown as Record<string, unknown>
  const toFill = missing(defaultsOf(global.fields as Field[]), current)
  const keys = Object.keys(toFill)
  if (keys.length === 0) {
    console.log(`${global.slug.padEnd(16)} nothing missing`)
    continue
  }
  await payload.updateGlobal({ slug: global.slug, data: toFill as never })
  console.log(`${global.slug.padEnd(16)} filled ${keys.length}: ${keys.join(', ')}`)
}

process.exit(0)
