import type { GlobalConfig } from 'payload'
import { anyone, staff } from '../access'

/**
 * The service-in-city pages (Car Lockout in Phoenix, etc.) are generated from
 * every service x every location. There are dozens of them, so the wording
 * lives here once as a template rather than as dozens of near-identical records.
 *
 * Placeholders: {service} {city} {state} {phone} {arrival} {price}
 */
export const ComboTemplate: GlobalConfig = {
  slug: 'combo-template',
  label: 'Service-in-city pages',
  admin: {
    group: 'Pages',
    description:
      'Wording for the "[service] in [city]" pages. Use {service}, {city}, {state}, {phone}, {arrival} and {price} — they are swapped for the real values on each page.',
  },
  access: { read: anyone, update: staff },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      label: 'Generate these pages',
      admin: { description: 'Turning this off removes them from the site and the sitemap.' },
    },
    { name: 'eyebrow', type: 'text', defaultValue: '{city}, {state}' },
    { name: 'heading', type: 'text', required: true, defaultValue: '{service} in {city}' },
    {
      name: 'intro',
      type: 'textarea',
      required: true,
      defaultValue:
        'Need {service} in {city}? Our mobile technicians are dispatched to you anywhere in {city} — licensed, insured, and with the price confirmed before work begins.',
    },
    {
      name: 'bodyHeading',
      type: 'text',
      defaultValue: 'Why {city} calls us first',
    },
    {
      name: 'body',
      type: 'textarea',
      admin: { description: 'A paragraph or two. Placeholders work here too.' },
      defaultValue:
        'Every {city} job is handled by a background-checked technician in a fully stocked van, so the work is finished on the first visit. You get a firm price on the phone before we set off — no call-out surprises, no upsell games.',
    },
    {
      name: 'ctaHeading',
      type: 'text',
      defaultValue: 'Need {service} in {city} right now?',
    },
    {
      name: 'seoTitle',
      type: 'text',
      defaultValue: '{service} in {city}, {state} | Mobile Locksmith | 888 Lock & Key',
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      defaultValue:
        '{service} in {city}, {state}. Mobile, licensed and insured locksmith dispatched across San Jose and the Bay Area. Call now.',
    },
  ],
}
