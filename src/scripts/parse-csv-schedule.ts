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

const DATE_MAPPING: Record<string, { date: string; dayOfWeek: string; isoDate: string; order: number }> = {
  '10/13/2026': { date: '13/10', dayOfWeek: 'Terça-feira', isoDate: '2026-10-13', order: 1 },
  '10/14/2026': { date: '14/10', dayOfWeek: 'Quarta-feira', isoDate: '2026-10-14', order: 2 },
  '10/15/2026': { date: '15/10', dayOfWeek: 'Quinta-feira', isoDate: '2026-10-15', order: 3 },
  '10/16/2026': { date: '16/10', dayOfWeek: 'Sexta-feira', isoDate: '2026-10-16', order: 4 },
  'A definir':   { date: 'Online', dayOfWeek: 'Atividades EAD / A definir', isoDate: '2026-10-17', order: 5 },
}

/**
 * Normaliza o horário substituindo "às" por " - " e espaços duplicados
 */
function normalizeHorario(horario?: string): string {
  if (!horario) return 'A definir'
  return horario
    .replace(/\s+às\s+/gi, ' - ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Normaliza o título da atividade, removendo aspas duplicadas e quebras de linha
 */
function normalizeText(text?: string): string {
  if (!text) return ''
  return text
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Realiza o parse do CSV de programação e estrutura no formato de dias, eixos e palestras.
 */
export function parseScheduleCsv(csvContent: string): ParsedDay[] {
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
  }) as CsvRow[]

  // Estrutura temporária: mapa por dateKey -> mapa por eventName -> lista de talks
  const daysMap = new Map<string, Map<string, ParsedTalk[]>>()

  for (const row of records) {
    const rawDate = row.Data?.trim() || 'A definir'
    const eventName = normalizeText(row.Evento) || 'Programação Geral'
    const titulo = normalizeText(row['Título da Atividade']) || (row.Modalidade ? `${row.Modalidade}: Atividade` : 'Atividade')
    const horario = normalizeHorario(row.Horário)
    const local = normalizeText(row.Local) || 'Câmpus UNITINS'
    const palestrante = normalizeText(row['Palestrante/ Ministrante']) || undefined
    const modalidade = normalizeText(row.Modalidade) || undefined
    const formato = normalizeText(row.Formato) || undefined
    const coordenador = normalizeText(row['Coordenador(a)']) || undefined

    const isOnline = formato?.toLowerCase() === 'online' || local.toLowerCase().includes('google meet') || rawDate === 'A definir'
    const meetLink = isOnline ? 'https://meet.google.com' : undefined

    if (!daysMap.has(rawDate)) {
      daysMap.set(rawDate, new Map())
    }

    const eventsMap = daysMap.get(rawDate)!
    if (!eventsMap.has(eventName)) {
      eventsMap.set(eventName, [])
    }

    eventsMap.get(eventName)!.push({
      titulo,
      horario,
      local,
      palestrante,
      modalidade,
      formato,
      coordenador,
      vagas: '',
      meetLink,
    })
  }

  // Converte o mapa para a estrutura ordenada final
  const parsedDays: ParsedDay[] = []

  // Ordena os dias conforme o DATE_MAPPING
  const sortedDateKeys = Array.from(daysMap.keys()).sort((a, b) => {
    const orderA = DATE_MAPPING[a]?.order ?? 99
    const orderB = DATE_MAPPING[b]?.order ?? 99
    return orderA - orderB
  })

  for (const dateKey of sortedDateKeys) {
    const dateMeta = DATE_MAPPING[dateKey] || {
      date: dateKey,
      dayOfWeek: 'Programação',
      isoDate: undefined,
      order: 99,
    }

    const eventsMap = daysMap.get(dateKey)!
    const events: ParsedEvent[] = []

    // Eixos temáticos prioritários (ex: Circuito de Inovação primeiro se houver)
    const sortedEventNames = Array.from(eventsMap.keys()).sort((a, b) => {
      if (a.toLowerCase().includes('circuito de inovação')) return -1
      if (b.toLowerCase().includes('circuito de inovação')) return 1
      if (a.toLowerCase().includes('palestra magna')) return -1
      if (b.toLowerCase().includes('palestra magna')) return 1
      return a.localeCompare(b, 'pt-BR')
    })

    for (const name of sortedEventNames) {
      events.push({
        name,
        talks: eventsMap.get(name)!,
      })
    }

    parsedDays.push({
      date: dateMeta.date,
      dayOfWeek: dateMeta.dayOfWeek,
      isoDate: dateMeta.isoDate,
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
  const defaultFilePath = path.resolve(process.cwd(), 'src/data/raw/2026/programacao-2026.csv')
  const targetFilePath = customFileArgIndex !== -1 && process.argv[customFileArgIndex + 1]
    ? path.resolve(process.cwd(), process.argv[customFileArgIndex + 1])
    : defaultFilePath

  console.log(`\n🚀 [Parse Schedule] Iniciando leitura do arquivo: ${targetFilePath}`)

  if (!fs.existsSync(targetFilePath)) {
    console.error(`❌ [Parse Schedule] Erro: Arquivo não encontrado em "${targetFilePath}"`)
    process.exit(1)
  }

  const csvRaw = fs.readFileSync(targetFilePath, 'utf-8')
  const scheduleDays = parseScheduleCsv(csvRaw)

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
