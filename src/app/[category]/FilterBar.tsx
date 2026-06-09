"use client"

import { useState, useRef, useEffect } from 'react'
import { SlidersHorizontal, Clock, TrendingUp, X } from 'lucide-react'
import Link from 'next/link'

interface FilterBarProps {
  categorySlug: string
  sort: string
  read: string
  date: string
}

export function FilterBar({ categorySlug, sort, read, date }: FilterBarProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function buildUrl(overrides: Record<string, string>) {
    const p = new URLSearchParams({ sort, read, date, ...overrides })
    return `/${categorySlug}?${p.toString()}`
  }

  const activeExtras = (read !== 'all' ? 1 : 0) + (date !== 'all' ? 1 : 0)

  const readOptions = [
    { value: 'all', label: 'Any length' },
    { value: 'short', label: '< 5 min' },
    { value: 'medium', label: '5–10 min' },
    { value: 'long', label: '10+ min' },
  ]

  const dateOptions = [
    { value: 'all', label: 'All time' },
    { value: 'week', label: 'This week' },
    { value: 'month', label: 'This month' },
  ]

  return (
    <div className="flex items-center gap-2 select-none" ref={ref}>
      {/* Sort — always visible */}
      <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
        <Link
          href={buildUrl({ sort: 'latest' })}
          className={`text-xs font-semibold px-3.5 py-2 flex items-center gap-1.5 border-r border-outline-variant transition-colors ${sort === 'latest' ? 'bg-on-surface text-surface' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
        >
          <Clock size={11} /> Newest
        </Link>
        <Link
          href={buildUrl({ sort: 'views' })}
          className={`text-xs font-semibold px-3.5 py-2 flex items-center gap-1.5 transition-colors ${sort === 'views' ? 'bg-on-surface text-surface' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
        >
          <TrendingUp size={11} /> Popular
        </Link>
      </div>

      {/* Filter icon button */}
      <div className="relative">
        <button
          onClick={() => setOpen(v => !v)}
          className={`relative flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 border rounded-lg transition-colors cursor-pointer ${open || activeExtras > 0 ? 'bg-on-surface text-surface border-on-surface' : 'border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
        >
          <SlidersHorizontal size={12} />
          <span>Filters</span>
          {activeExtras > 0 && (
            <span className="w-4 h-4 rounded-full bg-primary text-on-primary text-[9px] font-bold flex items-center justify-center">
              {activeExtras}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-surface border border-outline-variant rounded-lg shadow-xl z-50 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Filters</span>
              <button onClick={() => setOpen(false)} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                <X size={13} />
              </button>
            </div>

            {/* Read time */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Read time</span>
              <div className="flex flex-wrap gap-1.5">
                {readOptions.map(opt => (
                  <Link
                    key={opt.value}
                    href={buildUrl({ read: opt.value })}
                    onClick={() => setOpen(false)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${read === opt.value ? 'bg-on-surface text-surface border-on-surface' : 'border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Date range */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Date range</span>
              <div className="flex flex-wrap gap-1.5">
                {dateOptions.map(opt => (
                  <Link
                    key={opt.value}
                    href={buildUrl({ date: opt.value })}
                    onClick={() => setOpen(false)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${date === opt.value ? 'bg-on-surface text-surface border-on-surface' : 'border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Clear */}
            {activeExtras > 0 && (
              <Link
                href={buildUrl({ read: 'all', date: 'all' })}
                onClick={() => setOpen(false)}
                className="block text-center text-xs font-semibold text-primary hover:underline pt-1"
              >
                Clear filters
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
