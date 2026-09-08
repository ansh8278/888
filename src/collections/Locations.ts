import type { CollectionConfig } from 'payload'
import { anyone, staff } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Locations: CollectionConfig = {
  slug: 'locations',
  labels: { singular: 'Location', plural: 'Locations' },
  admin: {
    useAsTitle: 'city',
    defaultColumns: ['city', 'state', 'phone', 'order'],
    group: 'Content',
    // Gives each document a "Preview" button pointing at its live page.
    preview: (doc) => (doc?.slug ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/locations/${doc.slug}` : null),
    description: 'Cities you serve. Each one gets a page, plus a page for every service.',
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
          label: 'Details',
          fields: [
            { name: 'city', type: 'text', required: true, admin: { description: 'e.g. "San Jose"' } },
            { name: 'state', type: 'text', required: true, admin: { description: 'e.g. "California"' } },
            {
              name: 'stateAbbr',
              type: 'text',
              required: true,
              admin: { description: 'Two letters, e.g. "CA". Used in addresses.' },
            },
            {
              name: 'badge',
              type: 'text',
              admin: { description: 'Label on the shop card, e.g. "California HQ".' },
            },
            {
              name: 'shopName',
              type: 'text',
              admin: { description: 'e.g. "888 Lock & Key — San Jose"' },
            },
            {
              name: 'shopSubtitle',
              type: 'text',
              admin: { description: 'e.g. "Main shop & dispatch center"' },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'City photo used on the location card and page header.' },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'addressLine', type: 'text', admin: { width: '50%', description: 'Street address' } },
                { name: 'postcode', type: 'text', admin: { width: '50%', description: 'ZIP code' } },
              ],
            },
            {
              name: 'phone',
              type: 'text',
              admin: { description: 'Leave blank to use the main site phone number.' },
            },
            {
              name: 'hours',
              type: 'text',
              defaultValue: 'Open 24 hours',
              admin: { description: 'e.g. "Open 24 hours · walk-ins 8am–7pm"' },
            },
            {
              name: 'mapUrl',
              type: 'text',
              admin: { description: 'Optional Google Maps link for the "Get directions" button.' },
            },
            {
              name: 'neighbourhoods',
              type: 'array',
              label: 'Areas covered',
              admin: { description: 'Listed on the location page. Helps local search.' },
              fields: [{ name: 'name', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Page content',
          fields: [
            {
              name: 'intro',
              type: 'textarea',
              admin: { description: 'Opening paragraph on the city page.' },
            },
            { name: 'body', type: 'richText' },
            {
              name: 'services',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              admin: {
                description: 'Services offered here. Leave empty to offer every service.',
              },
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
    slugField('city'),
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
      admin: { position: 'sidebar', description: 'Show in the home page city strip.' },
    },
  ],
}
