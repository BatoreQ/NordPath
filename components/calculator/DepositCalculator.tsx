'use client'

import { useState } from 'react'

interface Props {
  currency: string
  maxMonths: number
  exchangeRate?: number
}

export function DepositCalculator({ currency, maxMonths, exchangeRate = 0.38 }: Props) {
  const [rent, setRent] = useState('')

  const rentNum = parseFloat(rent) || 0
  const maxDeposit = rentNum * maxMonths
  const maxDepositPln = Math.round(maxDeposit * exchangeRate)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-1">Kalkulator kaucji</h3>
      <p className="text-sm text-gray-500 mb-4">
        Maksymalna legalna kaucja to {maxMonths} miesiące czynszu
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Miesięczny czynsz ({currency})
        </label>
        <input
          type="number"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          placeholder={currency === 'NOK' ? 'np. 9500' : currency === 'EUR' ? 'np. 900' : 'np. 250000'}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {rentNum > 0 && (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-xs text-blue-600 font-medium">Maksymalna kaucja jaką może żądać właściciel</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {maxDeposit.toLocaleString('pl-PL')} {currency}
            </p>
            {currency !== 'PLN' && (
              <p className="text-sm text-blue-600 mt-1">
                ≈ {maxDepositPln.toLocaleString('pl-PL')} PLN
              </p>
            )}
          </div>

          <div className="bg-green-50 border border-green-100 rounded-lg p-3">
            <p className="text-xs text-green-700">
              Kaucja musi trafić na osobne, zablokowane konto bankowe. Właściciel nie może jej używać podczas trwania najmu.
            </p>
          </div>

          <p className="text-xs text-gray-400">
            Kurs orientacyjny {currency}/PLN: ~{exchangeRate}
          </p>
        </div>
      )}
    </div>
  )
}
