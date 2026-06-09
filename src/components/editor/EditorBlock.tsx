// E:\Projects\Works\Expliq\src\components\editor\EditorBlock.tsx
"use client"

import { useRef, useEffect } from 'react'
import DOMPurify from 'isomorphic-dompurify'
import { Block, BlockType } from '@/lib/types/blocks'

interface EditorBlockProps {
  block: Block
  autoFocus: boolean
  onUpdate: (updates: Partial<Block>) => void
  onAddAfter: (type: BlockType) => void
  onDelete: () => void
}

export function EditorBlock({ block, autoFocus, onUpdate, onAddAfter, onDelete }: EditorBlockProps) {
  const editableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoFocus && editableRef.current) {
      editableRef.current.focus()
      // Move cursor to end of text
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(editableRef.current)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }, [autoFocus])

  // Clean HTML markup on save
  const sanitizeHtml = (html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['strong', 'em', 'a', 'code', 'mark', 's', 'br'],
      ALLOWED_ATTR: ['href', 'target'],
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && (block.type === 'paragraph' || block.type === 'heading')) {
      e.preventDefault()
      onAddAfter('paragraph')
    }
    if (e.key === 'Backspace' && editableRef.current?.innerText.trim() === '') {
      e.preventDefault()
      onDelete()
    }
  }

  const handleBlur = () => {
    if (editableRef.current) {
      const html = editableRef.current.innerHTML
      if (block.type === 'paragraph' || block.type === 'heading') {
        onUpdate({ content: sanitizeHtml(html) })
      }
    }
  }

  switch (block.type) {
    case 'heading':
      return (
        <div className="my-4 relative">
          <div className="flex gap-2 mb-1.5 select-none">
            {([2, 3, 4] as const).map((level) => (
              <button
                key={level}
                onClick={() => onUpdate({ level })}
                className={`text-xs px-2 py-0.5 rounded font-mono border transition-all ${
                  block.level === level
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface border-outline-variant text-outline hover:bg-surface-container-high'
                }`}
              >
                H{level}
              </button>
            ))}
          </div>
          <div
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`outline-none font-serif font-bold text-on-surface border-b border-transparent focus:border-primary-fixed pb-1 ${
              block.level === 2 ? 'text-2xl' : block.level === 3 ? 'text-xl' : 'text-lg'
            }`}
            data-placeholder={`H${block.level} Heading...`}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        </div>
      )

    case 'paragraph':
      return (
        <div className="my-3 relative">
          <div
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="outline-none text-body-md text-on-surface leading-relaxed min-h-[24px] border-l-2 border-transparent focus:border-primary-fixed pl-2"
            data-placeholder="Start typing your paragraph... Use Cmd+B for Bold, Cmd+I for Italic, select to Link"
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        </div>
      )

    case 'quote':
      return (
        <div className="my-6 border-l-4 border-primary bg-surface-container-low p-6 rounded-r-lg space-y-3">
          <textarea
            className="w-full bg-transparent border-none outline-none font-serif italic text-lg resize-none focus:ring-0 text-on-surface"
            placeholder="Paste or type a quote..."
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            rows={2}
          />
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none text-xs font-semibold text-on-surface-variant focus:ring-0 border-b border-transparent focus:border-outline-variant pb-1"
            placeholder="— Attribution (Optional)"
            value={block.attribution || ''}
            onChange={(e) => onUpdate({ attribution: e.target.value })}
          />
        </div>
      )

    case 'code':
      return (
        <div className="my-6 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
          <div className="flex justify-between items-center bg-zinc-900 px-4 py-2 border-b border-zinc-850">
            <select
              value={block.language}
              onChange={(e: any) => onUpdate({ language: e.target.value })}
              className="bg-zinc-950 border border-zinc-700 text-xs px-2 py-1 rounded text-zinc-300 focus:outline-none"
            >
              {['javascript', 'typescript', 'python', 'bash', 'sql', 'json', 'html', 'css', 'plaintext'].map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="filename (optional)"
              value={block.filename || ''}
              onChange={(e) => onUpdate({ filename: e.target.value })}
              className="bg-transparent border-none outline-none text-xs text-zinc-400 text-right focus:ring-0 w-40"
            />
          </div>
          <textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Write or paste your code here..."
            className="w-full bg-transparent border-none outline-none font-mono text-sm p-4 text-zinc-300 min-h-[120px] focus:ring-0 resize-y"
          />
        </div>
      )

    case 'callout':
      return (
        <div
          className={`my-6 border-l-4 p-5 rounded-r-lg ${
            block.style === 'info'
              ? 'bg-[#f0f4f9] border-[#0053db]'
              : block.style === 'warning'
              ? 'bg-[#fffbeb] border-[#f59e0b]'
              : block.style === 'tip'
              ? 'bg-[#f0fdf4] border-[#10b981]'
              : 'bg-[#fef2f2] border-[#ef4444]'
          }`}
        >
          <div className="flex justify-between items-center mb-3">
            <select
              value={block.style}
              onChange={(e: any) => onUpdate({ style: e.target.value })}
              className="bg-white/80 border border-outline-variant text-xs px-2 py-0.5 rounded text-on-surface outline-none"
            >
              <option value="info">INFO</option>
              <option value="warning">WARNING</option>
              <option value="tip">TIP</option>
              <option value="important">IMPORTANT</option>
            </select>
            <input
              type="text"
              placeholder="Callout Title (Optional)"
              value={block.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="bg-transparent border-none outline-none text-xs font-bold text-on-surface focus:ring-0 border-b border-transparent focus:border-outline-variant pb-0.5 ml-4 grow"
            />
          </div>
          <textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Write callout notes..."
            className="w-full bg-transparent border-none outline-none text-sm focus:ring-0 text-on-surface-variant resize-none"
            rows={2}
          />
        </div>
      )

    case 'divider':
      return (
        <div className="my-6 py-4 flex justify-center items-center relative select-none">
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ style: 'line' })}
              className={`text-[10px] px-2 py-0.5 rounded border ${
                block.style === 'line' ? 'bg-zinc-800 text-white' : 'bg-surface text-outline border-outline-variant'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => onUpdate({ style: 'dots' })}
              className={`text-[10px] px-2 py-0.5 rounded border ${
                block.style === 'dots' ? 'bg-zinc-800 text-white' : 'bg-surface text-outline border-outline-variant'
              }`}
            >
              Dots
            </button>
          </div>
          <div className="absolute left-0 right-0 h-[1px] bg-outline-variant -z-10" />
        </div>
      )

    case 'list':
      return (
        <div className="my-4 space-y-2">
          <div className="flex gap-2 select-none mb-1.5">
            {(['bullet', 'numbered', 'checklist'] as const).map((style) => (
              <button
                key={style}
                onClick={() => onUpdate({ style })}
                className={`text-[10px] px-2 py-0.5 rounded border ${
                  block.style === style ? 'bg-zinc-850 text-white' : 'bg-surface text-outline border-outline-variant'
                }`}
              >
                {style.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="pl-6 space-y-1">
            {block.items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="font-mono text-xs text-outline">
                  {block.style === 'bullet' ? '•' : block.style === 'numbered' ? `${idx + 1}.` : '☐'}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...block.items]
                    newItems[idx] = e.target.value
                    onUpdate({ items: newItems })
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const newItems = [...block.items]
                      newItems.splice(idx + 1, 0, '')
                      onUpdate({ items: newItems })
                    }
                    if (e.key === 'Backspace' && item === '') {
                      e.preventDefault()
                      const newItems = block.items.filter((_, i) => i !== idx)
                      if (newItems.length === 0) {
                        onDelete()
                      } else {
                        onUpdate({ items: newItems })
                      }
                    }
                  }}
                  className="bg-transparent border-none outline-none focus:ring-0 text-body-md text-on-surface grow border-b border-transparent focus:border-outline-variant pb-0.5"
                  placeholder="List item..."
                />
              </div>
            ))}
          </div>
        </div>
      )

    case 'image':
      return (
        <div className="my-6 border border-outline-variant rounded-lg overflow-hidden bg-surface-container-low p-4 space-y-3">
          <input
            type="url"
            placeholder="Image URL (Supabase Storage URL or external)"
            value={block.url}
            onChange={(e) => onUpdate({ url: e.target.value })}
            className="w-full text-xs bg-white border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="SEO Alt text (Required)"
              value={block.alt}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              className="text-xs bg-white border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none"
            />
            <input
              type="text"
              placeholder="Image caption (Optional)"
              value={block.caption || ''}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              className="text-xs bg-white border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none"
            />
          </div>
          <div className="flex gap-4 select-none items-center text-xs">
            <span className="text-on-surface-variant font-bold">Alignment:</span>
            <button
              onClick={() => onUpdate({ alignment: 'center' })}
              className={`px-3 py-1 rounded border ${
                block.alignment === 'center' ? 'bg-primary text-on-primary' : 'bg-white text-outline border-outline-variant'
              }`}
            >
              Center
            </button>
            <button
              onClick={() => onUpdate({ alignment: 'full' })}
              className={`px-3 py-1 rounded border ${
                block.alignment === 'full' ? 'bg-primary text-on-primary' : 'bg-white text-outline border-outline-variant'
              }`}
            >
              Full Width
            </button>
          </div>
          {block.url && (
            <div className="mt-3 flex justify-center bg-black/5 p-2 rounded-lg">
              <img src={block.url} alt={block.alt} className="max-h-48 object-contain rounded" />
            </div>
          )}
        </div>
      )

    case 'affiliate':
      return (
        <div className="my-6 border-2 border-primary-fixed bg-surface p-6 rounded-lg flex flex-col md:flex-row gap-6 relative">
          <div className="absolute top-[-10px] left-4 bg-primary text-on-primary text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider select-none">
            Affiliate Link Block
          </div>
          {/* Editor inputs */}
          <div className="flex-1 space-y-3.5 border-b md:border-b-0 md:border-r border-outline-variant pb-6 md:pb-0 md:pr-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-outline">Product Name</label>
              <input
                type="text"
                value={block.product_name}
                onChange={(e) => onUpdate({ product_name: e.target.value })}
                className="w-full text-xs border border-outline-variant rounded p-1.5 focus:outline-none"
                placeholder="Product/Service Name"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-outline">Description</label>
              <textarea
                value={block.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                className="w-full text-xs border border-outline-variant rounded p-1.5 focus:outline-none resize-none"
                placeholder="1-2 sentences review..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-outline">Price / Free details</label>
                <input
                  type="text"
                  value={block.price || ''}
                  onChange={(e) => onUpdate({ price: e.target.value })}
                  className="w-full text-xs border border-outline-variant rounded p-1.5 focus:outline-none"
                  placeholder="e.g. ₹999/mo"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-outline">Badge Pill Text</label>
                <input
                  type="text"
                  value={block.badge || ''}
                  onChange={(e) => onUpdate({ badge: e.target.value })}
                  className="w-full text-xs border border-outline-variant rounded p-1.5 focus:outline-none"
                  placeholder="e.g. Best Value"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-outline">Affiliate Target URL</label>
                <input
                  type="text"
                  value={block.affiliate_url}
                  onChange={(e) => onUpdate({ affiliate_url: e.target.value })}
                  className="w-full text-xs border border-outline-variant rounded p-1.5 focus:outline-none"
                  placeholder="tracked URL"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-outline">CTA Button Text</label>
                <input
                  type="text"
                  value={block.cta_text}
                  onChange={(e) => onUpdate({ cta_text: e.target.value })}
                  className="w-full text-xs border border-outline-variant rounded p-1.5 focus:outline-none"
                  placeholder="Buy now / Enroll"
                />
              </div>
            </div>
          </div>
          {/* Live Preview Card */}
          <div className="md:w-1/3 flex flex-col justify-center select-none bg-surface-container-low p-4 rounded-lg border border-outline-variant">
            <div className="text-[10px] text-outline font-semibold uppercase tracking-wider mb-2 text-center">
              Live Preview
            </div>
            <div className="space-y-3">
              {block.badge && (
                <span className="inline-block bg-tertiary-container/20 text-tertiary-container text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {block.badge}
                </span>
              )}
              <h4 className="font-bold text-on-surface text-sm">{block.product_name || 'Product Title'}</h4>
              <p className="text-xs text-on-surface-variant line-clamp-2">{block.description || 'No description added yet.'}</p>
              {block.price && <div className="text-xs font-mono font-bold text-primary">{block.price}</div>}
              <button className="w-full bg-primary text-on-primary py-1.5 rounded-lg text-xs font-bold hover:opacity-90">
                {block.cta_text || 'CTA Link'}
              </button>
            </div>
          </div>
        </div>
      )

    case 'table':
      return (
        <div className="my-6 border border-outline-variant rounded-lg overflow-hidden p-4 space-y-3 bg-surface-container-low">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-outline">Interactive Table Builder</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newHeaders = [...block.headers, `Col ${block.headers.length + 1}`]
                  const newRows = block.rows.map((row) => [...row, ''])
                  onUpdate({ headers: newHeaders, rows: newRows })
                }}
                className="text-[10px] px-2 py-0.5 rounded border bg-white border-outline-variant hover:bg-surface-container-high"
              >
                + Col
              </button>
              <button
                onClick={() => {
                  const newRows = [...block.rows, Array(block.headers.length).fill('')]
                  onUpdate({ rows: newRows })
                }}
                className="text-[10px] px-2 py-0.5 rounded border bg-white border-outline-variant hover:bg-surface-container-high"
              >
                + Row
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-outline-variant border border-outline-variant">
              <thead className="bg-surface-container-high">
                <tr>
                  {block.headers.map((header, colIdx) => (
                    <th key={colIdx} className="px-3 py-2 text-left">
                      <input
                        type="text"
                        value={header}
                        onChange={(e) => {
                          const newHeaders = [...block.headers]
                          newHeaders[colIdx] = e.target.value
                          onUpdate({ headers: newHeaders })
                        }}
                        className="bg-transparent border-none outline-none font-bold text-xs focus:ring-0 text-on-surface w-full"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant bg-surface">
                {block.rows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, colIdx) => (
                      <td key={colIdx} className="px-3 py-1.5">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => {
                            const newRows = [...block.rows]
                            newRows[rowIdx][colIdx] = e.target.value
                            onUpdate({ rows: newRows })
                          }}
                          className="bg-transparent border-none outline-none text-xs focus:ring-0 text-on-surface-variant w-full"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )

    case 'embed': {
      const extractYouTubeId = (url: string) => {
        const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
        return m ? m[1] : ''
      }
      const extractVideoId = (url: string) => {
        // support direct video files too
        if (url.match(/\.(mp4|webm|ogg)$/i)) return url
        return extractYouTubeId(url)
      }
      const isDirectVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url)

      return (
        <div className="my-6 border border-outline-variant rounded-lg overflow-hidden bg-surface-container-low p-4 space-y-3">
          <div className="flex items-center gap-2">
            <select
              value={block.provider}
              onChange={e => onUpdate({ provider: e.target.value as any, embed_id: '', url: '' })}
              className="bg-white border border-outline-variant text-xs px-2 py-1.5 rounded-lg text-on-surface outline-none"
            >
              <option value="youtube">YouTube</option>
              <option value="video">Video File</option>
              <option value="twitter">Twitter / X</option>
            </select>
            <input
              type="url"
              placeholder={
                block.provider === 'youtube' ? 'Paste YouTube URL…' :
                block.provider === 'video' ? 'Paste MP4/WebM URL…' :
                'Paste Tweet URL…'
              }
              value={block.url}
              onChange={e => {
                const url = e.target.value
                const id = extractYouTubeId(url)
                onUpdate({ url, embed_id: id || url })
              }}
              className="flex-1 text-xs bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <input
            type="text"
            placeholder="Caption (optional)"
            value={block.caption || ''}
            onChange={e => onUpdate({ caption: e.target.value })}
            className="w-full text-xs bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-on-surface focus:outline-none"
          />
          {block.url && (
            <div className="rounded-lg overflow-hidden bg-black aspect-video">
              {block.provider === 'youtube' && block.embed_id ? (
                <iframe
                  src={`https://www.youtube.com/embed/${block.embed_id}`}
                  className="w-full h-full border-none"
                  allowFullScreen
                  title="YouTube preview"
                />
              ) : block.provider === 'video' && isDirectVideo(block.url) ? (
                <video src={block.url} controls className="w-full h-full" />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-zinc-400">
                  Preview not available
                </div>
              )}
            </div>
          )}
        </div>
      )
    }

    case 'key-takeaways':
      return (
        <div className="my-6 border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-r-lg space-y-3">
          <p className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">Key Takeaways</p>
          <div className="space-y-2 pl-2">
            {block.items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="text-emerald-500 text-sm font-bold shrink-0">•</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...block.items]
                    newItems[idx] = e.target.value
                    onUpdate({ items: newItems })
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const newItems = [...block.items]
                      newItems.splice(idx + 1, 0, '')
                      onUpdate({ items: newItems })
                    }
                    if (e.key === 'Backspace' && item === '') {
                      e.preventDefault()
                      const newItems = block.items.filter((_, i) => i !== idx)
                      if (newItems.length === 0) onDelete()
                      else onUpdate({ items: newItems })
                    }
                  }}
                  className="bg-transparent border-none outline-none focus:ring-0 text-sm text-on-surface grow border-b border-transparent focus:border-emerald-400 pb-0.5"
                  placeholder="Takeaway item..."
                />
                <button
                  onClick={() => {
                    const newItems = block.items.filter((_, i) => i !== idx)
                    if (newItems.length === 0) onDelete()
                    else onUpdate({ items: newItems })
                  }}
                  className="text-xs text-outline hover:text-error px-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => onUpdate({ items: [...block.items, ''] })}
            className="text-[10px] text-emerald-600 hover:text-emerald-800 font-semibold"
          >
            + Add item
          </button>
        </div>
      )

    case 'pull-quote':
      return (
        <div className="my-8 px-6 py-6 space-y-3 border border-outline-variant rounded-lg bg-surface-container-low">
          <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Pull Quote</p>
          <textarea
            className="w-full bg-transparent border-none outline-none font-serif italic text-2xl resize-none focus:ring-0 text-on-surface text-center leading-snug"
            placeholder="Enter pull quote text..."
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            rows={3}
          />
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none text-xs font-semibold text-on-surface-variant focus:ring-0 border-b border-transparent focus:border-outline-variant pb-1 text-center"
            placeholder="— Attribution (Optional)"
            value={block.attribution || ''}
            onChange={(e) => onUpdate({ attribution: e.target.value })}
          />
        </div>
      )

    case 'steps':
      return (
        <div className="my-6 space-y-3">
          <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Steps</p>
          <div className="space-y-2 pl-2">
            {block.items.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...block.items]
                    newItems[idx] = e.target.value
                    onUpdate({ items: newItems })
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const newItems = [...block.items]
                      newItems.splice(idx + 1, 0, '')
                      onUpdate({ items: newItems })
                    }
                    if (e.key === 'Backspace' && item === '') {
                      e.preventDefault()
                      const newItems = block.items.filter((_, i) => i !== idx)
                      if (newItems.length === 0) onDelete()
                      else onUpdate({ items: newItems })
                    }
                  }}
                  className="bg-transparent border-none outline-none focus:ring-0 text-sm text-on-surface grow border-b border-transparent focus:border-primary pb-0.5"
                  placeholder={`Step ${idx + 1}...`}
                />
                <button
                  onClick={() => {
                    const newItems = block.items.filter((_, i) => i !== idx)
                    if (newItems.length === 0) onDelete()
                    else onUpdate({ items: newItems })
                  }}
                  className="text-xs text-outline hover:text-error px-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => onUpdate({ items: [...block.items, ''] })}
            className="text-[10px] text-primary hover:text-primary/80 font-semibold"
          >
            + Add step
          </button>
        </div>
      )

    case 'faq':
      return (
        <div className="my-6 space-y-4 border border-outline-variant rounded-lg p-4 bg-surface-container-low">
          <p className="text-[10px] uppercase font-bold text-outline tracking-wider">FAQ</p>
          {block.items.map((faqItem, idx) => (
            <div key={idx} className="space-y-2 pb-4 border-b border-outline-variant last:border-0 last:pb-0">
              <div className="flex gap-2 items-start">
                <span className="text-[10px] uppercase font-bold text-primary shrink-0 mt-1.5">Q</span>
                <input
                  type="text"
                  value={faqItem.question}
                  onChange={(e) => {
                    const newItems = [...block.items]
                    newItems[idx] = { ...newItems[idx], question: e.target.value }
                    onUpdate({ items: newItems })
                  }}
                  className="grow bg-transparent border-none outline-none focus:ring-0 text-sm font-semibold text-on-surface border-b border-transparent focus:border-primary pb-0.5"
                  placeholder="Question..."
                />
                <button
                  onClick={() => {
                    const newItems = block.items.filter((_, i) => i !== idx)
                    if (newItems.length === 0) onDelete()
                    else onUpdate({ items: newItems })
                  }}
                  className="text-xs text-outline hover:text-error px-1 mt-1"
                >
                  ×
                </button>
              </div>
              <div className="flex gap-2 items-start pl-4">
                <span className="text-[10px] uppercase font-bold text-outline shrink-0 mt-1.5">A</span>
                <textarea
                  value={faqItem.answer}
                  onChange={(e) => {
                    const newItems = [...block.items]
                    newItems[idx] = { ...newItems[idx], answer: e.target.value }
                    onUpdate({ items: newItems })
                  }}
                  className="grow bg-transparent border-none outline-none focus:ring-0 text-sm text-on-surface-variant resize-none border-b border-transparent focus:border-outline-variant pb-0.5"
                  placeholder="Answer..."
                  rows={2}
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => onUpdate({ items: [...block.items, { question: '', answer: '' }] })}
            className="text-[10px] text-primary hover:text-primary/80 font-semibold"
          >
            + Add FAQ pair
          </button>
        </div>
      )

    case 'cta':
      return (
        <div className="my-6 border-2 border-primary/30 rounded-xl p-5 space-y-4 bg-surface-container-low">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">CTA Block</p>
            <div className="flex gap-1.5">
              {(['primary', 'outline'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdate({ style: s })}
                  className={`text-[10px] px-2 py-0.5 rounded border font-semibold capitalize ${
                    block.style === s
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface border-outline-variant text-outline'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            value={block.heading}
            onChange={(e) => onUpdate({ heading: e.target.value })}
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-base font-bold text-on-surface border-b border-transparent focus:border-primary pb-0.5"
            placeholder="CTA Heading..."
          />
          <input
            type="text"
            value={block.subtext || ''}
            onChange={(e) => onUpdate({ subtext: e.target.value })}
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm text-on-surface-variant border-b border-transparent focus:border-outline-variant pb-0.5"
            placeholder="Subtext (optional)..."
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={block.buttonLabel}
              onChange={(e) => onUpdate({ buttonLabel: e.target.value })}
              className="bg-white border border-outline-variant rounded px-2 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Button Label"
            />
            <input
              type="url"
              value={block.buttonUrl}
              onChange={(e) => onUpdate({ buttonUrl: e.target.value })}
              className="bg-white border border-outline-variant rounded px-2 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Button URL"
            />
          </div>
        </div>
      )

    case 'stat':
      return (
        <div className="my-6 border border-outline-variant rounded-xl p-5 space-y-3 bg-surface-container-low text-center">
          <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Stat Highlight</p>
          <input
            type="text"
            value={block.value}
            onChange={(e) => onUpdate({ value: e.target.value })}
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-4xl font-extrabold text-primary text-center border-b border-transparent focus:border-primary pb-0.5"
            placeholder="e.g. 98%"
          />
          <input
            type="text"
            value={block.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-semibold text-on-surface text-center border-b border-transparent focus:border-outline-variant pb-0.5"
            placeholder="Label, e.g. Customer Satisfaction"
          />
          <input
            type="text"
            value={block.context || ''}
            onChange={(e) => onUpdate({ context: e.target.value })}
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-xs text-on-surface-variant text-center border-b border-transparent focus:border-outline-variant pb-0.5"
            placeholder="Context (optional), e.g. Based on 2024 survey"
          />
        </div>
      )

    case 'newsletter':
      return (
        <div className="my-6 border border-outline-variant rounded-xl p-5 space-y-3 bg-surface-container-low">
          <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Newsletter Signup</p>
          <input
            type="text"
            value={block.heading}
            onChange={(e) => onUpdate({ heading: e.target.value })}
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-base font-bold text-on-surface border-b border-transparent focus:border-primary pb-0.5"
            placeholder="Newsletter heading..."
          />
          <input
            type="text"
            value={block.subtext || ''}
            onChange={(e) => onUpdate({ subtext: e.target.value })}
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm text-on-surface-variant border-b border-transparent focus:border-outline-variant pb-0.5"
            placeholder="Subtext (optional)..."
          />
        </div>
      )

    default:
      return <div className="text-xs text-error my-2">Unsupported block type: {(block as any).type}</div>
  }
}
