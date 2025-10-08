import Image from "next/image"
import Link from "next/link"

export default function Partners() {
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
    <section className="w-full py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance font-montserrat">Parceiros</h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto" />
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 items-center justify-items-center">
            {partnersItems.map((partner, index) => (
              <Link
                key={index}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full h-24 md:h-28 flex items-center justify-center transition-transform hover:scale-110 duration-300"
              >
                <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100">
                  <Image src={partner.src || "/placeholder.svg"} alt={partner.alt} fill className="object-contain" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
