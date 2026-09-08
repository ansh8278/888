import type { CollectionConfig } from 'payload'
import { staff } from '../access'
import { notifyOnNewEnquiry } from '../lib/notify'

/**
 * Service orders and quote requests submitted from the website.
 * Anyone may create one (that is the public form) but only signed-in staff
 * may read them — these records hold customer names, phones and addresses.
 */
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'serviceLabel', 'cityLabel', 'status', 'createdAt'],
    group: 'Enquiries',
    description: 'Service orders and quote requests from the website.',
  },
  hooks: {
    // Emails the dispatcher the moment a lead lands.
    afterChange: [notifyOnNewEnquiry],
  },
  access: {
    create: () => true,
    read: staff,
    update: staff,
    delete: staff,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'order',
      options: [
        { label: 'Service order', value: 'order' },
        { label: 'Quote request', value: 'quote' },
        { label: 'Contact form', value: 'contact' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Booked', value: 'booked' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'phone', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    { name: 'email', type: 'email' },
    {
      type: 'row',
      fields: [
        { name: 'serviceLabel', type: 'text', label: 'Service', admin: { width: '50%' } },
        { name: 'cityLabel', type: 'text', label: 'City or ZIP', admin: { width: '50%' } },
      ],
    },
    { name: 'when', type: 'text', admin: { description: 'When they need it.' } },
    { name: 'message', type: 'textarea' },
    {
      name: 'sourcePage',
      type: 'text',
      admin: { readOnly: true, description: 'The page the form was submitted from.' },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal notes. Not shown to the customer.' },
    },
  ],
}
