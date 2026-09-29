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

    UPDATE "editions_schedule_events" SET "color" = '#2563EB' WHERE "name" ILIKE '%licenciatura%';
    UPDATE "editions_schedule_events" SET "color" = '#059669' WHERE "name" ILIKE '%iniciação científica%' OR "name" ILIKE '%jic%';
    UPDATE "editions_schedule_events" SET "color" = '#15803D' WHERE "name" ILIKE '%embrapa%';
    UPDATE "editions_schedule_events" SET "color" = '#4F46E5' WHERE "name" ILIKE '%direitos humanos%' OR "name" ILIKE '%fórum de gestão dos grupos de pesquisa%';
    UPDATE "editions_schedule_events" SET "color" = '#E11D48' WHERE "name" ILIKE '%cultural%' OR "name" ILIKE '%culinário%';
    UPDATE "editions_schedule_events" SET "color" = '#DC2626' WHERE "name" = 'III SCTI';
    UPDATE "editions_schedule_events" SET "color" = '#65A30D' WHERE "name" ILIKE '%agrária%' OR "name" ILIKE '%agronômica%' OR "name" ILIKE '%agro%';
    UPDATE "editions_schedule_events" SET "color" = '#0284C7' WHERE "name" ILIKE '%colóquio interdisciplinar%' OR "name" ILIKE '%distância%';
    UPDATE "editions_schedule_events" SET "color" = '#9333EA' WHERE "name" ILIKE '%circuito de inovação%';
    UPDATE "editions_schedule_events" SET "color" = '#B45309' WHERE "name" ILIKE '%fapt%';
    UPDATE "editions_schedule_events" SET "color" = '#C026D3' WHERE "name" ILIKE '%gestão pública%';
    UPDATE "editions_schedule_events" SET "color" = '#0891B2' WHERE "name" ILIKE '%saúde%' OR "name" = 'I Fórum de Gestão dos Grupos de Pesquisa';
    UPDATE "editions_schedule_events" SET "color" = '#EA580C' WHERE "name" ILIKE '%extensão%' OR "name" ILIKE '%ciências da vida%';
    UPDATE "editions_schedule_events" SET "color" = '#0D9488' WHERE "name" ILIKE '%climática%' OR "name" ILIKE '%climáticas%';
    UPDATE "editions_schedule_events" SET "color" = '#475569' WHERE "name" ILIKE '%direito%';
    UPDATE "editions_schedule_events" SET "color" = '#DB2777' WHERE "name" ILIKE '%sistemas de informação%' OR "name" ILIKE '%si e tads%';
    UPDATE "editions_schedule_events" SET "color" = '#CA8A04' WHERE "name" ILIKE '%revista%';
    UPDATE "editions_schedule_events" SET "color" = '#D97706' WHERE "name" ILIKE '%palestra magna%';
    UPDATE "editions_schedule_events" SET "color" = '#BE185D' WHERE "name" ILIKE '%mulheres%' OR "name" ILIKE '%delas%';
    UPDATE "editions_schedule_events" SET "color" = '#059669' WHERE "name" ILIKE '%pedagogia%';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "editions_schedule" ALTER COLUMN "day_of_week" SET DATA TYPE varchar;
    ALTER TABLE "editions_schedule_events" DROP COLUMN IF EXISTS "color";
    ALTER TABLE "editions_schedule_events_talks" DROP COLUMN IF EXISTS "is_online";
  `)
}
