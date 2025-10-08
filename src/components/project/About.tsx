'use client';
import { Sparkles } from "lucide-react";
import { motion, useInView } from "motion/react";
import Image from "next/image"
import { useRef } from "react";
import { TypeAnimation } from 'react-type-animation'


export default function AboutEvent() {
  const rightRef = useRef(null);

  // Hook detecta se o elemento está visível na tela
  const isRightInView = useInView(rightRef, { once: false, margin: "-100px" });

  return (
    <section id="sobre" className="w-full py-20 md:py-32 bg-secondary/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Texto à esquerda */}
          <div className="space-y-8">
            <div className="space-y-4"> 
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance font-montserrat">
                III Semana de{' '}
                <TypeAnimation
                    sequence={[
                        'Ciência',
                        2000, 
                        'Tecnologia',
                        2000, 
                        'Inovação',
                        2000,
                        'Ciência, Tecnologia e Inovação da UNITINS',
                        20000, 
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                    cursor={true}
                    className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight text-balance text-primary"
                />
              </h2>

              <div className="h-1 w-16 bg-primary rounded-full" />
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-base md:text-lg font-poppins pl-4 py-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia nobis ab doloribus veritatis nam
                reprehenderit quisquam, error distinctio voluptates quae sapiente cum necessitatibus cupiditate tempora
                qui ipsam omnis dolorem ea.
              </p>
              <p className="text-base md:text-lg font-poppins pl-4 py-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem asperiores est maiores vel temporibus
                iure voluptatem distinctio ad provident eaque, porro hic voluptate nam dolor obcaecati, quia
                dignissimos, delectus cumque!
              </p>
            </div>
          </div>

          {/* Imagem à direita */}
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/ilustracoes/globo.png"
              alt="Ilustração de um globo representando tecnologia e inovação"
              width={600}
              height={500}
              className="animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
