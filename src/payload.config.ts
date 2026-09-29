import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { pt } from '@payloadcms/translations/languages/pt'
import { en } from '@payloadcms/translations/languages/en'
import { mcpPlugin } from '@payloadcms/plugin-mcp'

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
  csrf: allowedDomains,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    supportedLanguages: { pt, en },
    fallbackLanguage: 'pt',
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
    mcpPlugin({
      collections: {
        editions: {
          enabled: true,
          description:
            'Edições anuais da Semana de Ciência e Tecnologia da UNITINS, contendo a programação oficial, trilhas, atividades, palestras e configurações do evento.',
        },
        speakers: {
          enabled: true,
          description:
            'Banco de palestrantes, oficineiros, pesquisadores e convidados com bio, vínculos institucionais e contatos.',
        },
        partners: {
          enabled: true,
          description:
            'Parceiros, órgãos de fomento, apoiadores e patrocinadores do evento categorizados por tier.',
        },
        media: {
          enabled: {
            find: true,
            create: true,
            update: true,
            delete: false,
          },
          description: 'Arquivos de mídia, fotos de palestrantes e logos.',
        },
        users: {
          enabled: {
            find: true,
            create: false,
            update: false,
            delete: false,
          },
          description: 'Usuários administradores cadastrados com acesso ao painel administrativo.',
        },
      },
      overrideApiKeyCollection: (collection) => {
        collection.admin = {
          ...collection.admin,
          hidden: true,
        }
        collection.access = {
          create: ({ req }) => Boolean(req.user),
          delete: ({ req }) => Boolean(req.user),
          read: ({ req }) => Boolean(req.user),
          unlock: ({ req }) => Boolean(req.user),
          update: ({ req }) => Boolean(req.user),
        }
        const userField = collection.fields.find(
          (field) => 'name' in field && field.name === 'user',
        )
        if (userField) {
          (userField as any).access = {
            create: ({ req }: any) => Boolean(req.user),
            update: ({ req }: any) => Boolean(req.user),
          }
        }
        return collection
      },
      overrideAuth: async (req, getDefaultMcpAccessSettings) => {
        const authorization = req.headers.get('Authorization')
        const token = authorization?.startsWith('Bearer ')
          ? authorization.replace('Bearer ', '').trim()
          : null

        const envApiKey = process.env.PAYLOAD_MCP_API_KEY
        if (envApiKey && token && token === envApiKey) {
          const firstUser = await req.payload.find({
            collection: 'users',
            limit: 1,
            pagination: false,
          })
          const userDoc = firstUser.docs[0] || { id: 1, collection: 'users' }
          return {
            user: {
              ...userDoc,
              collection: 'users',
              _strategy: 'mcp-api-key',
            },
            editions: { find: true, create: true, update: true, delete: true },
            speakers: { find: true, create: true, update: true, delete: true },
            partners: { find: true, create: true, update: true, delete: true },
            media: { find: true, create: true, update: true, delete: false },
            users: { find: true, create: false, update: false, delete: false },
          } as any
        }

        return await getDefaultMcpAccessSettings()
      },
    }),
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
