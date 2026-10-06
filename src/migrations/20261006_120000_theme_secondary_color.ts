import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "editions" ADD COLUMN IF NOT EXISTS "theme_secondary_color" varchar DEFAULT '#E3F5FF';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "editions" DROP COLUMN IF EXISTS "theme_secondary_color";
  `)
}
