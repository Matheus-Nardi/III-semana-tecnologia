import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_editions_schedule_day_of_week" AS ENUM('Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo', 'Todos os dias', 'A definir');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    UPDATE "editions_schedule" 
    SET "day_of_week" = 'A definir' 
    WHERE "day_of_week" NOT IN ('Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo', 'Todos os dias', 'A definir');

    ALTER TABLE "editions_schedule" 
    ALTER COLUMN "day_of_week" SET DATA TYPE "public"."enum_editions_schedule_day_of_week" 
    USING "day_of_week"::"public"."enum_editions_schedule_day_of_week";

    ALTER TABLE "editions_schedule_events" ADD COLUMN IF NOT EXISTS "color" varchar DEFAULT '#083D77';
    ALTER TABLE "editions_schedule_events_talks" ADD COLUMN IF NOT EXISTS "is_online" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "editions_schedule" ALTER COLUMN "day_of_week" SET DATA TYPE varchar;
    ALTER TABLE "editions_schedule_events" DROP COLUMN IF EXISTS "color";
    ALTER TABLE "editions_schedule_events_talks" DROP COLUMN IF EXISTS "is_online";
  `)
}
