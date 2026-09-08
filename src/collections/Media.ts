import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  // "Media" sat alone under a stray "Collections" heading in the sidebar.
  // Named and grouped to match the dashboard tile.
  labels: { singular: 'Image', plural: 'Images' },
  admin: {
    group: 'Settings',
    description: 'Photos used across the website.',
    useAsTitle: 'alt',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
