"use client"

import { useState, useCallback, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Block, BlockType, ArticleDocument } from '@/lib/types/blocks'
import { EditorBlock } from './EditorBlock'
import { BlockMenu } from './BlockMenu'
import { FloatingToolbar } from './FloatingToolbar'
import { useAutoSave } from '@/lib/hooks/useAutoSave'
import {
  ArrowLeft,
  Check,
  Cloud,
  RefreshCw,
  Send,
  Type,
  Heading,
  Quote,
  List,
  Minus,
  Image,
  Play,
  Code,
  AlertCircle,
  Table,
  Link,
  ListChecks,
  TextQuote,
  ListOrdered,
  HelpCircle,
  MousePointerClick,
  BarChart2,
  Mail,
} from 'lucide-react'
import NextLink from 'next/link'
import { submitForReviewAction } from '@/lib/actions/articles'
import { BookOpen, Clock, Calendar } from 'lucide-react'
import { DragHandle } from './DragHandle'
import { ArticleRenderer } from '@/components/renderer/ArticleRenderer'

interface EditorProps {
  articleId: string
  initialDocument: ArticleDocument
  initialTitle: string
  categorySlug: string
  authorRole: string
}

// ─── Sidebar block type definitions ──────────────────────────────────────────

const SIDEBAR_GROUPS = [
  {
    label: 'Text',
    items: [
      { type: 'paragraph' as BlockType, label: 'Paragraph', icon: Type },
      { type: 'heading' as BlockType, label: 'Heading', icon: Heading },
      { type: 'quote' as BlockType, label: 'Quote', icon: Quote },
      { type: 'list' as BlockType, label: 'List', icon: List },
      { type: 'divider' as BlockType, label: 'Divider', icon: Minus },
    ],
  },
  {
    label: 'Media',
    items: [
      { type: 'image' as BlockType, label: 'Image', icon: Image },
      { type: 'embed' as BlockType, label: 'YouTube / Video', icon: Play },
    ],
  },
  {
    label: 'Advanced',
    items: [
      { type: 'code' as BlockType, label: 'Code Block', icon: Code },
      { type: 'callout' as BlockType, label: 'Callout Box', icon: AlertCircle },
      { type: 'table' as BlockType, label: 'Table', icon: Table },
      { type: 'affiliate' as BlockType, label: 'Affiliate Card', icon: Link },
    ],
  },
  {
    label: 'Content',
    items: [
      { type: 'key-takeaways' as BlockType, label: 'Key Takeaways', icon: ListChecks },
      { type: 'pull-quote' as BlockType, label: 'Pull Quote', icon: TextQuote },
      { type: 'steps' as BlockType, label: 'Steps', icon: ListOrdered },
      { type: 'faq' as BlockType, label: 'FAQ', icon: HelpCircle },
      { type: 'cta' as BlockType, label: 'CTA Button', icon: MousePointerClick },
      { type: 'stat' as BlockType, label: 'Stat Highlight', icon: BarChart2 },
      { type: 'newsletter' as BlockType, label: 'Newsletter', icon: Mail },
    ],
  },
]

// ─── Draggable sidebar tool card ─────────────────────────────────────────────

function SidebarToolCard({
  blockType,
  label,
  icon: Icon,
}: {
  blockType: BlockType
  label: string
  icon: React.ElementType
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${blockType}`,
    data: { fromSidebar: true, blockType },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg border border-outline-variant bg-surface hover:bg-primary/5 hover:border-primary/30 cursor-grab active:cursor-grabbing transition-all select-none text-center ${
        isDragging ? 'opacity-40 shadow-lg ring-2 ring-primary/40' : ''
      }`}
      title={`Drag to add ${label}`}
    >
      <Icon size={16} className="text-primary shrink-0" />
      <span className="text-[10px] font-medium text-on-surface leading-tight">{label}</span>
    </div>
  )
}

// ─── Left sidebar ─────────────────────────────────────────────────────────────

function EditorSidebar() {
  return (
    <aside className="w-65 shrink-0 h-[calc(100vh-56px)] sticky top-14 flex flex-col border-r border-outline-variant bg-surface-container-low overflow-y-auto">
      <div className="px-4 pt-5 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">
          Blocks
        </p>
        <p className="text-[10px] text-outline">Drag onto canvas to insert</p>
      </div>

      <div className="flex-1 px-3 py-2 space-y-4 overflow-y-auto">
        {SIDEBAR_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-outline px-1 mb-1.5">
              {group.label}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {group.items.map((item) => (
                <SidebarToolCard
                  key={item.type}
                  blockType={item.type}
                  label={item.label}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-outline-variant">
        <p className="text-[10px] text-outline text-center">
          ↑ drag a block to the canvas
        </p>
      </div>
    </aside>
  )
}

// ─── Drop zone for empty canvas ───────────────────────────────────────────────

function EmptyCanvasDropZone() {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-empty' })
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col items-center justify-center min-h-50 rounded-xl border-2 border-dashed transition-colors ${
        isOver
          ? 'border-primary bg-primary/5'
          : 'border-outline-variant bg-surface-container-lowest'
      }`}
    >
      <p className="text-sm text-outline">
        {isOver ? 'Release to add block' : 'Drag a block here to start'}
      </p>
    </div>
  )
}

// ─── Drop indicator between blocks ────────────────────────────────────────────

function DropIndicator({ isActive }: { isActive: boolean }) {
  if (!isActive) return null
  return (
    <div className="h-0.5 rounded-full bg-primary mx-2 my-0.5 transition-all" />
  )
}

// ─── Sortable block row ───────────────────────────────────────────────────────

function SortableBlockRow({
  block,
  autoFocus,
  onUpdate,
  onAddAfter,
  onDelete,
  isDropTarget,
}: {
  block: Block
  autoFocus: boolean
  onUpdate: (updates: Partial<Block>) => void
  onAddAfter: (type: BlockType) => void
  onDelete: () => void
  isDropTarget: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id })

  return (
    <>
      <DropIndicator isActive={isDropTarget} />
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className={`group relative pr-10 pl-10 ${isDragging ? 'opacity-40 z-50' : ''}`}
      >
        <DragHandle
          listeners={listeners}
          attributes={attributes}
          onDelete={onDelete}
        />

        <EditorBlock
          block={block}
          autoFocus={autoFocus}
          onUpdate={onUpdate}
          onAddAfter={onAddAfter}
          onDelete={onDelete}
        />

        <BlockMenu onSelect={(type) => onAddAfter(type)} />
      </div>
    </>
  )
}

// ─── Helper: create a blank block for a given type ───────────────────────────

function createBlock(type: BlockType): Block {
  const id = crypto.randomUUID()
  switch (type) {
    case 'list':
      return { id, type: 'list', style: 'bullet', items: [''] }
    case 'heading':
      return { id, type: 'heading', level: 2, content: '' }
    case 'divider':
      return { id, type: 'divider', style: 'line' }
    case 'callout':
      return { id, type: 'callout', style: 'info', title: '', content: '' }
    case 'code':
      return { id, type: 'code', language: 'javascript', content: '' }
    case 'image':
      return { id, type: 'image', url: '', alt: '', caption: '', alignment: 'center' }
    case 'affiliate':
      return {
        id,
        type: 'affiliate',
        product_name: '',
        description: '',
        cta_text: 'Buy Now',
        affiliate_url: '',
      }
    case 'table':
      return { id, type: 'table', headers: ['Header 1', 'Header 2'], rows: [['Cell 1', 'Cell 2']] }
    case 'embed':
      return { id, type: 'embed', provider: 'youtube', url: '', embed_id: '' }
    case 'quote':
      return { id, type: 'quote', content: '', attribution: '' }
    case 'key-takeaways':
      return { id, type: 'key-takeaways', items: [''] }
    case 'pull-quote':
      return { id, type: 'pull-quote', content: '', attribution: '' }
    case 'steps':
      return { id, type: 'steps', items: [''] }
    case 'faq':
      return { id, type: 'faq', items: [{ question: '', answer: '' }] }
    case 'cta':
      return { id, type: 'cta', heading: '', subtext: '', buttonLabel: 'Learn More', buttonUrl: '', style: 'primary' }
    case 'stat':
      return { id, type: 'stat', value: '', label: '', context: '' }
    case 'newsletter':
      return { id, type: 'newsletter', heading: '', subtext: '' }
    default:
      return { id, type: 'paragraph', content: '' }
  }
}

// ─── Live preview panel ───────────────────────────────────────────────────────

function PreviewPanel({
  title,
  blocks,
  categorySlug,
  coverImage,
}: {
  title: string
  blocks: Block[]
  categorySlug: string
  coverImage?: string
}) {
  const wordCount = blocks
    .filter((b: any) => b.content || b.items)
    .map((b: any) => (b.content || (b.items || []).join(' ')).replace(/<[^>]+>/g, ''))
    .join(' ')
    .split(/\s+/).filter(Boolean).length
  const readMins = Math.max(1, Math.ceil(wordCount / 200))
  const categoryName = categorySlug
    .split('-')
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <aside className="w-96 shrink-0 flex flex-col border-l border-outline-variant bg-background overflow-hidden">
      {/* Panel header */}
      <div className="shrink-0 px-4 py-2.5 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Reader Preview</p>
        <span className="text-[10px] text-outline">{blocks.length} blocks · ~{readMins} min</span>
      </div>

      {/* Article page preview — scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Simulated browser chrome */}
        <div className="bg-surface-container-low border-b border-outline-variant px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400/60" />
            <span className="w-2 h-2 rounded-full bg-yellow-400/60" />
            <span className="w-2 h-2 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1 bg-surface rounded text-[10px] text-on-surface-variant/50 px-2 py-0.5 truncate">
            expliq.in/{categorySlug}/{title?.toLowerCase().replace(/\s+/g, '-').slice(0, 30) || 'article-slug'}
          </div>
        </div>

        <div className="px-5 pt-6 pb-16 space-y-0">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-on-surface-variant mb-4">
            <span>Home</span>
            <span className="text-on-surface-variant/30">›</span>
            <span className="text-primary">{categoryName}</span>
          </nav>

          {/* Cover image */}
          <div className="w-full aspect-3/1 rounded-lg overflow-hidden bg-surface-dim mb-0 relative">
            <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/40 to-transparent z-10" />
            {coverImage ? (
              <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover z-0" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant/20 text-[10px] uppercase tracking-widest z-0">
                Cover Image
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20 space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/20 text-white bg-white/10">
                {categoryName}
              </span>
              {title && (
                <h1 className="font-serif font-extrabold text-base text-white leading-snug">
                  {title}
                </h1>
              )}
            </div>
          </div>

          {/* Author / meta row */}
          <div className="flex items-center gap-3 mt-4 pb-4 border-b border-outline-variant">
            <div className="w-7 h-7 rounded-full bg-linear-to-tr from-primary to-secondary text-on-primary flex items-center justify-center font-extrabold text-[10px] shrink-0">
              PB
            </div>
            <div className="grow">
              <div className="text-xs font-bold text-on-surface">Publisher</div>
              <div className="text-[10px] text-on-surface-variant flex items-center gap-1">
                <Calendar size={9} /> Today
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
              <Clock size={10} /> {readMins} min read
            </div>
          </div>

          {/* Article content */}
          {blocks.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen size={24} className="mx-auto text-outline-variant mb-2" />
              <p className="text-xs text-outline">Add blocks to see preview</p>
            </div>
          ) : (
            <div className="mt-5 text-sm">
              <ArticleRenderer document={{ version: 1, blocks }} />
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

// ─── Main Editor component ────────────────────────────────────────────────────

export function Editor({
  articleId,
  initialDocument,
  initialTitle,
  categorySlug,
  authorRole,
}: EditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialDocument.blocks)
  const [title, setTitle] = useState(initialTitle)
  const [coverImage, setCoverImage] = useState('')
  const [coverInputVisible, setCoverInputVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const focusRef = useRef<string | null>(null)

  const { saveStatus } = useAutoSave(articleId, blocks, title)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? ({ ...b, ...updates } as Block) : b)))
  }, [])

  const addBlock = useCallback((afterId: string, type: BlockType = 'paragraph') => {
    const newBlock = createBlock(type)
    focusRef.current = newBlock.id
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === afterId)
      if (idx === -1) return [...prev, newBlock]
      return [...prev.slice(0, idx + 1), newBlock, ...prev.slice(idx + 1)]
    })
  }, [])

  const addBlockAt = useCallback((beforeId: string | null, type: BlockType) => {
    const newBlock = createBlock(type)
    focusRef.current = newBlock.id
    setBlocks((prev) => {
      if (beforeId === null) return [...prev, newBlock]
      const idx = prev.findIndex((b) => b.id === beforeId)
      if (idx === -1) return [...prev, newBlock]
      return [...prev.slice(0, idx), newBlock, ...prev.slice(idx)]
    })
  }, [])

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      if (prev.length <= 1) return prev
      const idx = prev.findIndex((b) => b.id === id)
      focusRef.current = prev[Math.max(0, idx - 1)].id
      return prev.filter((b) => b.id !== id)
    })
  }, [])

  const handleFormat = (command: string, value = '') => {
    document.execCommand(command, false, value)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await submitForReviewAction(articleId)
      setSubmitSuccess(true)
    } catch {
      alert('Failed to submit draft for review.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string | null ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setOverId(null)

    if (!over) return

    const fromSidebar = active.data.current?.fromSidebar as boolean | undefined

    if (fromSidebar) {
      // Insert a new block from the sidebar
      const blockType = active.data.current?.blockType as BlockType
      const overId = over.id as string

      if (overId === 'canvas-empty') {
        // Drop onto empty canvas
        const newBlock = createBlock(blockType)
        focusRef.current = newBlock.id
        setBlocks((prev) => [...prev, newBlock])
      } else {
        // Insert before the block that's currently hovered
        addBlockAt(overId, blockType)
      }
    } else {
      // Reorder existing blocks
      if (active.id !== over.id) {
        setBlocks((prev) => {
          const oldIdx = prev.findIndex((b) => b.id === active.id)
          const newIdx = prev.findIndex((b) => b.id === over.id)
          return arrayMove(prev, oldIdx, newIdx)
        })
      }
    }
  }

  // Determine what to show in the DragOverlay
  const activeIsFromSidebar = activeId?.startsWith('sidebar-')
  const activeSidebarType = activeIsFromSidebar
    ? (activeId!.replace('sidebar-', '') as BlockType)
    : null
  const activeCanvasBlock = !activeIsFromSidebar
    ? blocks.find((b) => b.id === activeId)
    : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen bg-background text-on-background flex flex-col overflow-hidden">
        {/* ── Top Navbar ─────────────────────────────────────────────────── */}
        <header className="shrink-0 w-full h-14 border-b border-outline-variant bg-surface/90 backdrop-blur-md flex items-center px-6 justify-between select-none z-40">
          <div className="flex items-center gap-3">
            <NextLink
              href="/publisher"
              className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
            >
              <ArrowLeft size={17} />
            </NextLink>
            <span className="font-bold text-sm tracking-tight hidden sm:inline text-on-surface">
              Editor
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw size={12} className="animate-spin text-primary" />
                  <span>Saving…</span>
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Cloud size={12} className="text-primary" />
                  <span>Saved</span>
                </>
              ) : saveStatus === 'error' ? (
                <span className="text-error font-semibold">Save failed</span>
              ) : (
                <span>Unsaved</span>
              )}
            </div>

            {submitSuccess ? (
              <span className="flex items-center gap-1 text-xs text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-lg">
                <Check size={14} /> Submitted
              </span>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send size={13} />
                {isSubmitting ? 'Submitting…' : 'Submit for Review'}
              </button>
            )}
          </div>
        </header>

        {/* ── Body: sidebar + canvas ──────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <EditorSidebar />

          {/* ── Main canvas ──────────────────────────────────────────────── */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-180 mx-auto px-4 mt-12 pb-24 relative">
              <FloatingToolbar onFormat={handleFormat} />

              {/* Cover image */}
              {coverImage ? (
                <div className="relative w-full aspect-3/1 rounded-lg overflow-hidden mb-6 group">
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => setCoverInputVisible(true)}
                      className="text-xs bg-white/90 text-zinc-900 font-semibold px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
                    >
                      Change
                    </button>
                    <button
                      onClick={() => setCoverImage('')}
                      className="text-xs bg-error text-on-error font-semibold px-3 py-1.5 rounded-lg hover:bg-error/90 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setCoverInputVisible(true)}
                  className="w-full mb-6 border-2 border-dashed border-outline-variant hover:border-primary rounded-lg py-6 flex flex-col items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group"
                >
                  <Image size={22} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xs font-semibold">Add Cover Image</span>
                  <span className="text-[10px] text-outline">Click to paste an image URL</span>
                </button>
              )}

              {/* Cover image URL input dialog */}
              {coverInputVisible && (
                <div className="mb-6 flex gap-2 items-center">
                  <input
                    type="url"
                    autoFocus
                    placeholder="Paste image URL…"
                    defaultValue={coverImage}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setCoverImage((e.target as HTMLInputElement).value)
                        setCoverInputVisible(false)
                      }
                      if (e.key === 'Escape') setCoverInputVisible(false)
                    }}
                    className="flex-1 text-sm bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={(e) => {
                      const input = (e.currentTarget.previousSibling as HTMLInputElement)
                      setCoverImage(input.value)
                      setCoverInputVisible(false)
                    }}
                    className="text-xs bg-primary text-on-primary font-semibold px-3 py-2 rounded-lg"
                  >
                    Set
                  </button>
                  <button
                    onClick={() => setCoverInputVisible(false)}
                    className="text-xs text-on-surface-variant hover:text-on-surface px-2 py-2"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Article title */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article Title…"
                className="w-full text-3xl md:text-4xl font-serif font-bold outline-none border-b border-transparent focus:border-outline-variant pb-3 mb-10 placeholder:text-outline-variant text-on-surface"
              />

              {/* Block list */}
              {blocks.length === 0 ? (
                <EmptyCanvasDropZone />
              ) : (
                <SortableContext
                  items={blocks.map((b) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-1">
                    {blocks.map((block) => (
                      <SortableBlockRow
                        key={block.id}
                        block={block}
                        autoFocus={focusRef.current === block.id}
                        onUpdate={(updates) => updateBlock(block.id, updates)}
                        onAddAfter={(type) => addBlock(block.id, type)}
                        onDelete={() => deleteBlock(block.id)}
                        isDropTarget={
                          overId === block.id &&
                          activeIsFromSidebar === true
                        }
                      />
                    ))}
                  </div>
                </SortableContext>
              )}
            </div>
          </main>

          <PreviewPanel title={title} blocks={blocks} categorySlug={categorySlug} coverImage={coverImage} />
        </div>

        {/* ── Drag overlay ghost ──────────────────────────────────────────── */}
        <DragOverlay>
          {activeSidebarType ? (
            // Ghost for sidebar drag
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-primary bg-surface shadow-2xl opacity-90 w-44">
              <span className="text-xs font-medium text-on-surface capitalize">
                {activeSidebarType}
              </span>
            </div>
          ) : activeCanvasBlock ? (
            // Ghost for canvas reorder drag
            <div className="bg-surface border border-primary/30 rounded-lg px-4 py-3 shadow-2xl opacity-90 text-sm text-on-surface-variant">
              {activeCanvasBlock.type === 'heading'
                ? (activeCanvasBlock as any).content || 'Heading'
                : activeCanvasBlock.type === 'paragraph'
                ? (activeCanvasBlock as any).content?.replace(/<[^>]+>/g, '').slice(0, 60) + '…' ||
                  'Paragraph'
                : activeCanvasBlock.type}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}
