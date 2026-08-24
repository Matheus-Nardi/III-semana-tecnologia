import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: {
    singular: 'Parceiro / Patrocinador',
    plural: 'Parceiros & Patrocinadores',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'order', 'updatedAt'],
    description: 'Cadastro global de instituições parceiras, órgãos de fomento, apoiadores e patrocinadores do evento.',
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
          label: 'Nome da Instituição ou Empresa',
          admin: {
            width: '60%',
            description: 'Ex: MCTI, Governo do Estado do Tocantins, Sebrae',
          },
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: '🏛️ Realização', value: 'realizacao' },
            { label: '🤝 Correalização', value: 'correalizacao' },
            { label: '💎 Patrocínio Master', value: 'patrocinio-master' },
            { label: '⭐ Patrocínio', value: 'patrocinio' },
            { label: '🎓 Apoio Institucional', value: 'apoio-institucional' },
            { label: '📋 Apoio Geral', value: 'apoio' },
          ],
          defaultValue: 'apoio',
          required: true,
          label: 'Categoria / Tier de Patrocínio',
          admin: {
            width: '40%',
            description: 'Define a ordem e o agrupamento visual no grid de parceiros.',
          },
        },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: '🖼️ Arquivo da Logo (Upload com Preview)',
      admin: {
        description: 'Faça upload da imagem da logo com fundo transparente (PNG ou SVG recomendado).',
      },
    },
    {
      name: 'logoUrl',
      type: 'text',
      label: 'URL da Logo (Fallback / Link Direto)',
      admin: {
        description: 'Caminho estático ou link externo alternativo (ex: /logos/logo-snct.png).',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'href',
          type: 'text',
          label: 'Link para o Site do Parceiro',
          admin: {
            width: '70%',
            description: 'URL de destino ao clicar no logo (ex: https://www.to.gov.br/)',
          },
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          label: 'Ordem de Prioridade',
          admin: {
            width: '30%',
            description: 'Menor número aparece primeiro no grid (ex: 1, 2, 3...)',
          },
        },
      ],
    },
  ],
}
