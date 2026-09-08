import type { CollectionConfig } from 'payload'
import { anyone, staff } from '../access'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Review', plural: 'Reviews' },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'cityLabel', 'rating', 'featured'],
    group: 'Content',
    description: 'Customer reviews. Featured ones scroll across the home page.',
  },
  access: { read: anyone, create: staff, update: staff, delete: staff },
  defaultSort: 'order',
  fields: [
    { name: 'quote', type: 'textarea', required: true, admin: { description: 'The review itself, without quote marks.' } },
    {
      type: 'row',
      fields: [
        { name: 'author', type: 'text', required: true, admin: { width: '50%', description: 'e.g. "Priya M."' } },
        { name: 'cityLabel', type: 'text', label: 'City', admin: { width: '50%', description: 'e.g. "San Jose, CA"' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'rating',
          type: 'number',
          required: true,
          defaultValue: 5,
          min: 1,
          max: 5,
          admin: { width: '50%', description: 'Stars, 1 to 5.' },
        },
        {
          name: 'source',
          type: 'select',
          defaultValue: 'google',
          admin: { width: '50%' },
          options: [
            { label: 'Google', value: 'google' },
            { label: 'Yelp', value: 'yelp' },
            { label: 'Direct', value: 'direct' },
          ],
        },
      ],
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      admin: { description: 'Optional. Shows this review on that city page.' },
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      admin: { description: 'Optional. Shows this review on that service page.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Include in the scrolling home page strip.' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
