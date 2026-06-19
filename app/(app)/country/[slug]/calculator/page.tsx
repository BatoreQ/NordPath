import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { COUNTRIES, COUNTRY_DATA } from '@/lib/data/index'
import { DepositCalculator } from '@/components/calculator/DepositCalculator'
import type { CountrySlug } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params
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

  const exchangeRates: Record<CountrySlug, number> = {
    norway: 0.38,
    austria: 4.25,
    iceland: 0.031
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar userEmail={user.email} />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        <Link
          href={`/country/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć do checklisty
        </Link>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">{country.flag}</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Kalkulator — {country.name}</h1>
            <p className="text-sm text-gray-500">{country.currency}</p>
          </div>
        </div>

        <DepositCalculator
          currency={data.calculator.currency}
          maxMonths={data.calculator.maxDepositMonths}
          exchangeRate={exchangeRates[countrySlug]}
        />

        {'taxRates' in data.calculator && (
          <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Stawki podatkowe</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Podstawowa stawka</span>
                <span className="font-medium">{data.calculator.taxRates.low}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Wyższa stawka</span>
                <span className="font-medium">{data.calculator.taxRates.high}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Stawki orientacyjne — mogą się różnić w zależności od dochodów i sytuacji podatkowej.</p>
          </div>
        )}

        {'minimumWage' in data.calculator && (
          <div className="mt-4 bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Minimalne wynagrodzenie</h3>
            <div className="space-y-2">
              {Object.entries(data.calculator.minimumWage).map(([key, val]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">{key === 'hospitality' ? 'Gastronomia/Hotelarstwo' : key === 'general' ? 'Ogólne' : key}</span>
                  <span className="font-medium">{val} {data.calculator.currency}{key !== 'general' || data.calculator.currency !== 'ISK' ? '/godz.' : '/mies.'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
