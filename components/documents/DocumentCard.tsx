import Link from 'next/link'
import { FileText, Mail, FileCheck } from 'lucide-react'
import type { DocumentTemplate } from '@/lib/types'

interface Props {
  document: DocumentTemplate
  countrySlug: string
}

const CATEGORY_ICONS = {
  email: Mail,
  letter: FileText,
  form: FileCheck,
  checklist: FileCheck
}

const CATEGORY_LABELS = {
  email: 'Email',
  letter: 'Pismo',
  form: 'Formularz',
  checklist: 'Lista'
}

export function DocumentCard({ document: doc, countrySlug }: Props) {
  const Icon = CATEGORY_ICONS[doc.category]

  return (
    <Link
      href={`/documents/${doc.id}?country=${countrySlug}`}
      className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-medium text-sm text-gray-900 truncate">{doc.title}</h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex-shrink-0">
              {CATEGORY_LABELS[doc.category]}
            </span>
          </div>
          <p className="text-xs text-gray-500">{doc.description}</p>
        </div>
      </div>
    </Link>
  )
}
