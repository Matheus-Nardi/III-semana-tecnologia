import type { Access, FieldAccess } from 'payload'

export type Role = 'admin' | 'editor'

export const ROLE_OPTIONS = [
  { label: 'Administrador (acesso total)', value: 'admin' },
  { label: 'Editor (gerencia conteúdo do evento)', value: 'editor' },
] as const

interface UserWithRole {
  id?: number | string
  role?: Role | null
}

export const isAdmin: Access = ({ req: { user } }) => {
  const typedUser = user as unknown as UserWithRole | null | undefined
  return typedUser?.role === 'admin'
}

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  const typedUser = user as unknown as UserWithRole | null | undefined
  return typedUser?.role === 'admin' || typedUser?.role === 'editor'
}

// Admin acessa todos; usuários comuns acessam apenas o próprio registro
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  const typedUser = user as unknown as UserWithRole
  if (typedUser?.role === 'admin') return true

  return {
    id: {
      equals: typedUser.id,
    },
  }
}

export const isAdminField: FieldAccess = ({ req: { user } }) => {
  const typedUser = user as unknown as UserWithRole | null | undefined
  return typedUser?.role === 'admin'
}
