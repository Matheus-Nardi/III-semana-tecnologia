import { MapPin } from "lucide-react"

export default function Location() {
  return (
    <section id="localizacao" className="py-20 px-4 relative overflow-hidden bg-secondary/10">
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left space-y-6">
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat text-primary">
              Localização do evento
            </h2>
            
            <div className="flex gap-2 justify-center lg:justify-start">
              <div className="h-1 w-16 bg-primary rounded-full" />
            </div>
            
            <p className="text-muted-foreground font-poppins text-lg leading-relaxed">
              Todo o evento acontecerá no campus Graciosa da UNITINS
            </p>

            {/* Address card */}
            <div className="bg-white border-2 border-primary/20 rounded-2xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg font-montserrat">UNITINS - Campus Graciosa</h3>
                  <p className="text-muted-foreground text-sm">
                    Quadra 109 Norte, Avenida NS 15, Lote 09<br />
                    Plano Diretor Norte<br />
                    Palmas-TO, CEP: 77001-090
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md border-4 border-white/50 ring-2 ring-primary/20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.9772599216494!2d-48.36306562390588!3d-10.182501909999257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x933b34d9792561fd%3A0x46c870dad9a6640b!2sUniversidade%20Estadual%20do%20Tocantins%20-%20Unitins!5e0!3m2!1spt-BR!2sbr!4v1759885547683!5m2!1spt-BR!2sbr"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do evento - UNITINS Campus Graciosa"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
