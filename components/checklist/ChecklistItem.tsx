'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, ExternalLink, Clock, AlertCircle } from 'lucide-react'
import type { ChecklistItem as TChecklistItem } from '@/lib/types'

interface Props {
  item: TChecklistItem
  completed: boolean
  notes: string | null
  onToggle: (itemId: string) => Promise<void>
  onNotesSave: (itemId: string, notes: string) => Promise<void>
}

export function ChecklistItemComponent({ item, completed, notes, onToggle, onNotesSave }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [localNotes, setLocalNotes] = useState(notes || '')
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState(false)

  async function handleToggle() {
    setToggling(true)
    await onToggle(item.id)
    setToggling(false)
  }

  async function handleSaveNotes() {
    setSaving(true)
    await onNotesSave(item.id, localNotes)
    setSaving(false)
  }

  return (
    <div className={`border rounded-lg p-4 transition-all ${
      completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
    } ${item.isBlocking && !completed ? 'ring-1 ring-red-200' : ''}`}>

      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          disabled={toggling}
          className="mt-0.5 flex-shrink-0 disabled:opacity-50"
          aria-label={completed ? 'Oznacz jako nieukończone' : 'Oznacz jako ukończone'}
        >
          {completed
            ? <CheckCircle2 className="w-5 h-5 text-green-600" />
            : <Circle className="w-5 h-5 text-gray-400" />
          }
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`font-medium text-sm ${completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {item.title}
            </h3>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.estimatedTime}
            </span>
            {item.isBlocking && !completed && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Blokuje kolejne kroki
              </span>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 ml-8 space-y-3">
          <p className="text-sm text-gray-600">{item.description}</p>

          {item.requiredDocuments.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Potrzebne dokumenty:</p>
              <ul className="space-y-1">
                {item.requiredDocuments.map((doc, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.tips.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
              <p className="text-xs font-semibold text-amber-800 mb-1.5">Wskazówki:</p>
              <ul className="space-y-1.5">
                {item.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-amber-700 flex items-start gap-1.5">
                    <span className="flex-shrink-0">💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.officialUrl && (
            <a
              href={item.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              <ExternalLink className="w-3 h-3" />
              Oficjalna strona urzędu
            </a>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-700 mb-1">Twoje notatki:</p>
            <textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="np. Mam wizytę 15 marca o 10:00"
              className="w-full text-xs border border-gray-200 rounded-lg p-2 resize-none h-16 focus:outline-none focus:ring-1 focus:ring-blue-300"
            />
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="mt-1 text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Zapisuję...' : 'Zapisz notatki'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
