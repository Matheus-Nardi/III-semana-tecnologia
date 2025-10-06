import {
    Carousel,
    CarouselContent,
    CarouselItem, // Importe o CarouselItem
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function Hero() {
    const carouselItens = [
        { src: "https://images.pexels.com/photos/1533720/pexels-photo-1533720.jpeg", alt: "Imagem sobre o evento" },
        { src: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg", alt: "Programação" },
        { src: "https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg", alt: "Palestrantes" },
    ];

    return (
        <section className="w-full flex justify-center p-0">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {carouselItens.map((item, index) => (

                        <CarouselItem key={index}>
                            <div className="p-0">
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    className="w-full h-auto object-cover rounded-lg"
                                    style={{ height: '370px' }}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2" />
            </Carousel>
        </section>
    );
}