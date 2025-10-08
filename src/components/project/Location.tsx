export default function Location() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Texto */}
          <div className="text-center lg:text-left lg:w-1/3 xl:w-2/5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3 lg:mb-4 font-montserrat">
              Localização do evento
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto lg:mx-0 mb-4 lg:mb-6" />
            <p className="text-muted-foreground font-poppins text-base sm:text-lg xl:text-xl max-w-md mx-auto lg:mx-0">
              Todo o evento acontecerá no campus da UNITINS em Palmas
            </p>
          </div>

          {/* Mapa */}
          <div className="w-full lg:w-2/3 xl:w-3/5">
            <div className="relative w-full aspect-video sm:aspect-[4/3] lg:aspect-video rounded-xl overflow-hidden shadow-lg border border-border hover:shadow-xl transition-shadow duration-300">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.9772599216494!2d-48.36306562390588!3d-10.182501909999257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x933b34d9792561fd%3A0x46c870dad9a6640b!2sUniversidade%20Estadual%20do%20Tocantins%20-%20Unitins!5e0!3m2!1spt-BR!2sbr!4v1759885547683!5m2!1spt-BR!2sbr"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização do evento - UNITINS Campus Palmas"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
