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
            { name: 'eyebrow', type: 'text', defaultValue: 'Mobile Locksmith' },
            {
              name: 'headingLine1',
              type: 'text',
              required: true,
              defaultValue: 'Serving All of San Jose',
              admin: { description: 'Shown in dark navy.' },
            },
            {
              name: 'headingLine2',
              type: 'text',
              required: true,
              defaultValue: '& the Entire Bay Area',
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
                { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'Request Service', admin: { width: '50%' } },
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
                { name: 'value', type: 'text', required: true, admin: { description: 'Bold line, e.g. "Licensed & Insured"' } },
                { name: 'label', type: 'text', required: true, admin: { description: 'Grey line, e.g. "CA BSIS"' } },
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
            { name: 'locationsEyebrow', type: 'text', defaultValue: 'Where We Dispatch' },
            { name: 'locationsHeading', type: 'text', defaultValue: 'Mobile Locksmith Coverage Across the Bay Area' },
            { name: 'servicesEyebrow', type: 'text', defaultValue: 'What We Do' },
            { name: 'servicesHeading', type: 'text', defaultValue: 'Locksmith Services Throughout the Bay Area' },
            { name: 'reviewsHeading', type: 'text', defaultValue: 'What Our Customers Say' },
            { name: 'reviewsSubtitle', type: 'text', defaultValue: 'Real people. Real reviews.' },
            { name: 'shopsEyebrow', type: 'text', defaultValue: 'Where We Are Based' },
            { name: 'shopsHeading', type: 'text', defaultValue: 'Dispatched from our hub, to you.' },
            { name: 'shopsSubtitle', type: 'text' },
            { name: 'aboutEyebrow', type: 'text', label: 'About block — small line', defaultValue: 'About 888 Lock & Key' },
            { name: 'aboutHeading', type: 'text', label: 'About block — heading', defaultValue: 'A mobile locksmith that comes to you' },
            {
              name: 'aboutLead',
              type: 'textarea',
              label: 'About block — paragraph',
              defaultValue:
                '888 Lock & Key is a licensed, bonded and insured mobile locksmith serving San Jose and the entire Bay Area — South Bay, the Peninsula, the East Bay and the Tri-Valley. Automotive, residential, commercial and emergency work, with the price confirmed before anything begins.',
            },
            {
              name: 'aboutFeatures',
              type: 'array',
              label: 'About block — the three points',
              maxRows: 4,
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  defaultValue: 'shield',
                  options: [
                    { label: 'Shield', value: 'shield' },
                    { label: 'Key', value: 'key' },
                    { label: 'People', value: 'people' },
                    { label: 'Clock', value: 'clock' },
                    { label: 'Star', value: 'star' },
                  ],
                },
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea', required: true },
              ],
              defaultValue: [
                { icon: 'shield', title: 'Upfront pricing', text: 'The price is confirmed with you before work begins — no doorstep surprises.' },
                { icon: 'key', title: 'Non-destructive entry first', text: 'Lockouts are opened without damage to your door, lock or vehicle wherever possible.' },
                { icon: 'people', title: 'Background-checked technicians', text: 'Licensed and insured, dispatched across the Bay Area.' },
              ],
            },
            { name: 'aboutCtaLabel', type: 'text', label: 'About block — button', defaultValue: 'More about us' },
            { name: 'faqBarText', type: 'text', label: 'FAQ block — line above the buttons', defaultValue: 'Have more questions?' },
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
