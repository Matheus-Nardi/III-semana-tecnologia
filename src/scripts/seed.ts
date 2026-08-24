import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import scheduleData from '../data/schedule.json'
import fs from 'fs'
import path from 'path'

const dateMapping: Record<string, { date: string; dayOfWeek: string; eventName: string }> = {
  '2025-10-20': { date: '20/10', dayOfWeek: 'Segunda-feira', eventName: 'Abertura Oficial e Licenciaturas' },
  '2025-10-21': { date: '21/10', dayOfWeek: 'Terça-feira', eventName: 'Agrárias e Inovação' },
  '2025-10-22': { date: '22/10', dayOfWeek: 'Quarta-feira', eventName: 'Circuito de Inovação e Grupos de Pesquisa' },
  '2025-10-23': { date: '23/10', dayOfWeek: 'Quinta-feira', eventName: 'Direito, Tecnologia e Clima' },
  '2025-10-24': { date: '24/10', dayOfWeek: 'Sexta-feira', eventName: 'Sistemas de Informação e Encerramento' },
  'Todos os dias': { date: '20 a 24/10', dayOfWeek: 'Todos os dias', eventName: 'Exposições e Mostras Permanentes' },
}

/**
 * Importa um arquivo estático da pasta public/ para a coleção de mídias do Payload.
 * Se a mídia já existir (por filename), retorna o ID existente sem duplicar.
 */
async function uploadLocalMedia(payload: Payload, relativePath: string, alt: string): Promise<number | null> {
  const fullPath = path.resolve(process.cwd(), 'public', relativePath)
  if (!fs.existsSync(fullPath)) {
    console.warn(`[Seed Media] Arquivo não encontrado: ${fullPath}`)
    return null
  }

  const fileBuffer = fs.readFileSync(fullPath)
  const filename = path.basename(fullPath)
  const ext = path.extname(filename).toLowerCase()
  const mimeType =
    ext === '.png' ? 'image/png'
    : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
    : ext === '.svg' ? 'image/svg+xml'
    : ext === '.webp' ? 'image/webp'
    : 'application/octet-stream'

  // Verifica se a mídia já foi importada para evitar duplicatas
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  if (existing.totalDocs > 0 && existing.docs[0]) {
    console.log(`[Seed Media] Já existente, reutilizando: ${filename}`)
    return existing.docs[0].id as number
  }

  try {
    const mediaDoc = await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: fileBuffer,
        mimetype: mimeType,
        name: filename,
        size: fileBuffer.length,
      },
    })
    console.log(`[Seed Media] Importado: ${filename} (ID: ${mediaDoc.id})`)
    return mediaDoc.id as number
  } catch (err) {
    console.warn(`[Seed Media] Erro ao importar ${filename}:`, err)
    return null
  }
}

/**
 * Cria um speaker no Payload se não existir ainda (lookup por nome exato).
 * Retorna o ID do speaker criado ou já existente.
 */
async function upsertSpeaker(
  payload: Payload,
  data: { name: string; role?: string; institution?: string },
): Promise<number | null> {
  const existing = await payload.find({
    collection: 'speakers',
    where: { name: { equals: data.name } },
    limit: 1,
  })
  if (existing.totalDocs > 0 && existing.docs[0]) {
    return existing.docs[0].id as number
  }
  try {
    const doc = await payload.create({ collection: 'speakers', data })
    return doc.id as number
  } catch {
    return null
  }
}

export async function seed(existingPayload?: Payload) {
  console.log('[Seed] Conectando ao Payload CMS...')
  const payload = existingPayload || (await getPayload({ config }))

  // ──────────────────────────────────────────────────
  // 1. Usuário Administrador Inicial
  // ──────────────────────────────────────────────────
  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (existingUsers.totalDocs === 0) {
    const email = process.env.ADMIN_INITIAL_EMAIL || 'admin@unitins.br'
    const password = process.env.ADMIN_INITIAL_PASSWORD || 'Unitins@2025'
    console.log(`[Seed] Criando usuário administrador (${email})...`)
    await payload.create({
      collection: 'users',
      data: { email, password, name: 'Administrador UNITINS' },
    })
  }

  // ──────────────────────────────────────────────────
  // 2. Ingestão de Mídias Estáticas (public/)
  // ──────────────────────────────────────────────────
  console.log('[Seed] Importando mídias estáticas para o armazenamento do Payload...')
  const govToMediaId    = await uploadLocalMedia(payload, 'logos/logo-gov-to.png',          'Governo do Estado do Tocantins')
  const mctiMediaId     = await uploadLocalMedia(payload, 'logos/logo-mcti.png',             'Ministério da Ciência, Tecnologia e Inovação')
  const snctMediaId     = await uploadLocalMedia(payload, 'logos/logo-snct.png',             'Semana Nacional de Ciência e Tecnologia (SNCT)')
  const fndctMediaId    = await uploadLocalMedia(payload, 'logos/logo-fndct.png',            'FNDCT')
  const capesMediaId    = await uploadLocalMedia(payload, 'logos/logo-capes.png',            'CAPES')
  const cnpqMediaId     = await uploadLocalMedia(payload, 'logos/logo-cnpq.png',             'CNPq')
  const faptMediaId     = await uploadLocalMedia(payload, 'logos/logo-fapt.png',             'Fundação de Amparo à Pesquisa do Tocantins (FAPT)')
  const popMediaId      = await uploadLocalMedia(payload, 'logos/logo-pop.png',              'POP Ciência')
  const uabMediaId      = await uploadLocalMedia(payload, 'logos/logo-uab.png',              'Universidade Aberta do Brasil (UAB)')
  const embrapaMediaId  = await uploadLocalMedia(payload, 'logos/logo-embrapa.png',          'Embrapa')
  const sebraeMediaId   = await uploadLocalMedia(payload, 'logos/logo-sebrae.png',           'Sebrae Tocantins')
  const unitinsMediaId  = await uploadLocalMedia(payload, 'logos/logo-unitins.png',          'Universidade Estadual do Tocantins (UNITINS)')
  await uploadLocalMedia(payload, 'logos/logo-unitins-quadrada.png', 'Logo UNITINS Quadrada')
  await uploadLocalMedia(payload, 'logos/logo-snct-recortada.png',   'Logo SNCT Recortada')
  const globoMediaId    = await uploadLocalMedia(payload, 'ilustracoes/globo.png',           'Ilustração do Globo - Planeta Água')

  // ──────────────────────────────────────────────────
  // 3. Guard: não recria edições existentes
  // ──────────────────────────────────────────────────
  const existingEditions = await payload.find({ collection: 'editions', limit: 1 })
  if (existingEditions.totalDocs > 0) {
    console.log('[Seed] Edições já existentes. Preservando banco de dados.')
    return
  }

  // ──────────────────────────────────────────────────
  // 4. Palestrantes Principais da Edição 2025
  //    Extraídos do schedule.json. Cadastrados como perfis
  //    na coleção global `speakers` para futura edição com foto e bio.
  // ──────────────────────────────────────────────────
  console.log('[Seed] Cadastrando palestrantes da edição 2025...')
  const speakers2025 = [
    { name: 'Arthur Igreja',            role: 'Palestrante Magna',    institution: '' },
    { name: 'Sandro Magaldi',           role: 'Palestrante',          institution: '' },
    { name: 'Carlos César',             role: 'Palestrante',          institution: '' },
    { name: 'Eliane Archangelo',        role: 'Palestrante',          institution: '' },
    { name: 'Fátima Casarin',           role: 'Consultora',           institution: 'Poli / UFRJ' },
    { name: 'Heder Soares',             role: 'Pesquisador',          institution: 'INPE' },
    { name: 'Marco Giongo',             role: 'Palestrante',          institution: 'Semarh-TO' },
    { name: 'Marli Santos',             role: 'Palestrante',          institution: 'Semarh-TO' },
    { name: 'Rodrigo Veras',            role: 'Palestrante',          institution: '' },
    { name: 'Luiz Henrique Froes Michelin', role: 'Palestrante',     institution: '' },
    { name: 'Alexandro Billy',          role: 'Palestrante',          institution: '' },
    { name: 'Frederico Borba Diniz',    role: 'Palestrante',          institution: '' },
    { name: 'Helcids de Sá Reis',       role: 'Palestrante',          institution: '' },
    { name: 'Pedro Henrique Rezende',   role: 'Palestrante',          institution: '' },
    { name: 'Denilsom Bezerra Costa',   role: 'Palestrante',          institution: '' },
    { name: 'Sérgio Armando Castro Souza Liocádio', role: 'Palestrante', institution: '' },
    { name: 'Lucas Mattos',             role: 'Palestrante',          institution: 'FIT - Instituto de Tecnologia' },
    { name: 'Cleovan Barbosa',          role: 'Palestrante',          institution: '' },
    { name: 'Felipe Michetti',          role: 'Analista',             institution: 'STJ-TO' },
    { name: 'Harly Carreiro',           role: 'Analista',             institution: 'TJTO' },
    { name: 'Rennan Thamay',            role: 'Advogado e Professor', institution: '' },
    { name: 'Joelma Feitosa Modesto',   role: 'Professora',           institution: 'UNITINS' },
    { name: 'Sandra Negri',             role: 'Professora',           institution: 'Universidade Federal do Mato Grosso' },
    { name: 'Prof. Dr. Alexandre Dias Carreiro Santos Serra', role: 'Professor Doutor', institution: 'Universidade de Coimbra - Portugal' },
    { name: 'Prof. Dr. Jofre Jacob da Silva Freitas', role: 'Professor Doutor', institution: 'Universidade Estadual do Pará' },
    { name: 'Prof. Dr. Leonardo Miranda Frossard', role: 'Professor Doutor', institution: 'Universidade Federal de Juiz de Fora' },
    { name: 'Raquel Aparecida Marra da Madeira Freitas', role: 'Professora Doutora', institution: 'PUC GO' },
    { name: 'Gustavo Fagundes',         role: 'Professor',            institution: 'UNITINS - Serviço Social' },
    { name: 'Erasto Fortes Mendonça',   role: 'Coordenador',          institution: 'MEC' },
    { name: 'Luiz Eduardo Maia',        role: 'Instrutor',            institution: 'SENAI' },
    { name: 'Cristovam Liberato',       role: 'Especialista',         institution: 'Player Contabilidade' },
    { name: 'Ministrante: Cibelle Christine',       role: 'Ministrante', institution: '' },
    { name: 'Ministrante: Diony Alves Reis',        role: 'Ministrante', institution: '' },
    { name: 'Ministrante: Gilberto Fernandes de Melo Junior', role: 'Ministrante', institution: '' },
    { name: 'Ministrante: Giovani Menegucci Martin', role: 'Ministrante', institution: '' },
    { name: 'Ministrante: Gustavo Marquardt',       role: 'Ministrante', institution: '' },
    { name: 'Ministrante: Inocencio Oliveira',      role: 'Ministrante', institution: '' },
    { name: 'Ministrante: Mayke Rocha',             role: 'Ministrante', institution: '' },
    { name: 'Ministrante: Mirian das Mercês',       role: 'Ministrante', institution: '' },
  ]

  // Mapa de nome -> ID para vincular nos talks
  const speakerIdByName: Record<string, number> = {}
  for (const s of speakers2025) {
    const id = await upsertSpeaker(payload, s)
    if (id) speakerIdByName[s.name] = id
  }

  // ──────────────────────────────────────────────────
  // 5. Parceiros vinculados às mídias importadas
  // ──────────────────────────────────────────────────
  console.log('[Seed] Populando parceiros...')
  const initialPartners = [
    { name: 'Governo do Estado do Tocantins',               category: 'realizacao'         as const, logo: govToMediaId,   logoUrl: '/logos/logo-gov-to.png',   href: 'https://www.to.gov.br/',                                           order: 1 },
    { name: 'MCTI - Ministério da Ciência, Tecnologia e Inovação', category: 'realizacao'  as const, logo: mctiMediaId,    logoUrl: '/logos/logo-mcti.png',     href: 'https://www.gov.br/mcti/pt-br',                                    order: 2 },
    { name: 'SNCT - Semana Nacional de Ciência e Tecnologia',       category: 'correalizacao' as const, logo: snctMediaId, logoUrl: '/logos/logo-snct.png',     href: 'https://semanact.mcti.gov.br/',                                    order: 3 },
    { name: 'FNDCT',                                        category: 'apoio-institucional' as const, logo: fndctMediaId,  logoUrl: '/logos/logo-fndct.png',    href: 'https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/fndct',             order: 4 },
    { name: 'CAPES',                                        category: 'apoio-institucional' as const, logo: capesMediaId,  logoUrl: '/logos/logo-capes.png',    href: 'https://www.gov.br/capes/pt-br',                                   order: 5 },
    { name: 'CNPq',                                         category: 'apoio-institucional' as const, logo: cnpqMediaId,   logoUrl: '/logos/logo-cnpq.png',     href: 'https://www.gov.br/cnpq/pt-br',                                    order: 6 },
    { name: 'FAPT - Fundação de Amparo à Pesquisa do Tocantins', category: 'apoio-institucional' as const, logo: faptMediaId, logoUrl: '/logos/logo-fapt.png', href: 'https://www.to.gov.br/fapt',                                       order: 7 },
    { name: 'POP Ciência',                                  category: 'apoio'               as const, logo: popMediaId,    logoUrl: '/logos/logo-pop.png',      href: 'https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/popciencia',        order: 8 },
    { name: 'UAB - Universidade Aberta do Brasil',          category: 'apoio'               as const, logo: uabMediaId,    logoUrl: '/logos/logo-uab.png',      href: 'https://www.gov.br/capes/pt-br',                                   order: 9 },
    { name: 'Embrapa',                                      category: 'apoio'               as const, logo: embrapaMediaId, logoUrl: '/logos/logo-embrapa.png', href: 'https://www.embrapa.br/',                                          order: 10 },
    { name: 'Sebrae Tocantins',                             category: 'apoio'               as const, logo: sebraeMediaId, logoUrl: '/logos/logo-sebrae.png',   href: 'https://sebrae.com.br/sites/PortalSebrae/ufs/to?codUf=24',         order: 11 },
  ]

  const partnerIds: number[] = []
  for (const partnerData of initialPartners) {
    const created = await payload.create({ collection: 'partners', data: partnerData })
    partnerIds.push(created.id as number)
  }

  // ──────────────────────────────────────────────────
  // 6. Grade de Programação com speakerRef vinculado
  //    Estratégia: para cada talk, verifica se o campo
  //    palestrante bate com um nome exato dos speakers
  //    cadastrados e vincula via speakerRef.
  // ──────────────────────────────────────────────────
  console.log('[Seed] Convertendo grade de programação e vinculando palestrantes...')

  // Mapa de strings de identificação parcial para nome canônico no banco
  const speakerMatchMap: Record<string, string> = {
    'Arthur Igreja':           'Arthur Igreja',
    'Sandro Magaldi':          'Sandro Magaldi',
    'Carlos César':            'Carlos César',
    'Eliane Archangelo':       'Eliane Archangelo',
    'Fátima Casarin':          'Fátima Casarin',
    'Heder Soares':            'Heder Soares',
    'Marco Giongo':            'Marco Giongo',
    'Marli Santos':            'Marli Santos',
    'Rodrigo Veras':           'Rodrigo Veras',
    'Luiz Henrique Froes Michelin': 'Luiz Henrique Froes Michelin',
    'Alexandro Billy':         'Alexandro Billy',
    'Frederico Borba Diniz':   'Frederico Borba Diniz',
    'Helcids de Sá Reis':      'Helcids de Sá Reis',
    'Pedro Henrique Rezende':  'Pedro Henrique Rezende',
    'Denilsom Bezerra Costa':  'Denilsom Bezerra Costa',
    'Lucas Mattos':            'Lucas Mattos',
    'Cleovan Barbosa':         'Cleovan Barbosa',
    'Felipe Michetti':         'Felipe Michetti',
    'Harly Carreiro':          'Harly Carreiro',
    'Rennan Thamay':           'Rennan Thamay',
    'Joelma Feitosa Modesto':  'Joelma Feitosa Modesto',
    'Sandra Negri':            'Sandra Negri',
    'Alexandre Dias':          'Prof. Dr. Alexandre Dias Carreiro Santos Serra',
    'Jofre':                   'Prof. Dr. Jofre Jacob da Silva Freitas',
    'Leonardo Miranda':        'Prof. Dr. Leonardo Miranda Frossard',
    'Raquel Aparecida Marra':  'Raquel Aparecida Marra da Madeira Freitas',
    'Gustavo Fagundes':        'Gustavo Fagundes',
    'Erasto Fortes':           'Erasto Fortes Mendonça',
    'Luiz Eduardo Maia':       'Luiz Eduardo Maia',
    'Cristovam Liberato':      'Cristovam Liberato',
    'Ministrante: Cibelle':    'Ministrante: Cibelle Christine',
    'Ministrante: Diony':      'Ministrante: Diony Alves Reis',
    'Ministrante: Gilberto':   'Ministrante: Gilberto Fernandes de Melo Junior',
    'Ministrante: Giovani':    'Ministrante: Giovani Menegucci Martin',
    'Ministrante: Gustavo Marquardt': 'Ministrante: Gustavo Marquardt',
    'Ministrante: Inocencio':  'Ministrante: Inocencio Oliveira',
    'Ministrante: Mayke':      'Ministrante: Mayke Rocha',
    'Ministrante: Mirian':     'Ministrante: Mirian das Mercês',
  }

  function resolveSpeakerId(palestrante: string): number | null {
    if (!palestrante || palestrante.trim() === '') return null
    for (const [fragment, canonicalName] of Object.entries(speakerMatchMap)) {
      if (palestrante.includes(fragment) && speakerIdByName[canonicalName]) {
        return speakerIdByName[canonicalName]
      }
    }
    return null
  }

  type ScheduleTalk = {
    titulo: string
    horario: string
    local: string
    palestrante?: string
    speakerRef?: number | null
    vagas?: string
    meetLink?: string
  }

  type ScheduleEvent = {
    name: string
    talks: ScheduleTalk[]
  }

  const formattedSchedule = Object.entries(scheduleData)
    .map(([dateKey, dayData]) => {
      if (dateKey === 'lastUpdate') return null
      const meta = dateMapping[dateKey] || {
        date: dateKey,
        dayOfWeek: 'Programação',
      }

      const dayEvents: ScheduleEvent[] = []

      Object.entries(
        dayData as Record<
          string,
          Array<{
            titulo?: string
            horario?: string
            local?: string
            palestrante?: string
            vagas?: string
            meetLink?: string
          }>
        >
      ).forEach(([eventName, talksList]) => {
        if (!Array.isArray(talksList) || talksList.length === 0) return

        const talks: ScheduleTalk[] = talksList.map((t) => {
          const palestrante = t.palestrante || ''
          const speakerRef = resolveSpeakerId(palestrante) || undefined
          return {
            titulo: t.titulo || 'Atividade',
            horario: t.horario || 'A definir',
            local: t.local || 'Campus UNITINS',
            palestrante: palestrante || undefined,
            ...(speakerRef ? { speakerRef } : {}),
            vagas: t.vagas || '',
            meetLink: t.meetLink || '',
          }
        })

        dayEvents.push({
          name: eventName,
          talks,
        })
      })

      return {
        date: meta.date,
        dayOfWeek: meta.dayOfWeek,
        events: dayEvents,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  // ──────────────────────────────────────────────────
  // 7. Criar Edição 2025 com slides originais e vínculos
  // ──────────────────────────────────────────────────
  console.log('[Seed] Criando edição 2025...')
  await payload.create({
    collection: 'editions',
    data: {
      slug: '2025',
      year: 2025,
      title: 'III Semana de Ciência, Tecnologia e Inovação',
      shortTitle: 'III Semana de Tecnologia',
      isDefault: true,
      dates: '20 a 24 de outubro de 2025',
      registrationUrl: 'https://unitins.br',
      theme: {
        primaryColor: '#083D77',
        accentColor: '#e2187f',
        logo: snctMediaId || unitinsMediaId,
        heroBanner: snctMediaId,
      },
      // Slides originais do carrossel (preservados do site anterior)
      // Desktop-first: as imagens landscape e vídeo drone de lavoura
      // Mobile: imagem drone aérea e vídeo vertical de drone
      heroSlides: [
        {
          type: 'image',
          src: 'https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg',
          alt: 'Imagem sobre o evento',
        },
        {
          type: 'video',
          src: 'https://www.pexels.com/pt-br/download/video/5608087/',
          alt: 'Vídeo drone sobre plantação',
        },
        {
          type: 'image',
          src: 'https://plus.unsplash.com/premium_photo-1664475382326-3dc5510e4ff9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169',
          alt: 'Drone sobre plantação',
        },
        {
          type: 'image',
          src: 'https://images.unsplash.com/photo-1560260240-c6ef90a163a4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1331',
          alt: 'Oceano',
        },
        {
          type: 'image',
          src: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg',
          alt: 'Programação',
        },
      ],
      about: {
        title: 'III Semana de Ciência, Tecnologia e Inovação da UNITINS',
        themeTitle: 'Planeta Água: a cultura oceânica para enfrentar as mudanças climáticas no meu território',
        body: 'A Universidade Estadual do Tocantins (Unitins) realizará, de 20 a 24 de outubro de 2025, a III Semana de Ciência, Tecnologia e Inovação - SCTI. Integrando a Semana Nacional de Ciência e Tecnologia, o evento reunirá estudantes, professores, pesquisadores e comunidade em torno de palestras, oficinas, exposições e apresentações científicas.',
        illustration: globoMediaId,
      },
      schedule: formattedSchedule,
      partners: partnerIds,
      faqs: [
        {
          question: 'O que é a Semana de Ciência, Tecnologia e Inovação da UNITINS?',
          answer: 'É o principal evento acadêmico e científico da UNITINS, promovendo a integração entre ensino, pesquisa e extensão com foco em inovação e desenvolvimento regional.',
        },
        {
          question: 'Como faço para me inscrever nas palestras e minicursos?',
          answer: 'As inscrições são gratuitas e podem ser realizadas online através do sistema oficial de eventos da UNITINS.',
        },
        {
          question: 'O evento emite certificado de participação?',
          answer: 'Sim, todos os participantes inscritos que confirmarem presença nas atividades receberão certificados digitais com carga horária correspondente.',
        },
        {
          question: 'Onde acontecerão as atividades presenciais?',
          answer: 'As atividades presenciais acontecerão no Câmpus Graciosa da UNITINS em Palmas, incluindo auditórios, salas temáticas e estandes de parceiros.',
        },
      ],
      subscription: {
        title: 'Garanta sua participação na III Semana de Tecnologia',
        ctaLabel: 'Inscreva-se Agora',
      },
    },
  })

  console.log('✅ [Seed] Concluído: mídias, palestrantes, parceiros e edição 2025 criados com sucesso!')
}

if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ [Seed] Erro durante a execução:', err)
      process.exit(1)
    })
}
