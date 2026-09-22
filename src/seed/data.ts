/**
 * Starter content that is NOT in the client package.
 *
 * The locations, services and hub come from the client's JSON files in
 * ./client/ — this file only holds the small extras: generic FAQs that make no
 * unverified claims, and the city-page service card wording from the client's
 * San Jose prototype.
 *
 * Nothing here may state a number the client has not confirmed: no arrival
 * times, prices, fees, warranty periods, review counts or licence numbers.
 */

export const FAQS = [
  {
    question: 'Are you licensed and insured?',
    answer:
      '888 Lock & Key is a California BSIS-licensed locksmith company, bonded and insured. Our licence number is shown in the footer of every page.',
    showOnHome: true,
  },
  {
    question: 'Can you unlock my car without damaging it?',
    answer:
      'Yes. We use non-destructive entry tools designed for modern vehicles, including luxury and imported models.',
    showOnHome: true,
  },
  {
    question: 'What ID do you need to unlock my home or car?',
    answer:
      'A photo ID matching the address, or for vehicles, a registration, title, or insurance card. We never open a lock without establishing that you are entitled to be inside.',
    showOnHome: true,
  },
  {
    question: 'Do you come to me, or do I need to visit a shop?',
    answer:
      'We come to you. 888 Lock & Key is a mobile locksmith: technicians are dispatched across San Jose and the Bay Area and carry the tools and hardware to finish most jobs on the spot.',
    showOnHome: true,
  },
  {
    question: 'Can you rekey a lock instead of replacing it?',
    answer:
      'Usually, yes. If the existing hardware is sound we repin the cylinder so old keys stop working. We only recommend replacement when the lock is worn, damaged, or below the security grade you need.',
    showOnHome: true,
  },
  {
    question: 'Do I get the price before you start?',
    answer:
      'Yes. Pricing is confirmed with you before any work begins, and any extra work is quoted separately and only carried out with your agreement.',
    showOnHome: true,
  },
]

/**
 * The 8 service cards every city page shows, in order, exactly as in the
 * client's San Jose prototype. {city} is filled in per page.
 */
export const CITY_CARDS: Record<string, { title: string; text: string }> = {
  'car-lockout': {
    title: 'Car Lockout',
    text: 'Locked out of your car anywhere in {city} — non-destructive entry on all makes and models.',
  },
  'car-key-replacement': {
    title: 'Car Key Replacement',
    text: 'Lost or broken car keys, spare keys, transponder and push-to-start key programming.',
  },
  'key-fob-programming': {
    title: 'Key Fob Programming',
    text: 'Fob replacement and programming, cut and set up on-site.',
  },
  'house-lockout': {
    title: 'House Lockout',
    text: 'Locked out of your home — ID verification on arrival, no-damage entry.',
  },
  'rekey-locks': {
    title: 'Rekey / Lock Change',
    text: 'New home, new tenant, or lost a key — full rekey or lock replacement.',
  },
  'garage-locksmith': {
    title: 'Garage Entry Locks',
    text: 'Garage side-entry door lockout, rekey, and lock replacement.',
  },
  'commercial-locksmith': {
    title: 'Commercial Locksmith',
    text: 'Office lockouts, master key systems, storefront and commercial hardware.',
  },
  'emergency-locksmith': {
    title: 'Emergency Locksmith',
    text: 'Urgent lockouts and lost-key situations across {city}.',
  },
}

/** Home page category card text, from the client's index.html. */
export const CATEGORY_CARDS: Record<string, string> = {
  'automotive-locksmith':
    'Car lockout, key replacement, key fob programming, transponder programming, broken key extraction.',
  'residential-locksmith':
    'House lockout, rekey, lock change, deadbolt installation, smart lock setup, garage entry locks.',
  'commercial-locksmith':
    'Business lockout, master key systems, storefront locks, panic hardware, commercial rekeying.',
  'emergency-locksmith': 'Urgent lockouts, lost or broken keys, lock changes after lost/stolen keys.',
}

export const SERVICE_ICONS: Record<string, string> = {
  'automotive-locksmith': 'car',
  'residential-locksmith': 'home',
  'commercial-locksmith': 'building',
  'emergency-locksmith': 'shield',
  'garage-locksmith': 'lock',
  'car-lockout': 'car',
  'car-key-replacement': 'key',
  'key-fob-programming': 'key',
  'transponder-key-programming': 'key',
  'ignition-repair': 'car',
  'house-lockout': 'home',
  'rekey-locks': 'key',
  'lock-change': 'lock',
  'smart-lock-installation': 'smart',
}
