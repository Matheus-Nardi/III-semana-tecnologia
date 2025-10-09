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

export default function Hero() {
    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    const carouselItens = [
        { src: "/temp/image1.png", alt: "Ciência e Tecnologia" },
        { src: "/temp/image2.jpeg", alt: "Ciência e Tecnologia" },

        // { src: "https://images.pexels.com/photos/1533720/pexels-photo-1533720.jpeg", alt: "Imagem sobre o evento" },
        // { src: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg", alt: "Programação" },
        // { src: "https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg", alt: "Palestrantes" },
    ];

    return (
        <section className="w-full relative overflow-hidden -mt-20 pt-20">
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
            >
                <CarouselContent>
                    {carouselItens.map((item, index) => (
                        <CarouselItem key={index}>
                            <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]">
                                {/* Image with elegant overlay gradient */}
                                <div className="absolute inset-0">
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Dark overlay */}
                                    <div className="absolute inset-0 bg-black/80" />
                                    {/* Subtle noise texture overlay for depth */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] opacity-40" />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Elegant minimal navigation */}
                <CarouselPrevious className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md h-14 w-14 transition-all duration-300 hover:scale-110 z-20 group" />
                <CarouselNext className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md h-14 w-14 transition-all duration-300 hover:scale-110 z-20 group" />
            </Carousel>

            {/* Fixed elegant content overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-5xl mx-auto">


                        {/* Main Title with elegant animation */}
                        <div className="text-center space-y-6 mb-12">
                            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold leading-tight animate-fade-in-up animation-delay-200">
                                <span className="block mb-2 text-white drop-shadow-2xl" style={{ color: '#e2187f' }}>
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
                        <div className="flex flex-wrap gap-4 justify-center pointer-events-auto animate-fade-in-up animation-delay-800">
                            <button className="group relative px-8 py-4 bg-white text-[#083D77] font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 overflow-hidden">
                                <span className="relative z-10 flex items-center gap-2">
                                    Inscreva-se Agora
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#38B6FF] to-[#4FD1FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>

                            <button className="group px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all duration-300 backdrop-blur-md border-2 border-white/30 hover:border-[#4FD1FF]/50 hover:scale-105 hover:shadow-xl flex items-center gap-2">
                                Ver Programação
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}