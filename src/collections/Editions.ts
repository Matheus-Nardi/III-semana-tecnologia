import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'

export const Editions: CollectionConfig = {
  slug: 'editions',
  labels: {
    singular: 'Edição',
    plural: 'Edições',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['year', 'slug', 'title', 'isDefault', 'updatedAt'],
    description: 'Gerencie as edições anuais do evento, temas visuais, programação, palestras e parceiros.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // Se esta edição está sendo marcada como default, desmarca as outras
        if (data?.isDefault) {
          try {
            await req.payload.update({
              collection: 'editions',
              where: {
                isDefault: {
                  equals: true,
                },
              },
              data: {
                isDefault: false,
              },
              req,
            })
          } catch {
            // Ignora se não houver outras ou em migrations
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        try {
          if (doc?.slug) {
            revalidateTag(`edition-${doc.slug}`)
          }
          revalidateTag('editions')
          revalidateTag('default-edition')
        } catch {
          // Ambiente sem next cache
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        try {
          if (doc?.slug) {
            revalidateTag(`edition-${doc.slug}`)
          }
          revalidateTag('editions')
          revalidateTag('default-edition')
        } catch {
          // Ambiente sem next cache
        }
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '📌 Informações Gerais',
          description: 'Identificação básica, ano, URLs e controle de edição ativa',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'year',
                  type: 'number',
                  required: true,
                  unique: true,
                  label: 'Ano da Edição',
                  admin: {
                    width: '30%',
                    description: 'Ex: 2025 ou 2026',
                  },
                },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  unique: true,
                  label: 'Slug da URL',
                  admin: {
                    width: '40%',
                    description: 'Caminho na barra de endereços (ex: 2025 para unitinscti.com.br/2025)',
                  },
                },
                {
                  name: 'isDefault',
                  type: 'checkbox',
                  defaultValue: false,
                  label: '⭐ Definir como Edição Ativa Principal',
                  admin: {
                    width: '30%',
                    description: 'Ao marcar, a rota raiz ( / ) redirecionará automaticamente para esta edição',
                  },
                },
              ],
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              defaultValue: 'III Semana de Ciência, Tecnologia e Inovação',
              label: 'Título Oficial Completo',
              admin: {
                description: 'Exibido no topo da página, metadados do Google e compartilhamento em redes sociais',
              },
            },
            {
              name: 'shortTitle',
              type: 'text',
              defaultValue: 'III Semana de Tecnologia',
              label: 'Título Curto (Header / Menu / Rodapé)',
              admin: {
                description: 'Versão concisa utilizada no cabeçalho e rodapé para economia de espaço',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'dates',
                  type: 'text',
                  defaultValue: '20 a 24 de outubro de 2025',
                  label: 'Período do Evento (Texto)',
                  admin: {
                    width: '50%',
                    description: 'Exibido nos cards e no cabeçalho (ex: 20 a 24 de outubro de 2025)',
                  },
                },
                {
                  name: 'registrationUrl',
                  type: 'text',
                  defaultValue: 'https://unitins.br',
                  label: 'Link Oficial de Inscrições',
                  admin: {
                    width: '50%',
                    description: 'URL de destino ao clicar no botão "Inscreva-se" do Header e do Hero',
                  },
                },
              ],
            },
          ],
        },
        {
          label: '🎨 Cores & Identidade Visual',
          description: 'Personalize a paleta de cores e logotipos exclusivos desta edição anual',
          fields: [
            {
              name: 'theme',
              type: 'group',
              label: 'Configurações Visuais do Tema',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'primaryColor',
                      type: 'text',
                      defaultValue: '#083D77',
                      label: 'Cor Primária (Hexadecimal)',
                      admin: {
                        width: '50%',
                        description: 'Cor dos fundos institucionais, cabeçalhos de tabela e botões principais (padrão: #083D77)',
                      },
                    },
                    {
                      name: 'accentColor',
                      type: 'text',
                      defaultValue: '#e2187f',
                      label: 'Cor de Destaque / Acento (Hexadecimal)',
                      admin: {
                        width: '50%',
                        description: 'Cor dos badges, palavras em destaque e botões de chamada (padrão: #e2187f)',
                      },
                    },
                  ],
                },
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: '🖼️ Logo Oficial desta Edição',
                  admin: {
                    description: 'Substitui a logo padrão exibida no cabeçalho e rodapé (formato recomendado: PNG ou SVG transparente)',
                  },
                },
                {
                  name: 'heroBanner',
                  type: 'upload',
                  relationTo: 'media',
                  label: '🖼️ Imagem de Compartilhamento (Open Graph / Banner)',
                  admin: {
                    description: 'Imagem de pré-visualização ao compartilhar o link no WhatsApp, LinkedIn e Twitter (1200x630px)',
                  },
                },
                {
                  name: 'heroBackground',
                  type: 'upload',
                  relationTo: 'media',
                  label: '🖼️ Grafismo / Textura de Fundo (Opcional)',
                  admin: {
                    description: 'Imagem de fundo aplicada suavemente na seção Hero do evento',
                  },
                },
              ],
            },
          ],
        },
        {
          label: '🎬 Carrossel Hero (Topo)',
          description: 'Gerencie as imagens e vídeos em rotação no carrossel de abertura da página',
          fields: [
            {
              name: 'heroSlides',
              type: 'array',
              label: 'Slides do Carrossel',
              labels: {
                singular: 'Slide',
                plural: 'Slides',
              },
              admin: {
                description: 'Adicione fotos em alta resolução ou vídeos MP4 curtos para o banner rotativo.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      options: [
                        { label: '🖼️ Imagem', value: 'image' },
                        { label: '🎥 Vídeo (MP4)', value: 'video' },
                      ],
                      defaultValue: 'image',
                      required: true,
                      label: 'Tipo de Mídia',
                      admin: {
                        width: '30%',
                      },
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Arquivo de Imagem (Upload)',
                      admin: {
                        width: '70%',
                        description: 'Faça upload direto da imagem (com preview visual)',
                        condition: (data, siblingData) => siblingData?.type === 'image',
                      },
                    },
                  ],
                },
                {
                  name: 'src',
                  type: 'text',
                  label: 'URL Externa (Alternativa / Link direto do vídeo MP4)',
                  admin: {
                    description: 'Ex: https://videos.pexels.com/... ou https://images.unsplash.com/...',
                  },
                },
                {
                  name: 'alt',
                  type: 'text',
                  label: 'Texto Descritivo / Acessibilidade (Alt Text)',
                  admin: {
                    description: 'Ex: "Auditório lotado durante a abertura da SCTI"',
                  },
                },
              ],
            },
          ],
        },
        {
          label: '📖 Sobre o Evento',
          description: 'Apresentação institucional, tema norteador do ano e ilustração temática',
          fields: [
            {
              name: 'about',
              type: 'group',
              label: 'Conteúdo da Seção Sobre',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'III Semana de Ciência, Tecnologia e Inovação da UNITINS',
                  label: 'Título Principal da Seção',
                },
                {
                  name: 'themeTitle',
                  type: 'text',
                  defaultValue: 'Planeta Água: a cultura oceânica para enfrentar as mudanças climáticas no meu território',
                  label: 'Subtítulo / Tema Oficial da Edição',
                  admin: {
                    description: 'Exibido em destaque como o tema norteador das palestras do ano',
                  },
                },
                {
                  name: 'body',
                  type: 'textarea',
                  label: 'Texto Descritivo Institucional',
                  admin: {
                    rows: 5,
                    description: 'Resumo com os objetivos, público-alvo e relevância da edição',
                  },
                },
                {
                  name: 'illustration',
                  type: 'upload',
                  relationTo: 'media',
                  label: '🖼️ Ilustração / Grafismo Temático (Globo / Mascote)',
                  admin: {
                    description: 'Imagem flutuante ao lado do texto da seção Sobre (ex: globo terrestre ou arte temática)',
                  },
                },
              ],
            },
          ],
        },
        {
          label: '📅 Grade de Programação',
          description: 'Estruturação completa dos dias, eixos temáticos/sub-eventos e palestras',
          fields: [
            {
              name: 'schedule',
              type: 'array',
              label: 'Dias da Programação',
              labels: {
                singular: 'Dia de Programação',
                plural: 'Dias de Programação',
              },
              admin: {
                description: 'Organize os dias do evento. Dentro de cada dia, cadastre os eixos temáticos (sub-eventos) e suas respectivas palestras e atividades.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'date',
                      type: 'text',
                      required: true,
                      label: 'Data do Dia',
                      admin: {
                        width: '30%',
                        description: 'Ex: 20/10 ou 20 a 24/10',
                      },
                    },
                    {
                      name: 'dayOfWeek',
                      type: 'text',
                      required: true,
                      label: 'Dia da Semana',
                      admin: {
                        width: '70%',
                        description: 'Ex: Segunda-feira ou Todos os dias',
                      },
                    },
                  ],
                },
                {
                  name: 'events',
                  type: 'array',
                  label: 'Eixos Temáticos / Sub-Eventos deste Dia',
                  labels: {
                    singular: 'Eixo / Sub-Evento',
                    plural: 'Eixos / Sub-Eventos',
                  },
                  admin: {
                    description: 'Ex: "Encontro Estadual das Licenciaturas", "XXXII Jornada de Iniciação Científica", "III SCTI", "Embrapa", etc.',
                  },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      label: 'Nome do Eixo / Sub-Evento',
                      admin: {
                        description: 'Ex: "Encontro Estadual das Licenciaturas da Unitins", "III SCTI", "III Circuito de Inovação"',
                      },
                    },
                    {
                      name: 'talks',
                      type: 'array',
                      label: 'Atividades e Palestras deste Eixo',
                      labels: {
                        singular: 'Atividade / Palestra',
                        plural: 'Atividades / Palestras',
                      },
                      fields: [
                        {
                          name: 'titulo',
                          type: 'text',
                          required: true,
                          label: 'Título da Atividade / Palestra / Oficina',
                        },
                        {
                          type: 'row',
                          fields: [
                            {
                              name: 'horario',
                              type: 'text',
                              required: true,
                              label: 'Horário de Início e Término',
                              admin: {
                                width: '50%',
                                description: 'Ex: 8h30 - 11h ou 14h - 17h',
                              },
                            },
                            {
                              name: 'local',
                              type: 'text',
                              required: true,
                              label: 'Localização / Sala / Auditório',
                              admin: {
                                width: '50%',
                                description: 'Ex: Auditório Planeta Água ou Sala 4 - Bloco B',
                              },
                            },
                          ],
                        },
                        {
                          type: 'row',
                          fields: [
                            {
                              name: 'palestrante',
                              type: 'text',
                              label: 'Nome do Palestrante / Facilitador',
                              admin: {
                                width: '50%',
                                description: 'Ex: Arthur Igreja ou Prof.ª Dr.ª Raquel Aparecida Marra',
                              },
                            },
                            {
                              name: 'speakerRef',
                              type: 'relationship',
                              relationTo: 'speakers',
                              label: 'Vincular Palestrante Cadastrado (Opcional)',
                              admin: {
                                width: '50%',
                                description: 'Conecta ao perfil detalhado com foto e biografia',
                              },
                            },
                          ],
                        },
                        {
                          type: 'row',
                          fields: [
                            {
                              name: 'vagas',
                              type: 'text',
                              label: 'Capacidade / Vagas',
                              admin: {
                                width: '50%',
                                description: 'Ex: 120 ou 60',
                              },
                            },
                            {
                              name: 'meetLink',
                              type: 'text',
                              label: 'Link da Transmissão Online (se houver)',
                              admin: {
                                width: '50%',
                                description: 'Ex: https://meet.google.com/... ou YouTube',
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: '🤝 Parceiros & Patrocinadores',
          description: 'Vincule as instituições e empresas apoiadoras desta edição',
          fields: [
            {
              name: 'partners',
              type: 'relationship',
              relationTo: 'partners',
              hasMany: true,
              label: 'Selecione os Parceiros Desta Edição',
              admin: {
                description: 'Escolha os parceiros cadastrados na coleção global de Parceiros para exibi-los nesta edição.',
              },
            },
          ],
        },
        {
          label: '❓ Perguntas Frequentes (FAQ)',
          description: 'Tire dúvidas dos participantes sobre certificados, inscrições e locais',
          fields: [
            {
              name: 'faqs',
              type: 'array',
              label: 'Lista de Perguntas Frequentes',
              labels: {
                singular: 'Pergunta Frequente',
                plural: 'Perguntas Frequentes',
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  label: 'Pergunta / Dúvida',
                  admin: {
                    description: 'Ex: "Como recebo o certificado de participação?"',
                  },
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  required: true,
                  label: 'Resposta Explicativa',
                  admin: {
                    rows: 3,
                  },
                },
              ],
            },
          ],
        },
        {
          label: '🚀 Chamada Final (CTA)',
          description: 'Configure a mensagem do banner de inscrição no rodapé da página',
          fields: [
            {
              name: 'subscription',
              type: 'group',
              label: 'Banner de Inscrição Final',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'Garanta sua participação na III Semana de Tecnologia',
                  label: 'Título de Chamada',
                },
                {
                  name: 'ctaLabel',
                  type: 'text',
                  defaultValue: 'Inscreva-se Agora',
                  label: 'Texto do Botão de Inscrição',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
