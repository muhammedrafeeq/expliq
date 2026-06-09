// E:\Projects\Works\Expliq\src\app\[category]\[slug]\ShareButtons.tsx
"use client"

import { useState } from 'react'
import { Share2, Check, Copy } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  categorySlug: string
  slug: string
  variant?: 'default' | 'icon'
}

export function ShareButtons({ title, categorySlug, slug, variant = 'default' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (typeof window === 'undefined') return
    const url = `${window.location.origin}/${categorySlug}/${slug}`

    // Try native sharing first (perfect for mobile browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this article on Expliq: ${title}`,
          url: url,
        })
        return
      } catch {
        // user cancelled or share not supported, fall through to clipboard
      }
    }

    // Clipboard Copy Fallback (standard for desktop browsers)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // clipboard not available
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        title={copied ? 'Link copied!' : 'Share article'}
        className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200 active:scale-95 cursor-pointer ${
          copied
            ? 'bg-green-500/10 border-green-500/30 text-green-500'
            : 'border-outline/30 hover:border-primary text-on-surface-variant hover:text-primary hover:bg-primary/5'
        }`}
      >
        {copied ? <Check size={14} /> : <Share2 size={14} />}
      </button>
    )
  }

  return (
    <div className="relative select-none">
      <button
        onClick={handleShare}
        className={`w-full flex items-center justify-center gap-2 border text-center font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg transition-all duration-300 shadow-sm active:scale-95 cursor-pointer ${
          copied
            ? 'bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/20'
            : 'border-outline/30 hover:border-primary text-on-surface hover:text-primary bg-surface-container-lowest/40 backdrop-blur hover:bg-primary/5'
        }`}
      >
        {copied ? (
          <>
            <Check size={13} className="text-green-500 animate-scale-in" />
            <span>Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 size={13} />
            <span>Share Article</span>
          </>
        )}
      </button>
    </div>
  )
}
