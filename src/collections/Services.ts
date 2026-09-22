import type { CollectionConfig } from 'payload'
import { anyone, staff } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'category', 'order'],
    group: 'Pages',
    // Gives each document a "Preview" button pointing at its live page.
    preview: (doc) => (doc?.slug ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/services/${doc.slug}` : null),
    description: 'Service categories (Automotive, Residential…) and the individual services under them. Each gets its own page.',
  },
  access: { read: anyone, create: staff, update: staff, delete: staff },
  defaultSort: 'order',
  // Save keeps a version; Publish makes it live. Gives non-technical staff a
  // preview and a way back to yesterday's wording.
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 20,
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true, admin: { description: 'e.g. "Car Lockout"' } },
            {
              type: 'row',
              fields: [
                {
                  name: 'kind',
                  type: 'select',
                  required: true,
                  defaultValue: 'service',
                  admin: { width: '50%', description: 'A category lists its services; a service sits under a category.' },
                  options: [
                    { label: 'Category (Automotive, Residential…)', value: 'category' },
                    { label: 'Service under a category', value: 'service' },
                    { label: 'Standalone page (e.g. Garage)', value: 'standalone' },
                  ],
                },
                {
                  name: 'category',
                  type: 'relationship',
                  relationTo: 'services',
                  filterOptions: { kind: { equals: 'category' } },
                  admin: { width: '50%', description: 'For services only: the category this belongs to.' },
                },
              ],
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              admin: { description: 'One or two lines. Shown on the home page service card.' },
            },
            {
              name: 'icon',
              type: 'select',
              required: true,
              defaultValue: 'car',
              admin: { description: 'Icon shown on cards and lists.' },
              options: [
                { label: 'Car', value: 'car' },
                { label: 'House', value: 'home' },
                { label: 'Building', value: 'building' },
                { label: 'Key', value: 'key' },
                { label: 'Smart lock / wifi', value: 'smart' },
                { label: 'Shield', value: 'shield' },
                { label: 'Padlock', value: 'lock' },
              ],
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional. Falls back to the site default hero image.' },
            },
            {
              name: 'intro',
              type: 'textarea',
              required: true,
              admin: { description: 'Opening paragraph on the service page.' },
            },
            {
              name: 'body',
              type: 'richText',
              admin: { description: 'The main write-up. Headings, lists and links all work.' },
            },
            {
              name: 'bullets',
              type: 'array',
              label: 'What is included',
              admin: { description: 'Checklist shown on the page (used for Commercial, Emergency and Garage).' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'cityCard',
              type: 'group',
              label: 'Card on city pages',
              admin: { description: 'Every city page shows the same service cards. Leave blank to keep this service off city pages.' },
              fields: [
                { name: 'title', type: 'text', admin: { description: 'Short label, e.g. "Rekey / Lock Change". Defaults to the page title.' } },
                { name: 'text', type: 'text', admin: { description: 'One line. Write {city} where the city name should go.' } },
              ],
            },
            {
              name: 'disclaimer',
              type: 'textarea',
              admin: {
                description:
                  'Shown in a highlighted box under the intro. Used on the Garage page to say this is lock service only, not garage door repair.',
              },
            },
            {
              name: 'ctaLabel',
              type: 'text',
              admin: { description: 'Optional call-button wording for this page, e.g. "LOCKED OUT? CALL NOW".' },
            },
            {
              name: 'related',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              label: 'Related services ("You may also need")',
              admin: { description: 'Links shown at the bottom of the page.' },
            },
            {
              name: 'faqs',
              type: 'relationship',
              relationTo: 'faqs',
              hasMany: true,
              admin: { description: 'Questions shown on this service page.' },
            },
          ],
        },
        {
          label: 'Pricing',
          fields: [
            {
              name: 'startingPrice',
              type: 'text',
              admin: {
                description:
                  'Confirmed starting price only, e.g. "$95" or "From $45 / lock". Leave blank until pricing is confirmed — nothing is shown then.',
              },
            },
            {
              name: 'priceNote',
              type: 'text',
              admin: { description: 'Shown in the pricing table Notes column.' },
            },
            {
              name: 'showInPricingTable',
              type: 'checkbox',
              defaultValue: false,
              label: 'Show this service in the pricing table',
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
    slugField('title'),
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Show on the home page.' },
    },
  ],
}
