export type CountrySlug = 'norway' | 'austria' | 'iceland'

export interface Country {
  slug: CountrySlug
  name: string
  nameLocal: string
  flag: string
  currency: string
  language: string
  price: number
}

export interface ChecklistGroup {
  id: string
  title: string
  description: string
  priority: 'critical' | 'important' | 'optional'
  timing: string
  items: ChecklistItem[]
}

export interface ChecklistItem {
  id: string
  title: string
  description: string
  officialUrl?: string
  estimatedTime: string
  requiredDocuments: string[]
  tips: string[]
  isBlocking: boolean
}

export interface DocumentTemplate {
  id: string
  title: string
  category: 'email' | 'letter' | 'form' | 'checklist'
  language: CountrySlug | 'english'
  description: string
  content: string
  placeholders: TemplatePlaceholder[]
}

export interface TemplatePlaceholder {
  key: string
  label: string
  type: 'text' | 'date' | 'number'
  example: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
}

export interface Purchase {
  id: string
  user_id: string
  country_slug: CountrySlug
  status: 'pending' | 'paid' | 'refunded'
  paid_at: string | null
  amount_pln: number
}

export interface ChecklistProgress {
  item_id: string
  completed: boolean
  completed_at: string | null
  notes: string | null
}
