import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Page Not Found' }

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
      <span className="text-6xl font-serif font-bold text-outline-variant">404</span>
      <div className="space-y-2">
        <h1 className="font-serif font-bold text-2xl text-on-surface">Page not found</h1>
        <p className="text-sm text-on-surface-variant max-w-sm">
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </div>
      <Link
        href="/"
        className="bg-primary text-on-primary text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
      >
        Back to home
      </Link>
    </div>
  )
}
