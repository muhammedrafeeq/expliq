'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

interface Item {
  id: string
  title: string
  category: { name: string; slug: string }
  slug: string
}

export function MarqueeStrip({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const rafRef = useRef<number>(0)
  const pausedRef = useRef(false)
  const speed = 0.5 // px per frame

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const half = track.scrollWidth / 2

    function tick() {
      if (!pausedRef.current) {
        posRef.current += speed
        if (posRef.current >= half) posRef.current -= half
        track!.style.transform = `translateX(${-posRef.current}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const doubled = [...items, ...items]

  return (
    <div
      className="marquee-wrapper overflow-hidden border-y border-outline-variant/50 py-3 bg-surface-container-lowest/60"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {doubled.map((art, i) => (
          <Link
            key={`${art.id}-${i}`}
            href={`/${art.category.slug}/${art.slug}`}
            className="inline-flex items-center gap-2.5 px-7 group shrink-0"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              {art.category.name}
            </span>
            <span className="text-on-surface-variant/25 select-none">·</span>
            <span className="text-xs font-medium text-on-surface group-hover:text-primary transition-colors duration-150">
              {art.title}
            </span>
            <span className="text-on-surface-variant/20 text-sm select-none ml-3">❖</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
