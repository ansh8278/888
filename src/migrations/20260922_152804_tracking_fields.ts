import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_page_copy\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`services_eyebrow\` text DEFAULT 'One call. Every solution.',
  	\`services_title\` text DEFAULT 'Locksmith Services' NOT NULL,
  	\`services_intro\` text DEFAULT 'Automotive, residential, commercial and emergency locksmith services, dispatched across San Jose and the Bay Area with the price confirmed before work begins.',
  	\`locations_eyebrow\` text DEFAULT 'Coverage Area',
  	\`locations_title\` text DEFAULT 'Mobile Locksmith Serving San Jose & the Entire Bay Area' NOT NULL,
  	\`locations_intro\` text DEFAULT '888 Lock & Key dispatches mobile automotive, residential, and commercial locksmith technicians throughout San Jose and every corner of the Bay Area. Find your area below.',
  	\`reviews_eyebrow\` text,
  	\`reviews_title\` text DEFAULT 'What our customers say' NOT NULL,
  	\`reviews_intro\` text DEFAULT 'Real people, real jobs, in their own words.',
  	\`faq_eyebrow\` text DEFAULT 'Before You Call',
  	\`faq_title\` text DEFAULT 'Frequently Asked Questions' NOT NULL,
  	\`faq_intro\` text DEFAULT 'Straight answers on pricing, ID checks, what we can open and how dispatch works.',
  	\`pricing_eyebrow\` text DEFAULT 'Transparent Pricing',
  	\`pricing_title\` text DEFAULT 'Starting prices, published up front.' NOT NULL,
  	\`pricing_intro\` text DEFAULT 'Your technician confirms the exact quote before any work begins. If a job needs more than what was quoted, we stop and tell you what it costs first.',
  	\`pricing_note\` text DEFAULT 'Prices are starting points for standard work. Your technician confirms the exact price before any work begins.',
  	\`book_eyebrow\` text DEFAULT 'Book Online',
  	\`book_title\` text DEFAULT 'Request service or a free quote' NOT NULL,
  	\`book_intro\` text DEFAULT 'Tell us where you are and what you need. A dispatcher calls you back to confirm the price before anyone is sent.',
  	\`book_side_title\` text DEFAULT 'Faster than a form',
  	\`book_side_text\` text DEFAULT 'If you are locked out right now, calling is faster than a form — a dispatcher can send the nearest technician while you are still on the line.',
  	\`contact_eyebrow\` text DEFAULT 'Get in touch',
  	\`contact_title\` text DEFAULT 'Contact us' NOT NULL,
  	\`contact_intro\` text,
  	\`contact_form_heading\` text DEFAULT 'Send us a message',
  	\`contact_shops_heading\` text DEFAULT 'Our dispatch hub',
  	\`thank_you_eyebrow\` text DEFAULT 'Request received',
  	\`thank_you_title\` text DEFAULT 'Thanks — a dispatcher is on it.' NOT NULL,
  	\`thank_you_intro\` text DEFAULT 'Your details are with our dispatch team and someone will call you back shortly to confirm the price and the arrival time.',
  	\`thank_you_urgent_title\` text DEFAULT 'Locked out right now?',
  	\`thank_you_urgent_text\` text DEFAULT 'Calling is faster. Someone answers day or night, and the van is dispatched while you are still on the line.',
  	\`cta_heading\` text DEFAULT 'Locked out right now?',
  	\`cta_subtitle\` text DEFAULT 'One call. A real dispatcher. A van on the way.',
  	\`service_city_subtitle\` text DEFAULT 'Pick your city to see local coverage and neighborhoods.',
  	\`call_card_title\` text DEFAULT 'Need a Locksmith?',
  	\`call_card_subtitle\` text DEFAULT 'Mobile technicians dispatched across the Bay Area.',
  	\`call_card_note\` text DEFAULT 'Same day service. No call-centre. Real people.',
  	\`not_found_eyebrow\` text DEFAULT '404',
  	\`not_found_title\` text DEFAULT 'We could not find that page.' NOT NULL,
  	\`not_found_intro\` text DEFAULT 'It may have moved. If you are locked out right now, calling is faster than looking.',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_page_copy\`("id", "services_eyebrow", "services_title", "services_intro", "locations_eyebrow", "locations_title", "locations_intro", "reviews_eyebrow", "reviews_title", "reviews_intro", "faq_eyebrow", "faq_title", "faq_intro", "pricing_eyebrow", "pricing_title", "pricing_intro", "pricing_note", "book_eyebrow", "book_title", "book_intro", "book_side_title", "book_side_text", "contact_eyebrow", "contact_title", "contact_intro", "contact_form_heading", "contact_shops_heading", "thank_you_eyebrow", "thank_you_title", "thank_you_intro", "thank_you_urgent_title", "thank_you_urgent_text", "cta_heading", "cta_subtitle", "service_city_subtitle", "call_card_title", "call_card_subtitle", "call_card_note", "not_found_eyebrow", "not_found_title", "not_found_intro", "updated_at", "created_at") SELECT "id", "services_eyebrow", "services_title", "services_intro", "locations_eyebrow", "locations_title", "locations_intro", "reviews_eyebrow", "reviews_title", "reviews_intro", "faq_eyebrow", "faq_title", "faq_intro", "pricing_eyebrow", "pricing_title", "pricing_intro", "pricing_note", "book_eyebrow", "book_title", "book_intro", "book_side_title", "book_side_text", "contact_eyebrow", "contact_title", "contact_intro", "contact_form_heading", "contact_shops_heading", "thank_you_eyebrow", "thank_you_title", "thank_you_intro", "thank_you_urgent_title", "thank_you_urgent_text", "cta_heading", "cta_subtitle", "service_city_subtitle", "call_card_title", "call_card_subtitle", "call_card_note", "not_found_eyebrow", "not_found_title", "not_found_intro", "updated_at", "created_at" FROM \`page_copy\`;`)
  await db.run(sql`DROP TABLE \`page_copy\`;`)
  await db.run(sql`ALTER TABLE \`__new_page_copy\` RENAME TO \`page_copy\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`google_analytics_id\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`google_site_verification\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_page_copy\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`services_eyebrow\` text DEFAULT 'One call. Every solution.',
  	\`services_title\` text DEFAULT 'Locksmith Services' NOT NULL,
  	\`services_intro\` text DEFAULT 'Automotive, residential, commercial and emergency locksmith services — dispatched to you across San Jose and the Bay Area, with the price confirmed before work begins.',
  	\`locations_eyebrow\` text DEFAULT 'Coverage Area',
  	\`locations_title\` text DEFAULT 'Mobile Locksmith Serving San Jose & the Entire Bay Area' NOT NULL,
  	\`locations_intro\` text DEFAULT '888 Lock & Key dispatches mobile automotive, residential, and commercial locksmith technicians throughout San Jose and every corner of the Bay Area. Find your area below.',
  	\`reviews_eyebrow\` text,
  	\`reviews_title\` text DEFAULT 'What our customers say' NOT NULL,
  	\`reviews_intro\` text DEFAULT 'Real people, real jobs, in their own words.',
  	\`faq_eyebrow\` text DEFAULT 'Before You Call',
  	\`faq_title\` text DEFAULT 'Frequently Asked Questions' NOT NULL,
  	\`faq_intro\` text DEFAULT 'Straight answers on pricing, ID checks, what we can open and how dispatch works.',
  	\`pricing_eyebrow\` text DEFAULT 'Transparent Pricing',
  	\`pricing_title\` text DEFAULT 'Starting prices, published up front.' NOT NULL,
  	\`pricing_intro\` text DEFAULT 'Your technician confirms the exact quote before any work begins. If a job needs more than what was quoted, we stop and tell you what it costs first.',
  	\`pricing_note\` text DEFAULT 'Prices are starting points for standard work during normal hours. After-hours call-outs carry a flat fee quoted on the phone before we dispatch.',
  	\`book_eyebrow\` text DEFAULT 'Book Online',
  	\`book_title\` text DEFAULT 'Request service or a free quote' NOT NULL,
  	\`book_intro\` text DEFAULT 'Tell us where you are and what you need. A dispatcher calls you back to confirm the price before anyone is sent.',
  	\`book_side_title\` text DEFAULT 'Faster than a form',
  	\`book_side_text\` text DEFAULT 'If you are locked out right now, calling is faster than a form — a dispatcher can send the nearest technician while you are still on the line.',
  	\`contact_eyebrow\` text DEFAULT 'Get in touch',
  	\`contact_title\` text DEFAULT 'Contact us' NOT NULL,
  	\`contact_intro\` text,
  	\`contact_form_heading\` text DEFAULT 'Send us a message',
  	\`contact_shops_heading\` text DEFAULT 'Our dispatch hub',
  	\`thank_you_eyebrow\` text DEFAULT 'Request received',
  	\`thank_you_title\` text DEFAULT 'Thanks — a dispatcher is on it.' NOT NULL,
  	\`thank_you_intro\` text DEFAULT 'Your details are with our dispatch team and someone will call you back shortly to confirm the price and the arrival time.',
  	\`thank_you_urgent_title\` text DEFAULT 'Locked out right now?',
  	\`thank_you_urgent_text\` text DEFAULT 'Calling is faster. Someone answers day or night, and the van is dispatched while you are still on the line.',
  	\`cta_heading\` text DEFAULT 'Locked out right now?',
  	\`cta_subtitle\` text DEFAULT 'One call. A real dispatcher. A van on the way.',
  	\`service_city_subtitle\` text DEFAULT 'Pick your city to see local coverage and neighborhoods.',
  	\`call_card_title\` text DEFAULT 'Need a Locksmith?',
  	\`call_card_subtitle\` text DEFAULT 'Mobile technicians dispatched across the Bay Area.',
  	\`call_card_note\` text DEFAULT 'Same day service. No call-centre. Real people.',
  	\`not_found_eyebrow\` text DEFAULT '404',
  	\`not_found_title\` text DEFAULT 'We could not find that page.' NOT NULL,
  	\`not_found_intro\` text DEFAULT 'It may have moved. If you are locked out right now, calling is faster than looking.',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_page_copy\`("id", "services_eyebrow", "services_title", "services_intro", "locations_eyebrow", "locations_title", "locations_intro", "reviews_eyebrow", "reviews_title", "reviews_intro", "faq_eyebrow", "faq_title", "faq_intro", "pricing_eyebrow", "pricing_title", "pricing_intro", "pricing_note", "book_eyebrow", "book_title", "book_intro", "book_side_title", "book_side_text", "contact_eyebrow", "contact_title", "contact_intro", "contact_form_heading", "contact_shops_heading", "thank_you_eyebrow", "thank_you_title", "thank_you_intro", "thank_you_urgent_title", "thank_you_urgent_text", "cta_heading", "cta_subtitle", "service_city_subtitle", "call_card_title", "call_card_subtitle", "call_card_note", "not_found_eyebrow", "not_found_title", "not_found_intro", "updated_at", "created_at") SELECT "id", "services_eyebrow", "services_title", "services_intro", "locations_eyebrow", "locations_title", "locations_intro", "reviews_eyebrow", "reviews_title", "reviews_intro", "faq_eyebrow", "faq_title", "faq_intro", "pricing_eyebrow", "pricing_title", "pricing_intro", "pricing_note", "book_eyebrow", "book_title", "book_intro", "book_side_title", "book_side_text", "contact_eyebrow", "contact_title", "contact_intro", "contact_form_heading", "contact_shops_heading", "thank_you_eyebrow", "thank_you_title", "thank_you_intro", "thank_you_urgent_title", "thank_you_urgent_text", "cta_heading", "cta_subtitle", "service_city_subtitle", "call_card_title", "call_card_subtitle", "call_card_note", "not_found_eyebrow", "not_found_title", "not_found_intro", "updated_at", "created_at" FROM \`page_copy\`;`)
  await db.run(sql`DROP TABLE \`page_copy\`;`)
  await db.run(sql`ALTER TABLE \`__new_page_copy\` RENAME TO \`page_copy\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`google_analytics_id\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`google_site_verification\`;`)
}
