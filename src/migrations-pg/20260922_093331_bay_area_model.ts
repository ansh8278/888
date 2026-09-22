import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_kind" AS ENUM('category', 'service', 'standalone');
  CREATE TYPE "public"."enum__services_v_version_kind" AS ENUM('category', 'service', 'standalone');
  CREATE TYPE "public"."enum_locations_subregion" AS ENUM('south-bay', 'peninsula', 'east-bay', 'tri-valley');
  CREATE TYPE "public"."enum__locations_v_version_subregion" AS ENUM('south-bay', 'peninsula', 'east-bay', 'tri-valley');
  CREATE TABLE "site_settings_dispatch_hubs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"address_line" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"state_abbr" varchar DEFAULT 'CA' NOT NULL,
  	"postcode" varchar,
  	"map_url" varchar
  );
  
  ALTER TABLE "services" ALTER COLUMN "show_in_pricing_table" SET DEFAULT false;
  ALTER TABLE "_services_v" ALTER COLUMN "version_show_in_pricing_table" SET DEFAULT false;
  ALTER TABLE "locations" ALTER COLUMN "hours" DROP DEFAULT;
  ALTER TABLE "_locations_v" ALTER COLUMN "version_hours" DROP DEFAULT;
  ALTER TABLE "home_page" ALTER COLUMN "eyebrow" SET DEFAULT 'Mobile Locksmith';
  ALTER TABLE "home_page" ALTER COLUMN "heading_line1" SET DEFAULT 'Serving All of San Jose';
  ALTER TABLE "home_page" ALTER COLUMN "heading_line2" SET DEFAULT '& the Entire Bay Area';
  ALTER TABLE "home_page" ALTER COLUMN "secondary_cta_label" SET DEFAULT 'Request Service';
  ALTER TABLE "home_page" ALTER COLUMN "locations_eyebrow" SET DEFAULT 'Where We Dispatch';
  ALTER TABLE "home_page" ALTER COLUMN "locations_heading" SET DEFAULT 'Mobile Locksmith Coverage Across the Bay Area';
  ALTER TABLE "home_page" ALTER COLUMN "services_eyebrow" SET DEFAULT 'What We Do';
  ALTER TABLE "home_page" ALTER COLUMN "services_heading" SET DEFAULT 'Locksmith Services Throughout the Bay Area';
  ALTER TABLE "home_page" ALTER COLUMN "shops_eyebrow" SET DEFAULT 'Where We Are Based';
  ALTER TABLE "home_page" ALTER COLUMN "shops_heading" SET DEFAULT 'Dispatched from our hub, to you.';
  ALTER TABLE "page_copy" ALTER COLUMN "services_intro" SET DEFAULT 'Automotive, residential, commercial and emergency locksmith services — dispatched to you across San Jose and the Bay Area, with the price confirmed before work begins.';
  ALTER TABLE "page_copy" ALTER COLUMN "locations_eyebrow" SET DEFAULT 'Coverage Area';
  ALTER TABLE "page_copy" ALTER COLUMN "locations_title" SET DEFAULT 'Mobile Locksmith Serving San Jose & the Entire Bay Area';
  ALTER TABLE "page_copy" ALTER COLUMN "locations_intro" SET DEFAULT '888 Lock & Key dispatches mobile automotive, residential, and commercial locksmith technicians throughout San Jose and every corner of the Bay Area. Find your area below.';
  ALTER TABLE "page_copy" ALTER COLUMN "faq_intro" SET DEFAULT 'Straight answers on pricing, ID checks, what we can open and how dispatch works.';
  ALTER TABLE "page_copy" ALTER COLUMN "book_intro" SET DEFAULT 'Tell us where you are and what you need. A dispatcher calls you back to confirm the price before anyone is sent.';
  ALTER TABLE "page_copy" ALTER COLUMN "book_side_text" SET DEFAULT 'If you are locked out right now, calling is faster than a form — a dispatcher can send the nearest technician while you are still on the line.';
  ALTER TABLE "page_copy" ALTER COLUMN "contact_shops_heading" SET DEFAULT 'Our dispatch hub';
  ALTER TABLE "page_copy" ALTER COLUMN "service_city_subtitle" SET DEFAULT 'Pick your city to see local coverage and neighborhoods.';
  ALTER TABLE "page_copy" ALTER COLUMN "call_card_subtitle" SET DEFAULT 'Mobile technicians dispatched across the Bay Area.';
  ALTER TABLE "combo_template" ALTER COLUMN "intro" SET DEFAULT 'Need {service} in {city}? Our mobile technicians are dispatched to you anywhere in {city} — licensed, insured, and with the price confirmed before work begins.';
  ALTER TABLE "combo_template" ALTER COLUMN "seo_title" SET DEFAULT '{service} in {city}, {state} | Mobile Locksmith | 888 Lock & Key';
  ALTER TABLE "combo_template" ALTER COLUMN "seo_description" SET DEFAULT '{service} in {city}, {state}. Mobile, licensed and insured locksmith dispatched across San Jose and the Bay Area. Call now.';
  ALTER TABLE "site_settings" ALTER COLUMN "phone" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "phone_href" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "hours" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "service_area_line" SET DEFAULT 'Serving San Jose & the Entire Bay Area';
  ALTER TABLE "site_settings" ALTER COLUMN "rating" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "review_count" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "average_arrival" DROP DEFAULT;
  ALTER TABLE "services" ADD COLUMN "kind" "enum_services_kind" DEFAULT 'service';
  ALTER TABLE "services" ADD COLUMN "category_id" integer;
  ALTER TABLE "services" ADD COLUMN "city_card_title" varchar;
  ALTER TABLE "services" ADD COLUMN "city_card_text" varchar;
  ALTER TABLE "services" ADD COLUMN "disclaimer" varchar;
  ALTER TABLE "services" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "services_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "_services_v" ADD COLUMN "version_kind" "enum__services_v_version_kind" DEFAULT 'service';
  ALTER TABLE "_services_v" ADD COLUMN "version_category_id" integer;
  ALTER TABLE "_services_v" ADD COLUMN "version_city_card_title" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_city_card_text" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_disclaimer" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_cta_label" varchar;
  ALTER TABLE "_services_v_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "locations" ADD COLUMN "subregion" "enum_locations_subregion" DEFAULT 'south-bay';
  ALTER TABLE "locations" ADD COLUMN "parent_id" integer;
  ALTER TABLE "locations_rels" ADD COLUMN "locations_id" integer;
  ALTER TABLE "_locations_v" ADD COLUMN "version_subregion" "enum__locations_v_version_subregion" DEFAULT 'south-bay';
  ALTER TABLE "_locations_v" ADD COLUMN "version_parent_id" integer;
  ALTER TABLE "_locations_v_rels" ADD COLUMN "locations_id" integer;
  ALTER TABLE "site_settings_dispatch_hubs" ADD CONSTRAINT "site_settings_dispatch_hubs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_dispatch_hubs_order_idx" ON "site_settings_dispatch_hubs" USING btree ("_order");
  CREATE INDEX "site_settings_dispatch_hubs_parent_id_idx" ON "site_settings_dispatch_hubs" USING btree ("_parent_id");
  ALTER TABLE "services" ADD CONSTRAINT "services_category_id_services_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_category_id_services_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_parent_id_locations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations_rels" ADD CONSTRAINT "locations_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v" ADD CONSTRAINT "_locations_v_version_parent_id_locations_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_locations_v_rels" ADD CONSTRAINT "_locations_v_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_category_idx" ON "services" USING btree ("category_id");
  CREATE INDEX "services_rels_services_id_idx" ON "services_rels" USING btree ("services_id");
  CREATE INDEX "_services_v_version_version_category_idx" ON "_services_v" USING btree ("version_category_id");
  CREATE INDEX "_services_v_rels_services_id_idx" ON "_services_v_rels" USING btree ("services_id");
  CREATE INDEX "locations_parent_idx" ON "locations" USING btree ("parent_id");
  CREATE INDEX "locations_rels_locations_id_idx" ON "locations_rels" USING btree ("locations_id");
  CREATE INDEX "_locations_v_version_version_parent_idx" ON "_locations_v" USING btree ("version_parent_id");
  CREATE INDEX "_locations_v_rels_locations_id_idx" ON "_locations_v_rels" USING btree ("locations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_dispatch_hubs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings_dispatch_hubs" CASCADE;
  ALTER TABLE "services" DROP CONSTRAINT "services_category_id_services_id_fk";
  
  ALTER TABLE "services_rels" DROP CONSTRAINT "services_rels_services_fk";
  
  ALTER TABLE "_services_v" DROP CONSTRAINT "_services_v_version_category_id_services_id_fk";
  
  ALTER TABLE "_services_v_rels" DROP CONSTRAINT "_services_v_rels_services_fk";
  
  ALTER TABLE "locations" DROP CONSTRAINT "locations_parent_id_locations_id_fk";
  
  ALTER TABLE "locations_rels" DROP CONSTRAINT "locations_rels_locations_fk";
  
  ALTER TABLE "_locations_v" DROP CONSTRAINT "_locations_v_version_parent_id_locations_id_fk";
  
  ALTER TABLE "_locations_v_rels" DROP CONSTRAINT "_locations_v_rels_locations_fk";
  
  DROP INDEX "services_category_idx";
  DROP INDEX "services_rels_services_id_idx";
  DROP INDEX "_services_v_version_version_category_idx";
  DROP INDEX "_services_v_rels_services_id_idx";
  DROP INDEX "locations_parent_idx";
  DROP INDEX "locations_rels_locations_id_idx";
  DROP INDEX "_locations_v_version_version_parent_idx";
  DROP INDEX "_locations_v_rels_locations_id_idx";
  ALTER TABLE "services" ALTER COLUMN "show_in_pricing_table" SET DEFAULT true;
  ALTER TABLE "_services_v" ALTER COLUMN "version_show_in_pricing_table" SET DEFAULT true;
  ALTER TABLE "locations" ALTER COLUMN "hours" SET DEFAULT 'Open 24 hours';
  ALTER TABLE "_locations_v" ALTER COLUMN "version_hours" SET DEFAULT 'Open 24 hours';
  ALTER TABLE "home_page" ALTER COLUMN "eyebrow" SET DEFAULT 'Fast • Reliable • Professional';
  ALTER TABLE "home_page" ALTER COLUMN "heading_line1" SET DEFAULT 'Locked Out?';
  ALTER TABLE "home_page" ALTER COLUMN "heading_line2" SET DEFAULT 'We''re Already On The Way.';
  ALTER TABLE "home_page" ALTER COLUMN "secondary_cta_label" SET DEFAULT 'Get a Free Quote';
  ALTER TABLE "home_page" ALTER COLUMN "locations_eyebrow" SET DEFAULT 'We Serve Multiple Cities';
  ALTER TABLE "home_page" ALTER COLUMN "locations_heading" SET DEFAULT 'Find a locksmith near you';
  ALTER TABLE "home_page" ALTER COLUMN "services_eyebrow" SET DEFAULT 'One call. Every solution.';
  ALTER TABLE "home_page" ALTER COLUMN "services_heading" SET DEFAULT 'Our Locksmith Services';
  ALTER TABLE "home_page" ALTER COLUMN "shops_eyebrow" SET DEFAULT 'Three Shops, One Dispatch';
  ALTER TABLE "home_page" ALTER COLUMN "shops_heading" SET DEFAULT 'Walk in, or we drive to you.';
  ALTER TABLE "page_copy" ALTER COLUMN "services_intro" SET DEFAULT 'Cars, homes and businesses — handled by our own background-checked technicians, 24 hours a day, at a price agreed before we set off.';
  ALTER TABLE "page_copy" ALTER COLUMN "locations_eyebrow" SET DEFAULT 'We Serve Multiple Cities';
  ALTER TABLE "page_copy" ALTER COLUMN "locations_title" SET DEFAULT 'Find a locksmith near you';
  ALTER TABLE "page_copy" ALTER COLUMN "locations_intro" SET DEFAULT 'Mobile locksmith coverage across California, Arizona and New York. Find your city for local pricing, shop details and arrival times.';
  ALTER TABLE "page_copy" ALTER COLUMN "faq_intro" SET DEFAULT 'Straight answers on pricing, arrival times, ID checks and warranty.';
  ALTER TABLE "page_copy" ALTER COLUMN "book_intro" SET DEFAULT 'Tell us where you are and what you need. A dispatcher calls you back with a firm price — usually within minutes.';
  ALTER TABLE "page_copy" ALTER COLUMN "book_side_text" SET DEFAULT 'If you are locked out right now, call. Someone answers 24 hours a day and the van is dispatched while you are still on the line.';
  ALTER TABLE "page_copy" ALTER COLUMN "contact_shops_heading" SET DEFAULT 'Our shops';
  ALTER TABLE "page_copy" ALTER COLUMN "service_city_subtitle" SET DEFAULT 'Pick your city for local pricing, arrival times and shop details.';
  ALTER TABLE "page_copy" ALTER COLUMN "call_card_subtitle" SET DEFAULT 'We''re here 24/7.';
  ALTER TABLE "combo_template" ALTER COLUMN "intro" SET DEFAULT 'Need {service} in {city}? Our mobile vans are dispatched by GPS from the closest shop, arriving in about {arrival} on average. Upfront pricing from {price}, licensed and insured technicians, 24 hours a day.';
  ALTER TABLE "combo_template" ALTER COLUMN "seo_title" SET DEFAULT '{service} in {city}, {state} | 24/7 Mobile Locksmith';
  ALTER TABLE "combo_template" ALTER COLUMN "seo_description" SET DEFAULT '{service} in {city}. Average arrival {arrival}, pricing from {price}, licensed and insured. Call {phone} — open 24 hours.';
  ALTER TABLE "site_settings" ALTER COLUMN "phone" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "phone_href" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "hours" SET DEFAULT '24/7 Emergency Service';
  ALTER TABLE "site_settings" ALTER COLUMN "service_area_line" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "rating" SET DEFAULT '4.9/5';
  ALTER TABLE "site_settings" ALTER COLUMN "review_count" SET DEFAULT 214;
  ALTER TABLE "site_settings" ALTER COLUMN "average_arrival" SET DEFAULT '24 MIN';
  ALTER TABLE "services" DROP COLUMN "kind";
  ALTER TABLE "services" DROP COLUMN "category_id";
  ALTER TABLE "services" DROP COLUMN "city_card_title";
  ALTER TABLE "services" DROP COLUMN "city_card_text";
  ALTER TABLE "services" DROP COLUMN "disclaimer";
  ALTER TABLE "services" DROP COLUMN "cta_label";
  ALTER TABLE "services_rels" DROP COLUMN "services_id";
  ALTER TABLE "_services_v" DROP COLUMN "version_kind";
  ALTER TABLE "_services_v" DROP COLUMN "version_category_id";
  ALTER TABLE "_services_v" DROP COLUMN "version_city_card_title";
  ALTER TABLE "_services_v" DROP COLUMN "version_city_card_text";
  ALTER TABLE "_services_v" DROP COLUMN "version_disclaimer";
  ALTER TABLE "_services_v" DROP COLUMN "version_cta_label";
  ALTER TABLE "_services_v_rels" DROP COLUMN "services_id";
  ALTER TABLE "locations" DROP COLUMN "subregion";
  ALTER TABLE "locations" DROP COLUMN "parent_id";
  ALTER TABLE "locations_rels" DROP COLUMN "locations_id";
  ALTER TABLE "_locations_v" DROP COLUMN "version_subregion";
  ALTER TABLE "_locations_v" DROP COLUMN "version_parent_id";
  ALTER TABLE "_locations_v_rels" DROP COLUMN "locations_id";
  DROP TYPE "public"."enum_services_kind";
  DROP TYPE "public"."enum__services_v_version_kind";
  DROP TYPE "public"."enum_locations_subregion";
  DROP TYPE "public"."enum__locations_v_version_subregion";`)
}
