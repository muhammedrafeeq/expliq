// E:\Projects\Works\Expliq\src\components\editor\BlockMenu.tsx
"use client"

import { useState } from 'react'
import { Plus, Heading, Type, Image, Quote, Code, AlertCircle, Table, List, Link, Play, Minus, ListChecks, TextQuote, ListOrdered, HelpCircle, MousePointerClick, BarChart2, Mail } from 'lucide-react'
import { BlockType } from '@/lib/types/blocks'

interface BlockMenuProps {
  onSelect: (type: BlockType) => void
}

export function BlockMenu({ onSelect }: BlockMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { type: 'paragraph', label: 'Paragraph', icon: Type, group: 'Text' },
    { type: 'heading', label: 'Heading', icon: Heading, group: 'Text' },
    { type: 'quote', label: 'Quote', icon: Quote, group: 'Text' },
    { type: 'list', label: 'List', icon: List, group: 'Text' },
    { type: 'divider', label: 'Divider', icon: Minus, group: 'Text' },
    { type: 'image', label: 'Image', icon: Image, group: 'Media' },
    { type: 'embed', label: 'YouTube / Video', icon: Play, group: 'Media' },
    { type: 'code', label: 'Code Block', icon: Code, group: 'Advanced' },
    { type: 'callout', label: 'Callout Box', icon: AlertCircle, group: 'Advanced' },
    { type: 'table', label: 'Table', icon: Table, group: 'Advanced' },
    { type: 'affiliate', label: 'Affiliate Card', icon: Link, group: 'Advanced' },
    { type: 'key-takeaways', label: 'Key Takeaways', icon: ListChecks, group: 'Content' },
    { type: 'pull-quote', label: 'Pull Quote', icon: TextQuote, group: 'Content' },
    { type: 'steps', label: 'Steps', icon: ListOrdered, group: 'Content' },
    { type: 'faq', label: 'FAQ', icon: HelpCircle, group: 'Content' },
    { type: 'cta', label: 'CTA Button', icon: MousePointerClick, group: 'Content' },
    { type: 'stat', label: 'Stat Highlight', icon: BarChart2, group: 'Content' },
    { type: 'newsletter', label: 'Newsletter', icon: Mail, group: 'Content' },
  ] as const

  return (
    <div className="absolute right-[-40px] top-1.5 hidden group-hover:block z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:scale-105 transition-all"
        title="Insert block"
      >
        <Plus size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-zinc-950 text-white rounded-lg shadow-2xl border border-zinc-800 p-2 w-52 flex flex-col gap-0.5 z-50">
          {(['Text', 'Media', 'Advanced', 'Content'] as const).map(group => {
            const items = menuItems.filter(i => i.group === group)
            return (
              <div key={group}>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest px-2.5 py-1.5 mt-1">
                  {group}
                </p>
                {items.map(item => {
                  const IconComponent = item.icon
                  return (
                    <button
                      key={item.type}
                      onClick={() => { onSelect(item.type as BlockType); setIsOpen(false) }}
                      className="flex items-center gap-2.5 w-full text-left px-2.5 py-1.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <IconComponent size={14} className="text-primary-fixed shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
