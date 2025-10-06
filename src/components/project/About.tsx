import Image from "next/image"

export default function AboutEvent() {
  return (
    <section className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                Sobre a semana de tecnologia e inovação
              </h2>
              <div className="w-16 h-1 bg-primary rounded-full" />
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-base md:text-lg">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia nobis ab doloribus veritatis nam
                reprehenderit quisquam, error distinctio voluptates quae sapiente cum necessitatibus cupiditate tempora
                qui ipsam omnis dolorem ea.
              </p>
              <p className="text-base md:text-lg">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem asperiores est maiores vel temporibus
                iure voluptatem distinctio ad provident eaque, porro hic voluptate nam dolor obcaecati, quia
                dignissimos, delectus cumque!
              </p>
            </div>
          </div>

          {/* Illustrations Column */}
          <div className="relative flex flex-col gap-8 lg:gap-12">
            <div className="flex justify-start">
              <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                <Image
                  src="/ilustracoes/2_ilustracao.png"
                  alt="Ilustração de um pássaro voando"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                <Image
                  src="/ilustracoes/7_ilustracao.png"
                  alt="Ilustração de um homem pescando"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
