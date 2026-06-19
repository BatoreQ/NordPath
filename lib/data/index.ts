import type { Country } from '../types'
import { norwayChecklist, norwayDocuments, norwayCalculatorData } from './norway'
import { austriaChecklist, austriaDocuments, austriaCalculatorData } from './austria'
import { icelandChecklist, icelandDocuments, icelandCalculatorData } from './iceland'

export const COUNTRIES: Country[] = [
  {
    slug: 'norway',
    name: 'Norwegia',
    nameLocal: 'Norge',
    flag: '🇳🇴',
    currency: 'NOK',
    language: 'Norweski',
    price: 2900
  },
  {
    slug: 'austria',
    name: 'Austria',
    nameLocal: 'Österreich',
    flag: '🇦🇹',
    currency: 'EUR',
    language: 'Niemiecki',
    price: 2900
  },
  {
    slug: 'iceland',
    name: 'Islandia',
    nameLocal: 'Ísland',
    flag: '🇮🇸',
    currency: 'ISK',
    language: 'Angielski',
    price: 2900
  }
]

export const COUNTRY_DATA = {
  norway: {
    checklist: norwayChecklist,
    documents: norwayDocuments,
    calculator: norwayCalculatorData
  },
  austria: {
    checklist: austriaChecklist,
    documents: austriaDocuments,
    calculator: austriaCalculatorData
  },
  iceland: {
    checklist: icelandChecklist,
    documents: icelandDocuments,
    calculator: icelandCalculatorData
  }
}

export { norwayChecklist, norwayDocuments, norwayCalculatorData }
export { austriaChecklist, austriaDocuments, austriaCalculatorData }
export { icelandChecklist, icelandDocuments, icelandCalculatorData }
