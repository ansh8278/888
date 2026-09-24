import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_reviews_source" ADD VALUE 'example';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reviews" ALTER COLUMN "source" SET DATA TYPE text;
  ALTER TABLE "reviews" ALTER COLUMN "source" SET DEFAULT 'google'::text;
  DROP TYPE "public"."enum_reviews_source";
  CREATE TYPE "public"."enum_reviews_source" AS ENUM('google', 'yelp', 'direct');
  ALTER TABLE "reviews" ALTER COLUMN "source" SET DEFAULT 'google'::"public"."enum_reviews_source";
  ALTER TABLE "reviews" ALTER COLUMN "source" SET DATA TYPE "public"."enum_reviews_source" USING "source"::"public"."enum_reviews_source";`)
}
