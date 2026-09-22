import type { CollectionConfig } from 'payload'
import { anyone, staff } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Locations: CollectionConfig = {
  slug: 'locations',
  labels: { singular: 'Location', plural: 'Locations' },
  admin: {
    useAsTitle: 'city',
    defaultColumns: ['city', 'subregion', 'parent', 'order'],
    group: 'Pages',
    // Gives each document a "Preview" button pointing at its live page.
    preview: (doc) => (doc?.slug ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/locations/${doc.slug}` : null),
    description: 'Cities and San Jose districts you serve. Each one gets a page. This is a service area, not a list of shops.',
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
              name: 'subregion',
              type: 'select',
              required: true,
              defaultValue: 'south-bay',
              admin: { description: 'Which part of the Bay Area this city belongs to. Groups it on the Bay Area page.' },
              options: [
                { label: 'South Bay / Silicon Valley', value: 'south-bay' },
                { label: 'Peninsula', value: 'peninsula' },
                { label: 'East Bay', value: 'east-bay' },
                { label: 'Tri-Valley', value: 'tri-valley' },
              ],
            },
            {
              name: 'parent',
              type: 'relationship',
              relationTo: 'locations',
              admin: {
                description:
                  'Only for districts inside a city (e.g. North San Jose → San Jose). Nested under the parent in breadcrumbs and left out of the Bay Area page.',
              },
            },
            {
              name: 'nearby',
              type: 'relationship',
              relationTo: 'locations',
              hasMany: true,
              label: 'Also serving (nearby areas)',
              admin: { description: 'Shown as links at the bottom of the page.' },
            },
            {
              name: 'badge',
              type: 'text',
              admin: { description: 'Small label above the page heading. Defaults to the region name.' },
            },
            {
              name: 'shopName',
              type: 'text',
              admin: { description: 'Only if there is a real, confirmed shop or dispatch hub here. Leave blank otherwise.' },
            },
            {
              name: 'shopSubtitle',
              type: 'text',
              admin: { description: 'e.g. "Dispatch hub". Leave blank if there is no physical location.' },
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
          description:
            'Only fill in an address if there is a real, confirmed shop or dispatch hub in this city. Cities without one are still served — never invent an address.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'addressLine', type: 'text', admin: { width: '50%', description: 'Street address of a real location only' } },
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
              admin: { description: 'Confirmed opening hours for a physical location here. Leave blank otherwise.' },
            },
            {
              name: 'mapUrl',
              type: 'text',
              admin: { description: 'Optional Google Maps link for the "Get directions" button.' },
            },
            {
              name: 'neighbourhoods',
              type: 'array',
              label: 'Neighborhoods we serve',
              admin: { description: 'Listed as pills on the page. Helps local search.' },
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
                description: 'Service cards shown on this page, in order. Leave empty to show every service.',
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
      admin: { position: 'sidebar', description: 'Show in the home page and footer city lists.' },
    },
  ],
}
