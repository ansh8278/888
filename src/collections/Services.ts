import type { CollectionConfig } from 'payload'
import { anyone, staff } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startingPrice', 'order'],
    group: 'Content',
    // Gives each document a "Preview" button pointing at its live page.
    preview: (doc) => (doc?.slug ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/services/${doc.slug}` : null),
    description: 'Each service gets its own page, and one page per city it is offered in.',
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
              admin: { description: 'Short checklist shown beside the write-up.' },
              fields: [{ name: 'text', type: 'text', required: true }],
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
              required: true,
              admin: { description: 'e.g. "$95" or "From $45 / lock" or "Custom quote"' },
            },
            {
              name: 'priceNote',
              type: 'text',
              admin: { description: 'Shown in the pricing table Notes column.' },
            },
            {
              name: 'showInPricingTable',
              type: 'checkbox',
              defaultValue: true,
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
