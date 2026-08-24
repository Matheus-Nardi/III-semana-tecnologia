import { getPayload } from 'payload'
import config from '@payload-config'

export interface MediaRef {
  id?: string
  url?: string
  alt?: string
  width?: number
  height?: number
}

export interface Speaker {
  id?: string
  name: string
  role?: string
  institution?: string
  bio?: string
  photo?: MediaRef | null
  link?: string
}

export interface Partner {
  id?: string
  name: string
  category?: 'realizacao' | 'correalizacao' | 'patrocinio-master' | 'patrocinio' | 'apoio-institucional' | 'apoio'
  logo?: MediaRef | null
  logoUrl?: string
  src?: string
  alt?: string
  href?: string
  order?: number
}

export interface Talk {
  titulo: string
  horario: string
  local: string
  palestrante: string
  speakerRef?: Speaker | null
  vagas?: string
  meetLink?: string
}

export interface ScheduleEvent {
  name: string
  talks: Talk[]
}

export interface ScheduleDay {
  date: string
  dayOfWeek: string
  events?: ScheduleEvent[]
  eventName?: string
  talks?: Talk[]
}

export interface FaqItem {
  question: string
  answer: string
}

export interface ThemeConfig {
  primaryColor?: string
  accentColor?: string
  logo?: MediaRef | null
  heroBanner?: MediaRef | null
  heroBackground?: MediaRef | null
}

export interface HeroSlide {
  type: 'image' | 'video'
  src: string
  alt?: string
}

export interface Edition {
  id?: string
  slug: string
  year: number
  title: string
  shortTitle: string
  isDefault: boolean
  dates: string
  registrationUrl: string
  theme?: ThemeConfig
  heroSlides?: HeroSlide[]
  about?: {
    title?: string
    themeTitle?: string
    body?: string
    illustration?: MediaRef | null
  }
  schedule?: ScheduleDay[]
  partners?: Partner[]
  faqs?: FaqItem[]
  subscription?: {
    title?: string
    ctaLabel?: string
  }
}

// Fallback padrão para a edição 2025 caso o banco esteja inicializando
export const FALLBACK_2025_EDITION: Edition = {
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
  },
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
  },
  partners: [
    { name: 'Governo do Estado do Tocantins', src: '/logos/logo-gov-to.png', alt: 'Governo do Estado do Tocantins', href: 'https://www.to.gov.br/' },
    { name: 'MCTI', src: '/logos/logo-mcti.png', alt: 'MCTI - Ministério da Ciência, Tecnologia e Inovação', href: 'https://www.gov.br/mcti/pt-br' },
    { name: 'SNCT', src: '/logos/logo-snct.png', alt: 'SNCT - Semana Nacional de Ciência e Tecnologia', href: 'https://semanact.mcti.gov.br/' },
    { name: 'FNDCT', src: '/logos/logo-fndct.png', alt: 'FNDCT', href: 'https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/fndct' },
    { name: 'CAPES', src: '/logos/logo-capes.png', alt: 'CAPES', href: 'https://www.gov.br/capes/pt-br' },
    { name: 'CNPq', src: '/logos/logo-cnpq.png', alt: 'CNPq', href: 'https://www.gov.br/cnpq/pt-br' },
    { name: 'FAPT', src: '/logos/logo-fapt.png', alt: 'FAPT', href: 'https://www.to.gov.br/fapt' },
    { name: 'POP Ciência', src: '/logos/logo-pop.png', alt: 'POP Ciência', href: 'https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/popciencia' },
    { name: 'UAB', src: '/logos/logo-uab.png', alt: 'UAB', href: 'https://www.gov.br/capes/pt-br/acesso-a-informacao/acoes-e-programas/educacao-a-distancia/universidade-aberta-do-brasil' },
    { name: 'Embrapa', src: '/logos/logo-embrapa.png', alt: 'Embrapa', href: 'https://www.embrapa.br/' },
    { name: 'Sebrae Tocantins', src: '/logos/logo-sebrae.png', alt: 'Sebrae Tocantins', href: 'https://sebrae.com.br/sites/PortalSebrae/ufs/to?codUf=24' },
  ],
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
  ],
  subscription: {
    title: 'Garanta sua participação na III Semana de Tecnologia',
    ctaLabel: 'Inscreva-se Agora',
  },
}

/**
 * Busca uma edição específica por slug com tag caching do Next.js
 */
export async function getEdition(slug: string): Promise<Edition | null> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'editions',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 2,
      limit: 1,
    })

    if (result.docs && result.docs.length > 0) {
      return result.docs[0] as unknown as Edition
    }
  } catch (error) {
    console.warn(`[Content Layer] Erro ao buscar edição "${slug}" no Payload (usando fallback se aplicável):`, error)
  }

  if (slug === '2025') {
    return FALLBACK_2025_EDITION
  }
  return null
}

/**
 * Busca a edição padrão ativa (isDefault = true) ou a mais recente
 */
export async function getDefaultEdition(): Promise<Edition> {
  try {
    const payload = await getPayload({ config })
    
    // 1. Tenta buscar a edição marcada como isDefault
    const defaultResult = await payload.find({
      collection: 'editions',
      where: {
        isDefault: {
          equals: true,
        },
      },
      depth: 2,
      limit: 1,
    })

    if (defaultResult.docs && defaultResult.docs.length > 0) {
      return defaultResult.docs[0] as unknown as Edition
    }

    // 2. Fallback para a edição com maior ano
    const latestResult = await payload.find({
      collection: 'editions',
      sort: '-year',
      depth: 2,
      limit: 1,
    })

    if (latestResult.docs && latestResult.docs.length > 0) {
      return latestResult.docs[0] as unknown as Edition
    }
  } catch (error) {
    console.warn('[Content Layer] Erro ao buscar default edition no Payload:', error)
  }

  return FALLBACK_2025_EDITION
}

/**
 * Lista todas as edições cadastradas ordenadas por ano decrescente
 */
export async function getAllEditions(): Promise<Edition[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'editions',
      sort: '-year',
      depth: 1,
      limit: 100,
    })

    if (result.docs && result.docs.length > 0) {
      return result.docs as unknown as Edition[]
    }
  } catch (error) {
    console.warn('[Content Layer] Erro ao listar edições no Payload:', error)
  }

  return [FALLBACK_2025_EDITION]
}
