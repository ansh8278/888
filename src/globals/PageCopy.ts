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
    description:
      'Every heading and intro that is not part of a service or city page itself — index pages, the repeated section labels on city and service pages, and the standard city FAQs.',
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
              intro: 'Automotive, residential, commercial and emergency locksmith services, dispatched across San Jose and the Bay Area with the price confirmed before work begins.',
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
              defaultValue: 'Prices are starting points for standard work. Your technician confirms the exact price before any work begins.',
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
          label: 'About page',
          fields: [
            { name: 'aboutStandardsEyebrow', type: 'text', label: 'Standards — small line', defaultValue: 'Our standards' },
            { name: 'aboutStandardsHeading', type: 'text', label: 'Standards — heading', defaultValue: 'Built on honesty and quality service' },
            {
              name: 'aboutStandardsIntro',
              type: 'text',
              label: 'Standards — line under the heading',
              defaultValue: 'Three standards that guide every lockout, rekey and installation we perform.',
            },
            {
              name: 'aboutPillars',
              type: 'array',
              label: 'Standards — the three cards',
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
                { icon: 'shield', title: 'Upfront pricing', text: 'The price is confirmed with you before any work begins — no doorstep surprises.' },
                { icon: 'key', title: 'Non-destructive entry', text: 'Vehicles and properties are opened without damage to your locks or doors wherever possible.' },
                { icon: 'people', title: 'Qualified technicians', text: 'Background-checked, licensed and insured technicians, dispatched across the Bay Area.' },
              ],
            },
            { name: 'aboutAreasHeading', type: 'text', label: 'Service-area block — heading', defaultValue: 'Serving {count} Bay Area cities' },
            {
              name: 'aboutAreasText',
              type: 'text',
              label: 'Service-area block — line',
              defaultValue: 'South Bay, the Peninsula, the East Bay and the Tri-Valley — see every city we cover.',
            },
            { name: 'aboutHubsHeading', type: 'text', label: 'Dispatch hub block — heading', defaultValue: 'Where we dispatch from' },
          ],
        },
        {
          label: 'City pages',
          description:
            'The section labels repeated on all 24 city and district pages, and the questions shown at the bottom of each. Write {city} where the city name should appear.',
          fields: [
            { name: 'cityNeighborhoodsEyebrow', type: 'text', label: 'Neighborhoods — small line', defaultValue: 'Neighborhoods We Serve' },
            { name: 'cityNeighborhoodsHeading', type: 'text', label: 'Neighborhoods — heading', defaultValue: 'All of {city}' },
            { name: 'cityServicesEyebrow', type: 'text', label: 'Services — small line', defaultValue: 'Services in {city}' },
            { name: 'cityServicesHeading', type: 'text', label: 'Services — heading', defaultValue: 'Locksmith Services Available Here' },
            { name: 'cityCtaHeading', type: 'text', label: 'Banner heading', defaultValue: 'Locked out in {city} right now?' },
            { name: 'cityCtaSubtitle', type: 'text', label: 'Banner text', defaultValue: 'Mobile technicians dispatched across the city.' },
            { name: 'cityFaqEyebrow', type: 'text', label: 'FAQs — small line', defaultValue: 'Before You Call' },
            { name: 'cityFaqHeading', type: 'text', label: 'FAQs — heading', defaultValue: '{city} Locksmith FAQs' },
            {
              name: 'cityFaqs',
              type: 'array',
              label: 'Questions on every city page',
              admin: {
                description:
                  'Shown on all city pages. Use {city} for the city name and {arrival} for the average arrival time — a question using {arrival} is hidden until that figure is filled in under Site settings.',
              },
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
              defaultValue: [
                { question: 'How fast can a technician reach me in {city}?', answer: 'Our tracked average arrival time for {city} dispatch is {arrival}.' },
                { question: 'Do you cover all of {city}?', answer: 'Yes — our mobile technicians are dispatched throughout {city} and the surrounding area.' },
                { question: 'Can you unlock my car without damaging it?', answer: 'Yes. We use non-destructive entry tools designed for modern vehicles, including luxury and imported models.' },
                { question: 'What ID do you need to unlock my home or car?', answer: 'A photo ID matching the address, or for vehicles, a registration, title, or insurance card.' },
              ],
            },
            { name: 'cityNearbyEyebrow', type: 'text', label: 'Nearby areas — small line', defaultValue: 'Nearby Areas' },
            { name: 'cityNearbyHeading', type: 'text', label: 'Nearby areas — heading', defaultValue: 'Also Serving' },
          ],
        },
        {
          label: 'Service pages',
          description: 'The section labels repeated on all 14 service pages, and on the Bay Area page.',
          fields: [
            { name: 'serviceIncludedHeading', type: 'text', label: "What's included — heading", defaultValue: "What's included" },
            { name: 'serviceCtaSubtitle', type: 'text', label: 'Banner text', defaultValue: 'Mobile technicians dispatched across San Jose & the Bay Area.' },
            { name: 'serviceAreasEyebrow', type: 'text', label: 'Areas — small line', defaultValue: 'Where We Cover This Service' },
            { name: 'serviceAreasHeading', type: 'text', label: 'Areas — heading', defaultValue: 'Areas We Serve' },
            { name: 'serviceRelatedEyebrow', type: 'text', label: 'Related — small line', defaultValue: 'Related Services' },
            { name: 'serviceRelatedHeading', type: 'text', label: 'Related — heading', defaultValue: 'You May Also Need' },
            { name: 'hubRegionsEyebrow', type: 'text', label: 'Bay Area page — small line', defaultValue: 'Find Your Area' },
            { name: 'hubRegionsHeading', type: 'text', label: 'Bay Area page — heading', defaultValue: 'Bay Area Service Regions' },
            { name: 'hubCtaHeading', type: 'text', label: 'Bay Area page — banner heading', defaultValue: 'Need a locksmith right now?' },
          ],
        },
        {
          label: 'Empty states',
          description:
            'Shown while there is nothing real to display. The pricing table appears automatically once prices are entered, and the reviews grid once reviews are added.',
          fields: [
            { name: 'pricingEmptyHeading', type: 'text', defaultValue: 'Pricing is confirmed on the phone' },
            {
              name: 'pricingEmptyText',
              type: 'textarea',
              defaultValue:
                'Every job is quoted before a technician is sent, and the price is confirmed with you before any work begins. Call or send a request and a dispatcher will give you the price for your job.',
            },
            { name: 'reviewsEmptyHeading', type: 'text', defaultValue: 'Reviews are on their way' },
            {
              name: 'reviewsEmptyText',
              type: 'textarea',
              defaultValue: 'We only publish verified customer reviews. Check back soon, or ask us for references when you call.',
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
