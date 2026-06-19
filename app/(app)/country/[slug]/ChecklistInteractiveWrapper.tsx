'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChecklistGroupComponent } from '@/components/checklist/ChecklistGroup'
import type { ChecklistGroup, ChecklistProgress, CountrySlug } from '@/lib/types'

interface Props {
  userId: string
  countrySlug: CountrySlug
  checklist: ChecklistGroup[]
  initialProgress: Record<string, ChecklistProgress>
}

export function ChecklistInteractiveWrapper({ userId, countrySlug, checklist, initialProgress }: Props) {
  const [progress, setProgress] = useState(initialProgress)
  const supabase = createClient()

  const handleToggle = useCallback(async (itemId: string) => {
    const current = progress[itemId]
    const newCompleted = !(current?.completed ?? false)

    setProgress(prev => ({
      ...prev,
      [itemId]: {
        item_id: itemId,
        completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null,
        notes: prev[itemId]?.notes ?? null
      }
    }))

    await supabase.from('checklist_progress').upsert({
      user_id: userId,
      country_slug: countrySlug,
      item_id: itemId,
      completed: newCompleted,
      completed_at: newCompleted ? new Date().toISOString() : null
    }, { onConflict: 'user_id,country_slug,item_id' })
  }, [progress, userId, countrySlug, supabase])

  const handleNotesSave = useCallback(async (itemId: string, notes: string) => {
    setProgress(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        item_id: itemId,
        completed: prev[itemId]?.completed ?? false,
        completed_at: prev[itemId]?.completed_at ?? null,
        notes
      }
    }))

    await supabase.from('checklist_progress').upsert({
      user_id: userId,
      country_slug: countrySlug,
      item_id: itemId,
      notes,
      completed: progress[itemId]?.completed ?? false
    }, { onConflict: 'user_id,country_slug,item_id' })
  }, [progress, userId, countrySlug, supabase])

  return (
    <div className="space-y-6">
      {checklist.map(group => (
        <ChecklistGroupComponent
          key={group.id}
          group={group}
          progress={progress}
          onToggle={handleToggle}
          onNotesSave={handleNotesSave}
        />
      ))}
    </div>
  )
}
