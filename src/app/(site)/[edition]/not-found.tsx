import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EditionNotFound() {
  return (
    <div className="min-h-screen bg-gradient-soft-primary flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <Calendar size={32} />
        </div>
        <h1 className="text-4xl font-bold font-montserrat text-primary">
          Edição Não Encontrada
        </h1>
        <p className="text-muted-foreground font-poppins">
          A edição que você está procurando não existe ou ainda não foi publicada.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild className="bg-primary hover:bg-primary/90 text-white">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Edição Atual
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/edicoes">
              Ver Histórico de Edições
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
