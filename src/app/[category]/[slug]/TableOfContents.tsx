// E:\Projects\Works\Expliq\src\app\[category]\[slug]\TableOfContents.tsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface TOCItem {
  id: string
  label: string
}

interface TableOfContentsProps {
  items: TOCItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find entries that are intersecting
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          // Set active to the first intersecting element's id
          setActiveId(visibleEntries[0].target.id)
        }
      },
      {
        rootMargin: '-100px 0px -70% 0px', // Triggers when heading is in the upper reading section
        threshold: 0,
      }
    )

    // Observe all heading elements
    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => {
      items.forEach((item) => {
        const el = document.getElementById(item.id)
        if (el) observer.unobserve(el)
      })
    }
  }, [items])

  return (
    <div className="space-y-4">
      <h5 className="text-[10px] font-bold uppercase tracking-wider text-outline">Table of Contents</h5>
      <nav className="flex flex-col gap-2.5">
        {items.map((item) => {
          const isActive = activeId === item.id
          return (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className={`text-xs transition-all duration-200 border-l-2 pl-3.5 py-0.5 leading-normal block ${
                isActive
                  ? 'border-primary text-primary font-bold translate-x-1'
                  : 'border-outline-variant/40 hover:border-primary/50 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
