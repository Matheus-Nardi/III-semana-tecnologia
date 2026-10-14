import 'dotenv/config'

import type { Payload } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseScheduleCsv, type ParsedDay, type ParsedTalk } from './parse-csv-schedule'
import { getDefaultEventColor } from '@/lib/event-colors'

/**
 * Sincroniza a programação de uma edição a partir da planilha oficial (CSV exportado do Google Sheets).
 *
 * Regras (a planilha é a fonte da verdade):
 *  - Título, horário, local e palestrante vêm sempre da planilha.
 *  - Palestrante vazio na planilha NÃO apaga um palestrante já cadastrado no site (fica no relatório como "preservado").
 *  - Dados técnicos do banco são preservados: ids das linhas, cor dos eixos, vagas, meetLink, isOnline e speakerRef.
 *  - Atividades que existem só no site são removidas (e listadas no relatório).
 *  - Atividades permanentes ("13 a 16/10") são ignoradas: o banner é fixo no componente Schedule.
 *
 * Por padrão roda em modo simulação (não grava). Use --apply para gravar; antes da gravação
 * o estado atual da edição é salvo em backups/schedule/.
 */

export const DEFAULT_SCHEDULE_CSV = 'src/data/raw/2026/programacao-2026.csv'
const OUTPUT_DIR = 'backups/schedule'

interface CurrentTalk {
  id?: string | null
  titulo?: string | null
  horario?: string | null
  local?: string | null
  vagas?: string | null
  palestrante?: string | null
  speakerRef?: number | { id: number } | null
  isOnline?: boolean | null
  meetLink?: string | null
}

interface CurrentEvent {
  id?: string | null
  name: string
  color?: string | null
  talks?: CurrentTalk[] | null
}

interface CurrentDay {
  id?: string | null
  date: string
  dayOfWeek?: string | null
  events?: CurrentEvent[] | null
}

interface FlatTalk {
  day: string
  event: string
  talk: CurrentTalk
}

interface Change {
  day: string
  event: string
  titulo: string
  fields: Record<string, { antes: string; depois: string }>
}

interface SyncReport {
  added: FlatTalk[]
  removed: FlatTalk[]
  changed: Change[]
  preserved: { day: string; event: string; titulo: string; palestrante: string }[]
  unchanged: number
}

const VALID_DAYS = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
  'Todos os dias',
  'A definir',
] as const
type DayOfWeekOption = (typeof VALID_DAYS)[number]

/** Chave de comparação: ignora acentos, caixa, pontuação e zeros à esquerda ("Sala 09" = "Sala 9", "08h00" = "8h00") */
function matchKey(value?: string | null): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\b0+(\d)/g, '$1')
    .replace(/[^a-z0-9]/g, '')
}

const text = (value?: string | null) => (value || '').trim()

/**
 * Extrai o nome limpo e opcionalmente a instituição de strings como:
 * "Marla Guedes (Seagro - CGE ABC+TO)" -> nome: "Marla Guedes", institution: "Seagro - CGE ABC+TO"
 */
function extractSpeakerInfo(rawText: string): { name: string; institution?: string } {
  const match = rawText.match(/^([^(]+)(?:\(([^)]+)\))?/)
  if (match) {
    const name = match[1].trim()
    const institution = match[2]?.trim()
    return { name, institution }
  }
  return { name: rawText.trim() }
}

/**
 * Cria ou recupera o ID de um palestrante pelo nome exato (idempotente)
 */
async function upsertSpeaker(
  payload: Payload,
  rawName: string,
  cache: Map<string, number>
): Promise<number | null> {
  const { name, institution } = extractSpeakerInfo(rawName)
  if (!name || name.length < 3) return null

  if (cache.has(name)) {
    return cache.get(name)!
  }

  try {
    const existing = await payload.find({
      collection: 'speakers',
      where: { name: { equals: name } },
      limit: 1,
    })

    if (existing.totalDocs > 0 && existing.docs[0]) {
      const id = existing.docs[0].id as number
      cache.set(name, id)
      return id
    }

    const created = await payload.create({
      collection: 'speakers',
      data: {
        name,
        institution: institution || 'UNITINS',
      },
    })

    const id = created.id as number
    cache.set(name, id)
    return id
  } catch (error) {
    console.warn(`[Import Schedule] Não foi possível vincular speaker "${name}":`, error)
    return null
  }
}

/**
 * Casa as atividades da planilha com as do banco, do critério mais estrito ao mais flexível.
 * Retorna, para cada talk da planilha, a talk atual correspondente (ou undefined).
 */
function matchTalks(
  sheet: { day: string; event: string; talk: ParsedTalk }[],
  current: FlatTalk[]
): (FlatTalk | undefined)[] {
  type Pair = { day: string; event: string; talk: { titulo?: string | null; horario?: string | null; local?: string | null } }
  const same = (a: Pair, b: Pair, fields: ('event' | 'titulo' | 'horario' | 'local')[]) =>
    a.day === b.day &&
    fields.every((f) => (f === 'event' ? matchKey(a.event) === matchKey(b.event) : matchKey(a.talk[f]) === matchKey(b.talk[f])))

  const tiers: ('event' | 'titulo' | 'horario' | 'local')[][] = [
    ['event', 'titulo', 'local', 'horario'],
    ['titulo', 'local'],
    ['titulo', 'horario'],
    ['titulo'],
    ['event', 'local', 'horario'],
  ]

  const result: (FlatTalk | undefined)[] = new Array(sheet.length)
  const used = new Set<number>()
  for (const fields of tiers) {
    sheet.forEach((s, i) => {
      if (result[i]) return
      const j = current.findIndex((c, idx) => !used.has(idx) && same(s, c, fields))
      if (j >= 0) {
        used.add(j)
        result[i] = current[j]
      }
    })
  }
  return result
}

/**
 * Monta a nova grade (planilha + dados técnicos preservados do banco) e o relatório de diferenças.
 */
export function buildSchedule(sheetDays: ParsedDay[], currentDays: CurrentDay[]) {
  const currentFlat: FlatTalk[] = currentDays.flatMap((d) =>
    (d.events || []).flatMap((e) => (e.talks || []).map((talk) => ({ day: d.date, event: e.name, talk })))
  )

  // Atividades permanentes são exibidas por um banner fixo no Schedule.tsx
  const days = sheetDays.map((d) => ({
    ...d,
    events: d.events
      .map((e) => ({ ...e, talks: e.talks.filter((t) => t.modalidade !== 'Exposição Permanente') }))
      .filter((e) => e.talks.length > 0),
  }))

  const sheetFlat = days.flatMap((d) => d.events.flatMap((e) => e.talks.map((talk) => ({ day: d.date, event: e.name, talk }))))
  const matches = matchTalks(sheetFlat, currentFlat)
  const matchOf = new Map(sheetFlat.map((s, i) => [s.talk, matches[i]]))

  const report: SyncReport = { added: [], removed: [], changed: [], preserved: [], unchanged: 0 }

  const schedule = days.map((day) => {
    const currentDay = currentDays.find((d) => d.date === day.date)
    const dayOfWeek: DayOfWeekOption = VALID_DAYS.includes(currentDay?.dayOfWeek as DayOfWeekOption)
      ? (currentDay!.dayOfWeek as DayOfWeekOption)
      : VALID_DAYS.includes(day.dayOfWeek as DayOfWeekOption)
        ? (day.dayOfWeek as DayOfWeekOption)
        : 'Todos os dias'

    const events = day.events.map((event) => {
      const currentEvent = currentDay?.events?.find((e) => matchKey(e.name) === matchKey(event.name))
      // Mantém a grafia já publicada quando só muda caixa/acentuação (ex.: "PALESTRA MAGNA" x "Palestra Magna")
      const name = currentEvent?.name || event.name

      const talks = event.talks.map((talk) => {
        const match = matchOf.get(talk)?.talk
        let palestrante = text(talk.palestrante)

        if (!palestrante && text(match?.palestrante)) {
          palestrante = text(match?.palestrante)
          report.preserved.push({ day: day.date, event: name, titulo: talk.titulo, palestrante })
        }

        const next = {
          ...(match?.id ? { id: match.id } : {}),
          titulo: talk.titulo,
          horario: talk.horario,
          local: talk.local,
          palestrante: palestrante || undefined,
          vagas: text(match?.vagas) || talk.vagas || '',
          meetLink: match?.meetLink || talk.meetLink || undefined,
          isOnline: match?.isOnline ?? undefined,
          speakerRef:
            match && matchKey(match.palestrante) === matchKey(palestrante) && match.speakerRef
              ? typeof match.speakerRef === 'object'
                ? match.speakerRef.id
                : match.speakerRef
              : undefined,
        }

        if (!match) {
          report.added.push({ day: day.date, event: name, talk: next })
        } else {
          const fields: Change['fields'] = {}
          for (const f of ['titulo', 'horario', 'local', 'palestrante'] as const) {
            if (text(match[f]) !== text(next[f])) fields[f] = { antes: text(match[f]), depois: text(next[f]) }
          }
          const movedFrom = currentFlat.find((c) => c.talk === match)
          if (movedFrom && movedFrom.day !== day.date) fields.dia = { antes: movedFrom.day, depois: day.date }
          if (movedFrom && movedFrom.event !== name) fields.eixo = { antes: movedFrom.event, depois: name }

          if (Object.keys(fields).length) report.changed.push({ day: day.date, event: name, titulo: talk.titulo, fields })
          else report.unchanged++
        }

        return next
      })

      return {
        ...(currentEvent?.id ? { id: currentEvent.id } : {}),
        name,
        color: currentEvent?.color || getDefaultEventColor(name),
        talks,
      }
    })

    return {
      ...(currentDay?.id ? { id: currentDay.id } : {}),
      date: day.date,
      dayOfWeek,
      events,
    }
  })

  const matched = new Set(matches.filter(Boolean).map((m) => m!.talk))
  report.removed = currentFlat.filter((c) => !matched.has(c.talk))

  return { schedule, report }
}

function formatReport(report: SyncReport, meta: { year: number; csv: string; apply: boolean }): string {
  const line = (t: FlatTalk) =>
    `- **${t.day}** · ${text(t.talk.horario)} · ${text(t.talk.local)} · _${t.event}_ — ${text(t.talk.titulo)}${t.talk.palestrante ? ` (${text(t.talk.palestrante)})` : ''}`

  const out: string[] = [
    `# Sincronização da programação ${meta.year}`,
    '',
    `- Planilha: \`${meta.csv}\``,
    `- Modo: ${meta.apply ? '**APLICADO** no banco' : 'simulação (nada foi gravado)'}`,
    `- Sem alteração: ${report.unchanged} · Alteradas: ${report.changed.length} · Novas: ${report.added.length} · Removidas: ${report.removed.length} · Palestrantes preservados: ${report.preserved.length}`,
    '',
    `## Alteradas (${report.changed.length})`,
    ...report.changed.flatMap((c) => [
      `- **${c.day}** · _${c.event}_ — ${c.titulo}`,
      ...Object.entries(c.fields).map(([f, v]) => `  - ${f}: "${v.antes}" → "${v.depois}"`),
    ]),
    '',
    `## Novas (${report.added.length})`,
    ...report.added.map(line),
    '',
    `## Removidas — existiam só no site (${report.removed.length})`,
    ...report.removed.map(line),
    '',
    `## Palestrantes preservados — vazios na planilha, mantidos do site (${report.preserved.length})`,
    ...report.preserved.map((p) => `- **${p.day}** · _${p.event}_ — ${p.titulo}: ${p.palestrante}`),
    '',
  ]
  return out.join('\n')
}

function readCurrentFromFile(filePath: string): CurrentDay[] {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  if (Array.isArray(raw)) return raw
  if (raw.docs?.[0]?.schedule) return raw.docs[0].schedule
  if (raw.schedule) return raw.schedule
  throw new Error(`Formato não reconhecido em "${filePath}" (esperado array de dias ou documento da edição)`)
}

export async function importSchedule(options: {
  filePath?: string
  year?: number
  apply?: boolean
  currentFile?: string
}) {
  const year = options.year || 2026
  const apply = options.apply ?? false
  const csvPath = path.resolve(process.cwd(), options.filePath || DEFAULT_SCHEDULE_CSV)
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const outDir = path.resolve(process.cwd(), OUTPUT_DIR)
  fs.mkdirSync(outDir, { recursive: true })

  if (!fs.existsSync(csvPath)) {
    throw new Error(`Planilha não encontrada em "${csvPath}"`)
  }

  console.log(`\n📖 [Import Schedule] Lendo planilha: ${csvPath}`)
  const sheetDays = parseScheduleCsv(fs.readFileSync(csvPath, 'utf-8'))

  // 1. Estado atual: do banco (padrão) ou de um snapshot JSON (--current, apenas simulação)
  let payload: Payload | undefined
  let editionId: number | string | undefined
  let currentDays: CurrentDay[] = []

  if (options.currentFile) {
    if (apply) throw new Error('--current só pode ser usado em simulação (sem --apply)')
    console.log(`📄 [Import Schedule] Comparando com snapshot: ${options.currentFile}`)
    currentDays = readCurrentFromFile(path.resolve(process.cwd(), options.currentFile))
  } else {
    console.log(`🔌 [Import Schedule] Conectando ao Payload CMS...`)
    const { getPayload } = await import('payload')
    const { default: config } = await import('@payload-config')
    payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'editions',
      where: { year: { equals: year } },
      limit: 1,
      depth: 0,
    })
    const edition = existing.docs[0]
    if (!edition) {
      throw new Error(`Edição ${year} não encontrada. Crie a edição pelo admin antes de importar a programação.`)
    }
    editionId = edition.id
    currentDays = (edition.schedule || []) as CurrentDay[]
  }

  // 2. Monta a nova grade e o relatório
  const { schedule, report } = buildSchedule(sheetDays, currentDays)
  const reportText = formatReport(report, { year, csv: path.relative(process.cwd(), csvPath), apply })
  const reportPath = path.join(outDir, `relatorio-${year}-${stamp}.md`)
  fs.writeFileSync(reportPath, reportText, 'utf-8')
  console.log('\n' + reportText)
  console.log(`📝 Relatório salvo em ${path.relative(process.cwd(), reportPath)}`)

  if (!apply || !payload || editionId === undefined) {
    console.log(`\n🧪 Simulação concluída. Nada foi gravado. Revise o relatório e rode novamente com --apply.\n`)
    return report
  }

  // 3. Backup do estado atual antes de gravar
  const backupPath = path.join(outDir, `edicao-${year}-${stamp}.json`)
  fs.writeFileSync(backupPath, JSON.stringify(currentDays, null, 2), 'utf-8')
  console.log(`💾 Backup da grade atual salvo em ${path.relative(process.cwd(), backupPath)}`)

  // 4. Vincula palestrantes novos/alterados (nomes únicos; listas com ";" ficam só como texto)
  const speakerCache = new Map<string, number>()
  for (const day of schedule) {
    for (const event of day.events) {
      for (const talk of event.talks) {
        if (!talk.speakerRef && talk.palestrante && !talk.palestrante.includes(';') && talk.palestrante.length < 80) {
          talk.speakerRef = (await upsertSpeaker(payload, talk.palestrante, speakerCache)) ?? undefined
        }
      }
    }
  }

  await payload.update({
    collection: 'editions',
    id: editionId,
    data: { schedule },
  })

  console.log(`\n✅ [Import Schedule] Programação ${year} gravada (${report.changed.length} alteradas, ${report.added.length} novas, ${report.removed.length} removidas).\n`)
  return report
}

// Execução CLI direta
const currentFilePath = fileURLToPath(import.meta.url)
const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFilePath)
if (isMainModule) {
  const arg = (flag: string) => {
    const idx = process.argv.indexOf(flag)
    return idx !== -1 ? process.argv[idx + 1] : undefined
  }

  importSchedule({
    filePath: arg('--file'),
    year: arg('--year') ? parseInt(arg('--year')!, 10) : 2026,
    apply: process.argv.includes('--apply'),
    currentFile: arg('--current'),
  })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Erro na importação:', err)
      process.exit(1)
    })
}
