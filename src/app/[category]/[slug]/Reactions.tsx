"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const REACTIONS = [
  { key: 'fire',    emoji: '🔥', label: 'Hot topic' },
  { key: 'learned', emoji: '💡', label: 'Learned something' },
  { key: 'think',   emoji: '🤔', label: 'Made me think' },
  { key: 'clap',    emoji: '👏', label: 'Well written' },
  { key: 'share',   emoji: '🚀', label: 'Shared this' },
] as const

type ReactionKey = typeof REACTIONS[number]['key']

interface ReactionsProps {
  articleId: string
}

export function Reactions({ articleId }: ReactionsProps) {
  const [counts, setCounts] = useState<Record<ReactionKey, number>>({
    fire: 0, learned: 0, think: 0, clap: 0, share: 0,
  })
  const [myReactions, setMyReactions] = useState<Set<ReactionKey>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      const { data } = await supabase
        .from('article_reactions')
        .select('reaction, user_id')
        .eq('article_id', articleId)

      if (data) {
        const newCounts: Record<ReactionKey, number> = { fire: 0, learned: 0, think: 0, clap: 0, share: 0 }
        const mine = new Set<ReactionKey>()
        for (const row of data) {
          if (row.reaction in newCounts) newCounts[row.reaction as ReactionKey]++
          if (user && row.user_id === user.id) mine.add(row.reaction as ReactionKey)
        }
        setCounts(newCounts)
        setMyReactions(mine)
      }
      setLoading(false)
    }

    load()
  }, [articleId])

  async function toggle(key: ReactionKey) {
    const supabase = createClient()

    // Optimistic update
    const isActive = myReactions.has(key)
    setCounts(prev => ({ ...prev, [key]: prev[key] + (isActive ? -1 : 1) }))
    setMyReactions(prev => {
      const next = new Set(prev)
      isActive ? next.delete(key) : next.add(key)
      return next
    })

    if (!userId) {
      // Guest: use localStorage as fallback, no DB write
      return
    }

    if (isActive) {
      await supabase.from('article_reactions')
        .delete()
        .eq('article_id', articleId)
        .eq('user_id', userId)
        .eq('reaction', key)
    } else {
      await supabase.from('article_reactions')
        .upsert({ article_id: articleId, user_id: userId, reaction: key })
    }
  }

  if (loading) {
    return <div className="flex gap-2 animate-pulse">{REACTIONS.map(r => (
      <div key={r.key} className="h-10 w-16 rounded-full bg-surface-variant" />
    ))}</div>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {REACTIONS.map(({ key, emoji, label }) => {
        const active = myReactions.has(key)
        return (
          <button
            key={key}
            onClick={() => toggle(key)}
            title={label}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium transition-all duration-150 select-none font-sans
              ${active
                ? 'bg-primary/10 border-primary/30 text-primary shadow-sm scale-105'
                : 'bg-surface-container border-outline-variant/40 text-on-surface-variant hover:border-outline hover:bg-surface-container-high'
              }`}
          >
            <span className="text-base leading-none">{emoji}</span>
            {counts[key] > 0 && (
              <span className="text-xs font-bold tabular-nums">{counts[key]}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
