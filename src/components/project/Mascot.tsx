'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { X, Sparkles, Lightbulb, MessageSquareQuote, RefreshCw } from 'lucide-react'
import dialoguesData from '@/data/mascot-dialogues.json'

type Pose = 'waving' | 'reading' | 'eureka'

interface SpeechMessage {
  text: string
  pose: Pose
  badge: string
  isEphemeral?: boolean
}

const POSE_IMAGES: Record<Pose, string> = {
  waving: '/images/mascot/curie-waving.png',
  reading: '/images/mascot/curie-reading.png',
  eureka: '/images/mascot/curie-eureka.png',
}

const POSE_ALTS: Record<Pose, string> = {
  waving: 'Marie Curie acenando em boas-vindas',
  reading: 'Marie Curie lendo seu livro de anotações científicas',
  eureka: 'Marie Curie tendo uma ideia com uma lâmpada e frasco brilhante',
}

const OBSERVED_SECTIONS = ['programacao', 'localizacao', 'inscricao', 'noticias', 'faq']

export function Mascot() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isBubbleOpen, setIsBubbleOpen] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<SpeechMessage>({
    text: dialoguesData.welcome.text,
    pose: dialoguesData.welcome.pose as Pose,
    badge: dialoguesData.welcome.badge,
  })
  const [pose, setPose] = useState<Pose>('waving')
  const [isJumping, setIsJumping] = useState(false)

  const triviaIndexRef = useRef(0)
  const visitedSectionsRef = useRef<Set<string>>(new Set())
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isUserInteractingRef = useRef(false)

  // Aparição inicial tardia e inteligente
  useEffect(() => {
    setMounted(true)
    const storedMinimized = sessionStorage.getItem('marie_curie_mascot_minimized')
    if (storedMinimized === 'true') {
      setIsMinimized(true)
      setIsVisible(true)
      return
    }

    let triggered = false
    const triggerEntrance = () => {
      if (triggered) return
      triggered = true
      setIsVisible(true)
      setPose('waving')
      setCurrentMessage({
        text: dialoguesData.welcome.text,
        pose: dialoguesData.welcome.pose as Pose,
        badge: dialoguesData.welcome.badge,
      })
      setIsBubbleOpen(true)

      autoCloseTimerRef.current = setTimeout(() => {
        setPose('reading')
        setIsBubbleOpen(false)
      }, 7000)
    }

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
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current)
    }
  }, [])

  // Reação por contexto: pensamentos em voz alta (efêmeros e espontâneos)
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

        // Aguarda 1.8 segundos parado na seção
        debounceTimerRef.current = setTimeout(() => {
          visitedSectionsRef.current.add(sectionId)

          // Se o usuário estiver interagindo ativamente lendo curiosidades, não interrompe
          if (isUserInteractingRef.current) return

          const reaction = (dialoguesData.sectionReactions as Record<string, { text: string; pose: string; badge: string }>)[sectionId]
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
            setIsJumping(true)
            setTimeout(() => setIsJumping(false), 500)

            // Auto-fecha após 6s como um pensamento espontâneo
            if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current)
            autoCloseTimerRef.current = setTimeout(() => {
              setIsBubbleOpen(false)
              setPose('reading')
            }, 6000)
          }
        }, 1800)
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
  }, [mounted])

  // Próxima curiosidade científica (atemporal e fluida)
  const handleNextTrivia = useCallback(() => {
    isUserInteractingRef.current = true
    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current)

    setIsJumping(true)
    setTimeout(() => setIsJumping(false), 500)

    const triviaList = dialoguesData.trivia
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

    // Fica aberto por 14s para leitura confortável
    autoCloseTimerRef.current = setTimeout(() => {
      setIsBubbleOpen(false)
      setPose('reading')
      isUserInteractingRef.current = false
    }, 14000)
  }, [])

  const handleMascotClick = () => {
    handleNextTrivia()
  }

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(true)
    setIsBubbleOpen(false)
    sessionStorage.setItem('marie_curie_mascot_minimized', 'true')
  }

  const handleRestore = () => {
    setIsMinimized(false)
    sessionStorage.removeItem('marie_curie_mascot_minimized')
    handleNextTrivia()
  }

  if (!mounted || !isVisible) return null

  return (
    <aside
      aria-label="Mascote interativa Marie Curie"
      className="fixed bottom-6 left-6 z-40 select-none flex flex-col items-start pointer-events-none"
    >
      {/* Botão Minimizado (Pílula sutil no canto) */}
      <AnimatePresence>
        {isMinimized && (
          <motion.button
            key="minimized-pill"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRestore}
            className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-primary/20 text-xs font-medium text-primary hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            title="Abrir curiosidades com Marie Curie"
          >
            <div className="relative w-6 h-6 overflow-hidden rounded-full border border-primary/30 bg-primary/10">
              <Image
                src="/images/mascot/curie-waving.png"
                alt="Marie Curie avatar"
                fill
                sizes="24px"
                className="object-cover object-top"
              />
            </div>
            <span className="flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
              Conversar com Marie
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mascote Expandida */}
      <AnimatePresence>
        {!isMinimized && (
          <div className="pointer-events-auto flex flex-col items-start">
            {/* Balão de Fala */}
            <AnimatePresence mode="wait">
              {isBubbleOpen && (
                <motion.div
                  key={`bubble-${currentMessage.text.slice(0, 15)}`}
                  initial={{ opacity: 0, y: 12, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="mb-3 max-w-[280px] sm:max-w-xs rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-2xl border border-slate-200/80 text-slate-800 relative group"
                >
                  {/* Cabeçalho do Balão */}
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                      {currentMessage.badge === 'Eureka!' || currentMessage.pose === 'eureka' ? (
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      ) : (
                        <MessageSquareQuote className="w-3.5 h-3.5 text-primary" />
                      )}
                      {currentMessage.badge}
                    </span>

                    <button
                      onClick={handleMinimize}
                      className="text-slate-400 hover:text-slate-600 rounded-full p-0.5 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Minimizar mascote"
                      aria-label="Minimizar mascote"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Texto da fala */}
                  <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700 font-sans">
                    {currentMessage.text}
                  </p>

                  {/* Ação orgânica: Me conta outra! */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-end">
                    <button
                      onClick={handleNextTrivia}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/15 text-primary text-[11px] font-semibold transition-all hover:scale-102 active:scale-98 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3 text-primary animate-spin-hover" />
                      <span>{currentMessage.isEphemeral ? 'Saber uma curiosidade' : 'Me conta outra! ✨'}</span>
                    </button>
                  </div>

                  {/* Seta do balão apontando para a mascote */}
                  <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white/95 border-r border-b border-slate-200/80 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Personagem Marie Curie */}
            <div className="relative group cursor-pointer" onClick={handleMascotClick}>
              {/* Botão de minimizar discreto no hover da personagem */}
              <button
                onClick={handleMinimize}
                aria-label="Minimizar Marie Curie"
                className="absolute -top-1 -right-1 z-10 w-6 h-6 rounded-full bg-white shadow-md border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Minimizar"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Corpo da mascote (firme na base, sem flutuação contínua) */}
              <motion.div
                initial={{ y: 90, opacity: 0 }}
                animate={{
                  y: isJumping ? -14 : 0,
                  opacity: 1,
                  rotate: isJumping ? [-3, 3, 0] : 0,
                }}
                transition={
                  isJumping
                    ? { duration: 0.45, ease: 'easeOut' }
                    : { type: 'spring', damping: 22, stiffness: 260 }
                }
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative w-24 h-40 sm:w-28 sm:h-48 drop-shadow-xl"
              >
                <Image
                  src={POSE_IMAGES[pose]}
                  alt={POSE_ALTS[pose]}
                  fill
                  sizes="(max-width: 640px) 96px, 112px"
                  className="object-contain object-bottom pointer-events-none drop-shadow-md transition-opacity duration-300"
                  priority
                />

                {/* Brilho especial no modo Eureka */}
                {pose === 'eureka' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="absolute -top-2 left-6 pointer-events-none text-amber-400"
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
