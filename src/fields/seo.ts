import type { Field } from 'payload'

/**
 * Per-page search metadata. Left blank, the page falls back to its own
 * title/description, so editors only fill this in when they want to override.
 */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'Search engine listing',
  admin: {
    description: 'Optional. Leave blank to use the page title and intro text.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Best under 60 characters.' },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Best under 155 characters.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Shown when the page is shared on social media.' },
    },
    {
      name: 'noindex',
      type: 'checkbox',
      label: 'Hide this page from Google',
      defaultValue: false,
    },
  ],
}
