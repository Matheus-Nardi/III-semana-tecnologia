'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { resolveSvgBehavior } from '@/lib/svg-behaviors'

interface DynamicIllustrationProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
  behavior?: string
  interactive?: boolean
}

// Cache simples em memória para evitar requisições repetidas ao mesmo SVG
const svgCache = new Map<string, string>()

/**
 * Sanitiza o SVG removendo potenciais scripts maliciosos ou manipuladores inline
 */
function sanitizeSvg(rawSvg: string): string {
  return rawSvg
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s+on\w+="[^"]*"/gi, '')
    .replace(/\s+on\w+='[^']*'/gi, '')
}

export function DynamicIllustration({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 1024px) 0px, 384px',
  behavior,
  interactive = true,
}: DynamicIllustrationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svgMarkup, setSvgMarkup] = useState<string | null>(() => svgCache.get(src) || null)

  const isSvg = Boolean(
    src && (src.endsWith('.svg') || src.includes('.svg?') || src.startsWith('data:image/svg+xml'))
  )

  // 1. Carregamento assíncrono do conteúdo SVG (apenas se for SVG)
  useEffect(() => {
    if (!isSvg || !src) return

    if (svgCache.has(src)) {
      setSvgMarkup(svgCache.get(src)!)
      return
    }

    let isCancelled = false

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`Falha ao carregar SVG: ${res.statusText}`)
        return res.text()
      })
      .then((text) => {
        if (!isCancelled) {
          const cleaned = sanitizeSvg(text)
          svgCache.set(src, cleaned)
          setSvgMarkup(cleaned)
        }
      })
      .catch((err) => {
        console.warn('[DynamicIllustration] Erro ao buscar SVG externo, usando fallback:', err)
      })

    return () => {
      isCancelled = true
    }
  }, [src, isSvg])

  // 2. Anexação do ciclo de vida GSAP quando o SVG estiver no DOM
  useEffect(() => {
    if (!isSvg || !svgMarkup || !containerRef.current) return

    const container = containerRef.current
    const svg = container.querySelector<SVGSVGElement>('svg')
    if (!svg) return

    // Garante que o SVG preencha o container preservando aspecto
    svg.setAttribute('class', 'w-full h-full object-contain overflow-visible')
    svg.setAttribute('role', 'img')
    svg.setAttribute('aria-label', alt)

    // Contexto GSAP isolado para React 19 (elimina timelines e listeners ao desmontar)
    const ctx = gsap.context(() => {
      const runAnimation = resolveSvgBehavior(svg, src, behavior)
      runAnimation(svg, { interactive })
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [svgMarkup, src, behavior, interactive, isSvg, alt])

  // 3. Fallback para imagens rasterizadas convencionais (PNG, JPG, WebP) de edições anteriores
  if (!isSvg) {
    return (
      <div className={className}>
        <Image
          src={src || '/placeholder.svg'}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain drop-shadow-2xl animate-float"
        />
      </div>
    )
  }

  // 4. Renderização do SVG Inline com suporte ao GSAP (sem children na mesma tag)
  if (svgMarkup) {
    return (
      <div
        ref={containerRef}
        className={`relative flex items-center justify-center [perspective:1000px] ${className}`}
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
        aria-label={alt}
        role="img"
      />
    )
  }

  // 5. Estado de carregamento prévio enquanto o XML do SVG é obtido
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain drop-shadow-2xl opacity-60 animate-pulse"
      />
    </div>
  )
}
