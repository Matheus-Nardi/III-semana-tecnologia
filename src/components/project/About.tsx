'use client';
import { Sparkles } from "lucide-react";
import { motion, useInView } from "motion/react";
import Image from "next/image"
import { useRef } from "react";
import { TypeAnimation } from 'react-type-animation'


export default function AboutEvent() {
  const rightRef = useRef(null);
  const titleRef = useRef(null);

  // Hook detecta se o elemento está visível na tela
  const isRightInView = useInView(rightRef, { once: false, margin: "-100px" });
  const isTitleInView = useInView(titleRef, { once: false, margin: "-100px" });

  return (
    <section id="sobre" className="w-full py-16 sm:py-20 md:py-32 bg-gradient-soft-primary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Texto à esquerda */}
          <div className="space-y-6 sm:space-y-8">
            <div ref={titleRef} className="space-y-4"> 
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance font-montserrat leading-tight">
                III Semana de <span className="text-primary">Ciência, Tecnologia e Inovação </span> da UNITINS
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
              <p className="text-sm sm:text-base md:text-lg font-poppins pl-4 py-2 border-l-4 border-primary/30">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia nobis ab doloribus veritatis nam
                reprehenderit quisquam, error distinctio voluptates quae sapiente cum necessitatibus cupiditate tempora
                qui ipsam omnis dolorem ea.
              </p>
              <p className="text-sm sm:text-base md:text-lg font-poppins pl-4 py-2 border-l-4 border-primary/30">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem asperiores est maiores vel temporibus
                iure voluptatem distinctio ad provident eaque, porro hic voluptate nam dolor obcaecati, quia
                dignissimos, delectus cumque!
              </p>
            </div>
          </div>

          {/* Imagem à direita */}
          <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
              <Image
                src="/ilustracoes/globo.png"
                alt="Ilustração de um globo representando tecnologia e inovação"
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
