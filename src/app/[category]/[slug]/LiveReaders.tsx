"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface LiveReadersProps {
  articleId: string
}

export function LiveReaders({ articleId }: LiveReadersProps) {
  const [count, setCount] = useState(1)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`article-presence:${articleId}`, {
      config: { presence: { key: articleId } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const total = Object.values(state).flat().length
        setCount(Math.max(1, total))
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ article_id: articleId, joined_at: Date.now() })
        }
      })

    return () => {
      channel.unsubscribe()
    }
  }, [articleId])

  if (count <= 1) return null

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant font-sans">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      {count} reading now
    </span>
  )
}
