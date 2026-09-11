import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`page_copy_thank_you_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`page_copy\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`page_copy_thank_you_steps_order_idx\` ON \`page_copy_thank_you_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`page_copy_thank_you_steps_parent_id_idx\` ON \`page_copy_thank_you_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`page_copy\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`services_eyebrow\` text DEFAULT 'One call. Every solution.',
  	\`services_title\` text DEFAULT 'Locksmith Services' NOT NULL,
  	\`services_intro\` text DEFAULT 'Cars, homes and businesses — handled by our own background-checked technicians, 24 hours a day, at a price agreed before we set off.',
  	\`locations_eyebrow\` text DEFAULT 'We Serve Multiple Cities',
  	\`locations_title\` text DEFAULT 'Find a locksmith near you' NOT NULL,
  	\`locations_intro\` text DEFAULT 'Mobile locksmith coverage across California, Arizona and New York. Find your city for local pricing, shop details and arrival times.',
  	\`reviews_eyebrow\` text,
  	\`reviews_title\` text DEFAULT 'What our customers say' NOT NULL,
  	\`reviews_intro\` text DEFAULT 'Real people, real jobs, in their own words.',
  	\`faq_eyebrow\` text DEFAULT 'Before You Call',
  	\`faq_title\` text DEFAULT 'Frequently Asked Questions' NOT NULL,
  	\`faq_intro\` text DEFAULT 'Straight answers on pricing, arrival times, ID checks and warranty.',
  	\`pricing_eyebrow\` text DEFAULT 'Transparent Pricing',
  	\`pricing_title\` text DEFAULT 'Starting prices, published up front.' NOT NULL,
  	\`pricing_intro\` text DEFAULT 'Your technician confirms the exact quote before any work begins. If a job needs more than what was quoted, we stop and tell you what it costs first.',
  	\`pricing_note\` text DEFAULT 'Prices are starting points for standard work during normal hours. After-hours call-outs carry a flat fee quoted on the phone before we dispatch.',
  	\`book_eyebrow\` text DEFAULT 'Book Online',
  	\`book_title\` text DEFAULT 'Request service or a free quote' NOT NULL,
  	\`book_intro\` text DEFAULT 'Tell us where you are and what you need. A dispatcher calls you back with a firm price — usually within minutes.',
  	\`book_side_title\` text DEFAULT 'Faster than a form',
  	\`book_side_text\` text DEFAULT 'If you are locked out right now, call. Someone answers 24 hours a day and the van is dispatched while you are still on the line.',
  	\`contact_eyebrow\` text DEFAULT 'Get in touch',
  	\`contact_title\` text DEFAULT 'Contact us' NOT NULL,
  	\`contact_intro\` text,
  	\`contact_form_heading\` text DEFAULT 'Send us a message',
  	\`contact_shops_heading\` text DEFAULT 'Our shops',
  	\`thank_you_eyebrow\` text DEFAULT 'Request received',
  	\`thank_you_title\` text DEFAULT 'Thanks — a dispatcher is on it.' NOT NULL,
  	\`thank_you_intro\` text DEFAULT 'Your details are with our dispatch team and someone will call you back shortly to confirm the price and the arrival time.',
  	\`thank_you_urgent_title\` text DEFAULT 'Locked out right now?',
  	\`thank_you_urgent_text\` text DEFAULT 'Calling is faster. Someone answers day or night, and the van is dispatched while you are still on the line.',
  	\`cta_heading\` text DEFAULT 'Locked out right now?',
  	\`cta_subtitle\` text DEFAULT 'One call. A real dispatcher. A van on the way.',
  	\`call_card_title\` text DEFAULT 'Need a Locksmith?',
  	\`call_card_subtitle\` text DEFAULT 'We''re here 24/7.',
  	\`call_card_note\` text DEFAULT 'Same day service. No call-centre. Real people.',
  	\`not_found_eyebrow\` text DEFAULT '404',
  	\`not_found_title\` text DEFAULT 'We could not find that page.' NOT NULL,
  	\`not_found_intro\` text DEFAULT 'It may have moved. If you are locked out right now, calling is faster than looking.',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`page_copy_thank_you_steps\`;`)
  await db.run(sql`DROP TABLE \`page_copy\`;`)
}
