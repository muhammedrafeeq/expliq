// E:\Projects\Works\Expliq\src\lib\hooks\useAutoSave.ts
"use client"

import { useState, useEffect, useRef } from 'react'
import { Block } from '@/lib/types/blocks'
import { saveDraftAction } from '@/lib/actions/articles'

export type SaveStatus = 'saved' | 'saving' | 'error' | 'unsaved'

export function useAutoSave(articleId: string, blocks: Block[], title: string) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedRef = useRef({ blocks: JSON.stringify(blocks), title })

  useEffect(() => {
    const currentState = JSON.stringify(blocks)
    const hasChanged = currentState !== lastSavedRef.current.blocks || title !== lastSavedRef.current.title
    if (!hasChanged) return

    setSaveStatus('unsaved')
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      setSaveStatus('saving')
      try {
        await saveDraftAction({ articleId, blocks, title })
        lastSavedRef.current = { blocks: currentState, title }
        setSaveStatus('saved')
      } catch {
        setSaveStatus('error')
      }
    }, 2000) // Debounce 2 seconds

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [blocks, title, articleId])

  return { saveStatus }
}
