import type { CollectionConfig } from 'payload'
import { anyone, staff } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

/** Free-form pages: About, Privacy, Terms, and anything staff add later. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Pages',
    // Gives each document a "Preview" button pointing at its live page.
    preview: (doc) => (doc?.slug ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${doc.slug}` : null),
    description: 'Standalone pages such as About, Privacy and Terms.',
  },
  access: { read: anyone, create: staff, update: staff, delete: staff },
  // Save keeps a version; Publish makes it live. Gives non-technical staff a
  // preview and a way back to yesterday's wording.
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 20,
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'intro', type: 'textarea', admin: { description: 'Shown under the page heading.' } },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'showCta',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show the "call us" banner at the bottom',
    },
    seoField,
    slugField('title'),
  ],
}
