import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`home_page_about_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'shield' NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_about_features_order_idx\` ON \`home_page_about_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_about_features_parent_id_idx\` ON \`home_page_about_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`page_copy_about_pillars\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'shield' NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`page_copy\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`page_copy_about_pillars_order_idx\` ON \`page_copy_about_pillars\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`page_copy_about_pillars_parent_id_idx\` ON \`page_copy_about_pillars\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`page_copy_city_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`page_copy\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`page_copy_city_faqs_order_idx\` ON \`page_copy_city_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`page_copy_city_faqs_parent_id_idx\` ON \`page_copy_city_faqs\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`about_eyebrow\` text DEFAULT 'About 888 Lock & Key';`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`about_heading\` text DEFAULT 'A mobile locksmith that comes to you';`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`about_lead\` text DEFAULT '888 Lock & Key is a licensed, bonded and insured mobile locksmith serving San Jose and the entire Bay Area — South Bay, the Peninsula, the East Bay and the Tri-Valley. Automotive, residential, commercial and emergency work, with the price confirmed before anything begins.';`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`about_cta_label\` text DEFAULT 'More about us';`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`faq_bar_text\` text DEFAULT 'Have more questions?';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`about_standards_eyebrow\` text DEFAULT 'Our standards';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`about_standards_heading\` text DEFAULT 'Built on honesty and quality service';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`about_standards_intro\` text DEFAULT 'Three standards that guide every lockout, rekey and installation we perform.';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`about_areas_heading\` text DEFAULT 'Serving {count} Bay Area cities';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`about_areas_text\` text DEFAULT 'South Bay, the Peninsula, the East Bay and the Tri-Valley — see every city we cover.';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`about_hubs_heading\` text DEFAULT 'Where we dispatch from';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`city_neighborhoods_eyebrow\` text DEFAULT 'Neighborhoods We Serve';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`city_neighborhoods_heading\` text DEFAULT 'All of {city}';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`city_services_eyebrow\` text DEFAULT 'Services in {city}';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`city_services_heading\` text DEFAULT 'Locksmith Services Available Here';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`city_cta_heading\` text DEFAULT 'Locked out in {city} right now?';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`city_cta_subtitle\` text DEFAULT 'Mobile technicians dispatched across the city.';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`city_faq_eyebrow\` text DEFAULT 'Before You Call';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`city_faq_heading\` text DEFAULT '{city} Locksmith FAQs';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`city_nearby_eyebrow\` text DEFAULT 'Nearby Areas';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`city_nearby_heading\` text DEFAULT 'Also Serving';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`service_included_heading\` text DEFAULT 'What''s included';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`service_cta_subtitle\` text DEFAULT 'Mobile technicians dispatched across San Jose & the Bay Area.';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`service_areas_eyebrow\` text DEFAULT 'Where We Cover This Service';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`service_areas_heading\` text DEFAULT 'Areas We Serve';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`service_related_eyebrow\` text DEFAULT 'Related Services';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`service_related_heading\` text DEFAULT 'You May Also Need';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`hub_regions_eyebrow\` text DEFAULT 'Find Your Area';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`hub_regions_heading\` text DEFAULT 'Bay Area Service Regions';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`hub_cta_heading\` text DEFAULT 'Need a locksmith right now?';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`pricing_empty_heading\` text DEFAULT 'Pricing is confirmed on the phone';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`pricing_empty_text\` text DEFAULT 'Every job is quoted before a technician is sent, and the price is confirmed with you before any work begins. Call or send a request and a dispatcher will give you the price for your job.';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`reviews_empty_heading\` text DEFAULT 'Reviews are on their way';`)
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`reviews_empty_text\` text DEFAULT 'We only publish verified customer reviews. Check back soon, or ask us for references when you call.';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`home_page_about_features\`;`)
  await db.run(sql`DROP TABLE \`page_copy_about_pillars\`;`)
  await db.run(sql`DROP TABLE \`page_copy_city_faqs\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`about_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`about_heading\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`about_lead\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`about_cta_label\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`faq_bar_text\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`about_standards_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`about_standards_heading\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`about_standards_intro\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`about_areas_heading\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`about_areas_text\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`about_hubs_heading\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`city_neighborhoods_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`city_neighborhoods_heading\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`city_services_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`city_services_heading\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`city_cta_heading\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`city_cta_subtitle\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`city_faq_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`city_faq_heading\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`city_nearby_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`city_nearby_heading\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`service_included_heading\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`service_cta_subtitle\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`service_areas_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`service_areas_heading\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`service_related_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`service_related_heading\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`hub_regions_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`hub_regions_heading\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`hub_cta_heading\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`pricing_empty_heading\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`pricing_empty_text\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`reviews_empty_heading\`;`)
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`reviews_empty_text\`;`)
}
