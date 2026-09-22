// NOTE: the INSERT … SELECT statements below were corrected by hand after
// generation — drizzle listed the newly added columns in the copy, which
// SQLite rejects. Only pre-existing columns are copied into the rebuilt tables.
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`site_settings_dispatch_hubs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`address_line\` text NOT NULL,
  	\`city\` text NOT NULL,
  	\`state_abbr\` text DEFAULT 'CA' NOT NULL,
  	\`postcode\` text,
  	\`map_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_dispatch_hubs_order_idx\` ON \`site_settings_dispatch_hubs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_dispatch_hubs_parent_id_idx\` ON \`site_settings_dispatch_hubs\` (\`_parent_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`kind\` text DEFAULT 'service',
  	\`category_id\` integer,
  	\`short_description\` text,
  	\`icon\` text DEFAULT 'car',
  	\`hero_image_id\` integer,
  	\`intro\` text,
  	\`body\` text,
  	\`city_card_title\` text,
  	\`city_card_text\` text,
  	\`disclaimer\` text,
  	\`cta_label\` text,
  	\`starting_price\` text,
  	\`price_note\` text,
  	\`show_in_pricing_table\` integer DEFAULT false,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer DEFAULT false,
  	\`slug\` text,
  	\`order\` numeric DEFAULT 0,
  	\`featured\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`category_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_services\`("id", "title", "short_description", "icon", "hero_image_id", "intro", "body", "starting_price", "price_note", "show_in_pricing_table", "seo_title", "seo_description", "seo_image_id", "seo_noindex", "slug", "order", "featured", "updated_at", "created_at", "_status") SELECT "id", "title", "short_description", "icon", "hero_image_id", "intro", "body", "starting_price", "price_note", "show_in_pricing_table", "seo_title", "seo_description", "seo_image_id", "seo_noindex", "slug", "order", "featured", "updated_at", "created_at", "_status" FROM \`services\`;`)
  await db.run(sql`DROP TABLE \`services\`;`)
  await db.run(sql`ALTER TABLE \`__new_services\` RENAME TO \`services\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`services_category_idx\` ON \`services\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`services_hero_image_idx\` ON \`services\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`services_seo_seo_image_idx\` ON \`services\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`services_slug_idx\` ON \`services\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`services__status_idx\` ON \`services\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__services_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_kind\` text DEFAULT 'service',
  	\`version_category_id\` integer,
  	\`version_short_description\` text,
  	\`version_icon\` text DEFAULT 'car',
  	\`version_hero_image_id\` integer,
  	\`version_intro\` text,
  	\`version_body\` text,
  	\`version_city_card_title\` text,
  	\`version_city_card_text\` text,
  	\`version_disclaimer\` text,
  	\`version_cta_label\` text,
  	\`version_starting_price\` text,
  	\`version_price_note\` text,
  	\`version_show_in_pricing_table\` integer DEFAULT false,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_slug\` text,
  	\`version_order\` numeric DEFAULT 0,
  	\`version_featured\` integer DEFAULT true,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_category_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__services_v\`("id", "parent_id", "version_title", "version_short_description", "version_icon", "version_hero_image_id", "version_intro", "version_body", "version_starting_price", "version_price_note", "version_show_in_pricing_table", "version_seo_title", "version_seo_description", "version_seo_image_id", "version_seo_noindex", "version_slug", "version_order", "version_featured", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_title", "version_short_description", "version_icon", "version_hero_image_id", "version_intro", "version_body", "version_starting_price", "version_price_note", "version_show_in_pricing_table", "version_seo_title", "version_seo_description", "version_seo_image_id", "version_seo_noindex", "version_slug", "version_order", "version_featured", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_services_v\`;`)
  await db.run(sql`DROP TABLE \`_services_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__services_v\` RENAME TO \`_services_v\`;`)
  await db.run(sql`CREATE INDEX \`_services_v_parent_idx\` ON \`_services_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_category_idx\` ON \`_services_v\` (\`version_category_id\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_hero_image_idx\` ON \`_services_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_seo_version_seo_image_idx\` ON \`_services_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_slug_idx\` ON \`_services_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_updated_at_idx\` ON \`_services_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_created_at_idx\` ON \`_services_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version__status_idx\` ON \`_services_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_created_at_idx\` ON \`_services_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_updated_at_idx\` ON \`_services_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_latest_idx\` ON \`_services_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`__new_locations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`city\` text,
  	\`state\` text,
  	\`state_abbr\` text,
  	\`subregion\` text DEFAULT 'south-bay',
  	\`parent_id\` integer,
  	\`badge\` text,
  	\`shop_name\` text,
  	\`shop_subtitle\` text,
  	\`image_id\` integer,
  	\`address_line\` text,
  	\`postcode\` text,
  	\`phone\` text,
  	\`hours\` text,
  	\`map_url\` text,
  	\`intro\` text,
  	\`body\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer DEFAULT false,
  	\`slug\` text,
  	\`order\` numeric DEFAULT 0,
  	\`featured\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_locations\`("id", "city", "state", "state_abbr", "badge", "shop_name", "shop_subtitle", "image_id", "address_line", "postcode", "phone", "hours", "map_url", "intro", "body", "seo_title", "seo_description", "seo_image_id", "seo_noindex", "slug", "order", "featured", "updated_at", "created_at", "_status") SELECT "id", "city", "state", "state_abbr", "badge", "shop_name", "shop_subtitle", "image_id", "address_line", "postcode", "phone", "hours", "map_url", "intro", "body", "seo_title", "seo_description", "seo_image_id", "seo_noindex", "slug", "order", "featured", "updated_at", "created_at", "_status" FROM \`locations\`;`)
  await db.run(sql`DROP TABLE \`locations\`;`)
  await db.run(sql`ALTER TABLE \`__new_locations\` RENAME TO \`locations\`;`)
  await db.run(sql`CREATE INDEX \`locations_parent_idx\` ON \`locations\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`locations_image_idx\` ON \`locations\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`locations_seo_seo_image_idx\` ON \`locations\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`locations_slug_idx\` ON \`locations\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`locations_updated_at_idx\` ON \`locations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`locations_created_at_idx\` ON \`locations\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`locations__status_idx\` ON \`locations\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__locations_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_city\` text,
  	\`version_state\` text,
  	\`version_state_abbr\` text,
  	\`version_subregion\` text DEFAULT 'south-bay',
  	\`version_parent_id\` integer,
  	\`version_badge\` text,
  	\`version_shop_name\` text,
  	\`version_shop_subtitle\` text,
  	\`version_image_id\` integer,
  	\`version_address_line\` text,
  	\`version_postcode\` text,
  	\`version_phone\` text,
  	\`version_hours\` text,
  	\`version_map_url\` text,
  	\`version_intro\` text,
  	\`version_body\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_slug\` text,
  	\`version_order\` numeric DEFAULT 0,
  	\`version_featured\` integer DEFAULT true,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_parent_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__locations_v\`("id", "parent_id", "version_city", "version_state", "version_state_abbr", "version_badge", "version_shop_name", "version_shop_subtitle", "version_image_id", "version_address_line", "version_postcode", "version_phone", "version_hours", "version_map_url", "version_intro", "version_body", "version_seo_title", "version_seo_description", "version_seo_image_id", "version_seo_noindex", "version_slug", "version_order", "version_featured", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_city", "version_state", "version_state_abbr", "version_badge", "version_shop_name", "version_shop_subtitle", "version_image_id", "version_address_line", "version_postcode", "version_phone", "version_hours", "version_map_url", "version_intro", "version_body", "version_seo_title", "version_seo_description", "version_seo_image_id", "version_seo_noindex", "version_slug", "version_order", "version_featured", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_locations_v\`;`)
  await db.run(sql`DROP TABLE \`_locations_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__locations_v\` RENAME TO \`_locations_v\`;`)
  await db.run(sql`CREATE INDEX \`_locations_v_parent_idx\` ON \`_locations_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_version_parent_idx\` ON \`_locations_v\` (\`version_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_version_image_idx\` ON \`_locations_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_seo_version_seo_image_idx\` ON \`_locations_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_version_slug_idx\` ON \`_locations_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_version_updated_at_idx\` ON \`_locations_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_version_created_at_idx\` ON \`_locations_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_version__status_idx\` ON \`_locations_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_created_at_idx\` ON \`_locations_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_updated_at_idx\` ON \`_locations_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_latest_idx\` ON \`_locations_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text DEFAULT 'Mobile Locksmith',
  	\`heading_line1\` text DEFAULT 'Serving All of San Jose' NOT NULL,
  	\`heading_line2\` text DEFAULT '& the Entire Bay Area' NOT NULL,
  	\`lede\` text NOT NULL,
  	\`hero_image_id\` integer,
  	\`primary_cta_label\` text DEFAULT 'Call',
  	\`secondary_cta_label\` text DEFAULT 'Request Service',
  	\`locations_eyebrow\` text DEFAULT 'Where We Dispatch',
  	\`locations_heading\` text DEFAULT 'Mobile Locksmith Coverage Across the Bay Area',
  	\`services_eyebrow\` text DEFAULT 'What We Do',
  	\`services_heading\` text DEFAULT 'Locksmith Services Throughout the Bay Area',
  	\`reviews_heading\` text DEFAULT 'What Our Customers Say',
  	\`reviews_subtitle\` text DEFAULT 'Real people. Real reviews.',
  	\`shops_eyebrow\` text DEFAULT 'Where We Are Based',
  	\`shops_heading\` text DEFAULT 'Dispatched from our hub, to you.',
  	\`shops_subtitle\` text,
  	\`pricing_eyebrow\` text DEFAULT 'Transparent Pricing',
  	\`pricing_heading\` text DEFAULT 'Starting prices, published up front.',
  	\`pricing_subtitle\` text,
  	\`faq_eyebrow\` text DEFAULT 'Before You Call',
  	\`faq_heading\` text DEFAULT 'Frequently Asked Questions',
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page\`("id", "eyebrow", "heading_line1", "heading_line2", "lede", "hero_image_id", "primary_cta_label", "secondary_cta_label", "locations_eyebrow", "locations_heading", "services_eyebrow", "services_heading", "reviews_heading", "reviews_subtitle", "shops_eyebrow", "shops_heading", "shops_subtitle", "pricing_eyebrow", "pricing_heading", "pricing_subtitle", "faq_eyebrow", "faq_heading", "seo_title", "seo_description", "seo_image_id", "seo_noindex", "updated_at", "created_at") SELECT "id", "eyebrow", "heading_line1", "heading_line2", "lede", "hero_image_id", "primary_cta_label", "secondary_cta_label", "locations_eyebrow", "locations_heading", "services_eyebrow", "services_heading", "reviews_heading", "reviews_subtitle", "shops_eyebrow", "shops_heading", "shops_subtitle", "pricing_eyebrow", "pricing_heading", "pricing_subtitle", "faq_eyebrow", "faq_heading", "seo_title", "seo_description", "seo_image_id", "seo_noindex", "updated_at", "created_at" FROM \`home_page\`;`)
  await db.run(sql`DROP TABLE \`home_page\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page\` RENAME TO \`home_page\`;`)
  await db.run(sql`CREATE INDEX \`home_page_hero_image_idx\` ON \`home_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_seo_seo_image_idx\` ON \`home_page\` (\`seo_image_id\`);`)
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
  await db.run(sql`CREATE TABLE \`__new_combo_template\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`enabled\` integer DEFAULT true,
  	\`eyebrow\` text DEFAULT '{city}, {state}',
  	\`heading\` text DEFAULT '{service} in {city}' NOT NULL,
  	\`intro\` text DEFAULT 'Need {service} in {city}? Our mobile technicians are dispatched to you anywhere in {city} — licensed, insured, and with the price confirmed before work begins.' NOT NULL,
  	\`body_heading\` text DEFAULT 'Why {city} calls us first',
  	\`body\` text DEFAULT 'Every {city} job is handled by a background-checked technician in a fully stocked van, so the work is finished on the first visit. You get a firm price on the phone before we set off — no call-out surprises, no upsell games.',
  	\`cta_heading\` text DEFAULT 'Need {service} in {city} right now?',
  	\`seo_title\` text DEFAULT '{service} in {city}, {state} | Mobile Locksmith | 888 Lock & Key',
  	\`seo_description\` text DEFAULT '{service} in {city}, {state}. Mobile, licensed and insured locksmith dispatched across San Jose and the Bay Area. Call now.',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_combo_template\`("id", "enabled", "eyebrow", "heading", "intro", "body_heading", "body", "cta_heading", "seo_title", "seo_description", "updated_at", "created_at") SELECT "id", "enabled", "eyebrow", "heading", "intro", "body_heading", "body", "cta_heading", "seo_title", "seo_description", "updated_at", "created_at" FROM \`combo_template\`;`)
  await db.run(sql`DROP TABLE \`combo_template\`;`)
  await db.run(sql`ALTER TABLE \`__new_combo_template\` RENAME TO \`combo_template\`;`)
  await db.run(sql`CREATE TABLE \`__new_site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`company_name\` text DEFAULT '888 Lock & Key' NOT NULL,
  	\`tagline\` text DEFAULT 'AUTO · HOME · BUSINESS',
  	\`phone\` text,
  	\`phone_href\` text,
  	\`email\` text,
  	\`license_number\` text,
  	\`hours\` text,
  	\`service_area_line\` text DEFAULT 'Serving San Jose & the Entire Bay Area',
  	\`rating\` text,
  	\`review_count\` numeric,
  	\`average_arrival\` text,
  	\`script_line\` text DEFAULT 'Your Security Our Priority',
  	\`logo_id\` integer,
  	\`default_hero_image_id\` integer,
  	\`default_seo_image_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`default_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`default_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings\`("id", "company_name", "tagline", "phone", "phone_href", "email", "license_number", "hours", "service_area_line", "rating", "review_count", "average_arrival", "script_line", "logo_id", "default_hero_image_id", "default_seo_image_id", "updated_at", "created_at") SELECT "id", "company_name", "tagline", "phone", "phone_href", "email", "license_number", "hours", "service_area_line", "rating", "review_count", "average_arrival", "script_line", "logo_id", "default_hero_image_id", "default_seo_image_id", "updated_at", "created_at" FROM \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings\` RENAME TO \`site_settings\`;`)
  await db.run(sql`CREATE INDEX \`site_settings_logo_idx\` ON \`site_settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_default_hero_image_idx\` ON \`site_settings\` (\`default_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_default_seo_image_idx\` ON \`site_settings\` (\`default_seo_image_id\`);`)
  await db.run(sql`ALTER TABLE \`services_rels\` ADD \`services_id\` integer REFERENCES services(id);`)
  await db.run(sql`CREATE INDEX \`services_rels_services_id_idx\` ON \`services_rels\` (\`services_id\`);`)
  await db.run(sql`ALTER TABLE \`_services_v_rels\` ADD \`services_id\` integer REFERENCES services(id);`)
  await db.run(sql`CREATE INDEX \`_services_v_rels_services_id_idx\` ON \`_services_v_rels\` (\`services_id\`);`)
  await db.run(sql`ALTER TABLE \`locations_rels\` ADD \`locations_id\` integer REFERENCES locations(id);`)
  await db.run(sql`CREATE INDEX \`locations_rels_locations_id_idx\` ON \`locations_rels\` (\`locations_id\`);`)
  await db.run(sql`ALTER TABLE \`_locations_v_rels\` ADD \`locations_id\` integer REFERENCES locations(id);`)
  await db.run(sql`CREATE INDEX \`_locations_v_rels_locations_id_idx\` ON \`_locations_v_rels\` (\`locations_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`site_settings_dispatch_hubs\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`short_description\` text,
  	\`icon\` text DEFAULT 'car',
  	\`hero_image_id\` integer,
  	\`intro\` text,
  	\`body\` text,
  	\`starting_price\` text,
  	\`price_note\` text,
  	\`show_in_pricing_table\` integer DEFAULT true,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer DEFAULT false,
  	\`slug\` text,
  	\`order\` numeric DEFAULT 0,
  	\`featured\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_services\`("id", "title", "short_description", "icon", "hero_image_id", "intro", "body", "starting_price", "price_note", "show_in_pricing_table", "seo_title", "seo_description", "seo_image_id", "seo_noindex", "slug", "order", "featured", "updated_at", "created_at", "_status") SELECT "id", "title", "short_description", "icon", "hero_image_id", "intro", "body", "starting_price", "price_note", "show_in_pricing_table", "seo_title", "seo_description", "seo_image_id", "seo_noindex", "slug", "order", "featured", "updated_at", "created_at", "_status" FROM \`services\`;`)
  await db.run(sql`DROP TABLE \`services\`;`)
  await db.run(sql`ALTER TABLE \`__new_services\` RENAME TO \`services\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`services_hero_image_idx\` ON \`services\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`services_seo_seo_image_idx\` ON \`services\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`services_slug_idx\` ON \`services\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`services__status_idx\` ON \`services\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_services_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`faqs_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_services_rels\`("id", "order", "parent_id", "path", "faqs_id") SELECT "id", "order", "parent_id", "path", "faqs_id" FROM \`services_rels\`;`)
  await db.run(sql`DROP TABLE \`services_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_services_rels\` RENAME TO \`services_rels\`;`)
  await db.run(sql`CREATE INDEX \`services_rels_order_idx\` ON \`services_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_parent_idx\` ON \`services_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_path_idx\` ON \`services_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_faqs_id_idx\` ON \`services_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__services_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_short_description\` text,
  	\`version_icon\` text DEFAULT 'car',
  	\`version_hero_image_id\` integer,
  	\`version_intro\` text,
  	\`version_body\` text,
  	\`version_starting_price\` text,
  	\`version_price_note\` text,
  	\`version_show_in_pricing_table\` integer DEFAULT true,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_slug\` text,
  	\`version_order\` numeric DEFAULT 0,
  	\`version_featured\` integer DEFAULT true,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__services_v\`("id", "parent_id", "version_title", "version_short_description", "version_icon", "version_hero_image_id", "version_intro", "version_body", "version_starting_price", "version_price_note", "version_show_in_pricing_table", "version_seo_title", "version_seo_description", "version_seo_image_id", "version_seo_noindex", "version_slug", "version_order", "version_featured", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_title", "version_short_description", "version_icon", "version_hero_image_id", "version_intro", "version_body", "version_starting_price", "version_price_note", "version_show_in_pricing_table", "version_seo_title", "version_seo_description", "version_seo_image_id", "version_seo_noindex", "version_slug", "version_order", "version_featured", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_services_v\`;`)
  await db.run(sql`DROP TABLE \`_services_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__services_v\` RENAME TO \`_services_v\`;`)
  await db.run(sql`CREATE INDEX \`_services_v_parent_idx\` ON \`_services_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_hero_image_idx\` ON \`_services_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_seo_version_seo_image_idx\` ON \`_services_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_slug_idx\` ON \`_services_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_updated_at_idx\` ON \`_services_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_created_at_idx\` ON \`_services_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version__status_idx\` ON \`_services_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_created_at_idx\` ON \`_services_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_updated_at_idx\` ON \`_services_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_latest_idx\` ON \`_services_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`__new__services_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`faqs_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__services_v_rels\`("id", "order", "parent_id", "path", "faqs_id") SELECT "id", "order", "parent_id", "path", "faqs_id" FROM \`_services_v_rels\`;`)
  await db.run(sql`DROP TABLE \`_services_v_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new__services_v_rels\` RENAME TO \`_services_v_rels\`;`)
  await db.run(sql`CREATE INDEX \`_services_v_rels_order_idx\` ON \`_services_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_rels_parent_idx\` ON \`_services_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_rels_path_idx\` ON \`_services_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_rels_faqs_id_idx\` ON \`_services_v_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_locations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`city\` text,
  	\`state\` text,
  	\`state_abbr\` text,
  	\`badge\` text,
  	\`shop_name\` text,
  	\`shop_subtitle\` text,
  	\`image_id\` integer,
  	\`address_line\` text,
  	\`postcode\` text,
  	\`phone\` text,
  	\`hours\` text DEFAULT 'Open 24 hours',
  	\`map_url\` text,
  	\`intro\` text,
  	\`body\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer DEFAULT false,
  	\`slug\` text,
  	\`order\` numeric DEFAULT 0,
  	\`featured\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_locations\`("id", "city", "state", "state_abbr", "badge", "shop_name", "shop_subtitle", "image_id", "address_line", "postcode", "phone", "hours", "map_url", "intro", "body", "seo_title", "seo_description", "seo_image_id", "seo_noindex", "slug", "order", "featured", "updated_at", "created_at", "_status") SELECT "id", "city", "state", "state_abbr", "badge", "shop_name", "shop_subtitle", "image_id", "address_line", "postcode", "phone", "hours", "map_url", "intro", "body", "seo_title", "seo_description", "seo_image_id", "seo_noindex", "slug", "order", "featured", "updated_at", "created_at", "_status" FROM \`locations\`;`)
  await db.run(sql`DROP TABLE \`locations\`;`)
  await db.run(sql`ALTER TABLE \`__new_locations\` RENAME TO \`locations\`;`)
  await db.run(sql`CREATE INDEX \`locations_image_idx\` ON \`locations\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`locations_seo_seo_image_idx\` ON \`locations\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`locations_slug_idx\` ON \`locations\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`locations_updated_at_idx\` ON \`locations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`locations_created_at_idx\` ON \`locations\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`locations__status_idx\` ON \`locations\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_locations_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`services_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_locations_rels\`("id", "order", "parent_id", "path", "services_id") SELECT "id", "order", "parent_id", "path", "services_id" FROM \`locations_rels\`;`)
  await db.run(sql`DROP TABLE \`locations_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_locations_rels\` RENAME TO \`locations_rels\`;`)
  await db.run(sql`CREATE INDEX \`locations_rels_order_idx\` ON \`locations_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`locations_rels_parent_idx\` ON \`locations_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`locations_rels_path_idx\` ON \`locations_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`locations_rels_services_id_idx\` ON \`locations_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__locations_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_city\` text,
  	\`version_state\` text,
  	\`version_state_abbr\` text,
  	\`version_badge\` text,
  	\`version_shop_name\` text,
  	\`version_shop_subtitle\` text,
  	\`version_image_id\` integer,
  	\`version_address_line\` text,
  	\`version_postcode\` text,
  	\`version_phone\` text,
  	\`version_hours\` text DEFAULT 'Open 24 hours',
  	\`version_map_url\` text,
  	\`version_intro\` text,
  	\`version_body\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_slug\` text,
  	\`version_order\` numeric DEFAULT 0,
  	\`version_featured\` integer DEFAULT true,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__locations_v\`("id", "parent_id", "version_city", "version_state", "version_state_abbr", "version_badge", "version_shop_name", "version_shop_subtitle", "version_image_id", "version_address_line", "version_postcode", "version_phone", "version_hours", "version_map_url", "version_intro", "version_body", "version_seo_title", "version_seo_description", "version_seo_image_id", "version_seo_noindex", "version_slug", "version_order", "version_featured", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_city", "version_state", "version_state_abbr", "version_badge", "version_shop_name", "version_shop_subtitle", "version_image_id", "version_address_line", "version_postcode", "version_phone", "version_hours", "version_map_url", "version_intro", "version_body", "version_seo_title", "version_seo_description", "version_seo_image_id", "version_seo_noindex", "version_slug", "version_order", "version_featured", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_locations_v\`;`)
  await db.run(sql`DROP TABLE \`_locations_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__locations_v\` RENAME TO \`_locations_v\`;`)
  await db.run(sql`CREATE INDEX \`_locations_v_parent_idx\` ON \`_locations_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_version_image_idx\` ON \`_locations_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_seo_version_seo_image_idx\` ON \`_locations_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_version_slug_idx\` ON \`_locations_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_version_updated_at_idx\` ON \`_locations_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_version_created_at_idx\` ON \`_locations_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_version__status_idx\` ON \`_locations_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_created_at_idx\` ON \`_locations_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_updated_at_idx\` ON \`_locations_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_latest_idx\` ON \`_locations_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`__new__locations_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`services_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_locations_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__locations_v_rels\`("id", "order", "parent_id", "path", "services_id") SELECT "id", "order", "parent_id", "path", "services_id" FROM \`_locations_v_rels\`;`)
  await db.run(sql`DROP TABLE \`_locations_v_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new__locations_v_rels\` RENAME TO \`_locations_v_rels\`;`)
  await db.run(sql`CREATE INDEX \`_locations_v_rels_order_idx\` ON \`_locations_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_rels_parent_idx\` ON \`_locations_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_rels_path_idx\` ON \`_locations_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_rels_services_id_idx\` ON \`_locations_v_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text DEFAULT 'Fast • Reliable • Professional',
  	\`heading_line1\` text DEFAULT 'Locked Out?' NOT NULL,
  	\`heading_line2\` text DEFAULT 'We''re Already On The Way.' NOT NULL,
  	\`lede\` text NOT NULL,
  	\`hero_image_id\` integer,
  	\`primary_cta_label\` text DEFAULT 'Call',
  	\`secondary_cta_label\` text DEFAULT 'Get a Free Quote',
  	\`locations_eyebrow\` text DEFAULT 'We Serve Multiple Cities',
  	\`locations_heading\` text DEFAULT 'Find a locksmith near you',
  	\`services_eyebrow\` text DEFAULT 'One call. Every solution.',
  	\`services_heading\` text DEFAULT 'Our Locksmith Services',
  	\`reviews_heading\` text DEFAULT 'What Our Customers Say',
  	\`reviews_subtitle\` text DEFAULT 'Real people. Real reviews.',
  	\`shops_eyebrow\` text DEFAULT 'Three Shops, One Dispatch',
  	\`shops_heading\` text DEFAULT 'Walk in, or we drive to you.',
  	\`shops_subtitle\` text,
  	\`pricing_eyebrow\` text DEFAULT 'Transparent Pricing',
  	\`pricing_heading\` text DEFAULT 'Starting prices, published up front.',
  	\`pricing_subtitle\` text,
  	\`faq_eyebrow\` text DEFAULT 'Before You Call',
  	\`faq_heading\` text DEFAULT 'Frequently Asked Questions',
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page\`("id", "eyebrow", "heading_line1", "heading_line2", "lede", "hero_image_id", "primary_cta_label", "secondary_cta_label", "locations_eyebrow", "locations_heading", "services_eyebrow", "services_heading", "reviews_heading", "reviews_subtitle", "shops_eyebrow", "shops_heading", "shops_subtitle", "pricing_eyebrow", "pricing_heading", "pricing_subtitle", "faq_eyebrow", "faq_heading", "seo_title", "seo_description", "seo_image_id", "seo_noindex", "updated_at", "created_at") SELECT "id", "eyebrow", "heading_line1", "heading_line2", "lede", "hero_image_id", "primary_cta_label", "secondary_cta_label", "locations_eyebrow", "locations_heading", "services_eyebrow", "services_heading", "reviews_heading", "reviews_subtitle", "shops_eyebrow", "shops_heading", "shops_subtitle", "pricing_eyebrow", "pricing_heading", "pricing_subtitle", "faq_eyebrow", "faq_heading", "seo_title", "seo_description", "seo_image_id", "seo_noindex", "updated_at", "created_at" FROM \`home_page\`;`)
  await db.run(sql`DROP TABLE \`home_page\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page\` RENAME TO \`home_page\`;`)
  await db.run(sql`CREATE INDEX \`home_page_hero_image_idx\` ON \`home_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_seo_seo_image_idx\` ON \`home_page\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_page_copy\` (
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
  	\`service_city_subtitle\` text DEFAULT 'Pick your city for local pricing, arrival times and shop details.',
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
  await db.run(sql`INSERT INTO \`__new_page_copy\`("id", "services_eyebrow", "services_title", "services_intro", "locations_eyebrow", "locations_title", "locations_intro", "reviews_eyebrow", "reviews_title", "reviews_intro", "faq_eyebrow", "faq_title", "faq_intro", "pricing_eyebrow", "pricing_title", "pricing_intro", "pricing_note", "book_eyebrow", "book_title", "book_intro", "book_side_title", "book_side_text", "contact_eyebrow", "contact_title", "contact_intro", "contact_form_heading", "contact_shops_heading", "thank_you_eyebrow", "thank_you_title", "thank_you_intro", "thank_you_urgent_title", "thank_you_urgent_text", "cta_heading", "cta_subtitle", "service_city_subtitle", "call_card_title", "call_card_subtitle", "call_card_note", "not_found_eyebrow", "not_found_title", "not_found_intro", "updated_at", "created_at") SELECT "id", "services_eyebrow", "services_title", "services_intro", "locations_eyebrow", "locations_title", "locations_intro", "reviews_eyebrow", "reviews_title", "reviews_intro", "faq_eyebrow", "faq_title", "faq_intro", "pricing_eyebrow", "pricing_title", "pricing_intro", "pricing_note", "book_eyebrow", "book_title", "book_intro", "book_side_title", "book_side_text", "contact_eyebrow", "contact_title", "contact_intro", "contact_form_heading", "contact_shops_heading", "thank_you_eyebrow", "thank_you_title", "thank_you_intro", "thank_you_urgent_title", "thank_you_urgent_text", "cta_heading", "cta_subtitle", "service_city_subtitle", "call_card_title", "call_card_subtitle", "call_card_note", "not_found_eyebrow", "not_found_title", "not_found_intro", "updated_at", "created_at" FROM \`page_copy\`;`)
  await db.run(sql`DROP TABLE \`page_copy\`;`)
  await db.run(sql`ALTER TABLE \`__new_page_copy\` RENAME TO \`page_copy\`;`)
  await db.run(sql`CREATE TABLE \`__new_combo_template\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`enabled\` integer DEFAULT true,
  	\`eyebrow\` text DEFAULT '{city}, {state}',
  	\`heading\` text DEFAULT '{service} in {city}' NOT NULL,
  	\`intro\` text DEFAULT 'Need {service} in {city}? Our mobile vans are dispatched by GPS from the closest shop, arriving in about {arrival} on average. Upfront pricing from {price}, licensed and insured technicians, 24 hours a day.' NOT NULL,
  	\`body_heading\` text DEFAULT 'Why {city} calls us first',
  	\`body\` text DEFAULT 'Every {city} job is handled by a background-checked technician in a fully stocked van, so the work is finished on the first visit. You get a firm price on the phone before we set off — no call-out surprises, no upsell games.',
  	\`cta_heading\` text DEFAULT 'Need {service} in {city} right now?',
  	\`seo_title\` text DEFAULT '{service} in {city}, {state} | 24/7 Mobile Locksmith',
  	\`seo_description\` text DEFAULT '{service} in {city}. Average arrival {arrival}, pricing from {price}, licensed and insured. Call {phone} — open 24 hours.',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_combo_template\`("id", "enabled", "eyebrow", "heading", "intro", "body_heading", "body", "cta_heading", "seo_title", "seo_description", "updated_at", "created_at") SELECT "id", "enabled", "eyebrow", "heading", "intro", "body_heading", "body", "cta_heading", "seo_title", "seo_description", "updated_at", "created_at" FROM \`combo_template\`;`)
  await db.run(sql`DROP TABLE \`combo_template\`;`)
  await db.run(sql`ALTER TABLE \`__new_combo_template\` RENAME TO \`combo_template\`;`)
  await db.run(sql`CREATE TABLE \`__new_site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`company_name\` text DEFAULT '888 Lock & Key' NOT NULL,
  	\`tagline\` text DEFAULT 'AUTO · HOME · BUSINESS',
  	\`phone\` text NOT NULL,
  	\`phone_href\` text NOT NULL,
  	\`email\` text,
  	\`license_number\` text,
  	\`hours\` text DEFAULT '24/7 Emergency Service',
  	\`service_area_line\` text,
  	\`rating\` text DEFAULT '4.9/5',
  	\`review_count\` numeric DEFAULT 214,
  	\`average_arrival\` text DEFAULT '24 MIN',
  	\`script_line\` text DEFAULT 'Your Security Our Priority',
  	\`logo_id\` integer,
  	\`default_hero_image_id\` integer,
  	\`default_seo_image_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`default_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`default_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings\`("id", "company_name", "tagline", "phone", "phone_href", "email", "license_number", "hours", "service_area_line", "rating", "review_count", "average_arrival", "script_line", "logo_id", "default_hero_image_id", "default_seo_image_id", "updated_at", "created_at") SELECT "id", "company_name", "tagline", "phone", "phone_href", "email", "license_number", "hours", "service_area_line", "rating", "review_count", "average_arrival", "script_line", "logo_id", "default_hero_image_id", "default_seo_image_id", "updated_at", "created_at" FROM \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings\` RENAME TO \`site_settings\`;`)
  await db.run(sql`CREATE INDEX \`site_settings_logo_idx\` ON \`site_settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_default_hero_image_idx\` ON \`site_settings\` (\`default_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_default_seo_image_idx\` ON \`site_settings\` (\`default_seo_image_id\`);`)
}
