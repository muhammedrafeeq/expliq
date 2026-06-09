"use client"

import { useState } from 'react'
import { UserPlus, UserCheck } from 'lucide-react'

interface AuthorCardProps {
  author: {
    name: string
    bio: string
    avatar_letter: string
  }
}

export function AuthorCard({ author }: AuthorCardProps) {
  const [following, setFollowing] = useState(false)

  return (
    <div className="border border-outline-variant/30 rounded-lg bg-surface-container-lowest/50 backdrop-blur-md overflow-hidden select-none">
      {/* Accent line */}
      <div className="h-0.5 w-full bg-linear-to-r from-primary via-secondary to-tertiary opacity-60" />

      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary/15 to-secondary/15 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary shrink-0">
            {author.avatar_letter || 'TR'}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-on-surface leading-tight truncate">{author.name}</h4>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/60">Verified Writer</span>
          </div>
          <button
            onClick={() => setFollowing(!following)}
            title={following ? 'Following' : 'Follow writer'}
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 ${
              following
                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                : 'border border-outline/30 text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5'
            }`}
          >
            {following ? <UserCheck size={14} /> : <UserPlus size={14} />}
          </button>
        </div>
      </div>
    </div>
  )
}
