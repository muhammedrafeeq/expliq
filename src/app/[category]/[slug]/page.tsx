// E:\Projects\Works\Expliq\src\app\[category]\[slug]\page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArticleRenderer } from '@/components/renderer/ArticleRenderer'
import { ScrollProgress } from './ScrollProgress'
import { ShareButtons } from './ShareButtons'
import { TableOfContents } from './TableOfContents'
import { AuthorCard } from './AuthorCard'
import { NewsletterForm } from '@/components/layout/NewsletterForm'
import { Reactions } from './Reactions'
import { LiveReaders } from './LiveReaders'
import { Clock, Calendar, ChevronRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://expliq.in'

interface PageProps {
  params: Promise<{ category: string; slug: string }>
}

// Mock details for first load parity
const MOCK_ARTICLE_DETAILS: Record<string, any> = {
  'architecture-of-silence-minimalism': {
    title: 'The Architecture of Silence: Why Minimalism Scaling Matters',
    excerpt: 'In an era of cognitive overload, we explore how systematic design can restore focus and intentionality to digital consumption environments.',
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmGmR74CZaf8E_qRn-CY9DIqH3g41R0Cfi3o4SuWcmlpLQPVcSsYVOna8T6fnNPIDHopagdzBqpQtZR1J_QIjmgUonfSdo1OcW0DluBxainKuaCaigeBwrczVYRWjCgnvVm424UlAZLX76zPuDgadMfBlQT6fkJvCIedvvABkcQv6b5rJakJ8JOc9UJHCLq295qGuVtKTAMb70qSADL_rJMLxcP0jhMhEy9Ly3EdF9WNfD7r1sIZtshELlCZEuDc00czp11F-gTMlr',
    category: { name: 'AI Tools', slug: 'ai-tools' },
    author: { name: 'Elias Thorne', bio: 'Elias Thorne is a Design Systems architect who writes on digital focus and cognitive ergonomics.', avatar_letter: 'ET' },
    read_time_mins: 12,
    published_at: 'Jan 24, 2026',
    content: {
      version: 1,
      blocks: [
        { id: 'h1', type: 'heading', level: 2, content: 'The Aesthetic of Silence' },
        { id: 'p1', type: 'paragraph', content: 'Digital environments are often designed to be scavenged, not inhabited. We scan for keywords, dart between notifications, and treat paragraphs as obstacles rather than journeys. However, the <strong>"Expliq"</strong> philosophy suggests that the interface itself can act as a catalyst for deeper cognitive engagement.' },
        {
          id: 'q1',
          type: 'quote',
          content: 'True concentration is not the absence of distraction, but the presence of a meaningful structure that makes distraction irrelevant.',
          attribution: 'Dr. Elena Sterling, Cognitive Linguist'
        },
        { id: 'h2', type: 'heading', level: 2, content: 'Minimizing Cognitive Saliency' },
        { id: 'p2', type: 'paragraph', content: 'Every non-essential element on a screen competes for your attention. In this editorial system, we prioritize <i>tonal layering</i> over drop shadows. Notice how the sidebar sits quietly on a light background, ensuring that your primary visual focus remains on this centered column.' },
        {
          id: 'c1',
          type: 'callout',
          style: 'tip',
          title: 'Design systems tip',
          content: 'Limit your layout to a maximum width of 680px for reading text. This limits the line character count to 65-75, which fits the biological constraints of human saccadic eye movement.'
        },
        {
          id: 'a1',
          type: 'affiliate',
          product_name: 'Fiverr Gigs Program',
          description: 'Register as a freelance seller on Fiverr and start offering digital services like web formatting, logo drawing, and tech audits.',
          price: 'Free entry',
          badge: 'Featured Skill Tool',
          cta_text: 'Start Earning',
          affiliate_url: 'https://fiverr.com'
        }
      ]
    }
  },
  'mastering-css-container-queries': {
    title: 'Mastering CSS Container Queries for Editorial Layouts',
    excerpt: 'Learn how to build truly responsive article components that adapt to their container width, not just the viewport.',
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3zFUMaaMq-yJoR44S2evcU1Gt30cpLEgYETJJy8lIDsgnWPSMQXNaTrzCJBKUrclU-RSSciKO-jtK4jyD4HxNOoPqbx7fFTBgKmCwoVZKhVZ0v45Oxn23pcaSNqY0TSSoZF2s8IrnJI-x_vrgKQM_sAbXxyNVIXBzeOHMe63My88eiUqk0QS3WCIBTNP-GYLZD3wUOzWtZiyBb3QypyltAynnL8bFTCztwR011nIRBhKIgpcVLuSL9KZloCJmtP57f3XbJVXUbz1u',
    category: { name: 'Career Upgrades', slug: 'career' },
    author: { name: 'Elena Vance', bio: 'Elena Vance is a frontend engineer specializing in responsive typography and modern web layouts.', avatar_letter: 'EV' },
    read_time_mins: 8,
    published_at: '2 days ago',
    content: {
      version: 1,
      blocks: [
        { id: 'h1', type: 'heading', level: 2, content: 'The Viewport is Too Wide' },
        { id: 'p1', type: 'paragraph', content: 'Traditional media queries are restricted to viewport dimensions. For modular editorial layouts, container queries let components adjust based on their parent container width, solving layout issues in sidebars.' },
        {
          id: 'q1',
          type: 'quote',
          content: 'Write styles that react to parent containers, not screen widths. This is the cornerstone of component-driven architecture.',
          attribution: 'Miriam Suzanne, CSS Working Group'
        },
        { id: 'h2', type: 'heading', level: 2, content: 'Declaring Container Context' },
        { id: 'p2', type: 'paragraph', content: 'Using `container-type: inline-size` allows child selectors to match dimensions relative to parent constraints via `@container` queries.' }
      ]
    }
  },
  'psychology-long-form-reading': {
    title: 'The Psychology of Long-Form Reading in Digital Spaces',
    excerpt: 'Why traditional serif typography remains the gold standard for sustained reading sessions and cognitive retention.',
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvUAdSBjv1EbIXGBD7iNwBXGTSasrcyufi47tf2hRT2YOlZ-vJKdcU4RvKkZdxN7QEpSAUkGkUTbtTCQysR1TCwgmJGijW4C3h_Uk9WAclOqiPYt3jtTyrkf573vEZgAlLL-4CjktrxRWFhIIY1iBpoTB5sxA-F5zNOru5XaAFYU-GpXs3vSp1mnL5_h3AgIDtXBQlmYyLQgRY5G_j5WEeFYFzGXian5FvkF2nQp1QN7s9q2hT16vXOlZN5nwo8o-VzDitJ75k8iKi',
    category: { name: 'Student Earning', slug: 'student' },
    author: { name: 'Julian Vane', bio: 'Julian Vane studies cognitive readability metrics and is an advocate for visual design systems.', avatar_letter: 'JV' },
    read_time_mins: 15,
    published_at: '5 days ago',
    content: {
      version: 1,
      blocks: [
        { id: 'h1', type: 'heading', level: 2, content: 'Reading Speed and Retention' },
        { id: 'p1', type: 'paragraph', content: 'Serifs help form visual pathways that guide the human eye along horizontal reading lanes. This visual flow reduces cognitive fatigue.' },
        {
          id: 'q1',
          type: 'quote',
          content: 'Good design is silent. It guides the reader through complex hierarchies without calling attention to itself.',
          attribution: 'Massimo Vignelli'
        }
      ]
    }
  },
  'ssr-vs-static-generation': {
    title: 'Server-Side Rendering vs Static Generation in 2026',
    excerpt: 'Evaluating the trade-offs between dynamic performance and edge caching for content-heavy platforms.',
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA7CDhdeQaxcJ2qsugwKoq0djs55d-6U_C1RKLCneE6_WjC_rmCJkjgGp1Ck1pXrnXMkxNGCl7epvFVMgemybMtzgJyZkZlwAJaQ7D6KWbCYUzpi1zw3rKIUzT0jqc17L8uiTZgVMA33daq5TiVgyKG6H1uXwqbgUuVORFzGiuco-rVgJdTcjN4ZHW4vu6Q5F19_cIfTwY2GxC_swJi7ty5JJRXvWxW5FoQSVRvYhFHJy1-CR2AA7Ami6lQmT0vTpYF1penqLmyrVY',
    category: { name: 'Devices & Gadgets', slug: 'devices' },
    author: { name: 'Elias Thorne', bio: 'Elias Thorne is a Design Systems architect who writes on digital focus and cognitive ergonomics.', avatar_letter: 'ET' },
    read_time_mins: 10,
    published_at: '1 week ago',
    content: {
      version: 1,
      blocks: [
        { id: 'h1', type: 'heading', level: 2, content: 'SSG vs SSR' },
        { id: 'p1', type: 'paragraph', content: 'SSG builds static HTML at compilation time, while SSR generates pages dynamically on each incoming request. Combined with PPR (Partial Prerendering), Next.js delivers the best of both worlds.' }
      ]
    }
  }
}

function normalizeContent(content: any): { version: number; blocks: any[] } {
  if (!content) return { version: 1, blocks: [] }
  // When the whole article object was stored instead of just the content field
  const doc = content.blocks ? content : (content.content ?? content)
  const raw = doc.blocks || []
  const blocks: any[] = []

  raw.forEach((block: any, idx: number) => {
    const id = block.id || `block-${idx}`
    // Old format — fields are directly on the block (no data wrapper)
    if (!block.data) {
      blocks.push({ id, ...block })
      return
    }
    const d = block.data
    const listStyleMap: Record<string, string> = { unordered: 'bullet', ordered: 'numbered', checklist: 'checklist' }

    switch (block.type) {
      case 'heading':
        blocks.push({ id, type: 'heading', level: d.level ?? 2, content: d.text || '' })
        break
      case 'paragraph':
        blocks.push({ id, type: 'paragraph', content: d.text || '' })
        break
      case 'code':
        blocks.push({ id, type: 'code', language: d.language || 'text', filename: d.filename, content: d.code || '' })
        break
      case 'callout':
        blocks.push({ id, type: 'callout', style: d.type || d.style || 'info', title: d.title, content: d.text || d.content || '' })
        break
      case 'table':
        blocks.push({ id, type: 'table', headers: d.headers || [], rows: d.rows || [], caption: d.caption })
        break
      case 'list':
        blocks.push({ id, type: 'list', style: listStyleMap[d.style] || d.style || 'bullet', items: d.items || [] })
        break
      case 'quote':
        blocks.push({ id, type: 'quote', content: d.text || d.content || '', attribution: d.attribution || d.author })
        break
      case 'pull-quote':
        blocks.push({ id, type: 'pull-quote', content: d.text || d.content || '', attribution: d.attribution })
        break
      case 'steps': {
        const stepItems = d.steps || d.items || []
        blocks.push({
          id, type: 'steps',
          items: stepItems.map((s: any) =>
            typeof s === 'string' ? s : `<strong>${s.title || ''}</strong>${s.description ? ': ' + s.description : ''}`
          )
        })
        break
      }
      case 'stat': {
        const stats = d.stats || []
        if (stats.length > 0) {
          stats.forEach((s: any, i: number) => {
            blocks.push({ id: `${id}-${i}`, type: 'stat', value: s.value || '', label: s.label || '', context: s.context })
          })
        } else {
          blocks.push({ id, type: 'stat', value: d.value || '', label: d.label || '', context: d.context })
        }
        break
      }
      case 'key-takeaways':
        blocks.push({ id, type: 'key-takeaways', items: d.items || [] })
        break
      case 'faq':
        blocks.push({ id, type: 'faq', items: d.items || [] })
        break
      case 'cta':
        blocks.push({ id, type: 'cta', heading: d.heading || d.title || '', subtext: d.subtext || d.description, buttonLabel: d.buttonLabel || d.cta || 'Learn More', buttonUrl: d.buttonUrl || d.url || '#', style: d.style || 'primary' })
        break
      case 'image':
        blocks.push({ id, type: 'image', url: d.url || d.src || '', alt: d.alt || '', caption: d.caption, alignment: d.alignment })
        break
      case 'affiliate':
        blocks.push({ id, type: 'affiliate', product_name: d.product_name || d.name || '', description: d.description || '', price: d.price, badge: d.badge, cta_text: d.cta_text || d.cta || 'Learn More', affiliate_url: d.affiliate_url || d.url || '#' })
        break
      case 'divider':
        blocks.push({ id, type: 'divider', style: d.style })
        break
      case 'newsletter':
        blocks.push({ id, type: 'newsletter', heading: d.heading || '', subtext: d.subtext })
        break
      case 'embed':
        blocks.push({ id, type: 'embed', provider: d.provider || 'youtube', embed_id: d.embed_id || d.id || '', caption: d.caption })
        break
      default:
        blocks.push({ id, ...block, ...d })
    }
  })

  return { version: content.version || 1, blocks }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params
  const supabase = await createClient()

  let article: any = MOCK_ARTICLE_DETAILS[slug]
  try {
    const { data } = await supabase
      .from('articles')
      .select('title, excerpt, cover_image_url, published_at, updated_at, category:category_id(name, slug), author:author_id(name)')
      .eq('slug', slug)
      .single()
    if (data) article = data
  } catch { }

  if (!article) return { title: 'Article Not Found' }

  const title = article.title
  const description = article.excerpt || ''
  const image = article.cover_image_url || `${BASE_URL}/og-default.png`
  const url = `${BASE_URL}/${category}/${slug}`
  const authorName = article.author?.name || 'Expliq'
  const publishedTime = article.published_at ? new Date(article.published_at).toISOString() : undefined
  const modifiedTime = article.updated_at ? new Date(article.updated_at).toISOString() : publishedTime

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: 'Expliq',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      publishedTime,
      modifiedTime,
      authors: [authorName],
      section: article.category?.name || category,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params
  const { category, slug } = resolvedParams

  const supabase = await createClient()
  let article: any = null

  try {
    const { data } = await supabase
      .from('articles')
      .select('*, category:category_id(id, name, slug), author:author_id(name, avatar_url)')
      .eq('slug', slug)
      .single()

    if (data) {
      article = {
        id: data.id,
        title: data.title,
        excerpt: data.excerpt,
        cover_image_url: data.cover_image_url || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d',
        category_id: (data.category as any)?.id || data.category_id,
        category: {
          name: (data.category as any)?.name || 'General',
          slug: (data.category as any)?.slug || 'general'
        },
        author: {
          name: (data.author as any)?.name || 'Writer',
          bio: 'Platform contributor.',
          avatar_letter: ((data.author as any)?.name || 'W').slice(0, 2).toUpperCase()
        },
        read_time_mins: data.read_time_mins || 5,
        published_at: data.published_at
          ? new Date(data.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          : 'Draft',
        content: normalizeContent(data.content)
      }
    }
  } catch {
    // fall through to mock/notFound below
  }

  // Fallback to mock data if it matches our mock slug
  if (!article && MOCK_ARTICLE_DETAILS[slug]) {
    article = MOCK_ARTICLE_DETAILS[slug]
  }

  if (!article) {
    return notFound()
  }

  // Generate Table of Contents items (all level 2 headings)
  const tocItems = (article.content?.blocks || [])
    .filter((b: any) => b.type === 'heading' && b.level === 2)
    .map((b: any) => {
      const label = b.content.replace(/<[^>]*>/g, '')
      const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      return { id, label }
    })

  // Fetch related articles from Supabase or Fallback
  let relatedArticles: any[] = []
  try {
    const { data: relatedData } = await supabase
      .from('articles')
      .select('title, slug, excerpt, cover_image_url, read_time_mins, published_at, category:category_id(name, slug)')
      .eq('category_id', article?.category_id || '')
      .neq('slug', slug)
      .limit(3)

    if (relatedData && relatedData.length > 0) {
      relatedArticles = relatedData.map((d: any) => ({
        title: d.title,
        slug: d.slug,
        excerpt: d.excerpt,
        cover_image_url: d.cover_image_url || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d',
        category: {
          name: d.category?.name || 'General',
          slug: d.category?.slug || 'general'
        },
        read_time_mins: d.read_time_mins || 5,
        published_at: d.published_at
          ? new Date(d.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          : 'Published'
      }))
    }
  } catch {
    // fall through to mock related articles below
  }

  // Fallback related articles from mock data if DB query has no results
  if (relatedArticles.length === 0) {
    relatedArticles = Object.entries(MOCK_ARTICLE_DETAILS)
      .filter(([key, val]) => key !== slug && val.category.slug === article.category.slug)
      .slice(0, 3)
      .map(([key, val]) => ({
        slug: key,
        title: val.title,
        excerpt: val.excerpt,
        cover_image_url: val.cover_image_url,
        category: val.category,
        read_time_mins: val.read_time_mins,
        published_at: val.published_at
      }))

    // If still not enough, add other categories
    if (relatedArticles.length < 3) {
      const extra = Object.entries(MOCK_ARTICLE_DETAILS)
        .filter(([key, val]) => key !== slug && !relatedArticles.some(r => r.slug === key))
        .slice(0, 3 - relatedArticles.length)
        .map(([key, val]) => ({
          slug: key,
          title: val.title,
          excerpt: val.excerpt,
          cover_image_url: val.cover_image_url,
          category: val.category,
          read_time_mins: val.read_time_mins,
          published_at: val.published_at
        }))
      relatedArticles = [...relatedArticles, ...extra]
    }
  }

  const articleUrl = `${BASE_URL}/${category}/${slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.cover_image_url,
    datePublished: (() => { try { const d = new Date(article.published_at); return isNaN(d.getTime()) ? undefined : d.toISOString() } catch { return undefined } })(),
    author: { '@type': 'Person', name: article.author.name },
    publisher: { '@type': 'Organization', name: 'Expliq', url: BASE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgress />

      {/* Immersive Editorial Header inside Widescreen Banner */}
      <div className="max-w-page-max-width mx-auto px-gutter pt-8 mb-12 select-none relative z-10">
        {/* Breadcrumb — above image */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-sans mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={10} className="text-on-surface-variant/40" />
          <Link href={`/${article.category.slug}`} className="hover:text-primary transition-colors">{article.category.name}</Link>
        </nav>

        <div className="w-full min-h-64 md:aspect-3/1 relative rounded-lg overflow-hidden shadow-2xl border border-zinc-800/20 dark:border-outline-variant/30 bg-surface-dim group">
          {/* Cover Image */}
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-1000 z-0"
          />
          {/* Deep Editorial Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />

          {/* Hero Content Overlay (Bottom-aligned) */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-12 z-20 space-y-4 md:space-y-5 max-w-4xl text-white">
            {/* Category Badge */}
            <div className="flex items-center gap-3">
              <Link
                href={`/${article.category.slug}`}
                className="text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-white/20 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all font-sans"
              >
                {article.category.name}
              </Link>
            </div>

            {/* Big Immersive Title */}
            <h1 className="font-serif font-extrabold text-2xl md:text-4xl lg:text-5xl text-white leading-tight tracking-tight drop-shadow-sm">
              {article.title}
            </h1>
          </div>
        </div>

        {/* Author / Date + Description & Read Time — below image */}
        <div className="mt-5 space-y-4">
          <div className="flex items-center gap-4 font-sans">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary to-secondary text-white flex items-center justify-center font-extrabold text-sm shadow-md select-none shrink-0">
              {article.author.avatar_letter || 'TR'}
            </div>
            <div>
              <div className="text-sm font-bold text-on-surface">{article.author.name}</div>
              <div className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                <Calendar size={12} />
                <span>Published: {article.published_at}</span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="shrink-0 text-xs font-semibold text-on-surface-variant flex items-center gap-1.5 font-sans">
                <Clock size={13} /> {article.read_time_mins} min read
              </span>
              {article.id && <LiveReaders articleId={article.id} />}
              <ShareButtons title={article.title} categorySlug={article.category.slug} slug={slug} variant="icon" />
            </div>
          </div>
          <p className="text-sm md:text-base text-on-surface-variant font-normal leading-relaxed max-w-3xl border-l-2 border-outline-variant pl-4 font-sans">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-page-max-width mx-auto px-gutter pb-12 lg:flex lg:gap-12 items-start relative z-10">
        {/* Left Side: Table of Contents & Author Info */}
        <aside className="w-full lg:w-64 shrink-0 order-2 lg:order-1 mb-10 lg:mb-0 space-y-6 lg:sticky lg:top-24 select-none font-sans">
          {/* Author Card (Enhanced) */}
          <AuthorCard author={article.author} />

          {/* Table of Contents Scroll-Spy */}
          {tocItems.length > 0 && (
            <div className="hidden lg:block border border-outline-variant/40 p-6 rounded-lg bg-surface-container-lowest/40 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300">
              <TableOfContents items={tocItems} />
            </div>
          )}
        </aside>

        {/* Right Side: Article Body Renderer */}
        <article className="max-w-article-max-width mx-auto lg:mx-0 grow order-1 lg:order-2 space-y-12">
          <ArticleRenderer document={normalizeContent(article.content)} />
          {article.id && (
            <div className="border-t border-outline-variant/30 pt-8 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-outline font-sans">What did you think?</p>
              <Reactions articleId={article.id} />
            </div>
          )}
        </article>
      </div>

      {/* Related Articles & Newsletter */}
      <section className="border-t border-outline-variant/20 pt-12 mt-4 max-w-page-max-width mx-auto px-gutter pb-20 relative z-10 space-y-10">
        <div>
          <h3 className="font-serif font-bold text-xl text-on-surface mb-5 border-b border-outline-variant pb-3">
            More from Expliq
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedArticles.map((rel: any) => (
              <Link
                key={rel.slug}
                href={`/${rel.category.slug}/${rel.slug}`}
                className="group border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest hover:border-outline hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="aspect-video overflow-hidden bg-surface-variant">
                  <img
                    src={rel.cover_image_url}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2.5 grow">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-on-surface-variant">
                    <span className="text-primary font-bold uppercase tracking-wide">{rel.category.name}</span>
                    <span>·</span>
                    <span>{rel.published_at}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5"><Clock size={9} /> {rel.read_time_mins} min</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm leading-snug text-on-surface group-hover:text-primary transition-colors line-clamp-2 grow">
                    {rel.title}
                  </h4>
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
                    <span className="text-[11px] text-on-surface-variant">{rel.category.name}</span>
                    <ArrowUpRight size={13} className="text-outline group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <NewsletterForm layout="card" source={`article-${slug}`} />
      </section>
    </div>
  )
}
