import type { GlobalConfig, Field } from 'payload'
import { anyone, staff } from '../access'

/**
 * Headings and intro text for the pages that are not content documents
 * themselves: the Services and Locations indexes, Pricing, Reviews, FAQ, Book,
 * Contact, Thank-you and the 404. Without this they were hardcoded, so a
 * non-technical editor could change a service's price but not the heading
 * above the price table.
 */

const heading = (name: string, label: string, defaults: { eyebrow?: string; title: string; intro?: string }): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: defaults.eyebrow, admin: { description: 'Small orange line above the heading.' } },
    { name: 'title', type: 'text', required: true, defaultValue: defaults.title },
    { name: 'intro', type: 'textarea', defaultValue: defaults.intro, admin: { description: 'Also used as the page description in search results.' } },
  ],
})

export const PageCopy: GlobalConfig = {
  slug: 'page-copy',
  label: 'Page text',
  admin: {
    group: 'Pages',
    description: 'Headings and intros for the Services, Locations, Pricing, Reviews, FAQ, Book, Contact and Thank-you pages.',
  },
  access: { read: anyone, update: staff },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Index pages',
          fields: [
            heading('services', 'Services page', {
              eyebrow: 'One call. Every solution.',
              title: 'Locksmith Services',
              intro: 'Automotive, residential, commercial and emergency locksmith services — dispatched to you across San Jose and the Bay Area, with the price confirmed before work begins.',
            }),
            heading('locations', 'Locations page', {
              eyebrow: 'Coverage Area',
              title: 'Mobile Locksmith Serving San Jose & the Entire Bay Area',
              intro: '888 Lock & Key dispatches mobile automotive, residential, and commercial locksmith technicians throughout San Jose and every corner of the Bay Area. Find your area below.',
            }),
            heading('reviews', 'Reviews page', {
              title: 'What our customers say',
              intro: 'Real people, real jobs, in their own words.',
            }),
            heading('faq', 'FAQ page', {
              eyebrow: 'Before You Call',
              title: 'Frequently Asked Questions',
              intro: 'Straight answers on pricing, ID checks, what we can open and how dispatch works.',
            }),
          ],
        },
        {
          label: 'Pricing',
          fields: [
            heading('pricing', 'Pricing page', {
              eyebrow: 'Transparent Pricing',
              title: 'Starting prices, published up front.',
              intro: 'Your technician confirms the exact quote before any work begins. If a job needs more than what was quoted, we stop and tell you what it costs first.',
            }),
            {
              name: 'pricingNote',
              type: 'textarea',
              label: 'Note under the price table',
              defaultValue: 'Prices are starting points for standard work during normal hours. After-hours call-outs carry a flat fee quoted on the phone before we dispatch.',
            },
          ],
        },
        {
          label: 'Book & Contact',
          fields: [
            heading('book', 'Request Service page', {
              eyebrow: 'Book Online',
              title: 'Request service or a free quote',
              intro: 'Tell us where you are and what you need. A dispatcher calls you back to confirm the price before anyone is sent.',
            }),
            {
              name: 'bookSideTitle',
              type: 'text',
              label: 'Side panel heading',
              defaultValue: 'Faster than a form',
            },
            {
              name: 'bookSideText',
              type: 'textarea',
              label: 'Side panel text',
              defaultValue: 'If you are locked out right now, calling is faster than a form — a dispatcher can send the nearest technician while you are still on the line.',
            },
            heading('contact', 'Contact page', {
              eyebrow: 'Get in touch',
              title: 'Contact us',
            }),
            { name: 'contactFormHeading', type: 'text', defaultValue: 'Send us a message' },
            { name: 'contactShopsHeading', type: 'text', defaultValue: 'Our dispatch hub' },
          ],
        },
        {
          label: 'Thank you',
          fields: [
            heading('thankYou', 'Thank-you page', {
              eyebrow: 'Request received',
              title: 'Thanks — a dispatcher is on it.',
              intro: 'Your details are with our dispatch team and someone will call you back shortly to confirm the price and the arrival time.',
            }),
            { name: 'thankYouUrgentTitle', type: 'text', defaultValue: 'Locked out right now?' },
            {
              name: 'thankYouUrgentText',
              type: 'textarea',
              defaultValue: 'Calling is faster. Someone answers day or night, and the van is dispatched while you are still on the line.',
            },
            {
              name: 'thankYouSteps',
              type: 'array',
              label: 'What happens next',
              maxRows: 5,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea', required: true },
              ],
              defaultValue: [
                { title: 'We call you back', text: 'A real dispatcher, not an automated system, to confirm what you need and where you are.' },
                { title: 'You get a firm price', text: 'Agreed on the phone before a van moves. No call-out surprises when the technician arrives.' },
                { title: 'A technician is dispatched', text: 'From the nearest of our locations, arriving in about {arrival} on average.' },
              ],
              admin: { description: 'Use {arrival} to insert the average arrival time from Site settings.' },
            },
          ],
        },
        {
          label: 'Shared',
          fields: [
            {
              name: 'ctaHeading',
              type: 'text',
              label: 'Bottom-of-page banner heading',
              defaultValue: 'Locked out right now?',
              admin: { description: 'The dark banner at the foot of most pages. Service and city pages override it with their own.' },
            },
            {
              name: 'ctaSubtitle',
              type: 'text',
              label: 'Bottom-of-page banner text',
              defaultValue: 'One call. A real dispatcher. A van on the way.',
            },
            {
              name: 'serviceCitySubtitle',
              type: 'text',
              label: 'Service page — "near you" line',
              defaultValue: 'Pick your city to see local coverage and neighborhoods.',
              admin: { description: 'Shown under "[Service] near you" on every service page.' },
            },
            { name: 'callCardTitle', type: 'text', label: 'Home page call card heading', defaultValue: 'Need a Locksmith?' },
            { name: 'callCardSubtitle', type: 'text', label: 'Home page call card line', defaultValue: 'Mobile technicians dispatched across the Bay Area.' },
            { name: 'callCardNote', type: 'text', label: 'Home page call card small print', defaultValue: 'Same day service. No call-centre. Real people.' },
            heading('notFound', '404 page', {
              eyebrow: '404',
              title: 'We could not find that page.',
              intro: 'It may have moved. If you are locked out right now, calling is faster than looking.',
            }),
          ],
        },
      ],
    },
  ],
}
