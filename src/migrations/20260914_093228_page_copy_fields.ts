import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`page_copy\` ADD \`service_city_subtitle\` text DEFAULT 'Pick your city for local pricing, arrival times and shop details.';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`page_copy\` DROP COLUMN \`service_city_subtitle\`;`)
}
