import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "payload_mcp_api_keys" (
      "id" serial PRIMARY KEY NOT NULL,
      "user_id" integer NOT NULL,
      "label" varchar,
      "description" varchar,
      "editions_find" boolean DEFAULT false,
      "editions_create" boolean DEFAULT false,
      "editions_update" boolean DEFAULT false,
      "editions_delete" boolean DEFAULT false,
      "speakers_find" boolean DEFAULT false,
      "speakers_create" boolean DEFAULT false,
      "speakers_update" boolean DEFAULT false,
      "speakers_delete" boolean DEFAULT false,
      "partners_find" boolean DEFAULT false,
      "partners_create" boolean DEFAULT false,
      "partners_update" boolean DEFAULT false,
      "partners_delete" boolean DEFAULT false,
      "media_find" boolean DEFAULT false,
      "media_create" boolean DEFAULT false,
      "media_update" boolean DEFAULT false,
      "users_find" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "enable_a_p_i_key" boolean,
      "api_key" varchar,
      "api_key_index" varchar
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "payload_mcp_api_keys_id" integer;
    ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "payload_mcp_api_keys_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_mcp_api_keys" ADD CONSTRAINT "payload_mcp_api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "payload_mcp_api_keys_user_idx" ON "payload_mcp_api_keys" USING btree ("user_id");
    CREATE INDEX IF NOT EXISTS "payload_mcp_api_keys_updated_at_idx" ON "payload_mcp_api_keys" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "payload_mcp_api_keys_created_at_idx" ON "payload_mcp_api_keys" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payload_mcp_api_keys_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_mcp_api_keys_id");
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_payload_mcp_api_keys_id_idx" ON "payload_preferences_rels" USING btree ("payload_mcp_api_keys_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_payload_mcp_api_keys_fk";
    ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT IF EXISTS "payload_preferences_rels_payload_mcp_api_keys_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_payload_mcp_api_keys_id_idx";
    DROP INDEX IF EXISTS "payload_preferences_rels_payload_mcp_api_keys_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_mcp_api_keys_id";
    ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "payload_mcp_api_keys_id";
    DROP TABLE IF EXISTS "payload_mcp_api_keys" CASCADE;
  `)
}
