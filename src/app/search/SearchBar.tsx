// E:\Projects\Works\Expliq\src\app\search\SearchBar.tsx
"use client"

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      router.push('/search')
      return
    }

    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8 relative">
      <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded-full h-12 px-5 group focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all duration-200">
        {isPending ? (
          <Loader2 className="animate-spin text-primary" size={18} />
        ) : (
          <Search className="text-outline-variant group-focus-within:text-primary" size={18} />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tutorials, articles, or tools..."
          className="w-full bg-transparent border-none outline-none focus:ring-0 text-body-md font-body-md text-on-surface placeholder-on-surface-variant/50 ml-3 h-full"
        />
      </div>
    </form>
  )
}
