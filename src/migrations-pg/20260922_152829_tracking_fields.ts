import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_copy" ALTER COLUMN "services_intro" SET DEFAULT 'Automotive, residential, commercial and emergency locksmith services, dispatched across San Jose and the Bay Area with the price confirmed before work begins.';
  ALTER TABLE "page_copy" ALTER COLUMN "pricing_note" SET DEFAULT 'Prices are starting points for standard work. Your technician confirms the exact price before any work begins.';
  ALTER TABLE "site_settings" ADD COLUMN "google_analytics_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "google_site_verification" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_copy" ALTER COLUMN "services_intro" SET DEFAULT 'Automotive, residential, commercial and emergency locksmith services — dispatched to you across San Jose and the Bay Area, with the price confirmed before work begins.';
  ALTER TABLE "page_copy" ALTER COLUMN "pricing_note" SET DEFAULT 'Prices are starting points for standard work during normal hours. After-hours call-outs carry a flat fee quoted on the phone before we dispatch.';
  ALTER TABLE "site_settings" DROP COLUMN "google_analytics_id";
  ALTER TABLE "site_settings" DROP COLUMN "google_site_verification";`)
}
