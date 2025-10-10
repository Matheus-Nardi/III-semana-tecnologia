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
    { src: "/logos/logo-cnpq.png", alt: "CNPq - Conselho Nacional de Desenvolvimento Científico e Tecnológico", href: "https://www.gov.br/cnpq/pt-br" },
    { src: "/logos/logo-embrapa.png", alt: "Embrapa - Empresa Brasileira de Pesquisa Agropecuária", href: "https://www.embrapa.br/" },
    { src: "/logos/logo-gov-to.png", alt: "Governo do Estado do Tocantins", href: "https://www.to.gov.br/" },
    {
      src: "/logos/logo-mcti.png",
      alt: "MCTI - Ministério da Ciência, Tecnologia e Inovação",
      href: "https://www.gov.br/mcti/pt-br",
    },
    {
      src: "/logos/logo-sebrae.png",
      alt: "Sebrae Tocantins - Serviço Brasileiro de Apoio às Micro e Pequenas Empresas",
      href: "https://sebrae.com.br/sites/PortalSebrae/ufs/to?codUf=24",
    },
    {
      src: "/logos/logo-snct.png",
      alt: "SNCT - Semana Nacional de Ciência e Tecnologia",
      href: "https://semanact.mcti.gov.br/",
    },
  ]

  return (
    <section id="parceiros" className="w-full py-16 sm:py-20 md:py-32 relative overflow-hidden bg-gradient-soft-primary">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="space-y-8 sm:space-y-12">
          {/* Section Header */}
          <div ref={headerRef} className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance font-montserrat text-primary">
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
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center justify-items-center">
            {partnersItems.map((partner, index) => (
              <Link
                key={index}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full h-20 sm:h-24 md:h-28 flex items-center justify-center transition-all duration-500 hover:scale-105 focus-visible:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
                aria-label={`Visite o site de ${partner.alt} (abre em nova aba)`}
              >
                {/* Partner logo */}
                <div className="relative w-full h-full bg-white rounded-xl p-3 sm:p-4 border border-primary/10 group-hover:border-primary/30 group-focus-visible:border-primary/30 transition-all duration-300 shadow-sm group-hover:shadow-md group-focus-visible:shadow-md">
                  <div className="relative w-full h-full">
                    <Image
                      src={partner.src || "/placeholder.svg"}
                      alt={partner.alt}
                      fill
                      className="object-contain"
                      loading="lazy"
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
