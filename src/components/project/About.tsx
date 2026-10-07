'use client';
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image"
import { useRef } from "react";
import type { Edition } from "@/lib/content";

function renderHighlightedText(text: string) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="text-primary font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function AboutEvent({ edition }: { edition?: Edition }) {
  const rightRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef(null);

  const isTitleInView = useInView(titleRef, { once: false, margin: "-100px" });

  const titlePrefix = edition?.shortTitle
    ? `${edition.shortTitle.split(' ')[0]} ${edition.shortTitle.split(' ')[1] || 'Semana'} de`
    : 'IV Semana de';
  const sectionTitle = edition?.about?.title || `${titlePrefix} Ciência, Tecnologia, Inovação e Extensão da UNITINS`;
  const themeTitle = edition?.about?.themeTitle || "Ciência Delas";
  const dates = edition?.dates || "13 a 16 de outubro de 2026";
  const illustrationSrc = edition?.about?.illustration?.url || "/illustrations/meninas-ciencia.png";
  const illustrationAlt = edition?.about?.illustration?.alt || "Ilustração temática da Semana de Ciência, Tecnologia, Inovação e Extensão";

  // Efeito interativo de Tilt 3D suave com aceleração de mola (Spring)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rightRef.current) return;
    const rect = rightRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section id="sobre" className="w-full py-16 sm:py-20 md:py-32 bg-gradient-soft-primary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Texto à esquerda */}
          <div className="space-y-6 sm:space-y-8">
            <div ref={titleRef} className="space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance font-montserrat leading-tight">
                {(() => {
                  const highlightRegex = /(Ciência,\s+Tecnologia(?:,\s+Inovação)?(?:\s+e\s+(?:Inovação|Extensão))?(?:\s+e\s+Extensão)?)/i;
                  const match = sectionTitle.match(highlightRegex);
                  if (match) {
                    const parts = sectionTitle.split(match[0]);
                    return (
                      <>
                        {parts[0]}
                        <span className="text-primary">{match[0]}</span>
                        {parts.slice(1).join(match[0])}
                      </>
                    );
                  }
                  return sectionTitle;
                })()}
              </h2>

              <motion.div
                className="h-1 bg-primary rounded-full"
                initial={{ width: "4rem" }}
                animate={{
                  width: isTitleInView ? "12rem" : "4rem"
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut"
                }}
                aria-hidden="true"
              />
            </div>

            <div className="space-y-4 sm:space-y-6 text-muted-foreground leading-relaxed">
              {edition?.about?.body ? (
                edition.about.body
                  .split(/\r?\n\r?\n/)
                  .filter(Boolean)
                  .map((paragraph, idx) => (
                    <p key={idx} className="text-sm sm:text-base md:text-lg font-poppins pl-4 py-2 whitespace-pre-line">
                      {renderHighlightedText(paragraph)}
                    </p>
                  ))
              ) : (
                <>
                  <p className="text-sm sm:text-base md:text-lg font-poppins pl-4 py-2">
                    A Universidade Estadual do Tocantins (Unitins) realizará, de {dates}, a {edition?.title || "IV Semana de Ciência, Tecnologia, Inovação e Extensão - SCTIE"}, com o tema <strong className="text-primary font-semibold">“{themeTitle}”</strong>. Integrando a Semana Nacional de Ciência e Tecnologia, o evento reunirá estudantes, professores, pesquisadores e comunidade em torno de palestras, oficinas, exposições e apresentações científicas, promovendo o diálogo entre ensino, pesquisa e extensão.
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-poppins pl-4 py-2">
                    A iniciativa reforça o compromisso da Unitins com o desenvolvimento sustentável e a disseminação do conhecimento, incentivando soluções inovadoras e o engajamento social em prol de um futuro mais equilibrado para o Tocantins e para o Brasil!
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Imagem à direita com Aura Luminosa e Tilt 3D */}
          <div
            ref={rightRef}
            className="flex justify-center lg:justify-end mt-8 lg:mt-0 [perspective:1000px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              style={{ rotateX, rotateY }}
              className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl flex items-center justify-center"
            >
              {/* Aura luminosa difusa atrás da ilustração (Backlight Glow) */}
              <div
                className="absolute inset-4 -z-10 rounded-full bg-gradient-to-tr from-accent/25 via-primary/20 to-accent/15 blur-3xl opacity-75 animate-pulse"
                aria-hidden="true"
              />

              {/* Elemento com flutuação fluida e proporção preservada */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[14/11]">
                <Image
                  src={illustrationSrc}
                  alt={illustrationAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  className="animate-float object-contain drop-shadow-2xl"
                  priority={false}
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
