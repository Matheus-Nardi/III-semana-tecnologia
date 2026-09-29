'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { X, Sparkles, Lightbulb, ChevronRight, MessageSquareQuote } from 'lucide-react'
import dialoguesData from '@/data/mascot-dialogues.json'

type Pose = 'waving' | 'reading' | 'eureka'

interface DialogueItem {
  id: string
  text: string
  pose: string
  badge: string
}

const dialogues: DialogueItem[] = dialoguesData

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

export function Mascot() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isBubbleOpen, setIsBubbleOpen] = useState(false)
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0)
  const [pose, setPose] = useState<Pose>('waving')
  const [isJumping, setIsJumping] = useState(false)

  const activeDialogue = dialogues[currentDialogueIndex] || dialogues[0]

  // Verifica estado de minimizado no sessionStorage e agenda aparição
  useEffect(() => {
    setMounted(true)
    const storedMinimized = sessionStorage.getItem('marie_curie_mascot_minimized')
    if (storedMinimized === 'true') {
      setIsMinimized(true)
      setIsVisible(true)
      return
    }

    // Aparição apenas após o visitante já estar explorando o site (12 segundos)
    // ou se rolar um pouco a página (gatilho inteligente)
    let triggered = false
    const triggerEntrance = () => {
      if (triggered) return
      triggered = true
      setIsVisible(true)
      setPose('waving')
      setIsBubbleOpen(true)

      // Balão fecha após 8s e ela fica descansando (lendo)
      setTimeout(() => {
        setPose('reading')
        setIsBubbleOpen(false)
      }, 8000)
    }

    // Timer de 12 segundos
    const entranceTimer = setTimeout(triggerEntrance, 12000)

    // Gatilho alternativo por scroll: se o usuário já desceu 400px antes dos 12s
    const handleScroll = () => {
      if (window.scrollY > 400) {
        triggerEntrance()
        window.removeEventListener('scroll', handleScroll)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(entranceTimer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleNextDialogue = useCallback(() => {
    setIsJumping(true)
    setTimeout(() => setIsJumping(false), 500)

    setCurrentDialogueIndex((prev) => {
      const nextIndex = (prev + 1) % dialogues.length
      const nextItem = dialogues[nextIndex]
      if (nextItem?.pose && (nextItem.pose === 'waving' || nextItem.pose === 'reading' || nextItem.pose === 'eureka')) {
        setPose(nextItem.pose as Pose)
      } else {
        setPose('eureka')
      }
      return nextIndex
    })
    setIsBubbleOpen(true)
  }, [])

  const handleMascotClick = () => {
    if (!isBubbleOpen) {
      setIsBubbleOpen(true)
      setPose('eureka')
      setIsJumping(true)
      setTimeout(() => setIsJumping(false), 500)
    } else {
      handleNextDialogue()
    }
  }

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(true)
    setIsBubbleOpen(false)
    sessionStorage.setItem('marie_curie_mascot_minimized', 'true')
  }

  const handleRestore = () => {
    setIsMinimized(false)
    setIsBubbleOpen(true)
    setPose('waving')
    sessionStorage.removeItem('marie_curie_mascot_minimized')
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
            className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-primary/20 text-xs font-medium text-primary hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
            title="Abrir dicas da Marie Curie"
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
              Dicas da Marie
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
                  key={`bubble-${activeDialogue.id}`}
                  initial={{ opacity: 0, y: 12, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="mb-3 max-w-[280px] sm:max-w-xs rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-2xl border border-slate-200/80 text-slate-800 relative group"
                >
                  {/* Cabeçalho do Balão */}
                  <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                      {activeDialogue.badge === 'Eureka!' || activeDialogue.pose === 'eureka' ? (
                        <Lightbulb className="w-3 h-3 text-amber-500 fill-amber-400" />
                      ) : (
                        <MessageSquareQuote className="w-3 h-3 text-primary" />
                      )}
                      {activeDialogue.badge}
                    </span>

                    <button
                      onClick={handleMinimize}
                      className="text-slate-400 hover:text-slate-600 rounded-full p-0.5 hover:bg-slate-100 transition-colors"
                      title="Minimizar mascote"
                      aria-label="Minimizar mascote"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Texto da fala */}
                  <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700 font-sans">
                    {activeDialogue.text}
                  </p>

                  {/* Ação: Próxima curiosidade */}
                  <div className="mt-2.5 flex justify-end">
                    <button
                      onClick={handleNextDialogue}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors py-0.5 px-1.5 rounded hover:bg-primary/5"
                    >
                      <span>Mais uma dica</span>
                      <ChevronRight className="w-3 h-3" />
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
                className="absolute -top-1 -right-1 z-10 w-6 h-6 rounded-full bg-white shadow-md border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
