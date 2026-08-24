'use client';
import { motion, useInView } from "motion/react";
import Image from "next/image"
import { useRef } from "react";
import type { Edition } from "@/lib/content";

export default function AboutEvent({ edition }: { edition?: Edition }) {
  const rightRef = useRef(null);
  const titleRef = useRef(null);

  const isTitleInView = useInView(titleRef, { once: false, margin: "-100px" });

  const themeTitle = edition?.about?.themeTitle || "Planeta Água: a cultura oceânica para enfrentar as mudanças climáticas no meu território";
  const dates = edition?.dates || "20 a 24 de outubro de 2025";
  const illustrationSrc = edition?.about?.illustration?.url || "/ilustracoes/globo.png";

  return (
    <section id="sobre" className="w-full py-16 sm:py-20 md:py-32 bg-gradient-soft-primary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Texto à esquerda */}
          <div className="space-y-6 sm:space-y-8">
            <div ref={titleRef} className="space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance font-montserrat leading-tight">
                {edition?.shortTitle || "III Semana de"} <span className="text-primary">Ciência, Tecnologia e Inovação </span> da UNITINS
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
                <p className="text-sm sm:text-base md:text-lg font-poppins pl-4 py-2 whitespace-pre-line">
                  {edition.about.body}
                </p>
              ) : (
                <>
                  <p className="text-sm sm:text-base md:text-lg font-poppins pl-4 py-2">
                    A Universidade Estadual do Tocantins (Unitins) realizará, de {dates}, a {edition?.title || "III Semana de Ciência, Tecnologia e Inovação - SCTI"}, com o tema <strong className="text-primary">“{themeTitle}”</strong>. Integrando a Semana Nacional de Ciência e Tecnologia, o evento reunirá estudantes, professores, pesquisadores e comunidade em torno de palestras, oficinas, exposições e apresentações científicas, promovendo o diálogo entre ensino, pesquisa e extensão.
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-poppins pl-4 py-2">
                    A iniciativa reforça o compromisso da Unitins com o desenvolvimento sustentável e a disseminação do conhecimento, incentivando soluções inovadoras e o engajamento social em prol de um futuro mais equilibrado para o Tocantins e para o Brasil!
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Imagem à direita */}
          <div className="flex justify-center lg:justify-end mt-8 lg:mt-0" ref={rightRef}>
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
              <Image
                src={illustrationSrc}
                alt="Ilustração representando tecnologia e inovação"
                width={600}
                height={500}
                className="animate-float w-full h-auto"
                priority={false}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
