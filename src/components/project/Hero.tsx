'use client';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export default function Hero() {
    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    const carouselItens = [
        { src: "https://images.pexels.com/photos/1533720/pexels-photo-1533720.jpeg", alt: "Imagem sobre o evento" },
        { src: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg", alt: "Programação" },
        { src: "https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg", alt: "Palestrantes" },
    ];

    return (
        <section className="w-full relative overflow-hidden">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {carouselItens.map((item, index) => (
                        <CarouselItem key={index}>
                            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                                {/* Image with overlay */}
                                <div className="absolute inset-0">
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Simple dark overlay */}
                                    <div className="absolute inset-0 bg-black/40" />
                                </div>

                                {/* Content overlay */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="container mx-auto px-4 text-center">
                                        <div className="max-w-4xl mx-auto space-y-6">
                                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white">
                                                <span className="text-primary">
                                                    III Semana de
                                                </span>
                                                <br />
                                                <span className="text-white">
                                                    Ciência, Tecnologia e Inovação
                                                </span>
                                            </h1>
                                            <div className="flex flex-wrap gap-4 justify-center mt-8">
                                                <button className="px-8 py-4 bg-primary hover:bg-accent text-white font-semibold rounded-lg transition-colors duration-200">
                                                    Inscreva-se Agora
                                                </button>
                                                <button className="px-8 py-4 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors duration-200 border border-white/30">
                                                    Saiba Mais
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                
                {/* Navigation buttons */}
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-white/30 h-12 w-12 transition-colors duration-200" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-white/30 h-12 w-12 transition-colors duration-200" />
            </Carousel>
        </section>
    );
}