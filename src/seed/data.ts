/**
 * Placeholder content ported from the original single-page site.
 * Everything here is editable in the admin once seeded — this file only
 * decides what the site looks like on first run.
 */

export const SERVICES = [
  {
    title: 'Car Lockout',
    icon: 'car',
    order: 1,
    startingPrice: '$95',
    priceNote: 'Standard hours, no-damage door entry',
    shortDescription: 'Keys locked inside? We open all makes and models.',
    intro:
      'Locked your keys in the car? We reach most calls in around 24 minutes and open the door without a scratch — no drilling, no broken glass, no damage to the paint or trim.',
    bullets: [
      'Non-destructive entry on all makes and models',
      'Air wedges and long-reach tools rated for luxury trim',
      'Roadside, car park, driveway or highway shoulder',
      'Proof of ownership checked before we open anything',
    ],
    body: [
      'Our technicians carry the same long-reach tools and inflatable wedges the dealerships use, which means the lock, the door seal and the paintwork are all exactly as you left them when we drive away.',
      'We will confirm a firm price on the phone before a van moves. If the job turns out to need more than a standard opening — a broken key in the ignition, say, or a failed immobiliser — we tell you what it costs before we start, not after.',
    ],
  },
  {
    title: 'Residential Lockout',
    icon: 'home',
    order: 2,
    startingPrice: '$95',
    priceNote: 'ID verification required on arrival',
    shortDescription: 'Locked out of your home? We verify, we open, no drama.',
    intro:
      'Shut out of your own house at 2am? We open residential doors without damaging the lock, so you are not buying new hardware on top of the call-out.',
    bullets: [
      'Picked open where possible, so the lock still works after',
      'Deadbolts, night latches, uPVC and multipoint doors',
      'Photo ID matching the address checked on arrival',
      'Broken keys extracted from the cylinder',
    ],
    body: [
      'Most residential locks can be picked or bypassed without harm, and that is always what we try first. Drilling is a last resort reserved for high-security cylinders that genuinely cannot be opened any other way — and we tell you before we do it.',
      'If your documents are locked inside the house, our technician will work with you on other proof of residency. We never open a door without establishing that the person asking actually lives there.',
    ],
  },
  {
    title: 'House Rekey',
    icon: 'key',
    order: 3,
    startingPrice: 'From $45 / lock',
    priceNote: '2-lock minimum, standard pin cylinder',
    shortDescription: 'New home, new tenant, or lost a key? We rekey everything.',
    intro:
      'Moving in, changing tenants, or lost a keyring? Rekeying repins the lock you already own so every old key stops working — far cheaper than replacing the hardware.',
    bullets: [
      'Every old key stops working, permanently',
      'Keep your existing handles and deadbolts',
      'One key for every door if you want it',
      'Done on site, usually within the hour',
    ],
    body: [
      'Rekeying swaps the pin stack inside the cylinder for a new combination. The lock, the handle and the finish all stay exactly as they are — only the key that operates it changes.',
      'It is the right call after a house purchase, a tenant change, a lost keyring, or a break-up. We can also key several doors alike so a single key opens the front, back and garage.',
    ],
  },
  {
    title: 'Car Key & Fob Replacement',
    icon: 'key',
    order: 4,
    startingPrice: '$180',
    priceNote: 'Cut & programmed on site',
    shortDescription: 'Cut & program keys and fobs on-site.',
    intro:
      'Lost the only key to your car? We cut and program transponder keys, remotes and proximity fobs in your driveway, usually the same day and for well under dealer prices.',
    bullets: [
      'Transponder keys, remotes and proximity fobs',
      'Cut and programmed at your vehicle',
      'All keys can be erased so a lost one stops working',
      'Most makes and models from the early 2000s onward',
    ],
    body: [
      'Dealerships will usually have your car towed in and quote you several days. We come to the vehicle, cut the blade to the lock code and program the chip to the immobiliser on the spot.',
      'If a key has been lost rather than broken, we can wipe every key the car knows about and program a fresh set, so whoever has the missing one cannot use it.',
    ],
  },
  {
    title: 'Smart Lock Installation',
    icon: 'smart',
    order: 5,
    startingPrice: '$100 labor',
    priceNote: 'Customer-supplied hardware setup',
    shortDescription: 'Install and set up smart locks and keyless entry.',
    intro:
      'Keypads, app-controlled deadbolts and keyless entry, fitted properly and set up so everyone in the household can actually use them.',
    bullets: [
      'Fitted square and true so the bolt never binds',
      'Wifi, app and keypad codes configured before we leave',
      'Household members walked through the app',
      'Existing hardware removed and taken away',
    ],
    body: [
      'A smart lock that binds against the strike plate will chew through batteries and eventually fail to lock at all. We adjust the door and the strike so the bolt throws cleanly, which is the part most self-installs get wrong.',
      'We set up the app, add your codes, and show whoever needs it how to work the thing — including the person in the house who did not want a smart lock in the first place.',
    ],
  },
  {
    title: 'Commercial & Access Control',
    icon: 'building',
    order: 6,
    startingPrice: 'Custom quote',
    priceNote: 'Free site evaluation & master keying',
    shortDescription: 'Master key systems, panic hardware, and more.',
    intro:
      'Master key systems, panic bars, door closers and card access for offices, clinics, retail and warehouses — specified, fitted and documented.',
    bullets: [
      'Master key charts designed and documented',
      'Panic hardware and fire-door compliance',
      'Card and fob access control',
      'Scheduled out of hours to avoid disrupting trade',
    ],
    body: [
      'A proper master key system means a cleaner opens what a cleaner should open and nothing else, while a manager carries one key instead of eleven. We design the chart, cut the keys, label everything and hand you the documentation.',
      'Site evaluations are free. We will tell you honestly which doors need upgrading and which are fine as they are.',
    ],
  },
]

export const LOCATIONS = [
  {
    city: 'San Jose',
    state: 'California',
    stateAbbr: 'CA',
    badge: 'California HQ',
    shopName: '888 Lock & Key — San Jose',
    shopSubtitle: 'Main shop & dispatch center',
    addressLine: '1188 S First Street, Suite 4',
    postcode: '95110',
    hours: 'Open 24 hours · walk-ins 8am–7pm',
    image: 'san-jose',
    order: 1,
    neighbourhoods: ['Downtown San Jose', 'Willow Glen', 'Santana Row', 'Almaden', 'Berryessa', 'Evergreen'],
    intro:
      'Our main shop and dispatch centre. Vans leave from South First Street around the clock, covering the whole of San Jose and the wider South Bay.',
  },
  {
    city: 'San Francisco',
    state: 'California',
    stateAbbr: 'CA',
    badge: 'Bay Area',
    shopName: '888 Lock & Key — San Francisco',
    shopSubtitle: 'Bay Area mobile dispatch',
    addressLine: '1 Market Street, Suite 500',
    postcode: '94105',
    hours: 'Open 24 hours · mobile units active',
    image: 'san-francisco',
    order: 2,
    neighbourhoods: ['SoMa', 'Mission', 'Richmond', 'Sunset', 'Nob Hill', 'Marina'],
    intro:
      'Mobile vans covering the city and the peninsula, with technicians who know which garages, gates and vintage buildings need a gentler approach.',
  },
  {
    city: 'Los Angeles',
    state: 'California',
    stateAbbr: 'CA',
    badge: 'Southern California',
    shopName: '888 Lock & Key — Los Angeles',
    shopSubtitle: 'Greater LA mobile dispatch',
    addressLine: '3450 Wilshire Blvd, Suite 210',
    postcode: '90010',
    hours: 'Open 24 hours · mobile units active',
    image: 'los-angeles',
    order: 3,
    neighbourhoods: ['Downtown LA', 'Hollywood', 'Santa Monica', 'Pasadena', 'Silver Lake', 'Culver City'],
    intro:
      'Vans staged across the basin so traffic does not decide how long you wait. Residential, automotive and commercial work across greater Los Angeles.',
  },
  {
    city: 'Phoenix',
    state: 'Arizona',
    stateAbbr: 'AZ',
    badge: 'Arizona Center',
    shopName: '888 Lock & Key — Phoenix & Scottsdale',
    shopSubtitle: 'Greater Phoenix mobile dispatch',
    addressLine: '4400 E Camelback Rd',
    postcode: '85018',
    hours: 'Open 24 hours · mobile units active',
    image: 'phoenix',
    order: 4,
    neighbourhoods: ['Downtown Phoenix', 'Arcadia', 'Biltmore', 'Tempe', 'Chandler', 'Glendale'],
    intro:
      'Arizona dispatch covering Phoenix and the East Valley. Summer heat is hard on locks and car fobs — we carry the parts that fail most often in it.',
  },
  {
    city: 'Scottsdale',
    state: 'Arizona',
    stateAbbr: 'AZ',
    badge: 'Arizona',
    shopName: '888 Lock & Key — Scottsdale',
    shopSubtitle: 'Scottsdale & North Valley dispatch',
    addressLine: '7014 E Camelback Rd, Suite 1452',
    postcode: '85251',
    hours: 'Open 24 hours · mobile units active',
    image: 'scottsdale',
    order: 5,
    neighbourhoods: ['Old Town', 'North Scottsdale', 'McCormick Ranch', 'Gainey Ranch', 'Cave Creek', 'Fountain Hills'],
    intro:
      'Covering Old Town through to North Scottsdale, including gated communities and the smart-lock and access-control work that comes with them.',
  },
  {
    city: 'New York City',
    state: 'New York',
    stateAbbr: 'NY',
    badge: 'New York Hub',
    shopName: '888 Lock & Key — New York City',
    shopSubtitle: 'Manhattan & outer boroughs mobile dispatch',
    addressLine: '350 Fifth Ave, Suite 1200',
    postcode: '10118',
    hours: 'Open 24 hours · 24/7 mobile vans',
    image: 'new-york',
    order: 6,
    neighbourhoods: ['Manhattan', 'Brooklyn', 'Queens', 'The Bronx', 'Harlem', 'Staten Island'],
    intro:
      'Technicians on foot and in vans across the five boroughs, used to walk-ups, buzzer entries, mailbox locks and pre-war hardware.',
  },
]

export const REVIEWS = [
  {
    quote:
      'Locked out at 11pm with my toddler asleep in the car seat. Technician was there in 18 minutes, calm and quick.',
    author: 'Priya M.',
    cityLabel: 'San Jose, CA',
  },
  {
    quote:
      'Rekeyed our whole house the day we closed. Price was exactly what they quoted on the phone — no upsell games.',
    author: 'Daniel K.',
    cityLabel: 'Scottsdale, AZ',
  },
  {
    quote:
      'Ordered a fob replacement through their website at 7am and had a programmed key by lunch. The WhatsApp updates were a nice touch.',
    author: 'Marisol T.',
    cityLabel: 'Los Angeles, CA',
  },
  {
    quote:
      'Snapped my key in the office deadbolt on a Sunday. They extracted it without drilling and had us open in half an hour.',
    author: 'Andre W.',
    cityLabel: 'San Francisco, CA',
  },
  {
    quote:
      'Third locksmith I called and the only one who gave a real price before showing up. No mystery service fee at the door.',
    author: 'Renee C.',
    cityLabel: 'Phoenix, AZ',
  },
  {
    quote: 'Master keyed eleven doors across our clinic. Clean work, labelled every key, finished a day early.',
    author: 'Dr. Hana O.',
    cityLabel: 'New York, NY',
  },
  {
    quote:
      'Transponder key for a 2012 Odyssey — the dealer wanted four days and triple the money. These guys cut it in my driveway.',
    author: 'Terrence B.',
    cityLabel: 'San Jose, CA',
  },
  {
    quote: "Moved into a walk-up and wanted the old tenant's keys dead. Same-day rekey, showed me the old pins came out.",
    author: 'Yuki S.',
    cityLabel: 'Brooklyn, NY',
  },
  {
    quote:
      'Our storefront lock seized in the heat. Dispatcher stayed on the phone until the van pulled up, then swapped the cylinder on site.',
    author: 'Miguel A.',
    cityLabel: 'Scottsdale, AZ',
  },
  {
    quote:
      'Installed two smart locks and actually walked my mother through the app twice without sighing. That alone earned the five stars.',
    author: 'Colleen F.',
    cityLabel: 'Los Angeles, CA',
  },
]

export const FAQS = [
  {
    question: 'Are you fully licensed and insured?',
    answer:
      'Yes — 888 Lock & Key holds official state Locksmith Company licensing (#BSIS LCO-000000), and all technicians are individually background-checked, Live Scan fingerprinted, and badged.',
    showOnHome: true,
  },
  {
    question: 'How fast can a technician arrive?',
    answer:
      'Our average arrival time across all service areas is 24 minutes. Our vans are mobile workshops dispatched by GPS from the closest location in real time.',
    showOnHome: true,
  },
  {
    question: 'Can you unlock a car without damaging the door or paint?',
    answer:
      'Yes, 100%. We utilize specialized non-destructive automotive lock-picks and inflator wedges engineered specifically for all makes and luxury models.',
    showOnHome: true,
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit/debit cards, Apple Pay, Google Pay, Zelle, and cash. Payment is only completed once the job is resolved to your satisfaction.',
    showOnHome: true,
  },
  {
    question: 'Do you charge extra at night, on weekends or holidays?',
    answer:
      'Emergency call-outs between 10pm and 6am carry a flat after-hours fee, quoted to you on the phone before we dispatch. Weekends and holidays are billed at standard rates — no surge pricing.',
    showOnHome: true,
  },
  {
    question: 'What do you need from me to prove the property is mine?',
    answer:
      'Photo ID matching the address, or for vehicles a registration, title or insurance card. If your documents are locked inside, our technician will work with you on other proof — but we never open a lock without establishing ownership.',
    showOnHome: true,
  },
  {
    question: 'Is there a warranty on parts and labour?',
    answer:
      "Every installation carries a 90-day workmanship warranty, and hardware we supply is covered by the manufacturer's warranty on top of that. If a lock we fitted fails, we come back out at no charge.",
    showOnHome: true,
  },
  {
    question: 'Can you rekey a lock instead of replacing it?',
    answer:
      'Usually, yes — and it is far cheaper. If the existing hardware is sound we repin the cylinder so old keys stop working. We only recommend replacement when the lock is worn, damaged, or below the security grade you need.',
    showOnHome: true,
  },
]
