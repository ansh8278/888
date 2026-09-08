import type { CollectionConfig } from 'payload'
import { anyone, staff } from '../access'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'showOnHome', 'order'],
    group: 'Content',
    description: 'Answers reused across the site. Attach them to services from the service page.',
  },
  access: { read: anyone, create: staff, update: staff, delete: staff },
  defaultSort: 'order',
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    {
      name: 'showOnHome',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show in the main FAQ section',
      admin: { position: 'sidebar' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
