import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, ChevronRight, CheckCircle2 } from 'lucide-react'
import { getAllEditions, getDefaultEdition } from '@/lib/content'
import Header from '@/components/project/Header'
import Footer from '@/components/project/Footer'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Histórico de Edições | Semana de Tecnologia - UNITINS',
  description: 'Navegue pelo histórico de edições da Semana de Ciência, Tecnologia e Inovação da UNITINS.',
}

export default async function EditionsHistoryPage() {
  const [editions, defaultEdition] = await Promise.all([
    getAllEditions(),
    getDefaultEdition(),
  ])

  return (
    <div className="min-h-screen bg-gradient-soft-primary flex flex-col justify-between">
      <Header edition={defaultEdition} allEditions={editions} />

      <main className="flex-1 container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Cabeçalho */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span>Memória Institucional</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-montserrat text-primary">
              Histórico de Edições
            </h1>
            <p className="text-muted-foreground font-poppins max-w-xl mx-auto text-sm sm:text-base">
              Acompanhe a trajetória da Semana de Ciência, Tecnologia e Inovação da UNITINS ao longo dos anos.
            </p>
          </div>

          {/* Grid de Edições */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {editions.map((edition) => {
              const isCurrent = edition.isDefault || edition.slug === defaultEdition.slug
              return (
                <Card
                  key={edition.slug}
                  className={`bg-white transition-all duration-300 hover:shadow-lg border-2 ${
                    isCurrent ? 'border-primary shadow-md' : 'border-primary/10 hover:border-primary/30'
                  }`}
                >
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-extrabold font-montserrat text-primary">
                        {edition.year}
                      </span>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 size={13} />
                          Edição Ativa
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold font-montserrat leading-snug text-slate-900">
                      {edition.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-xs text-muted-foreground font-poppins">
                      <Calendar size={14} className="text-primary" />
                      {edition.dates || 'Outubro'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-slate-600 font-poppins line-clamp-3 leading-relaxed">
                      {edition.about?.themeTitle || edition.about?.body || 'Explore a programação, palestras, parceiros e atividades desta edição.'}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <Button
                      asChild
                      className={`w-full font-semibold ${
                        isCurrent
                          ? 'bg-primary hover:bg-primary/90 text-white'
                          : 'bg-slate-100 hover:bg-primary hover:text-white text-slate-800'
                      } transition-all duration-300`}
                    >
                      <Link href={`/${edition.slug}`}>
                        <span>Ver Edição {edition.year}</span>
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      <Footer edition={defaultEdition} />
    </div>
  )
}
