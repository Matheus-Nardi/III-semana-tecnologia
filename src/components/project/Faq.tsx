'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"
import { motion, useInView } from "motion/react"
import { useRef } from "react"

interface Faq {
    id: number
    question: string
    awnser: string
}

export default function Faq() {
    const headerRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: false, margin: "-100px" });
    const faqItens: Faq[] = [

        {
            id: 1,
            question: "Como faço para me inscrever no evento?",
            awnser: "Você pode se inscrever através do Sistema de eventos da UNITINS",
        },
        {
            id: 2,
            question: "Quem pode participar do evento ?",
            awnser:
                "O evento é aberto a pesquisadores, professores, estudantes de pós-graduação, profissionais da indústria, empreendedores, gestores de inovação, representantes de órgãos públicos, formuladores de políticas públicas e demais interessados em inovação, ciência e tecnologia",
        },
        {
            id: 3,
            question: "O evento será presencial ou online ?",
            awnser:
                "O evento conta com programações presencias no campus da UNTINS - PALMAS e também com programções remotas",
        },
        {
            id: 4,
            question: "Haverá emissão de certificados ?",
            awnser: "Sim, todos as atividades programadas contam com emissão de certifcados",
        },

        {
            id: 5,
            question: "Haverá alimentação no evento presencial?",
            awnser: "Sim, o evento presencial contará com a presença de food trucks.",
        },
    ]

    return (
        <section id="faq" className="w-full py-20 md:py-32 relative overflow-hidden bg-secondary/10">

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-3xl mx-auto space-y-12">
                    {/* Section Header */}
                    <div ref={headerRef} className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance font-montserrat text-primary">
                            Perguntas frequentes
                        </h2>
                        <div className="flex justify-center">
                            <motion.div 
                                className="h-1 bg-primary rounded-full"
                                initial={{ width: "4rem" }}
                                animate={{ 
                                    width: isHeaderInView ? "12rem" : "4rem" 
                                }}
                                transition={{ 
                                    duration: 0.8, 
                                    ease: "easeInOut" 
                                }}
                            />
                        </div>
                    </div>


                    <Accordion type="single" collapsible className="space-y-4">
                        {faqItens.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={`item-${item.id}`}
                                className="bg-white border-2 border-primary/10 hover:border-primary/30 rounded-xl px-6 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-primary hover:no-underline py-6 group">
                                    <span className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                                            {item.id}
                                        </span>
                                        <span className="flex-1">{item.question}</span>
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pt-2 pl-9">
                                    <div className="border-l-2 border-primary/20 pl-4 py-2">
                                        {item.awnser}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
