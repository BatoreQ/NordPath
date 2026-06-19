'use client'

import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'

interface Props {
  countrySlug: string
  countryName: string
}

export function PurchaseButton({ countrySlug, countryName }: Props) {
  const [loading, setLoading] = useState(false)

  async function handlePurchase() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countrySlug })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Błąd płatności. Spróbuj ponownie.')
        setLoading(false)
      }
    } catch {
      alert('Błąd połączenia. Spróbuj ponownie.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className="flex items-center justify-between w-full border border-blue-200 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors disabled:opacity-50"
    >
      {loading ? (
        <>
          <span>Przekierowuję...</span>
          <Loader2 className="w-4 h-4 animate-spin" />
        </>
      ) : (
        <>
          <span>Kup dostęp — 29 zł</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  )
}
