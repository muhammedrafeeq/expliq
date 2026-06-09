'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="font-serif font-bold text-2xl text-on-surface">Something went wrong</h2>
      <p className="text-sm text-on-surface-variant max-w-sm">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="bg-primary text-on-primary text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
