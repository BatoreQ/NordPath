import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { COUNTRIES, COUNTRY_DATA } from '@/lib/data/index'
import { DocumentCard } from '@/components/documents/DocumentCard'
import { ProgressBar } from '@/components/checklist/ProgressBar'
import type { ChecklistProgress, CountrySlug } from '@/lib/types'
import { ChecklistInteractiveWrapper } from './ChecklistInteractiveWrapper'
import { Calculator } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ payment?: string }>
}

export default async function CountryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { payment } = await searchParams

  const country = COUNTRIES.find(c => c.slug === slug)
  if (!country) notFound()

  const countrySlug = slug as CountrySlug
  const data = COUNTRY_DATA[countrySlug]
  if (!data) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: purchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('country_slug', countrySlug)
    .eq('status', 'paid')
    .single()

  if (!purchase) redirect('/dashboard')

  const { data: progressRaw } = await supabase
    .from('checklist_progress')
    .select('item_id, completed, completed_at, notes')
    .eq('user_id', user.id)
    .eq('country_slug', countrySlug)

  const progress: Record<string, ChecklistProgress> = {}
  for (const row of (progressRaw ?? [])) {
    progress[row.item_id] = row as ChecklistProgress
  }

  const totalItems = data.checklist.flatMap(g => g.items).length
  const completedItems = Object.values(progress).filter(p => p.completed).length

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar userEmail={user.email} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {payment === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-green-700 font-medium">
            Platnosc zakonczona! Masz teraz pelny dostep do checklisty {country.name}.
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{country.flag}</span>
              <h1 className="text-2xl font-bold text-gray-900">{country.name}</h1>
            </div>
            <p className="text-gray-500 text-sm">{country.nameLocal} · {country.language} · {country.currency}</p>
          </div>
          <Link
            href={`/country/${slug}/calculator`}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            Kalkulator
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <ProgressBar completed={completedItems} total={totalItems} />
        </div>

        <ChecklistInteractiveWrapper
          userId={user.id}
          countrySlug={countrySlug}
          checklist={data.checklist}
          initialProgress={progress}
        />

        {data.documents.length > 0 && (
          <div className="mt-8">
            <h2 className="font-bold text-gray-900 mb-4">Szablony dokumentów</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.documents.map(doc => (
                <DocumentCard key={doc.id} document={doc} countrySlug={slug} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
