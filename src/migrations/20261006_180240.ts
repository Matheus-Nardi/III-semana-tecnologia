import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "editions" ADD COLUMN "schedule_illustration_id" integer;
  ALTER TABLE "editions" ADD COLUMN "partners_illustration_id" integer;
  ALTER TABLE "editions" ADD COLUMN "news_illustration_id" integer;
  ALTER TABLE "editions" ADD COLUMN "subscription_left_illustration_id" integer;
  ALTER TABLE "editions" ADD COLUMN "subscription_right_illustration_id" integer;
  ALTER TABLE "editions" ADD CONSTRAINT "editions_schedule_illustration_id_media_id_fk" FOREIGN KEY ("schedule_illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "editions" ADD CONSTRAINT "editions_partners_illustration_id_media_id_fk" FOREIGN KEY ("partners_illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "editions" ADD CONSTRAINT "editions_news_illustration_id_media_id_fk" FOREIGN KEY ("news_illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "editions" ADD CONSTRAINT "editions_subscription_left_illustration_id_media_id_fk" FOREIGN KEY ("subscription_left_illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "editions" ADD CONSTRAINT "editions_subscription_right_illustration_id_media_id_fk" FOREIGN KEY ("subscription_right_illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "editions_schedule_illustration_idx" ON "editions" USING btree ("schedule_illustration_id");
  CREATE INDEX "editions_partners_illustration_idx" ON "editions" USING btree ("partners_illustration_id");
  CREATE INDEX "editions_news_illustration_idx" ON "editions" USING btree ("news_illustration_id");
  CREATE INDEX "editions_subscription_subscription_left_illustration_idx" ON "editions" USING btree ("subscription_left_illustration_id");
  CREATE INDEX "editions_subscription_subscription_right_illustration_idx" ON "editions" USING btree ("subscription_right_illustration_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "editions" DROP CONSTRAINT "editions_schedule_illustration_id_media_id_fk";
  
  ALTER TABLE "editions" DROP CONSTRAINT "editions_partners_illustration_id_media_id_fk";
  
  ALTER TABLE "editions" DROP CONSTRAINT "editions_news_illustration_id_media_id_fk";
  
  ALTER TABLE "editions" DROP CONSTRAINT "editions_subscription_left_illustration_id_media_id_fk";
  
  ALTER TABLE "editions" DROP CONSTRAINT "editions_subscription_right_illustration_id_media_id_fk";
  
  DROP INDEX "editions_schedule_illustration_idx";
  DROP INDEX "editions_partners_illustration_idx";
  DROP INDEX "editions_news_illustration_idx";
  DROP INDEX "editions_subscription_subscription_left_illustration_idx";
  DROP INDEX "editions_subscription_subscription_right_illustration_idx";
  ALTER TABLE "editions" DROP COLUMN "schedule_illustration_id";
  ALTER TABLE "editions" DROP COLUMN "partners_illustration_id";
  ALTER TABLE "editions" DROP COLUMN "news_illustration_id";
  ALTER TABLE "editions" DROP COLUMN "subscription_left_illustration_id";
  ALTER TABLE "editions" DROP COLUMN "subscription_right_illustration_id";`)
}
