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
  auth: {
    cookies: {
      secure: process.env.COOKIE_SECURE === 'true',
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
