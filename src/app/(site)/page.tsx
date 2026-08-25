import { redirect } from 'next/navigation'
import { getDefaultEdition } from '@/lib/content'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RootPage() {
  const defaultEdition = await getDefaultEdition()
  const targetSlug = defaultEdition?.slug || '2025'
  redirect(`/${targetSlug}`)
}
