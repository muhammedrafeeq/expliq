// E:\Projects\Works\Expliq\src\components\editor\FloatingToolbar.tsx
"use client"

import { useState, useEffect, useRef } from 'react'
import { Bold, Italic, Link, Code, Highlighter, Strikethrough, X } from 'lucide-react'

interface FloatingToolbarProps {
  onFormat: (command: string, value?: string) => void
}

export function FloatingToolbar({ onFormat }: FloatingToolbarProps) {
  const [show, setShow] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        setShow(false)
        setShowLinkInput(false)
        return
      }

      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      // Ensure we are inside a contenteditable block
      let node: Node | null = range.startContainer
      let isInsideEditable = false
      while (node) {
        if (node instanceof HTMLElement && node.hasAttribute('contenteditable')) {
          isInsideEditable = true
          break
        }
        node = node.parentNode
      }

      if (!isInsideEditable) {
        setShow(false)
        return
      }

      if (rect.width > 0 && rect.height > 0) {
        setCoords({
          top: rect.top + window.scrollY - 44, // Position above the text selection
          left: rect.left + window.scrollX + rect.width / 2 - 120, // Center horizontally
        })
        setShow(true)
      } else {
        setShow(false)
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [])

  const triggerFormat = (command: string, value: string = '') => {
    onFormat(command, value)
    // Refocus selection
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (linkUrl) {
      triggerFormat('createLink', linkUrl)
      setLinkUrl('')
      setShowLinkInput(false)
    }
  };

  if (!show) return null

  return (
    <div
      ref={toolbarRef}
      className="absolute z-50 flex items-center bg-zinc-950 text-white rounded-lg shadow-xl border border-zinc-800 p-1 gap-1 transition-all duration-100 ease-out"
      style={{
        top: `${Math.max(10, coords.top)}px`,
        left: `${Math.max(10, coords.left)}px`,
      }}
    >
      {!showLinkInput ? (
        <>
          <button
            onClick={() => triggerFormat('bold')}
            className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-zinc-300 hover:text-white"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => triggerFormat('italic')}
            className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-zinc-300 hover:text-white"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => triggerFormat('strikeThrough')}
            className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-zinc-300 hover:text-white"
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>
          <button
            onClick={() => setShowLinkInput(true)}
            className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-zinc-300 hover:text-white"
            title="Add Link"
          >
            <Link size={16} />
          </button>
          <button
            onClick={() => triggerFormat('formatBlock', '<code>')}
            className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-zinc-300 hover:text-white"
            title="Code Block"
          >
            <Code size={16} />
          </button>
          <button
            onClick={() => triggerFormat('hiliteColor', '#fef08a')} // Tailwind yellow-200 highlight
            className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-zinc-300 hover:text-white"
            title="Highlight Text"
          >
            <Highlighter size={16} />
          </button>
        </>
      ) : (
        <form onSubmit={handleLinkSubmit} className="flex items-center gap-1 px-1">
          <input
            type="url"
            placeholder="Paste URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-xs px-2 py-1 rounded text-white focus:outline-none focus:border-primary w-40"
            autoFocus
          />
          <button
            type="submit"
            className="bg-primary text-white text-xs px-2 py-1 rounded hover:bg-primary-container transition-colors"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
          >
            <X size={14} />
          </button>
        </form>
      )}
    </div>
  )
}
