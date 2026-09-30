'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { X, Sparkles, Lightbulb, MessageSquareQuote, RefreshCw } from 'lucide-react'
import dialoguesData from '@/data/mascot-dialogues.json'

type CharacterId = 'curie' | 'ada' | 'jaqueline'
type Pose = 'waving' | 'reading' | 'eureka'

interface SpeechMessage {
  text: string
  pose: Pose
  badge: string
  isEphemeral?: boolean
}

const CHARACTERS: CharacterId[] = ['curie', 'ada', 'jaqueline']
const POSES: Pose[] = ['waving', 'reading', 'eureka']

// Seções com reações contextuais, incluindo 'parceiros'
const OBSERVED_SECTIONS = ['programacao', 'localizacao', 'inscricao', 'parceiros', 'noticias', 'faq']

export function Mascot() {
  const [mounted, setMounted] = useState(false)
  const [isImagesReady, setIsImagesReady] = useState(false)
  const [characterId, setCharacterId] = useState<CharacterId>('curie')
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isBubbleOpen, setIsBubbleOpen] = useState(false)
  const [pose, setPose] = useState<Pose>('waving')

  const activeCharData = dialoguesData[characterId] || dialoguesData.curie

  const [currentMessage, setCurrentMessage] = useState<SpeechMessage>({
    text: activeCharData.welcome.text,
    pose: activeCharData.welcome.pose as Pose,
    badge: activeCharData.welcome.badge,
  })

  const triviaIndexRef = useRef(0)
  const visitedSectionsRef = useRef<Set<string>>(new Set())
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isUserInteractingRef = useRef(false)

  // Inicialização, sorteio da cientista e pré-carregamento imediato das 3 poses
  useEffect(() => {
    setMounted(true)

    // Sorteia aleatoriamente uma das 3 cientistas no carregamento
    const chosenChar = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
    setCharacterId(chosenChar)

    const charData = dialoguesData[chosenChar]
    setCurrentMessage({
      text: charData.welcome.text,
      pose: charData.welcome.pose as Pose,
      badge: charData.welcome.badge,
    })

    // Pré-carregamento paralelo de todas as poses da cientista para transições suaves
    const preloadPromises = POSES.map((p) => {
      return new Promise<void>((resolve) => {
        const img = new window.Image()
        img.src = `/images/mascot/${chosenChar}-${p}.png`
        img.onload = () => resolve()
        img.onerror = () => resolve()
      })
    })

    Promise.all(preloadPromises).then(() => {
      setIsImagesReady(true)
    })

    // Detecção mobile nativa: no mobile, inicia minimizado em segundo plano
    const isMobile = window.innerWidth < 768
    const storedMinimized = sessionStorage.getItem('unitins_mascot_minimized')

    if (isMobile || storedMinimized === 'true') {
      setIsMinimized(true)
      setIsVisible(true)
      return
    }

    // No desktop: entrada suave e não intrusiva
    let triggered = false
    const triggerEntrance = () => {
      if (triggered) return
      triggered = true
      setIsVisible(true)
      setPose('waving')
      setIsBubbleOpen(true)
    }

    // Timer de entrada tardia no desktop (12 segundos) ou scroll inicial
    const entranceTimer = setTimeout(triggerEntrance, 12000)

    const handleInitialScroll = () => {
      if (window.scrollY > 400) {
        triggerEntrance()
        window.removeEventListener('scroll', handleInitialScroll)
      }
    }
    window.addEventListener('scroll', handleInitialScroll, { passive: true })

    return () => {
      clearTimeout(entranceTimer)
      window.removeEventListener('scroll', handleInitialScroll)
    }
  }, [])

  const isMinimizedRef = useRef(isMinimized)
  useEffect(() => {
    isMinimizedRef.current = isMinimized
  }, [isMinimized])

  // Identifica a seção da página visível na tela no momento
  const getVisibleSection = useCallback(() => {
    if (typeof window === 'undefined') return null
    const sections = ['programacao', 'parceiros', 'inscricao', 'noticias', 'faq', 'localizacao']
    const viewportCenter = window.innerHeight / 2

    let bestSection: string | null = null
    let minDistance = Infinity

    for (const id of sections) {
      const el = document.getElementById(id)
      if (el) {
        const rect = el.getBoundingClientRect()
        // Se a seção cruza a viewport
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          const sectionCenter = (rect.top + rect.bottom) / 2
          const distance = Math.abs(sectionCenter - viewportCenter)
          if (distance < minDistance) {
            minDistance = distance
            bestSection = id
          }
        }
      }
    }

    return bestSection
  }, [])

  // Reação por contexto com a voz da cientista ao rolar pelas seções
  useEffect(() => {
    if (!mounted) return

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue

        const sectionId = entry.target.id
        if (!sectionId || visitedSectionsRef.current.has(sectionId)) continue

        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(() => {
          visitedSectionsRef.current.add(sectionId)

          // Se estiver minimizada ou se o usuário estiver interagindo, não abre balão de surpresa
          if (isMinimizedRef.current || isUserInteractingRef.current) return

          const charData = dialoguesData[characterId]
          const reaction = (charData.sectionReactions as Record<string, { text: string; pose: string; badge: string }>)[sectionId]

          if (reaction) {
            setCurrentMessage({
              text: reaction.text,
              pose: reaction.pose as Pose,
              badge: reaction.badge,
              isEphemeral: true,
            })
            setPose(reaction.pose as Pose)
            setIsVisible(true)
            setIsBubbleOpen(true)
          }
        }, 1500)
      }
    }

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.25,
      rootMargin: '0px 0px -100px 0px',
    })

    OBSERVED_SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => {
      observer.disconnect()
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [mounted, characterId])

  // Próxima curiosidade da cientista ativa (interação estável e sem saltos bruscos)
  const handleNextTrivia = useCallback(() => {
    isUserInteractingRef.current = true

    const triviaList = dialoguesData[characterId].trivia
    triviaIndexRef.current = (triviaIndexRef.current + 1) % triviaList.length
    const item = triviaList[triviaIndexRef.current]

    const nextPose = (item?.pose || 'eureka') as Pose
    setPose(nextPose)
    setCurrentMessage({
      text: item.text,
      pose: nextPose,
      badge: item.badge,
      isEphemeral: false,
    })
    setIsBubbleOpen(true)
  }, [characterId])

  const handleMascotClick = () => {
    handleNextTrivia()
  }

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(true)
    setIsBubbleOpen(false)
    sessionStorage.setItem('unitins_mascot_minimized', 'true')
  }

  // Ao puxar/abrir o chat a partir da pílula, conecta com a seção visível ou com as boas-vindas
  const handleRestore = () => {
    setIsMinimized(false)
    sessionStorage.removeItem('unitins_mascot_minimized')
    setIsBubbleOpen(true)

    const visibleSection = getVisibleSection()
    const charData = dialoguesData[characterId] || dialoguesData.curie

    if (visibleSection) {
      const reaction = (charData.sectionReactions as Record<string, { text: string; pose: string; badge: string }>)[visibleSection]
      if (reaction) {
        setCurrentMessage({
          text: reaction.text,
          pose: reaction.pose as Pose,
          badge: reaction.badge,
          isEphemeral: true,
        })
        setPose(reaction.pose as Pose)
        return
      }
    }

    // Se estiver no topo ou em área neutra, abre com as boas-vindas oficiais
    setCurrentMessage({
      text: charData.welcome.text,
      pose: charData.welcome.pose as Pose,
      badge: charData.welcome.badge,
      isEphemeral: true,
    })
    setPose(charData.welcome.pose as Pose)
  }

  if (!mounted || !isVisible) return null

  const avatarSrc = `/images/mascot/${characterId}-waving.png`

  return (
    <aside
      aria-label={`Mascote interativa ${activeCharData.name}`}
      className="fixed bottom-6 left-6 z-40 select-none flex flex-col items-start pointer-events-none"
    >
      {/* Botão Minimizado (Pílula sutil no canto com avatar da cientista) */}
      <AnimatePresence>
        {isMinimized && (
          <motion.button
            key="minimized-pill"
            initial={{ scale: 0.8, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleRestore}
            className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-primary/20 text-xs font-medium text-primary hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            title={`Conversar com ${activeCharData.name}`}
          >
            <div className="relative w-6 h-6 overflow-hidden rounded-full border border-primary/30 bg-primary/10 shrink-0">
              <Image
                src={avatarSrc}
                alt={`${activeCharData.name} avatar`}
                fill
                sizes="24px"
                className="object-cover object-top"
              />
            </div>
            <span className="flex items-center gap-1 font-semibold text-[11px] sm:text-xs">
              <Sparkles className="w-3 h-3 text-accent animate-pulse" />
              Conversar com {activeCharData.shortName}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mascote Expandida */}
      <AnimatePresence>
        {!isMinimized && (
          <div className="pointer-events-auto flex flex-col items-start">
            {/* Balão de Fala Compacto e Harmônico */}
            <AnimatePresence mode="wait">
              {isBubbleOpen && (
                <motion.div
                  key={`bubble-${characterId}-${currentMessage.text.slice(0, 15)}`}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="mb-2.5 max-w-[230px] sm:max-w-[260px] rounded-2xl bg-white/95 backdrop-blur-md p-2.5 sm:p-3 shadow-xl border border-slate-200/90 text-slate-800 relative group"
                >
                  {/* Cabeçalho do Balão */}
                  <div className="flex items-center justify-between gap-1.5 mb-1.5 pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary truncate">
                        {currentMessage.badge === 'Eureka!' || currentMessage.pose === 'eureka' ? (
                          <Lightbulb className="w-3 h-3 text-amber-500 fill-amber-400 shrink-0" />
                        ) : (
                          <MessageSquareQuote className="w-3 h-3 text-primary shrink-0" />
                        )}
                        {currentMessage.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">• {activeCharData.shortName}</span>
                    </div>

                    <button
                      onClick={handleMinimize}
                      className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                      title="Minimizar"
                      aria-label="Minimizar"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Texto da fala compacto e legível */}
                  <p className="text-xs leading-snug text-slate-700 font-sans">
                    {currentMessage.text}
                  </p>

                  {/* Ação: Outra curiosidade */}
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={handleNextTrivia}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 hover:bg-primary/15 text-primary text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-2.5 h-2.5 text-primary" />
                      <span>{currentMessage.isEphemeral ? 'Ver curiosidade' : 'Outra curiosidade'}</span>
                    </button>
                  </div>

                  {/* Seta do balão apontando para a mascote */}
                  <div className="absolute -bottom-1.5 left-7 w-3 h-3 bg-white/95 border-r border-b border-slate-200/90 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Personagem da Cientista Ativa com transição de poses a 60fps */}
            <div
              className="relative group cursor-pointer"
              onClick={handleMascotClick}
              title={`Clique para falar com ${activeCharData.name}`}
            >
              {/* Botão sutil de minimizar ao passar o mouse */}
              <button
                onClick={handleMinimize}
                aria-label={`Minimizar ${activeCharData.name}`}
                className="absolute -top-1 -right-1 z-20 w-5 h-5 rounded-full bg-white shadow-md border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Minimizar"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Container da mascote com animação de entrada suave */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: isImagesReady ? 1 : 0,
                }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-24 h-40 sm:w-28 sm:h-48 drop-shadow-xl"
              >
                {/* Camada de sobreposição com cross-fade a 60fps entre as 3 poses pré-carregadas */}
                {POSES.map((p) => {
                  const isActive = pose === p
                  return (
                    <div
                      key={`${characterId}-${p}`}
                      className={`absolute inset-0 transition-opacity duration-300 ease-in-out pointer-events-none ${
                        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <Image
                        src={`/images/mascot/${characterId}-${p}.png`}
                        alt={`${activeCharData.name} - ${p}`}
                        fill
                        sizes="(max-width: 640px) 96px, 112px"
                        className="object-contain object-bottom drop-shadow-md"
                        priority
                      />
                    </div>
                  )
                })}

                {/* Brilho sutil no modo Eureka */}
                {pose === 'eureka' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="absolute -top-2 left-6 z-20 pointer-events-none text-amber-400"
                  >
                    <Sparkles className="w-5 h-5 fill-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </aside>
  )
}
