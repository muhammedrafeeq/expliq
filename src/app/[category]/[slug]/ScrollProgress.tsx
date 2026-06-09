// E:\Projects\Works\Expliq\src\app\[category]\[slug]\ScrollProgress.tsx
"use client"

import { useState, useEffect } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0
      setProgress(scrolled)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-16 left-0 w-full h-1 z-[60] bg-surface-container-low select-none pointer-events-none">
      <div
        className="h-full bg-primary transition-all duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
