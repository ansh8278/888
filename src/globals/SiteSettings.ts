import type { GlobalConfig } from 'payload'
import { anyone, staff } from '../access'

/** Everything that appears on more than one page lives here. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    group: 'Settings',
    description: 'Phone number, licence, hours and trust badges — used across every page.',
  },
  access: { read: anyone, update: staff },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Business',
          fields: [
            { name: 'companyName', type: 'text', required: true, defaultValue: '888 Lock & Key' },
            { name: 'tagline', type: 'text', defaultValue: 'AUTO · HOME · BUSINESS' },
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  required: true,
                  admin: { width: '50%', description: 'Displayed, e.g. "(408) 555-0888"' },
                },
                {
                  name: 'phoneHref',
                  type: 'text',
                  required: true,
                  admin: { width: '50%', description: 'Dialled, e.g. "+14085550888"' },
                },
              ],
            },
            { name: 'email', type: 'text' },
            {
              name: 'licenseNumber',
              type: 'text',
              admin: { description: 'e.g. "BSIS #LCO-000000"' },
            },
            { name: 'hours', type: 'text', defaultValue: '24/7 Emergency Service' },
            {
              name: 'serviceAreaLine',
              type: 'text',
              admin: { description: 'e.g. "Across California, Arizona & New York"' },
            },
          ],
        },
        {
          label: 'Trust badges',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'rating', type: 'text', defaultValue: '4.9/5', admin: { width: '33%' } },
                { name: 'reviewCount', type: 'number', defaultValue: 214, admin: { width: '33%' } },
                {
                  name: 'averageArrival',
                  type: 'text',
                  defaultValue: '24 MIN',
                  admin: { width: '34%', description: 'e.g. "24 MIN"' },
                },
              ],
            },
            {
              name: 'scriptLine',
              type: 'text',
              defaultValue: 'Your Security Our Priority',
              admin: { description: 'The handwritten line on the hero image.' },
            },
          ],
        },
        {
          label: 'Branding',
          fields: [
            { name: 'logo', type: 'upload', relationTo: 'media' },
            {
              name: 'defaultHeroImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Used on any page without its own image.' },
            },
            {
              name: 'defaultSeoImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Shown when a page is shared on social media.' },
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'social',
              type: 'array',
              labels: { singular: 'Link', plural: 'Links' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Google Business', value: 'google' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Yelp', value: 'yelp' },
                    { label: 'X / Twitter', value: 'x' },
                  ],
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
