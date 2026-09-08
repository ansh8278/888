import type { GlobalConfig } from 'payload'
import { anyone, staff } from '../access'
import { seoField } from '../fields/seo'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  admin: { group: 'Pages', description: 'Every word on the home page.' },
  access: { read: anyone, update: staff },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Fast • Reliable • Professional' },
            {
              name: 'headingLine1',
              type: 'text',
              required: true,
              defaultValue: 'Locked Out?',
              admin: { description: 'Shown in dark navy.' },
            },
            {
              name: 'headingLine2',
              type: 'text',
              required: true,
              defaultValue: "We're Already On The Way.",
              admin: { description: 'Shown in orange, below the first line.' },
            },
            { name: 'lede', type: 'textarea', required: true },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'The van and technician photo.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'primaryCtaLabel', type: 'text', defaultValue: 'Call', admin: { width: '50%', description: 'The phone number is added automatically.' } },
                { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'Get a Free Quote', admin: { width: '50%' } },
              ],
            },
            {
              name: 'trustItems',
              type: 'array',
              label: 'Trust badges under the heading',
              maxRows: 3,
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Clock', value: 'clock' },
                    { label: 'Shield', value: 'shield' },
                    { label: 'People', value: 'people' },
                    { label: 'Star', value: 'star' },
                  ],
                },
                { name: 'value', type: 'text', required: true, admin: { description: 'Bold line, e.g. "24/7"' } },
                { name: 'label', type: 'text', required: true, admin: { description: 'Grey line, e.g. "Emergency Service"' } },
              ],
            },
            {
              name: 'categories',
              type: 'array',
              label: 'Card on the right of the hero',
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Car', value: 'car' },
                    { label: 'House', value: 'home' },
                    { label: 'Building', value: 'building' },
                    { label: 'Key', value: 'key' },
                    { label: 'Shield', value: 'shield' },
                  ],
                },
                { name: 'label', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Sections',
          fields: [
            { name: 'locationsEyebrow', type: 'text', defaultValue: 'We Serve Multiple Cities' },
            { name: 'locationsHeading', type: 'text', defaultValue: 'Find a locksmith near you' },
            { name: 'servicesEyebrow', type: 'text', defaultValue: 'One call. Every solution.' },
            { name: 'servicesHeading', type: 'text', defaultValue: 'Our Locksmith Services' },
            { name: 'reviewsHeading', type: 'text', defaultValue: 'What Our Customers Say' },
            { name: 'reviewsSubtitle', type: 'text', defaultValue: 'Real people. Real reviews.' },
            { name: 'shopsEyebrow', type: 'text', defaultValue: 'Three Shops, One Dispatch' },
            { name: 'shopsHeading', type: 'text', defaultValue: 'Walk in, or we drive to you.' },
            { name: 'shopsSubtitle', type: 'text' },
            { name: 'pricingEyebrow', type: 'text', defaultValue: 'Transparent Pricing' },
            { name: 'pricingHeading', type: 'text', defaultValue: 'Starting prices, published up front.' },
            { name: 'pricingSubtitle', type: 'text' },
            { name: 'faqEyebrow', type: 'text', defaultValue: 'Before You Call' },
            { name: 'faqHeading', type: 'text', defaultValue: 'Frequently Asked Questions' },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}
