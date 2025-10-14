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
import { Calendar, MapPin, Users, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Hero() {
    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    const carouselItens = [
        // { src: "/temp/image1.png", alt: "Ciência e Tecnologia" },
        // { src: "/temp/image2.jpeg", alt: "Ciência e Tecnologia" },

        { src: "https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg", alt: "Imagem sobre o evento" },
        { src: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg", alt: "Programação" },
        // { src: "https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg", alt: "Palestrantes" },
    ];

    return (
        <section
            className="w-full relative overflow-hidden -mt-20 pt-20"
            aria-label="Seção principal do evento"
        >
            {/* Carousel with images - with parallax effect */}
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                aria-roledescription="carrossel"
                aria-label="Imagens do evento"
            >
                <CarouselContent>
                    {carouselItens.map((item, index) => (
                        <CarouselItem key={index} aria-roledescription="slide" aria-label={`Slide ${index + 1} de ${carouselItens.length}`}>
                            <div className="relative w-full h-screen min-h-[600px] sm:min-h-[700px]">
                                {/* Image with elegant overlay gradient */}
                                <div className="absolute inset-0">
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="w-full h-full object-cover"
                                        loading={index === 0 ? "eager" : "lazy"}
                                    />
                                    {/* Dark overlay */}
                                    <div className="absolute inset-0 bg-black/80" aria-hidden="true" />
                                    {/* Subtle noise texture overlay for depth */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] opacity-40" aria-hidden="true" />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Elegant minimal navigation - Hidden on mobile, visible on desktop */}
                <CarouselPrevious
                    className="hidden md:flex absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 focus-visible:bg-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent text-white border-white/20 backdrop-blur-md h-12 w-12 sm:h-14 sm:w-14 transition-all duration-300 hover:scale-110 z-20 group"
                    aria-label="Slide anterior"
                />
                <CarouselNext
                    className="hidden md:flex absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 focus-visible:bg-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent text-white border-white/20 backdrop-blur-md h-12 w-12 sm:h-14 sm:w-14 transition-all duration-300 hover:scale-110 z-20 group"
                    aria-label="Próximo slide"
                />
            </Carousel>

            {/* Fixed elegant content overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4">
                <div className="container mx-auto px-2 sm:px-4 md:px-6">
                    <div className="max-w-5xl mx-auto">
                        {/* Main Title with elegant animation */}
                        <div className="text-center space-y-6 mb-12">
                            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold leading-tight animate-fade-in-up animation-delay-200 
                   flex flex-col gap-y-2">
                                <span className="block text-white drop-shadow-2xl" style={{ color: '#e2187f' }}>
                                    III Semana de
                                </span>
                                <span className="block text-3xl md:text-5xl lg:text-7xl font-light tracking-wide text-white">
                                    Ciência, Tecnologia e Inovação
                                </span>
                                <span className="block text-3xl md:text-5xl lg:text-7xl" style={{ color: '#e2187f' }}>
                                    UNITINS
                                </span>
                            </h1>
                        </div>
                        {/* CTA Buttons - sophisticated design */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pointer-events-auto">
                            <Button
                                size="xs"
                                asChild
                                className="!h-12 !px-8 !text-base !min-w-[200px]"
                                aria-label="Inscrever-se no evento"
                            >
                                <Link href={"https://www.unitins.br/Eventos/E007Evento/Abertos"} target='_blank' rel='noopener noreferrer'>
                                    Inscreva-se Agora
                                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                                </Link>
                            </Button>

                            <Button
                                size="xs"
                                asChild
                                className="!h-12 !px-8 !text-base !min-w-[200px]"
                            >
                                <a
                                    href="#programacao"
                                    aria-label="Ver programação completa do evento"
                                >
                                    Ver Programação
                                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}