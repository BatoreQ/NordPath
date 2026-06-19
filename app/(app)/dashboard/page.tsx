import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { COUNTRIES } from '@/lib/data/index'
import { PurchaseButton } from './PurchaseButton'
import type { Purchase } from '@/lib/types'
import { CheckCircle2, Lock, ArrowRight } from 'lucide-react'

async function getUserPurchases(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'paid')
  return (data ?? []) as Purchase[]
}

async function getChecklistProgress(userId: string, countrySlug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('checklist_progress')
    .select('item_id, completed')
    .eq('user_id', userId)
    .eq('country_slug', countrySlug)
  return data ?? []
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const purchases = await getUserPurchases(user.id)
  const paidCountries = new Set(purchases.map(p => p.country_slug))

  const progressData = await Promise.all(
    Array.from(paidCountries).map(async (slug) => {
      const progress = await getChecklistProgress(user.id, slug)
      return { slug, completed: progress.filter(p => p.completed).length, total: progress.length }
    })
  )
  const progressMap = Object.fromEntries(progressData.map(p => [p.slug, p]))

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar userEmail={user.email} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Twój panel</h1>
          <p className="text-gray-500 mt-1">Witaj, {user.email}</p>
        </div>

        <h2 className="font-semibold text-gray-700 mb-4">Wybierz kraj</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {COUNTRIES.map(country => {
            const hasPurchase = paidCountries.has(country.slug)
            const progress = progressMap[country.slug]

            return (
              <div key={country.slug} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-3xl mb-1">{country.flag}</div>
                    <h3 className="font-bold text-gray-900">{country.name}</h3>
                    <p className="text-xs text-gray-500">{country.nameLocal} · {country.language}</p>
                  </div>
                  {hasPurchase ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-300" />
                  )}
                </div>

                {hasPurchase && progress && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Postęp</span>
                      <span>{progress.completed}/{progress.total}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: progress.total > 0 ? `${Math.round(progress.completed / progress.total * 100)}%` : '0%' }}
                      />
                    </div>
                  </div>
                )}

                {hasPurchase ? (
                  <Link
                    href={`/country/${country.slug}`}
                    className="flex items-center justify-between w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Otwórz checklistę
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <PurchaseButton countrySlug={country.slug} countryName={country.name} />
                )}
              </div>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  )
}
