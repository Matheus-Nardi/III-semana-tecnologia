import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Speakers } from './collections/Speakers'
import { Partners } from './collections/Partners'
import { Editions } from './collections/Editions'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isS3Configured =
  process.env.S3_ENABLED === 'true' &&
  Boolean(
    process.env.S3_BUCKET &&
    process.env.S3_ENDPOINT &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY &&
    process.env.S3_ACCESS_KEY_ID !== 'your-access-key' &&
    process.env.S3_ACCESS_KEY_ID.length > 5
  )

const allowedDomains = [
  process.env.NEXT_PUBLIC_SERVER_URL,
  'https://unitinscti.com.br',
  'https://www.unitinscti.com.br',
  'https://admin.unitinscti.com.br',
  'http://168.138.247.203',
  'https://168.138.247.203',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean) as string[]

export default buildConfig({
  serverURL: '',
  cors: ['*'],
  csrf: [],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Speakers, Partners, Editions],
  editor: lexicalEditor(),
  sharp,
  secret: process.env.PAYLOAD_SECRET || 'unitins-semana-tecnologia-payload-secret-key-2025-2026',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URI ||
        process.env.POSTGRES_URL ||
        'postgresql://app:password@localhost:5432/semana_tecnologia',
    },
    prodMigrations: migrations,
  }),
  plugins: [
    ...(isS3Configured
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: process.env.S3_BUCKET || '',
            config: {
              endpoint: process.env.S3_ENDPOINT || '',
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
              },
              region: process.env.S3_REGION || 'us-east-005',
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
  onInit: async (payload) => {
    try {
      let attempts = 0
      let seeded = false
      while (attempts < 5 && !seeded) {
        try {
          const existingEditions = await payload.find({
            collection: 'editions',
            limit: 1,
          })
          if (existingEditions.totalDocs === 0) {
            payload.logger.info('[Auto-Seed] Banco de dados vazio. Executando seed automático da edição 2025...')
            const { seed } = await import('./scripts/seed')
            await seed(payload)
          }
          seeded = true
        } catch {
          attempts++
          if (attempts >= 5) {
            payload.logger.warn('[Auto-Seed] Tentativas de auto-seed esgotadas. O banco pode ser inicializado via "npm run seed".')
          } else {
            await new Promise((res) => setTimeout(res, 2000))
          }
        }
      }
    } catch (e) {
      payload.logger.warn(`[Auto-Seed] Aviso durante verificação de seed: ${e}`)
    }
  },
})
