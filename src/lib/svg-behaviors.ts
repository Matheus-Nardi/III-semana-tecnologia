import gsap from 'gsap'

export type SvgAnimationFunction = (
  svg: SVGSVGElement,
  options?: {
    interactive?: boolean
  }
) => gsap.core.Animation | gsap.core.Timeline | void

/**
 * Utilitário: extrai e normaliza elementos do SVG em proporções relativas (0 a 1),
 * eliminando números mágicos e dependências de dimensões fixas em pixels.
 */
function extractRelativeSvgElements(svg: SVGSVGElement) {
  const viewBox = svg.viewBox?.baseVal
  const svgWidth = viewBox?.width || svg.clientWidth || 1024
  const svgHeight = viewBox?.height || svg.clientHeight || 1024

  const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path'))

  return paths.map((path) => {
    try {
      const bbox = path.getBBox()
      return {
        element: path,
        relY: (bbox.y + bbox.height / 2) / svgHeight,
        relWidth: bbox.width / svgWidth,
        relHeight: bbox.height / svgHeight,
        fill: (path.getAttribute('fill') || '').toLowerCase(),
      }
    } catch {
      return {
        element: path,
        relY: 0,
        relWidth: 0,
        relHeight: 0,
        fill: '',
      }
    }
  })
}

/**
 * Registro de comportamentos para animações em SVGs
 */
export const svgBehaviors: Record<string, SvgAnimationFunction> = {
  /**
   * 🧬 Comportamento: DNA Double Helix
   * Prioriza contratos declarativos limpos (.dna-gene, [data-gene]) e faz
   * fallback gracioso para análise normalizada relativa (sem valores em pixels brutos).
   */
  dna: (svg, options = { interactive: true }) => {
    // 1. Busca Declarativa (Contrato Semântico Limpo por Classes ou Atributos)
    let geneElements = Array.from(
      svg.querySelectorAll<SVGElement>('.dna-gene, [data-gene], [data-part="gene"]')
    )
    let strandElements = Array.from(
      svg.querySelectorAll<SVGElement>('.dna-strand, [data-strand], [data-part="strand"]')
    )
    let highlightElements = Array.from(
      svg.querySelectorAll<SVGElement>('.dna-highlight, [data-highlight]')
    )

    // 2. Se o SVG veio "cru" sem tags declarativas, usa proporções relativas normalizadas
    if (geneElements.length === 0) {
      const items = extractRelativeSvgElements(svg).sort((a, b) => a.relY - b.relY)

      geneElements = items
        .filter((item) => !item.fill.includes('fff') && item.relWidth >= 0.04 && item.relWidth <= 0.35)
        .map((item) => item.element)

      strandElements = items
        .filter((item) => !item.fill.includes('fff') && (item.relWidth > 0.35 || item.relHeight > 0.2))
        .map((item) => item.element)

      highlightElements = items
        .filter((item) => item.fill.includes('fff'))
        .map((item) => item.element)
    }

    const masterTl = gsap.timeline({ repeat: -1 })

    // Animação dos Genes: onda sinusoidal suave com expansão e contração 2.5D
    if (geneElements.length > 0) {
      geneElements.forEach((el) => {
        gsap.set(el, { transformOrigin: '50% 50%' })
      })

      gsap.to(geneElements, {
        scaleX: 0.85,
        scaleY: 1.06,
        y: '+=6',
        duration: 1.8,
        ease: 'sine.inOut',
        stagger: {
          each: 0.1,
          repeat: -1,
          yoyo: true,
        },
      })
    }

    // Animação das Fitas: flexão elástica suave
    if (strandElements.length > 0) {
      strandElements.forEach((el) => {
        gsap.set(el, { transformOrigin: '50% 50%' })
      })

      gsap.to(strandElements, {
        scale: 1.02,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.15,
        },
      })
    }

    // Animação dos Highlights / Reflexos
    if (highlightElements.length > 0) {
      gsap.to(highlightElements, {
        opacity: 0.3,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.08,
        },
      })
    }

    // Flutuação global com leve inclinação
    gsap.to(svg, {
      y: -12,
      rotation: 2,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      transformOrigin: '50% 50%',
    })

    // Parallax ao mover o mouse
    if (options.interactive && svg.parentElement) {
      const parent = svg.parentElement
      const onMove = (e: MouseEvent) => {
        const rect = parent.getBoundingClientRect()
        const nx = (e.clientX - rect.left) / rect.width - 0.5
        const ny = (e.clientY - rect.top) / rect.height - 0.5
        gsap.to(svg, {
          rotateY: nx * 16,
          rotateX: -ny * 16,
          duration: 0.8,
          ease: 'power2.out',
        })
      }
      const onLeave = () => {
        gsap.to(svg, {
          rotateY: 0,
          rotateX: 0,
          duration: 1.2,
          ease: 'power2.out',
        })
      }
      parent.addEventListener('mousemove', onMove)
      parent.addEventListener('mouseleave', onLeave)
    }

    return masterTl
  },

  /**
   * 🌐 Comportamento Padrão / Genérico
   */
  default: (svg) => {
    gsap.set(svg, { transformOrigin: '50% 50%' })
    return gsap.to(svg, {
      y: -10,
      scale: 1.02,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  },
}

/**
 * Resolução semântica do comportamento:
 * 1. Atributo explícito data-behavior no próprio SVG (<svg data-behavior="dna">)
 * 2. Classes declarativas internas (se contiver .dna-gene ou [data-gene], identifica automaticamente)
 * 3. Identificador na URL/arquivo
 * 4. Fallback limpo para 'default'
 */
export function resolveSvgBehavior(
  svg: SVGSVGElement,
  src?: string,
  explicitBehavior?: string
): SvgAnimationFunction {
  if (explicitBehavior && svgBehaviors[explicitBehavior]) {
    return svgBehaviors[explicitBehavior]
  }

  // 1. O próprio SVG declara seu comportamento
  const dataBehavior = svg.getAttribute('data-behavior')
  if (dataBehavior && svgBehaviors[dataBehavior]) {
    return svgBehaviors[dataBehavior]
  }

  // 2. O SVG contém classes ou atributos declarativos de DNA
  if (svg.querySelector('.dna-gene, [data-gene]')) {
    return svgBehaviors.dna
  }

  // 3. Verificação pela URL/arquivo
  const normalizedSrc = (src || '').toLowerCase()
  if (normalizedSrc.includes('dna') || normalizedSrc.includes('helix') || normalizedSrc.includes('gene')) {
    return svgBehaviors.dna
  }

  return svgBehaviors.default
}
