import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { COUNTRY_DATA } from '@/lib/data/index'
import { EmailTemplateEditor } from '@/components/documents/EmailTemplate'
import type { CountrySlug } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ country?: string }>
}

export default async function DocumentPage({ params, searchParams }: Props) {
  const { id } = await params
  const { country: countryParam } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let document = null
  let countrySlug: CountrySlug | null = null

  const slugsToSearch = countryParam
    ? [countryParam as CountrySlug]
    : (['norway', 'austria', 'iceland'] as CountrySlug[])

  for (const slug of slugsToSearch) {
    const data = COUNTRY_DATA[slug]
    const found = data?.documents.find(d => d.id === id)
    if (found) {
      const { data: purchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('country_slug', slug)
        .eq('status', 'paid')
        .single()

      if (purchase) {
        document = found
        countrySlug = slug
        break
      }
    }
  }

  if (!document || !countrySlug) notFound()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar userEmail={user.email} />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        <Link
          href={`/country/${countrySlug}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć do checklisty
        </Link>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">{document.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{document.description}</p>
        </div>

        <EmailTemplateEditor template={document} />
      </main>

      <Footer />
    </div>
  )
}
