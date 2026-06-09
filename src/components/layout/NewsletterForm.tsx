// E:\Projects\Works\Expliq\src\components\layout\NewsletterForm.tsx
"use client"

import { useState } from 'react'
import { subscribeNewsletterAction } from '@/lib/actions/newsletter'
import { Sparkles, Check, AlertCircle } from 'lucide-react'

interface NewsletterFormProps {
  source?: string
  layout?: 'default' | 'card'
}

export function NewsletterForm({ source = 'homepage', layout = 'default' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    const res = await subscribeNewsletterAction(email, source)

    if (res.error) {
      setStatus('error')
      setMessage(res.error)
    } else {
      setStatus('success')
      setMessage('Thank you for subscribing! Weekly digests will land in your inbox.')
      setEmail('')
    }
  }

  if (layout === 'card') {
    return (
      <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white rounded-lg p-8 md:p-12 text-center relative overflow-hidden border border-zinc-800/60 shadow-xl select-none">
        {/* Blur gradients */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <div className="inline-flex p-2 bg-white/5 rounded-full border border-white/10 mb-2">
            <Sparkles size={16} className="text-primary-fixed-dim" />
          </div>
          <h3 className="font-serif font-extrabold text-2xl md:text-3xl tracking-tight text-white">Deep tech stories, delivered weekly.</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Join 15,000+ Indian developers and creators receiving our curated newsletter every Sunday morning.
          </p>
          
          {status === 'success' ? (
            <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg flex items-center justify-center gap-2.5 max-w-md mx-auto animate-fade-in">
              <Check size={18} className="text-green-400" />
              <span className="text-xs text-green-300 font-medium">{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={status === 'loading'}
                suppressHydrationWarning
                className="flex-grow bg-white/5 border border-white/10 rounded-lg px-5 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-white hover:bg-zinc-100 text-black font-bold text-xs px-6 py-3 rounded-lg transition-all whitespace-nowrap active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}

          {status === 'error' && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 font-medium animate-fade-in">
              <AlertCircle size={14} />
              <span>{message}</span>
            </div>
          )}

          <p className="text-[10px] font-mono text-zinc-500 pt-1">No spam. Only high-quality content. Unsubscribe anytime.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {status === 'success' ? (
        <div className="bg-primary/5 border border-primary/20 p-3.5 rounded-lg flex items-center gap-2">
          <Check size={16} className="text-primary" />
          <span className="text-xs text-on-surface-variant font-medium">{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2.5">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            disabled={status === 'loading'}
            className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2 text-xs focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50 text-on-surface"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-on-surface text-surface text-xs font-bold px-4 py-2 rounded-lg hover:bg-on-surface-variant transition-colors active:scale-95 disabled:opacity-50"
          >
            {status === 'loading' ? '...' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-1 text-xs text-error font-medium">
          <AlertCircle size={14} />
          <span>{message}</span>
        </div>
      )}
    </div>
  )
}
