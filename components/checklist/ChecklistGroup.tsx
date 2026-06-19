'use client'

import type { ChecklistGroup as TChecklistGroup, ChecklistProgress } from '@/lib/types'
import { ChecklistItemComponent } from './ChecklistItem'
import { ProgressBar } from './ProgressBar'

interface Props {
  group: TChecklistGroup
  progress: Record<string, ChecklistProgress>
  onToggle: (itemId: string) => Promise<void>
  onNotesSave: (itemId: string, notes: string) => Promise<void>
}

const PRIORITY_COLORS = {
  critical: 'bg-red-100 text-red-700',
  important: 'bg-amber-100 text-amber-700',
  optional: 'bg-gray-100 text-gray-600'
}

const PRIORITY_LABELS = {
  critical: 'Krytyczne',
  important: 'Ważne',
  optional: 'Opcjonalne'
}

export function ChecklistGroupComponent({ group, progress, onToggle, onNotesSave }: Props) {
  const completed = group.items.filter(item => progress[item.id]?.completed).length
  const total = group.items.length

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="font-semibold text-gray-900">{group.title}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[group.priority]}`}>
                {PRIORITY_LABELS[group.priority]}
              </span>
            </div>
            <p className="text-xs text-gray-500">{group.timing} · {group.description}</p>
          </div>
        </div>
        <ProgressBar completed={completed} total={total} />
      </div>
      <div className="p-4 space-y-3">
        {group.items.map(item => (
          <ChecklistItemComponent
            key={item.id}
            item={item}
            completed={progress[item.id]?.completed ?? false}
            notes={progress[item.id]?.notes ?? null}
            onToggle={onToggle}
            onNotesSave={onNotesSave}
          />
        ))}
      </div>
    </div>
  )
}
