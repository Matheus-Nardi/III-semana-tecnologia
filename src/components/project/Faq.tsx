import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Faq {
    id: number
    question: string
    awnser: string
}

export default function Faq() {
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
        <section className="w-full py-20 md:py-32 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto space-y-12">
                    {/* Section Header */}
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance font-montserrat">
                            Perguntas frequentes
                        </h2>
                        <div className="w-16 h-1 bg-primary rounded-full mx-auto" />
                    </div>


                    <Accordion type="single" collapsible className="space-y-4">
                        {faqItens.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={`item-${item.id}`}
                                className="bg-background border border-border rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-primary hover:no-underline py-6">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pt-2">
                                    {item.awnser}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
