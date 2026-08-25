import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getEdition, getAllEditions } from '@/lib/content'
import Header from '@/components/project/Header'
import Hero from '@/components/project/Hero'
import AboutEvent from '@/components/project/About'
import Schedule from '@/components/project/Schedule'
import Partners from '@/components/project/Partners'
import News from '@/components/project/News'
import Faq from '@/components/project/Faq'
import Location from '@/components/project/Location'
import Subscription from '@/components/project/Subscription'
import Footer from '@/components/project/Footer'

interface PageProps {
  params: Promise<{
    edition: string
  }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { edition: slug } = await params
  const edition = await getEdition(slug)

  if (!edition) {
    return {
      title: 'Edição Não Encontrada | UNITINS',
    }
  }

  const title = `${edition.title} - UNITINS (${edition.year})`
  const description = edition.about?.body || `Informações, programação e inscrições para a ${edition.title}.`

  return {
    title,
    description,
    alternates: {
      canonical: `/${edition.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://unitinscti.com.br/${edition.slug}`,
      siteName: `${edition.shortTitle} - UNITINS`,
      locale: 'pt_BR',
      images: [
        {
          url: edition.theme?.heroBanner?.url || '/logos/logo-snct.png',
          width: 1200,
          height: 630,
          alt: edition.title,
        },
      ],
    },
  }
}

export default async function EditionPage({ params }: PageProps) {
  const { edition: slug } = await params
  const [edition, allEditions] = await Promise.all([
    getEdition(slug),
    getAllEditions(),
  ])

  if (!edition) {
    notFound()
  }

  const primaryColor = edition.theme?.primaryColor || '#083D77'
  const accentColor = edition.theme?.accentColor || '#e2187f'

  return (
    <div
      data-edition={edition.slug}
      style={{
        '--color-primary': primaryColor,
        '--color-accent': accentColor,
      } as React.CSSProperties}
      className="min-h-screen bg-background text-foreground flex flex-col justify-between"
    >
      <Header edition={edition} allEditions={allEditions} />
      <main id="main-content" className="flex-1">
        <Hero edition={edition} />
        <AboutEvent edition={edition} />
        <Schedule edition={edition} />
        <Partners edition={edition} />
        <News />
        <Faq edition={edition} />
        <Location />
        <Subscription edition={edition} />
      </main>
      <Footer edition={edition} />
    </div>
  )
}
