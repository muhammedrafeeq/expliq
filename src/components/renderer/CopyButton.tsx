// E:\Projects\Works\Expliq\src\components\renderer\CopyButton.tsx
"use client"

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  code: string
}

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all select-none opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer z-10"
      title="Copy code"
      aria-label="Copy code"
    >
      {copied ? (
        <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 px-0.5">
          <Check size={12} /> Copied
        </span>
      ) : (
        <Copy size={12} />
      )}
    </button>
  )
}
