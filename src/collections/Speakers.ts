import type { CollectionConfig } from 'payload'

export const Speakers: CollectionConfig = {
  slug: 'speakers',
  labels: {
    singular: 'Palestrante',
    plural: 'Palestrantes',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'institution', 'updatedAt'],
    description: 'Banco global de palestrantes, oficineiros, pesquisadores e convidados.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nome Completo',
          admin: {
            width: '50%',
            description: 'Ex: Dra. Maria Silva',
          },
        },
        {
          name: 'role',
          type: 'text',
          label: 'Cargo / Titulação',
          admin: {
            width: '50%',
            description: 'Ex: Especialista em IA / Professora Doutora',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'institution',
          type: 'text',
          label: 'Instituição / Empresa Vinculada',
          admin: {
            width: '50%',
            description: 'Ex: UNITINS / MCTI / Google',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link Profissional (LinkedIn / Lattes)',
          admin: {
            width: '50%',
            description: 'URL para o perfil acadêmico ou rede social',
          },
        },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: '🖼️ Foto de Perfil (Upload com Preview)',
      admin: {
        description: 'Foto do palestrante para exibição nos cards da programação.',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Mini-Biografia / Resumo Curricular',
      admin: {
        rows: 3,
        description: 'Breve histórico profissional e acadêmico do palestrante.',
      },
    },
  ],
}
