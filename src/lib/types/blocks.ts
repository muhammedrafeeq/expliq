// E:\Projects\Works\Expliq\src\lib\types\blocks.ts

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'quote'
  | 'code'
  | 'callout'
  | 'divider'
  | 'list'
  | 'affiliate'
  | 'embed'
  | 'table'
  | 'key-takeaways'
  | 'pull-quote'
  | 'steps'
  | 'faq'
  | 'cta'
  | 'stat'
  | 'newsletter'

export interface BaseBlock {
  id: string
  type: BlockType
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading'
  level: 2 | 3 | 4
  content: string
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph'
  content: string // HTML string sanitized via DOMPurify
}

export interface ImageBlock extends BaseBlock {
  type: 'image'
  url: string
  alt: string
  caption?: string
  width?: number
  height?: number
  alignment: 'center' | 'full'
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote'
  content: string
  attribution?: string
}

export interface CodeBlock extends BaseBlock {
  type: 'code'
  language: 'javascript' | 'typescript' | 'python' | 'bash' | 'sql' | 'json' | 'html' | 'css' | 'plaintext'
  content: string
  filename?: string
}

export interface CalloutBlock extends BaseBlock {
  type: 'callout'
  style: 'info' | 'warning' | 'tip' | 'important'
  title?: string
  content: string
}

export interface DividerBlock extends BaseBlock {
  type: 'divider'
  style: 'line' | 'dots'
}

export interface ListBlock extends BaseBlock {
  type: 'list'
  style: 'bullet' | 'numbered' | 'checklist'
  items: string[]
}

export interface AffiliateBlock extends BaseBlock {
  type: 'affiliate'
  product_name: string
  description: string
  price?: string
  rating?: number // 1 - 5 stars
  cta_text: string
  affiliate_url: string
  badge?: string
  image_url?: string
}

export interface EmbedBlock extends BaseBlock {
  type: 'embed'
  provider: 'youtube' | 'video' | 'twitter' | 'instagram'
  url: string
  embed_id: string
  caption?: string
}

export interface TableBlock extends BaseBlock {
  type: 'table'
  headers: string[]
  rows: string[][]
  caption?: string
}

export interface KeyTakeawaysBlock extends BaseBlock {
  type: 'key-takeaways'
  items: string[]
}

export interface PullQuoteBlock extends BaseBlock {
  type: 'pull-quote'
  content: string
  attribution?: string
}

export interface StepsBlock extends BaseBlock {
  type: 'steps'
  items: string[]
}

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqBlock extends BaseBlock {
  type: 'faq'
  items: FaqItem[]
}

export interface CtaBlock extends BaseBlock {
  type: 'cta'
  heading: string
  subtext?: string
  buttonLabel: string
  buttonUrl: string
  style: 'primary' | 'outline'
}

export interface StatBlock extends BaseBlock {
  type: 'stat'
  value: string
  label: string
  context?: string
}

export interface NewsletterBlock extends BaseBlock {
  type: 'newsletter'
  heading: string
  subtext?: string
}

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | QuoteBlock
  | CodeBlock
  | CalloutBlock
  | DividerBlock
  | ListBlock
  | AffiliateBlock
  | EmbedBlock
  | TableBlock
  | KeyTakeawaysBlock
  | PullQuoteBlock
  | StepsBlock
  | FaqBlock
  | CtaBlock
  | StatBlock
  | NewsletterBlock

export interface ArticleDocument {
  version: number
  blocks: Block[]
}
