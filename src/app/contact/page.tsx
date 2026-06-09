"use client"

import { useState } from 'react'
import { Mail, MessageSquare, Send, Check, AlertCircle, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    // Simulate sending — replace with real API call or form service
    await new Promise(r => setTimeout(r, 1200))
    setStatus('success')
  }

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(v => ({ ...v, [field]: e.target.value }))

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="mb-12 max-w-xl">
        <p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-3">Get in touch</p>
        <h1 className="font-serif font-extrabold text-4xl text-on-surface tracking-tight mb-4">Contact Us</h1>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Have a question, story pitch, partnership enquiry, or just want to say hello? We'd love to hear from you. Fill in the form and we'll get back to you within 2 business days.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">

        {/* Left: info cards */}
        <div className="md:col-span-2 space-y-4">
          <InfoCard
            icon={<Mail size={16} />}
            title="Email"
            body="hello@expliq.in"
            sub="We reply within 2 business days"
            href="mailto:hello@expliq.in"
          />
          <InfoCard
            icon={<MessageSquare size={16} />}
            title="Editorial & Partnerships"
            body="partnerships@expliq.in"
            sub="Sponsored content, brand deals, guest posts"
            href="mailto:partnerships@expliq.in"
          />
          <InfoCard
            icon={<MapPin size={16} />}
            title="Based in"
            body="India"
            sub="Serving readers across India and beyond"
          />
          <InfoCard
            icon={<Clock size={16} />}
            title="Response time"
            body="Within 48 hours"
            sub="Monday – Friday, 10 AM – 6 PM IST"
          />

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-6">
            <p className="text-xs font-semibold text-primary mb-1">Newsletter</p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Want weekly tech stories in your inbox? <a href="/#newsletter" className="text-primary hover:underline font-medium">Subscribe to Expliq Weekly</a> — no spam, ever.
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="md:col-span-3">
          {status === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 gap-4">
              <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                <Check size={24} className="text-green-500" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-on-surface">Message sent!</h2>
              <p className="text-sm text-on-surface-variant max-w-xs">
                Thanks for reaching out. We'll get back to you at <strong className="text-on-surface">{form.email}</strong> within 2 business days.
              </p>
              <button
                onClick={() => { setStatus('idle'); setForm({ name: '', email: '', subject: '', message: '' }) }}
                className="mt-2 text-xs text-primary hover:underline font-medium"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Your name" required>
                  <input
                    type="text"
                    required
                    placeholder="Arjun Kumar"
                    value={form.name}
                    onChange={update('name')}
                    className={inputCls}
                  />
                </Field>
                <Field label="Email address" required>
                  <input
                    type="email"
                    required
                    placeholder="arjun@example.com"
                    value={form.email}
                    onChange={update('email')}
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Subject" required>
                <select required value={form.subject} onChange={update('subject')} className={inputCls}>
                  <option value="">Select a topic…</option>
                  <option value="general">General Enquiry</option>
                  <option value="partnership">Partnership / Sponsorship</option>
                  <option value="guest-post">Guest Post Pitch</option>
                  <option value="bug">Bug Report</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="other">Other</option>
                </select>
              </Field>

              <Field label="Message" required>
                <textarea
                  required
                  rows={6}
                  placeholder="Tell us what's on your mind…"
                  value={form.message}
                  onChange={update('message')}
                  className={`${inputCls} resize-none`}
                />
              </Field>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-xs text-red-500 font-medium">
                  <AlertCircle size={14} />
                  Something went wrong. Please try again or email us directly.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex items-center gap-2 bg-on-surface text-surface font-bold text-sm px-6 py-3 rounded-xl hover:bg-on-surface-variant transition-colors active:scale-95 disabled:opacity-50"
              >
                <Send size={14} />
                {status === 'loading' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const inputCls = "w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-on-surface">
        {label}{required && <span className="text-primary ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function InfoCard({ icon, title, body, sub, href }: { icon: React.ReactNode; title: string; body: string; sub: string; href?: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-outline-variant bg-surface-container-low">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">{title}</p>
        {href ? (
          <a href={href} className="text-sm font-semibold text-on-surface hover:text-primary transition-colors">{body}</a>
        ) : (
          <p className="text-sm font-semibold text-on-surface">{body}</p>
        )}
        <p className="text-xs text-on-surface-variant mt-0.5">{sub}</p>
      </div>
    </div>
  )
}
