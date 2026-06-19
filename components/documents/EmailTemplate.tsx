'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import type { DocumentTemplate, TemplatePlaceholder } from '@/lib/types'

interface Props {
  template: DocumentTemplate
}

export function EmailTemplateEditor({ template }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(template.placeholders.map(p => [p.key, '']))
  )
  const [copied, setCopied] = useState(false)

  function fillTemplate(content: string, vals: Record<string, string>): string {
    let filled = content
    for (const [key, value] of Object.entries(vals)) {
      filled = filled.replaceAll(`{${key}}`, value || `[${key}]`)
    }
    return filled
  }

  const filledContent = fillTemplate(template.content, values)

  async function handleCopy() {
    await navigator.clipboard.writeText(filledContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const blob = new Blob([filledContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Uzupełnij dane</h2>
        <div className="space-y-4">
          {template.placeholders.map((placeholder: TemplatePlaceholder) => (
            <div key={placeholder.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {placeholder.label}
              </label>
              <input
                type={placeholder.type === 'number' ? 'number' : placeholder.type === 'date' ? 'date' : 'text'}
                value={values[placeholder.key] || ''}
                onChange={(e) => setValues(prev => ({ ...prev, [placeholder.key]: e.target.value }))}
                placeholder={placeholder.example}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900 text-sm">Gotowy dokument</h2>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Skopiowano!' : 'Kopiuj'}
            </button>
            <button
              onClick={handleDownload}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Pobierz .txt
            </button>
          </div>
        </div>
        <pre className="p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed overflow-auto max-h-96">
          {filledContent}
        </pre>
      </div>
    </div>
  )
}
