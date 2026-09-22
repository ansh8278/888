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
          description:
            'Real, confirmed details only. Anything left blank is simply not shown on the site — a call button with no number sends people to the request form instead.',
          fields: [
            { name: 'companyName', type: 'text', required: true, defaultValue: '888 Lock & Key' },
            { name: 'tagline', type: 'text', defaultValue: 'AUTO · HOME · BUSINESS' },
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  admin: { width: '50%', description: 'As displayed, e.g. "(408) 000-0000". REQUIRED before launch.' },
                },
                {
                  name: 'phoneHref',
                  type: 'text',
                  admin: { width: '50%', description: 'As dialled, digits only with country code, e.g. "+14080000000".' },
                },
              ],
            },
            { name: 'email', type: 'text' },
            {
              name: 'licenseNumber',
              type: 'text',
              admin: {
                description:
                  'California BSIS locksmith licence, e.g. "CA BSIS Lic. #LCO 1234". REQUIRED by law on all advertising before launch.',
              },
            },
            {
              name: 'hours',
              type: 'text',
              admin: { description: 'Confirmed operating hours, e.g. "Mon–Sun 7am–10pm". Leave blank until confirmed — never claim 24/7 unless it is true.' },
            },
            {
              name: 'serviceAreaLine',
              type: 'text',
              defaultValue: 'Serving San Jose & the Entire Bay Area',
              admin: { description: 'One line shown in the footer and header strip.' },
            },
            {
              name: 'dispatchHubs',
              type: 'array',
              label: 'Dispatch hubs / physical locations',
              admin: {
                description:
                  'Confirmed physical addresses only. This is a mobile service area business — cities are served from these hubs, they do not each have a shop.',
              },
              fields: [
                { name: 'name', type: 'text', required: true, admin: { description: 'e.g. "Santa Clara dispatch hub"' } },
                { name: 'addressLine', type: 'text', required: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'stateAbbr', type: 'text', required: true, defaultValue: 'CA', admin: { width: '20%' } },
                    { name: 'postcode', type: 'text', admin: { width: '30%', description: 'ZIP' } },
                  ],
                },
                { name: 'mapUrl', type: 'text', admin: { description: 'Optional Google Maps link.' } },
              ],
            },
          ],
        },
        {
          label: 'Trust badges',
          description: 'Only verified figures. Blank = not shown (and not sent to Google as structured data).',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'rating', type: 'text', admin: { width: '33%', description: 'Verified rating, e.g. "4.8/5"' } },
                { name: 'reviewCount', type: 'number', admin: { width: '33%', description: 'Verified review count' } },
                {
                  name: 'averageArrival',
                  type: 'text',
                  admin: { width: '34%', description: 'Only a tracked, verified average, e.g. "25 min". Leave blank otherwise.' },
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
