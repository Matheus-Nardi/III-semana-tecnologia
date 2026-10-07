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
import { Mascot } from '@/components/project/Mascot'

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
  const description =
    edition.about?.body?.replace(/\*\*/g, '') ||
    `Informações, programação e inscrições para a ${edition.title}.`
  const imageUrl =
    edition.theme?.heroBanner?.url ||
    edition.about?.illustration?.url ||
    edition.heroSlides?.[0]?.src ||
    '/logos/logo-snct.png'

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
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: edition.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
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
  const secondaryColor = edition.theme?.secondaryColor || '#E3F5FF'

  return (
    <div
      data-edition={edition.slug}
      style={{
        // Variáveis base usadas pelas classes Tailwind (ex: text-primary → var(--primary))
        '--primary': primaryColor,
        '--accent': accentColor,
        '--secondary': secondaryColor,
        // Variáveis semânticas usadas em style inline nos componentes (ex: var(--color-accent))
        '--color-primary': primaryColor,
        '--color-accent': accentColor,
        '--color-secondary': secondaryColor,
      } as React.CSSProperties}
      className="min-h-screen bg-background text-foreground flex flex-col justify-between"
    >
      <Header edition={edition} allEditions={allEditions} />
      <main id="main-content" className="flex-1">
        <Hero edition={edition} />
        <AboutEvent edition={edition} />
        <Schedule edition={edition} />
        <Partners edition={edition} />
        <News edition={edition} />
        <Faq edition={edition} />
        <Location />
        <Subscription edition={edition} />
      </main>
      <Footer edition={edition} />
      {(edition.year === 2026 || edition.slug === '2026') && <Mascot />}
    </div>
  )
}
