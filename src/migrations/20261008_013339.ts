import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "editions" DROP CONSTRAINT "editions_subscription_left_illustration_id_media_id_fk";
  
  ALTER TABLE "editions" DROP CONSTRAINT "editions_subscription_right_illustration_id_media_id_fk";
  
  DROP INDEX "editions_subscription_subscription_left_illustration_idx";
  DROP INDEX "editions_subscription_subscription_right_illustration_idx";
  ALTER TABLE "editions" DROP COLUMN "subscription_title";
  ALTER TABLE "editions" DROP COLUMN "subscription_cta_label";
  ALTER TABLE "editions" DROP COLUMN "subscription_left_illustration_id";
  ALTER TABLE "editions" DROP COLUMN "subscription_right_illustration_id";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "editions" ADD COLUMN "subscription_title" varchar DEFAULT 'Garanta sua participação na III Semana de Tecnologia';
  ALTER TABLE "editions" ADD COLUMN "subscription_cta_label" varchar DEFAULT 'Inscreva-se Agora';
  ALTER TABLE "editions" ADD COLUMN "subscription_left_illustration_id" integer;
  ALTER TABLE "editions" ADD COLUMN "subscription_right_illustration_id" integer;
  ALTER TABLE "editions" ADD CONSTRAINT "editions_subscription_left_illustration_id_media_id_fk" FOREIGN KEY ("subscription_left_illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "editions" ADD CONSTRAINT "editions_subscription_right_illustration_id_media_id_fk" FOREIGN KEY ("subscription_right_illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "editions_subscription_subscription_left_illustration_idx" ON "editions" USING btree ("subscription_left_illustration_id");
  CREATE INDEX "editions_subscription_subscription_right_illustration_idx" ON "editions" USING btree ("subscription_right_illustration_id");`)
}
