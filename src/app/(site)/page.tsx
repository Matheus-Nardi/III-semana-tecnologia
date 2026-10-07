import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getDefaultEdition } from '@/lib/content'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const defaultEdition = await getDefaultEdition()
  const title = `${defaultEdition.title} - UNITINS (${defaultEdition.year})`
  const description =
    defaultEdition.about?.body?.replace(/\*\*/g, '') ||
    `Informações, programação e inscrições para a ${defaultEdition.title}.`
  const imageUrl =
    defaultEdition.theme?.heroBanner?.url ||
    defaultEdition.about?.illustration?.url ||
    defaultEdition.heroSlides?.[0]?.src ||
    '/logos/logo-snct.png'

  return {
    title,
    description,
    alternates: {
      canonical: `/${defaultEdition.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://unitinscti.com.br/${defaultEdition.slug}`,
      siteName: `${defaultEdition.shortTitle} - UNITINS`,
      locale: 'pt_BR',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: defaultEdition.title,
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

export default async function RootPage() {
  const defaultEdition = await getDefaultEdition()
  const targetSlug = defaultEdition?.slug || '2025'
  redirect(`/${targetSlug}`)
}

