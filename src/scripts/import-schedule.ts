import 'dotenv/config'

import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseScheduleCsv, type ParsedDay } from './parse-csv-schedule'

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

export async function importSchedule(options?: {
  filePath?: string
  year?: number
  isDefault?: boolean
}) {
  const year = options?.year || 2026
  const targetSlug = String(year)
  const isDefault = options?.isDefault ?? false

  console.log(`\n🚀 [Import Schedule] Conectando ao Payload CMS para a edição ${year}...`)
  const payload = await getPayload({ config })

  // 1. Carrega os dados da programação
  let scheduleDays: ParsedDay[] = []
  const customFilePath = options?.filePath
    ? path.resolve(process.cwd(), options.filePath)
    : path.resolve(process.cwd(), 'src/data/raw/2026/programacao-2026.csv')

  if (fs.existsSync(customFilePath)) {
    if (customFilePath.endsWith('.json')) {
      console.log(`📖 [Import Schedule] Lendo JSON estruturado: ${customFilePath}`)
      scheduleDays = JSON.parse(fs.readFileSync(customFilePath, 'utf-8'))
    } else {
      console.log(`📖 [Import Schedule] Lendo e fazendo parse do CSV: ${customFilePath}`)
      const csvRaw = fs.readFileSync(customFilePath, 'utf-8')
      scheduleDays = parseScheduleCsv(csvRaw)
    }
  } else {
    // Fallback para src/data/schedule-2026.json se existir
    const jsonFallback = path.resolve(process.cwd(), `src/data/schedule-${year}.json`)
    if (fs.existsSync(jsonFallback)) {
      console.log(`📖 [Import Schedule] Usando arquivo JSON fallback: ${jsonFallback}`)
      scheduleDays = JSON.parse(fs.readFileSync(jsonFallback, 'utf-8'))
    } else {
      throw new Error(`Arquivo de programação não encontrado em "${customFilePath}" nem em "${jsonFallback}"`)
    }
  }

  // 2. Mapeamento e Upsert de Palestrantes
  console.log(`👥 [Import Schedule] Mapeando e cadastrando palestrantes...`)
  const speakerCache = new Map<string, number>()
  let linkedSpeakersCount = 0

  const formattedSchedule = []

  for (const day of scheduleDays) {
    const formattedEvents = []

    for (const event of day.events) {
      const formattedTalks = []

      for (const talk of event.talks) {
        let speakerRef: number | undefined = undefined

        // Se tiver palestrante único bem definido (sem ponto-e-vírgula com dezenas de nomes)
        if (talk.palestrante && !talk.palestrante.includes(';') && talk.palestrante.length < 80) {
          const speakerId = await upsertSpeaker(payload, talk.palestrante, speakerCache)
          if (speakerId) {
            speakerRef = speakerId
            linkedSpeakersCount++
          }
        }

        formattedTalks.push({
          titulo: talk.titulo,
          horario: talk.horario,
          local: talk.local,
          palestrante: talk.palestrante,
          ...(speakerRef ? { speakerRef } : {}),
          vagas: talk.vagas || '',
          meetLink: talk.meetLink || undefined,
        })
      }

      formattedEvents.push({
        name: event.name,
        color: (event as { color?: string }).color || '#083D77',
        talks: formattedTalks,
      })
    }

    const isOnline = day.date.toLowerCase().includes('online') || day.dayOfWeek.toLowerCase().includes('ead')
    const validDays = [
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
    type DayOfWeekOption = typeof validDays[number]
    const sanitizedDayOfWeek: DayOfWeekOption = validDays.includes(day.dayOfWeek as DayOfWeekOption)
      ? (day.dayOfWeek as DayOfWeekOption)
      : 'Todos os dias'

    formattedSchedule.push({
      date: day.date,
      dayOfWeek: sanitizedDayOfWeek,
      isOnline,
      events: formattedEvents,
    })
  }

  // 3. Upsert da Edição 2026
  console.log(`💾 [Import Schedule] Salvando dados na coleção "editions"...`)

  const existingEditionQuery = await payload.find({
    collection: 'editions',
    where: {
      year: {
        equals: year,
      },
    },
    limit: 1,
  })

  if (existingEditionQuery.totalDocs > 0 && existingEditionQuery.docs[0]) {
    const existing = existingEditionQuery.docs[0]
    console.log(`🔄 [Import Schedule] Edição ${year} já existe (ID: ${existing.id}). Atualizando grade sem sobrescrever customizações...`)

    await payload.update({
      collection: 'editions',
      id: existing.id,
      data: {
        dates: '13 a 16 de outubro de 2026',
        schedule: formattedSchedule,
      },
    })
    console.log(`✅ [Import Schedule] Grade da edição ${year} atualizada com sucesso!`)
  } else {
    console.log(`✨ [Import Schedule] Criando nova edição ${year}...`)

    await payload.create({
      collection: 'editions',
      data: {
        slug: targetSlug,
        year,
        title: 'IV Semana de Ciência, Tecnologia e Inovação',
        shortTitle: 'IV Semana de Tecnologia',
        isDefault,
        dates: '13 a 16 de outubro de 2026',
        registrationUrl: 'https://unitins.br',
        theme: {
          primaryColor: '#083D77',
          accentColor: '#e2187f',
          secondaryColor: '#E3F5FF',
        },
        about: {
          title: 'IV Semana de Ciência, Tecnologia e Inovação da UNITINS',
          themeTitle: 'Ciência, Tecnologia e Inovação para o Desenvolvimento Regional',
          body: 'A Universidade Estadual do Tocantins (Unitins) realizará, de 13 a 16 de outubro de 2026, a IV Semana de Ciência, Tecnologia e Inovação - SCTI. Integrando a Semana Nacional de Ciência e Tecnologia, o evento reunirá estudantes, professores, pesquisadores e comunidade em torno de palestras, oficinas, exposições e apresentações científicas.',
        },
        schedule: formattedSchedule,
      },
    })
    console.log(`✅ [Import Schedule] Edição ${year} criada com sucesso!`)
  }

  console.log(`\n🎉 [Import Schedule] Carga concluída com sucesso!`)
  console.log(`📊 Resumo da Importação:`)
  console.log(`   - Edição: ${year} (/slug: ${targetSlug})`)
  console.log(`   - Dias de Programação: ${formattedSchedule.length}`)
  console.log(`   - Palestrantes no Cache/Banco: ${speakerCache.size}`)
  console.log(`   - Vínculos diretos criados: ${linkedSpeakersCount}\n`)
}

// Execução CLI direta
const currentFilePath = fileURLToPath(import.meta.url)
const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFilePath)
if (isMainModule) {
  const fileArgIdx = process.argv.indexOf('--file')
  const yearArgIdx = process.argv.indexOf('--year')
  const isDefaultArg = process.argv.includes('--set-default')

  const filePath = fileArgIdx !== -1 && process.argv[fileArgIdx + 1] ? process.argv[fileArgIdx + 1] : undefined
  const year = yearArgIdx !== -1 && process.argv[yearArgIdx + 1] ? parseInt(process.argv[yearArgIdx + 1], 10) : 2026

  importSchedule({
    filePath,
    year,
    isDefault: isDefaultArg,
  })
    .then(() => {
      console.log('🏁 Processo finalizado com sucesso!')
      process.exit(0)
    })
    .catch((err) => {
      console.error('❌ Erro na importação:', err)
      process.exit(1)
    })
}
