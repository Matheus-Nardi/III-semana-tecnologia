import type {
  CollectionConfig,
  FieldHook,
  CollectionBeforeDeleteHook,
  CollectionBeforeChangeHook,
} from 'payload'
import {
  isAdmin,
  isAdminOrSelf,
  isAdminField,
  ROLE_OPTIONS,
} from '../access/roles'

const forceFirstUserAdmin: FieldHook = async ({ req, operation, value }) => {
  if (operation === 'create') {
    try {
      const { totalDocs } = await req.payload.count({
        collection: 'users',
        req,
      })
      if (totalDocs === 0) {
        return 'admin'
      }
    } catch {
      // Se a contagem falhar por tabela vazia/migração, preserva o valor
    }
  }
  return value || 'editor'
}

const preventDeletingSelfOrLastAdmin: CollectionBeforeDeleteHook = async ({ req, id }) => {
  if (req.user && String(req.user.id) === String(id)) {
    throw new Error('Operação bloqueada: você não pode excluir a sua própria conta.')
  }

  try {
    const userToDelete = await req.payload.findByID({
      collection: 'users',
      id,
      req,
    })

    if (userToDelete && (userToDelete as { role?: string }).role === 'admin') {
      const { totalDocs: adminCount } = await req.payload.count({
        collection: 'users',
        where: {
          role: { equals: 'admin' },
        },
        req,
      })

      if (adminCount <= 1) {
        throw new Error('Operação bloqueada: não é permitido excluir o único administrador ativo do sistema.')
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Operação bloqueada:')) {
      throw error
    }
  }
}

const preventDemotingLastAdmin: CollectionBeforeChangeHook = async ({
  req,
  data,
  originalDoc,
  operation,
}) => {
  if (
    operation === 'update' &&
    originalDoc?.role === 'admin' &&
    data?.role &&
    data.role !== 'admin'
  ) {
    try {
      const { totalDocs: adminCount } = await req.payload.count({
        collection: 'users',
        where: {
          role: { equals: 'admin' },
        },
        req,
      })

      if (adminCount <= 1) {
        throw new Error('Operação bloqueada: não é permitido alterar o perfil do único administrador ativo do sistema.')
      }
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('Operação bloqueada:')) {
        throw error
      }
    }
  }
  return data
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Usuário',
    plural: 'Usuários do Painel',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'updatedAt'],
    description: 'Gerencie os usuários e perfis de permissão no painel administrativo.',
    hidden: ({ user }) => (user as { role?: string } | undefined)?.role !== 'admin',
  },
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
    unlock: isAdmin,
  },
  hooks: {
    beforeDelete: [preventDeletingSelfOrLastAdmin],
    beforeChange: [preventDemotingLastAdmin],
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
      required: true,
      admin: {
        description: 'Nome completo do usuário',
      },
    },
    {
      name: 'role',
      type: 'select',
      label: 'Perfil de Acesso',
      options: [...ROLE_OPTIONS],
      defaultValue: 'editor',
      required: true,
      saveToJWT: true,
      access: {
        create: isAdminField,
        update: isAdminField,
      },
      admin: {
        position: 'sidebar',
        description: 'Administradores têm controle total; editores gerenciam apenas o conteúdo do evento.',
      },
      hooks: {
        beforeValidate: [forceFirstUserAdmin],
      },
    },
  ],
}
