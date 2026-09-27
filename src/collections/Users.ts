import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Usuário Administrador',
    plural: 'Usuários do Painel',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'updatedAt'],
    description: 'Gerencie os usuários com permissão de acesso e edição no painel administrativo.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
    unlock: ({ req: { user } }) => Boolean(user),
  },
  auth: {
    cookies: {
      secure: process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true',
      sameSite: 'Lax',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome Completo',
      admin: {
        description: 'Nome do administrador',
      },
    },
  ],
}
