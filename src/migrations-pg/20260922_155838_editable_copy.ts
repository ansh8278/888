import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_about_features_icon" AS ENUM('shield', 'key', 'people', 'clock', 'star');
  CREATE TYPE "public"."enum_page_copy_about_pillars_icon" AS ENUM('shield', 'key', 'people', 'clock', 'star');
  CREATE TABLE "home_page_about_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_home_page_about_features_icon" DEFAULT 'shield' NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "page_copy_about_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_copy_about_pillars_icon" DEFAULT 'shield' NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "page_copy_city_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  ALTER TABLE "home_page" ADD COLUMN "about_eyebrow" varchar DEFAULT 'About 888 Lock & Key';
  ALTER TABLE "home_page" ADD COLUMN "about_heading" varchar DEFAULT 'A mobile locksmith that comes to you';
  ALTER TABLE "home_page" ADD COLUMN "about_lead" varchar DEFAULT '888 Lock & Key is a licensed, bonded and insured mobile locksmith serving San Jose and the entire Bay Area — South Bay, the Peninsula, the East Bay and the Tri-Valley. Automotive, residential, commercial and emergency work, with the price confirmed before anything begins.';
  ALTER TABLE "home_page" ADD COLUMN "about_cta_label" varchar DEFAULT 'More about us';
  ALTER TABLE "home_page" ADD COLUMN "faq_bar_text" varchar DEFAULT 'Have more questions?';
  ALTER TABLE "page_copy" ADD COLUMN "about_standards_eyebrow" varchar DEFAULT 'Our standards';
  ALTER TABLE "page_copy" ADD COLUMN "about_standards_heading" varchar DEFAULT 'Built on honesty and quality service';
  ALTER TABLE "page_copy" ADD COLUMN "about_standards_intro" varchar DEFAULT 'Three standards that guide every lockout, rekey and installation we perform.';
  ALTER TABLE "page_copy" ADD COLUMN "about_areas_heading" varchar DEFAULT 'Serving {count} Bay Area cities';
  ALTER TABLE "page_copy" ADD COLUMN "about_areas_text" varchar DEFAULT 'South Bay, the Peninsula, the East Bay and the Tri-Valley — see every city we cover.';
  ALTER TABLE "page_copy" ADD COLUMN "about_hubs_heading" varchar DEFAULT 'Where we dispatch from';
  ALTER TABLE "page_copy" ADD COLUMN "city_neighborhoods_eyebrow" varchar DEFAULT 'Neighborhoods We Serve';
  ALTER TABLE "page_copy" ADD COLUMN "city_neighborhoods_heading" varchar DEFAULT 'All of {city}';
  ALTER TABLE "page_copy" ADD COLUMN "city_services_eyebrow" varchar DEFAULT 'Services in {city}';
  ALTER TABLE "page_copy" ADD COLUMN "city_services_heading" varchar DEFAULT 'Locksmith Services Available Here';
  ALTER TABLE "page_copy" ADD COLUMN "city_cta_heading" varchar DEFAULT 'Locked out in {city} right now?';
  ALTER TABLE "page_copy" ADD COLUMN "city_cta_subtitle" varchar DEFAULT 'Mobile technicians dispatched across the city.';
  ALTER TABLE "page_copy" ADD COLUMN "city_faq_eyebrow" varchar DEFAULT 'Before You Call';
  ALTER TABLE "page_copy" ADD COLUMN "city_faq_heading" varchar DEFAULT '{city} Locksmith FAQs';
  ALTER TABLE "page_copy" ADD COLUMN "city_nearby_eyebrow" varchar DEFAULT 'Nearby Areas';
  ALTER TABLE "page_copy" ADD COLUMN "city_nearby_heading" varchar DEFAULT 'Also Serving';
  ALTER TABLE "page_copy" ADD COLUMN "service_included_heading" varchar DEFAULT 'What''s included';
  ALTER TABLE "page_copy" ADD COLUMN "service_cta_subtitle" varchar DEFAULT 'Mobile technicians dispatched across San Jose & the Bay Area.';
  ALTER TABLE "page_copy" ADD COLUMN "service_areas_eyebrow" varchar DEFAULT 'Where We Cover This Service';
  ALTER TABLE "page_copy" ADD COLUMN "service_areas_heading" varchar DEFAULT 'Areas We Serve';
  ALTER TABLE "page_copy" ADD COLUMN "service_related_eyebrow" varchar DEFAULT 'Related Services';
  ALTER TABLE "page_copy" ADD COLUMN "service_related_heading" varchar DEFAULT 'You May Also Need';
  ALTER TABLE "page_copy" ADD COLUMN "hub_regions_eyebrow" varchar DEFAULT 'Find Your Area';
  ALTER TABLE "page_copy" ADD COLUMN "hub_regions_heading" varchar DEFAULT 'Bay Area Service Regions';
  ALTER TABLE "page_copy" ADD COLUMN "hub_cta_heading" varchar DEFAULT 'Need a locksmith right now?';
  ALTER TABLE "page_copy" ADD COLUMN "pricing_empty_heading" varchar DEFAULT 'Pricing is confirmed on the phone';
  ALTER TABLE "page_copy" ADD COLUMN "pricing_empty_text" varchar DEFAULT 'Every job is quoted before a technician is sent, and the price is confirmed with you before any work begins. Call or send a request and a dispatcher will give you the price for your job.';
  ALTER TABLE "page_copy" ADD COLUMN "reviews_empty_heading" varchar DEFAULT 'Reviews are on their way';
  ALTER TABLE "page_copy" ADD COLUMN "reviews_empty_text" varchar DEFAULT 'We only publish verified customer reviews. Check back soon, or ask us for references when you call.';
  ALTER TABLE "home_page_about_features" ADD CONSTRAINT "home_page_about_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_copy_about_pillars" ADD CONSTRAINT "page_copy_about_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_copy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_copy_city_faqs" ADD CONSTRAINT "page_copy_city_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_copy"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_about_features_order_idx" ON "home_page_about_features" USING btree ("_order");
  CREATE INDEX "home_page_about_features_parent_id_idx" ON "home_page_about_features" USING btree ("_parent_id");
  CREATE INDEX "page_copy_about_pillars_order_idx" ON "page_copy_about_pillars" USING btree ("_order");
  CREATE INDEX "page_copy_about_pillars_parent_id_idx" ON "page_copy_about_pillars" USING btree ("_parent_id");
  CREATE INDEX "page_copy_city_faqs_order_idx" ON "page_copy_city_faqs" USING btree ("_order");
  CREATE INDEX "page_copy_city_faqs_parent_id_idx" ON "page_copy_city_faqs" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_about_features" CASCADE;
  DROP TABLE "page_copy_about_pillars" CASCADE;
  DROP TABLE "page_copy_city_faqs" CASCADE;
  ALTER TABLE "home_page" DROP COLUMN "about_eyebrow";
  ALTER TABLE "home_page" DROP COLUMN "about_heading";
  ALTER TABLE "home_page" DROP COLUMN "about_lead";
  ALTER TABLE "home_page" DROP COLUMN "about_cta_label";
  ALTER TABLE "home_page" DROP COLUMN "faq_bar_text";
  ALTER TABLE "page_copy" DROP COLUMN "about_standards_eyebrow";
  ALTER TABLE "page_copy" DROP COLUMN "about_standards_heading";
  ALTER TABLE "page_copy" DROP COLUMN "about_standards_intro";
  ALTER TABLE "page_copy" DROP COLUMN "about_areas_heading";
  ALTER TABLE "page_copy" DROP COLUMN "about_areas_text";
  ALTER TABLE "page_copy" DROP COLUMN "about_hubs_heading";
  ALTER TABLE "page_copy" DROP COLUMN "city_neighborhoods_eyebrow";
  ALTER TABLE "page_copy" DROP COLUMN "city_neighborhoods_heading";
  ALTER TABLE "page_copy" DROP COLUMN "city_services_eyebrow";
  ALTER TABLE "page_copy" DROP COLUMN "city_services_heading";
  ALTER TABLE "page_copy" DROP COLUMN "city_cta_heading";
  ALTER TABLE "page_copy" DROP COLUMN "city_cta_subtitle";
  ALTER TABLE "page_copy" DROP COLUMN "city_faq_eyebrow";
  ALTER TABLE "page_copy" DROP COLUMN "city_faq_heading";
  ALTER TABLE "page_copy" DROP COLUMN "city_nearby_eyebrow";
  ALTER TABLE "page_copy" DROP COLUMN "city_nearby_heading";
  ALTER TABLE "page_copy" DROP COLUMN "service_included_heading";
  ALTER TABLE "page_copy" DROP COLUMN "service_cta_subtitle";
  ALTER TABLE "page_copy" DROP COLUMN "service_areas_eyebrow";
  ALTER TABLE "page_copy" DROP COLUMN "service_areas_heading";
  ALTER TABLE "page_copy" DROP COLUMN "service_related_eyebrow";
  ALTER TABLE "page_copy" DROP COLUMN "service_related_heading";
  ALTER TABLE "page_copy" DROP COLUMN "hub_regions_eyebrow";
  ALTER TABLE "page_copy" DROP COLUMN "hub_regions_heading";
  ALTER TABLE "page_copy" DROP COLUMN "hub_cta_heading";
  ALTER TABLE "page_copy" DROP COLUMN "pricing_empty_heading";
  ALTER TABLE "page_copy" DROP COLUMN "pricing_empty_text";
  ALTER TABLE "page_copy" DROP COLUMN "reviews_empty_heading";
  ALTER TABLE "page_copy" DROP COLUMN "reviews_empty_text";
  DROP TYPE "public"."enum_home_page_about_features_icon";
  DROP TYPE "public"."enum_page_copy_about_pillars_icon";`)
}
