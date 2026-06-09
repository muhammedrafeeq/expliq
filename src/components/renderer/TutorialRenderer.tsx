"use client"

import { useState } from 'react'
import { Copy, Check, Lightbulb, AlertTriangle, Info, AlertCircle } from 'lucide-react'

export interface TutorialStep {
  title: string
  body: string
  callout?: { type: 'tip' | 'warning' | 'note' | 'info'; text: string }
  code?: { language: string; filename?: string; content: string }
}

interface TutorialRendererProps {
  steps: TutorialStep[]
  note?: string
}

function CopyBtn({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded text-zinc-400 hover:text-white transition-colors"
      title="Copy code"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  )
}

const CALLOUT_STYLES = {
  tip: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500',
    icon: <Lightbulb size={16} className="text-emerald-600 shrink-0 mt-0.5" />,
    label: 'Pro Tip',
    labelColor: 'text-emerald-700 dark:text-emerald-400',
    textColor: 'text-emerald-900/80 dark:text-emerald-200/80',
  },
  warning: {
    bg: 'bg-red-50 dark:bg-red-950/30 border-red-500',
    icon: <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />,
    label: 'Warning',
    labelColor: 'text-red-700 dark:text-red-400',
    textColor: 'text-red-900/80 dark:text-red-200/80',
  },
  note: {
    bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-500',
    icon: <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />,
    label: 'Note',
    labelColor: 'text-blue-700 dark:text-blue-400',
    textColor: 'text-blue-900/80 dark:text-blue-200/80',
  },
  info: {
    bg: 'bg-primary-fixed/5 border-primary',
    icon: <AlertCircle size={16} className="text-primary shrink-0 mt-0.5" />,
    label: 'Info',
    labelColor: 'text-primary',
    textColor: 'text-on-surface-variant',
  },
}

export function TutorialRenderer({ steps, note }: TutorialRendererProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1
        return (
          <div key={idx} className="relative flex gap-4">
            {/* Step number + connector line */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs z-10 shrink-0 shadow-sm">
                {idx + 1}
              </div>
              {!isLast && (
                <div className="w-0.5 bg-outline-variant/40 grow mt-2 mb-0 min-h-8" />
              )}
            </div>

            {/* Step content */}
            <div className={`grow min-w-0 pt-1 ${isLast ? 'pb-2' : 'pb-12'}`}>
              <h3 className="font-serif font-bold text-lg md:text-xl text-on-surface mb-3 leading-snug">
                {step.title}
              </h3>
              <p
                className="text-base text-on-surface/85 leading-relaxed font-sans mb-0"
                dangerouslySetInnerHTML={{ __html: step.body }}
              />

              {/* Callout */}
              {step.callout && (() => {
                const cfg = CALLOUT_STYLES[step.callout.type] || CALLOUT_STYLES.info
                return (
                  <div className={`mt-5 border-l-4 rounded-r-lg p-5 ${cfg.bg}`}>
                    <div className={`flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-widest ${cfg.labelColor}`}>
                      {cfg.icon}
                      {cfg.label}
                    </div>
                    <p className={`text-sm leading-relaxed font-sans ${cfg.textColor}`}>
                      {step.callout.text}
                    </p>
                  </div>
                )
              })()}

              {/* Code block */}
              {step.code && (
                <div className="mt-5 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800/80 text-sm font-mono shadow-md w-full max-w-full">
                  <div className="flex justify-between items-center bg-zinc-900/80 px-4 py-2.5 border-b border-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                      <span className="ml-2 text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                        {step.code.filename || step.code.language}
                      </span>
                    </div>
                    <CopyBtn code={step.code.content} />
                  </div>
                  <pre className="p-5 overflow-x-auto text-zinc-300 leading-relaxed text-sm">
                    <code>{step.code.content}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Bottom note */}
      {note && (
        <div className="mt-8 border-l-4 border-primary rounded-r-lg p-5 bg-primary-fixed/5">
          <div className="flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-widest text-primary">
            <Info size={14} />
            Note
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed font-sans">{note}</p>
        </div>
      )}
    </div>
  )
}
