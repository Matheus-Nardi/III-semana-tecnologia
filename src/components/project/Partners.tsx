'use client'
import Image from "next/image"
import Link from "next/link"
import { Award } from "lucide-react"
import { motion, useInView } from "motion/react"
import { useRef } from "react"

export default function Partners() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: false, margin: "-100px" });

  const partnersItems = [
    { src: "/logos/logo-cnpq.png", alt: "Logo cnpq", href: "https://www.gov.br/cnpq/pt-br" },
    { src: "/logos/logo-embrapa.png", alt: "Logo embrapa", href: "https://www.embrapa.br/" },
    { src: "/logos/logo-gov-to.png", alt: "Logo Governo do Tocantins", href: "https://www.to.gov.br/" },
    {
      src: "/logos/logo-mcti.png",
      alt: "Logo Ministério de Ciência, Tecnologia, Inovação",
      href: "https://www.gov.br/mcti/pt-br",
    },
    {
      src: "/logos/logo-sebrae.png",
      alt: "Logo Sebrae",
      href: "https://sebrae.com.br/sites/PortalSebrae/ufs/to?codUf=24",
    },
    {
      src: "/logos/logo-snct.png",
      alt: "Logo Semana Nacional de Ciência e Tecnologia",
      href: "https://semanact.mcti.gov.br/",
    },
  ]

  return (
    <section id="parceiros" className="w-full py-20 md:py-32 relative overflow-hidden bg-gradient-soft-secondary">

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="space-y-12">
          {/* Section Header */}
          <div ref={headerRef} className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance font-montserrat text-primary">
              Parceiros
            </h2>
            <div className="flex justify-center">
              <motion.div 
                className="h-1 bg-primary rounded-full"
                initial={{ width: "4rem" }}
                animate={{ 
                  width: isHeaderInView ? "12rem" : "4rem" 
                }}
                transition={{ 
                  duration: 0.8, 
                  ease: "easeInOut" 
                }}
              />
            </div>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 items-center justify-items-center">
            {partnersItems.map((partner, index) => (
              <Link
                key={index}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full h-24 md:h-28 flex items-center justify-center transition-all duration-500 hover:scale-105"
              >
                {/* Partner logo */}
                <div className="relative w-full h-full bg-white rounded-xl p-4 border border-primary/10 group-hover:border-primary/30 shadow-sm group-hover:shadow-md transition-all duration-500">
                  <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 opacity-70 group-hover:opacity-100">
                    <Image
                      src={partner.src || "/placeholder.svg"}
                      alt={partner.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
