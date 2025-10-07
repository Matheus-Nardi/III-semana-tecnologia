'use client';
import { Sparkles } from "lucide-react";
import Image from "next/image"
import { TypeAnimation } from 'react-type-animation'


export default function AboutEvent() {
  return (
    <section className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Texto à esquerda */}
          <div className="space-y-8">
            <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
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
        />
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

          <div className="flex justify-center lg:justify-end">
            <Image
              src="/ilustracoes/globo.png"
              alt="Ilustração de um globo representando tecnologia e inovação"
              width={500}
              height={400}

            />
          </div>
        </div>
      </div>
    </section>
  )
}
