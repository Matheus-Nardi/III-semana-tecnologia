import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

export interface CsvRow {
  Evento?: string
  Eixo?: string
  Vínculo?: string
  Local?: string
  Data?: string
  Horário?: string
  Modalidade?: string
  'Título da Atividade'?: string
  'Palestrante/ Ministrante'?: string
  'Coordenador(a)'?: string
  Formato?: string
}

export interface NitCsvRow {
  Evento?: string
  Local?: string
  Data?: string
  Horário?: string
  Modalidade?: string
  'Título da Atividade'?: string
  'Palestrante/ Ministrante'?: string
}

export interface ParsedTalk {
  titulo: string
  horario: string
  local: string
  palestrante?: string
  modalidade?: string
  formato?: string
  coordenador?: string
  vagas?: string
  meetLink?: string
}

export interface ParsedEvent {
  name: string
  talks: ParsedTalk[]
}

export interface ParsedDay {
  date: string
  dayOfWeek: string
  isoDate?: string
  events: ParsedEvent[]
}

export const DATE_MAPPING: Record<string, { date: string; dayOfWeek: string; isoDate: string; order: number }> = {
  // Dias da programação presencial
  '10/13/2026': { date: '13/10', dayOfWeek: 'Terça-feira', isoDate: '2026-10-13', order: 1 },
  '13/10/2026': { date: '13/10', dayOfWeek: 'Terça-feira', isoDate: '2026-10-13', order: 1 },
  '10/14/2026': { date: '14/10', dayOfWeek: 'Quarta-feira', isoDate: '2026-10-14', order: 2 },
  '14/10/2026': { date: '14/10', dayOfWeek: 'Quarta-feira', isoDate: '2026-10-14', order: 2 },
  '10/15/2026': { date: '15/10', dayOfWeek: 'Quinta-feira', isoDate: '2026-10-15', order: 3 },
  '15/10/2026': { date: '15/10', dayOfWeek: 'Quinta-feira', isoDate: '2026-10-15', order: 3 },
  '10/16/2026': { date: '16/10', dayOfWeek: 'Sexta-feira', isoDate: '2026-10-16', order: 4 },
  '16/10/2026': { date: '16/10', dayOfWeek: 'Sexta-feira', isoDate: '2026-10-16', order: 4 },

  // Sessões Virtuais / EAD (Google Meet)
  '10/20/2026': { date: 'Online', dayOfWeek: 'A definir', isoDate: '2026-10-20', order: 5 },
  '20/10/2026': { date: 'Online', dayOfWeek: 'A definir', isoDate: '2026-10-20', order: 5 },
  '10/22/2026': { date: 'Online', dayOfWeek: 'A definir', isoDate: '2026-10-22', order: 5 },
  '22/10/2026': { date: 'Online', dayOfWeek: 'A definir', isoDate: '2026-10-22', order: 5 },
  'A definir':   { date: 'Online', dayOfWeek: 'A definir', isoDate: '2026-10-23', order: 5 },
  'Online':      { date: 'Online', dayOfWeek: 'A definir', isoDate: '2026-10-23', order: 5 },
}

/**
 * Normaliza o horário substituindo "às" por " - " e espaços duplicados
 */
export function normalizeHorario(horario?: string): string {
  if (!horario) return 'A definir'
  return horario
    .replace(/\s+às\s+/gi, ' - ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Normaliza o texto removendo aspas duplicadas e quebras de linha
 */
export function normalizeText(text?: string): string {
  if (!text) return ''
  return text
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Retorna os metadados ordenados para uma dada string de data
 */
export function resolveDateMeta(rawDate: string): { date: string; dayOfWeek: string; isoDate?: string; order: number } {
  const trimmed = rawDate.trim()
  if (DATE_MAPPING[trimmed]) {
    return DATE_MAPPING[trimmed]
  }
  return {
    date: trimmed || 'Online',
    dayOfWeek: 'A definir',
    isoDate: undefined,
    order: 99,
  }
}

/**
 * Determina o coordenador para atividades do NIT caso não fornecido explicitamente
 */
export function getNitCoordinator(row: NitCsvRow): string {
  const tit = (row['Título da Atividade'] || '').toLowerCase()
  const pal = (row['Palestrante/ Ministrante'] || '').toLowerCase()
  const mod = (row.Modalidade || '').toLowerCase()
  if (
    mod.includes('hackathon') ||
    tit.includes('hackathon') ||
    pal.includes('jeferson') ||
    pal.includes('fredson') ||
    pal.includes('miranda')
  ) {
    return 'Jeferson Morais da Costa'
  }
  return 'Mylena Costa Jacundá'
}

/**
 * Enquadra a planilha específica do NIT para a estrutura padrão de CsvRow
 */
export function frameNitCsv(nitCsvContent: string): CsvRow[] {
  const nitRecords = parse(nitCsvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
  }) as NitCsvRow[]

  return nitRecords.map((r) => {
    let palestrante = normalizeText(r['Palestrante/ Ministrante'])
    if (palestrante.toLowerCase() === 'não se aplica') {
      palestrante = ''
    }

    return {
      Evento: 'IV Circuito de Inovação',
      Eixo: 'Inovação',
      Vínculo: 'NIT',
      Local: normalizeText(r.Local) || 'Câmpus UNITINS',
      Data: normalizeText(r.Data) || 'A definir',
      Horário: normalizeText(r.Horário) || 'A definir',
      Modalidade: normalizeText(r.Modalidade) || 'Atividade',
      'Título da Atividade': normalizeText(r['Título da Atividade']),
      'Palestrante/ Ministrante': palestrante,
      'Coordenador(a)': getNitCoordinator(r),
      Formato: 'Presencial',
    }
  })
}

/**
 * Realiza o parse do CSV de programação e estrutura no formato de dias, eixos e palestras.
 * Se nitCsvContent for passado, substitui o bloco do IV Circuito de Inovação pela versão oficial do NIT.
 */
export function parseScheduleCsv(csvContent: string, nitCsvContent?: string): ParsedDay[] {
  const rawRecords = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
  }) as CsvRow[]

  let records: CsvRow[] = []

  if (nitCsvContent) {
    // Substitui o bloco do IV Circuito pelas atividades oficiais do NIT
    const filtered = rawRecords.filter(
      (r) => normalizeText(r.Evento) !== 'IV Circuito de Inovação'
    )
    const nitFramed = frameNitCsv(nitCsvContent)
    records = [...filtered, ...nitFramed]
  } else {
    records = rawRecords
  }

  // Estrutura temporária: mapa por dateKey (resolvido) -> mapa por eventName -> lista de talks
  const daysMap = new Map<string, { date: string; dayOfWeek: string; isoDate?: string; order: number; events: Map<string, ParsedTalk[]> }>()

  // Pré-popula os 4 dias presenciais oficiais
  const inPersonDays = ['13/10', '14/10', '15/10', '16/10']
  for (const dayKey of inPersonDays) {
    const meta = resolveDateMeta(dayKey + '/2026')
    daysMap.set(dayKey, {
      date: meta.date,
      dayOfWeek: meta.dayOfWeek,
      isoDate: meta.isoDate,
      order: meta.order,
      events: new Map(),
    })
  }

  for (const row of records) {
    const rawDate = row.Data?.trim() || 'A definir'
    const eventName = normalizeText(row.Evento) || 'Programação Geral'
    const rawTitulo = normalizeText(row['Título da Atividade'])
    const rawLocal = normalizeText(row.Local)

    // Filtra linhas totalmente vazias ou residuais
    if (!eventName && !rawTitulo && !rawLocal) {
      continue
    }

    // Se título estiver vazio, herda o próprio nome do evento
    const titulo = rawTitulo || eventName || (row.Modalidade ? `${row.Modalidade}: Atividade` : 'Atividade')
    const horario = normalizeHorario(row.Horário)
    const local = rawLocal || 'Câmpus UNITINS'

    let palestrante = normalizeText(row['Palestrante/ Ministrante'])
    if (palestrante.toLowerCase() === 'não se aplica') {
      palestrante = ''
    }

    const modalidade = normalizeText(row.Modalidade) || undefined
    const formato = normalizeText(row.Formato) || undefined
    const coordenador = normalizeText(row['Coordenador(a)']) || undefined

    // Tratamento de Atividade Permanente (ex: Exposição do Museu de 13 a 16/10)
    // Replicada nos 4 dias da semana para visualização imediata do participante
    if (rawDate.includes('13 a 16')) {
      for (const dayKey of inPersonDays) {
        const dayObj = daysMap.get(dayKey)!
        if (!dayObj.events.has(eventName)) {
          dayObj.events.set(eventName, [])
        }
        dayObj.events.get(eventName)!.push({
          titulo,
          horario: '08h30 - 18h00 (Semana toda)',
          local,
          palestrante: palestrante || undefined,
          modalidade: 'Exposição Permanente',
          formato: 'Presencial',
          coordenador,
          vagas: '',
        })
      }
      continue
    }

    const isOnline =
      formato?.toLowerCase() === 'online' ||
      local.toLowerCase().includes('google meet') ||
      rawDate.toLowerCase().includes('online') ||
      rawDate.includes('10/20') ||
      rawDate.includes('20/10') ||
      rawDate.includes('10/22') ||
      rawDate.includes('22/10') ||
      rawDate === 'A definir'
    const meetLink = isOnline ? 'https://meet.google.com' : undefined

    let formattedHorario = horario
    if (rawDate === '10/20/2026' || rawDate === '20/10/2026') {
      formattedHorario = `20/10 (Terça) • ${horario}`
    } else if (rawDate === '10/22/2026' || rawDate === '22/10/2026') {
      formattedHorario = `22/10 (Quinta) • ${horario}`
    }

    const dateMeta = resolveDateMeta(rawDate)
    const dateKey = dateMeta.date

    if (!daysMap.has(dateKey)) {
      daysMap.set(dateKey, {
        date: dateMeta.date,
        dayOfWeek: dateMeta.dayOfWeek,
        isoDate: dateMeta.isoDate,
        order: dateMeta.order,
        events: new Map(),
      })
    }

    const dayObj = daysMap.get(dateKey)!
    if (!dayObj.events.has(eventName)) {
      dayObj.events.set(eventName, [])
    }

    dayObj.events.get(eventName)!.push({
      titulo,
      horario: formattedHorario,
      local,
      palestrante: palestrante || undefined,
      modalidade,
      formato,
      coordenador,
      vagas: '',
      meetLink,
    })
  }

  // Ordena os dias conforme order do DATE_MAPPING
  const sortedDays = Array.from(daysMap.values()).sort((a, b) => a.order - b.order)
  const parsedDays: ParsedDay[] = []

  for (const dayObj of sortedDays) {
    const events: ParsedEvent[] = []

    // Eixos temáticos prioritários: Circuito de Inovação e Palestra Magna no topo
    const sortedEventNames = Array.from(dayObj.events.keys()).sort((a, b) => {
      const aLower = a.toLowerCase()
      const bLower = b.toLowerCase()
      if (aLower.includes('circuito de inovação')) return -1
      if (bLower.includes('circuito de inovação')) return 1
      if (aLower.includes('palestra magna')) return -1
      if (bLower.includes('palestra magna')) return 1
      return a.localeCompare(b, 'pt-BR')
    })

    for (const name of sortedEventNames) {
      events.push({
        name,
        talks: dayObj.events.get(name)!,
      })
    }

    parsedDays.push({
      date: dayObj.date,
      dayOfWeek: dayObj.dayOfWeek,
      isoDate: dayObj.isoDate,
      events,
    })
  }

  return parsedDays
}

import { fileURLToPath } from 'url'

// Execução CLI direta
const currentFilePath = fileURLToPath(import.meta.url)
const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFilePath)
if (isMainModule) {
  const customFileArgIndex = process.argv.indexOf('--file')
  const customNitArgIndex = process.argv.indexOf('--nit-file')

  const defaultFilePath = path.resolve(process.cwd(), 'src/data/raw/2026/programacao-2026_01.csv')
  const targetFilePath =
    customFileArgIndex !== -1 && process.argv[customFileArgIndex + 1]
      ? path.resolve(process.cwd(), process.argv[customFileArgIndex + 1])
      : defaultFilePath

  const defaultNitFilePath = path.resolve(
    process.cwd(),
    'src/data/raw/2026/Programação_IV Circuito de Inovação_2026_NIT (1).csv'
  )
  const targetNitFilePath =
    customNitArgIndex !== -1 && process.argv[customNitArgIndex + 1]
      ? path.resolve(process.cwd(), process.argv[customNitArgIndex + 1])
      : fs.existsSync(defaultNitFilePath)
        ? defaultNitFilePath
        : undefined

  console.log(`\n🚀 [Parse Schedule] Iniciando leitura do arquivo principal: ${targetFilePath}`)
  if (targetNitFilePath) {
    console.log(`📋 [Parse Schedule] Mesclando arquivo oficial do NIT: ${targetNitFilePath}`)
  }

  if (!fs.existsSync(targetFilePath)) {
    console.error(`❌ [Parse Schedule] Erro: Arquivo principal não encontrado em "${targetFilePath}"`)
    process.exit(1)
  }

  const csvRaw = fs.readFileSync(targetFilePath, 'utf-8')
  const nitCsvRaw = targetNitFilePath && fs.existsSync(targetNitFilePath) ? fs.readFileSync(targetNitFilePath, 'utf-8') : undefined

  const scheduleDays = parseScheduleCsv(csvRaw, nitCsvRaw)

  let totalTalks = 0
  let totalEvents = 0
  scheduleDays.forEach((day) => {
    totalEvents += day.events.length
    day.events.forEach((ev) => {
      totalTalks += ev.talks.length
    })
  })

  const outputJsonPath = path.resolve(process.cwd(), 'src/data/schedule-2026.json')
  fs.writeFileSync(outputJsonPath, JSON.stringify(scheduleDays, null, 2), 'utf-8')

  console.log(`✅ [Parse Schedule] Processamento concluído com sucesso!`)
  console.log(`📊 Estatísticas:`)
  console.log(`   - Dias de Programação: ${scheduleDays.length}`)
  console.log(`   - Eixos / Sub-eventos: ${totalEvents}`)
  console.log(`   - Atividades / Palestras: ${totalTalks}`)
  console.log(`📁 Arquivo JSON intermediário gerado em: ${outputJsonPath}\n`)

  scheduleDays.forEach((day) => {
    console.log(`   📅 ${day.date} (${day.dayOfWeek}): ${day.events.length} eixos temáticos`)
  })
}
