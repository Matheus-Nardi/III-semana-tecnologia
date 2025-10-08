export default function Location() {
  return (
    <section className="py-20 px-4 bg-secondary/30 flex">
      <div className="container mx-auto max-w-5xl flex gap-10">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground mb-3 font-montserrat">Localização do evento</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6" />
          <p className="text-muted-foreground font-poppins text-lg">
            Todo o evento acontecerá no campus Graciosa da UNITINS
          </p>
        </div>

        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-border">
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
    </section>
  )
}
