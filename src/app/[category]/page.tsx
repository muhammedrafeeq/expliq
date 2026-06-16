import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BookOpen, ArrowUpRight, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'
import { FilterBar } from './FilterBar'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://expliq.in'

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ sort?: string; read?: string; date?: string }>
}

const MOCK_CATEGORIES = [
  { id: 'cat-1',  name: 'AI Tools',        slug: 'ai-tools',     description: 'AI tool reviews and guides',                          color: '#8B5CF6' },
  { id: 'cat-2',  name: 'Devices & Gadgets',slug: 'devices',     description: 'Phone and gadget reviews for India',                  color: '#3B82F6' },
  { id: 'cat-3',  name: 'Career Upgrades',  slug: 'career',      description: 'Career growth and upskilling',                        color: '#10B981' },
  { id: 'cat-4',  name: 'Tech News',        slug: 'tech-news',   description: 'Weekly tech digest with India context',               color: '#F59E0B' },
  { id: 'cat-5',  name: 'Student Earning',  slug: 'student',     description: 'Earning methods for Indian college students',         color: '#EF4444' },
  { id: 'cat-6',  name: 'Tutorials',        slug: 'tutorials',   description: 'Step-by-step technical guides',                       color: '#0EA5E9' },
  { id: 'cat-7',  name: 'Freelancing',      slug: 'freelancing', description: 'Build and grow a freelance business',                 color: '#EC4899' },
  { id: 'cat-8',  name: 'Startup',          slug: 'startup',     description: 'Build a startup in India',                            color: '#F97316' },
  { id: 'cat-9',  name: 'Finance',          slug: 'finance',     description: 'Personal finance for tech professionals',             color: '#14B8A6' },
  { id: 'cat-10', name: 'Open Source',      slug: 'open-source', description: 'GitHub, open source contributions',                  color: '#6366F1' },
  { id: 'cat-11', name: 'Productivity',     slug: 'productivity',description: 'Tools and habits for peak performance',               color: '#84CC16' },
  { id: 'cat-12', name: 'Cybersecurity',    slug: 'security',    description: 'Cybersecurity and online safety',                     color: '#F43F5E' },
  { id: 'cat-13', name: 'Design & UI/UX',   slug: 'design',      description: 'UI/UX design and Figma tutorials',                   color: '#A78BFA' },
  { id: 'cat-14', name: 'Cloud & DevOps',   slug: 'cloud',       description: 'AWS, Docker, Kubernetes tutorials',                  color: '#FB923C' },
  { id: 'cat-15', name: 'Remote Work',      slug: 'remote',      description: 'Find and thrive in remote tech roles',               color: '#2DD4BF' },
]

const MOCK_ARTICLES = [
  {
    id: 'featured-1',
    title: 'The Architecture of Silence: Why Minimalism Scaling Matters',
    slug: 'architecture-of-silence-minimalism',
    excerpt: 'In an era of cognitive overload, we explore how systematic design can restore focus and intentionality.',
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmGmR74CZaf8E_qRn-CY9DIqH3g41R0Cfi3o4SuWcmlpLQPVcSsYVOna8T6fnNPIDHopagdzBqpQtZR1J_QIjmgUonfSdo1OcW0DluBxainKuaCaigeBwrczVYRWjCgnvVm424UlAZLX76zPuDgadMfBlQT6fkJvCIedvvABkcQv6b5rJakJ8JOc9UJHCLq295qGuVtKTAMb70qSADL_rJMLxcP0jhMhEy9Ly3EdF9WNfD7r1sIZtshELlCZEuDc00czp11F-gTMlr',
    category: { name: 'AI Tools', slug: 'ai-tools' },
    author: { name: 'Elias Thorne', avatar_letter: 'ET' },
    read_time_mins: 12,
    published_at: 'Jan 24, 2026'
  },
  {
    id: 'card-1',
    title: 'Mastering CSS Container Queries for Editorial Layouts',
    slug: 'mastering-css-container-queries',
    excerpt: 'Learn how to build truly responsive article components that adapt to their container width.',
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3zFUMaaMq-yJoR44S2evcU1Gt30cpLEgYETJJy8lIDsgnWPSMQXNaTrzCJBKUrclU-RSSciKO-jtK4jyD4HxNOoPqbx7fFTBgKmCwoVZKhVZ0v45Oxn23pcaSNqY0TSSoZF2s8IrnJI-x_vrgKQM_sAbXxyNVIXBzeOHMe63My88eiUqk0QS3WCIBTNP-GYLZD3wUOzWtZiyBb3QypyltAynnL8bFTCztwR011nIRBhKIgpcVLuSL9KZloCJmtP57f3XbJVXUbz1u',
    category: { name: 'Career', slug: 'career' },
    author: { name: 'Elena Vance', avatar_letter: 'EV' },
    read_time_mins: 8,
    published_at: '2 days ago'
  },
  {
    id: 'card-2',
    title: 'The Psychology of Long-Form Reading in Digital Spaces',
    slug: 'psychology-long-form-reading',
    excerpt: 'Why traditional serif typography remains the gold standard for sustained reading sessions.',
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvUAdSBjv1EbIXGBD7iNwBXGTSasrcyufi47tf2hRT2YOlZ-vJKdcU4RvKkZdxN7QEpSAUkGkUTbtTCQysR1TCwgmJGijW4C3h_Uk9WAclOqiPYt3jtTyrkf573vEZgAlLL-4CjktrxRWFhIIY1iBpoTB5sxA-F5zNOru5XaAFYU-GpXs3vSp1mnL5_h3AgIDtXBQlmYyLQgRY5G_j5WEeFYFzGXian5FvkF2nQp1QN7s9q2hT16vXOlZN5nwo8o-VzDitJ75k8iKi',
    category: { name: 'Student Earning', slug: 'student' },
    author: { name: 'Julian Vane', avatar_letter: 'JV' },
    read_time_mins: 15,
    published_at: '5 days ago'
  },
  {
    id: 'card-3',
    title: 'Server-Side Rendering vs Static Generation in 2026',
    slug: 'ssr-vs-static-generation',
    excerpt: 'Evaluating the trade-offs between dynamic performance and edge caching for content-heavy platforms.',
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA7CDhdeQaxcJ2qsugwKoq0djs55d-6U_C1RKLCneE6_WjC_rmCJkjgGp1Ck1pXrnXMkxNGCl7epvFVMgemybMtzgJyZkZlwAJaQ7D6KWbCYUzpi1zw3rKIUzT0jqc17L8uiTZgVMA33daq5TiVgyKG6H1uXwqbgUuVORFzGiuco-rVgJdTcjN4ZHW4vu6Q5F19_cIfTwY2GxC_swJi7ty5JJRXvWxW5FoQSVRvYhFHJy1-CR2AA7Ami6lQmT0vTpYF1penqLmyrVY',
    category: { name: 'Devices & Gadgets', slug: 'devices' },
    author: { name: 'Elias Thorne', avatar_letter: 'ET' },
    read_time_mins: 10,
    published_at: '1 week ago'
  }
]

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params
  const supabase = await createClient()

  let category: any = MOCK_CATEGORIES.find(c => c.slug === slug)
  try {
    const { data } = await supabase.from('categories').select('*').eq('slug', slug).eq('is_active', true).single()
    if (data) category = data
  } catch { }

  if (!category) return { title: 'Category Not Found' }

  const title = category.name
  const description = category.description || `Read the latest ${category.name} articles on Expliq.`
  const url = `${BASE_URL}/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${title} | Expliq`,
      description,
      siteName: 'Expliq',
    },
    twitter: {
      card: 'summary',
      title: `${title} | Expliq`,
      description,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const categorySlug = resolvedParams.category
  const sort = resolvedSearchParams.sort || 'latest'
  const read = resolvedSearchParams.read || 'all'
  const date = resolvedSearchParams.date || 'all'

const supabase = await createClient()

  let category: any = null
  try {
    const { data } = await supabase.from('categories').select('*').eq('slug', categorySlug).eq('is_active', true).single()
    if (data) category = data
  } catch {
    // fall through to mock/notFound below
  }

  if (!category) category = MOCK_CATEGORIES.find(c => c.slug === categorySlug)
  if (!category) return notFound()

  let dbArticles: any[] = []
  try {
    let query = supabase.from('articles').select('*, author_id(name)').eq('category_id', category.id).eq('status', 'published')
    query = sort === 'views' ? query.order('view_count', { ascending: false }) : query.order('published_at', { ascending: false })
    const { data: articlesData } = await query
    if (articlesData && articlesData.length > 0) dbArticles = articlesData
  } catch {
    // fall through to mock data below
  }

  const rawArticles = dbArticles.length > 0 ? dbArticles : MOCK_ARTICLES.filter(art => art.category.slug === categorySlug)

  // Apply read-time filter
  const readFiltered = rawArticles.filter((art) => {
    const mins = art.read_time_mins || 5
    if (read === 'short') return mins < 5
    if (read === 'medium') return mins >= 5 && mins <= 10
    if (read === 'long') return mins > 10
    return true
  })

  // Apply date filter
  const now = Date.now()
  const dateFiltered = readFiltered.filter((art) => {
    if (date === 'week') return now - new Date(art.published_at).getTime() < 7 * 86400000
    if (date === 'month') return now - new Date(art.published_at).getTime() < 30 * 86400000
    return true
  })

  const articles = dateFiltered.map((art) => {
    let published_at = 'Recently'
    if (art.published_at) {
      if (typeof art.published_at === 'string' && (art.published_at.includes('ago') || art.published_at.includes(',') || isNaN(Date.parse(art.published_at)))) {
        published_at = art.published_at
      } else {
        try { published_at = new Date(art.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) } catch { }
      }
    }
    return {
      id: art.id,
      title: art.title,
      slug: art.slug,
      excerpt: art.excerpt,
      cover_image_url: art.cover_image_url,
      read_time_mins: art.read_time_mins || 5,
      published_at,
      author_name: art.author?.name || art.author_id?.name || 'Writer',
      author_letter: (art.author?.name || art.author_id?.name || 'W').slice(0, 2).toUpperCase()
    }
  })

  return (
    <div className="max-w-page-max-width mx-auto px-gutter py-10 space-y-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={10} className="text-on-surface-variant/40" />
        <span className="text-on-surface">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="border-b border-outline-variant pb-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-serif font-bold text-3xl text-on-surface">{category.name}</h1>
            <p className="text-sm text-on-surface-variant">{category.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-on-surface-variant">{articles.length} article{articles.length !== 1 ? 's' : ''}</span>
            <FilterBar categorySlug={categorySlug} sort={sort} read={read} date={date} />
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((art) => (
            <Link
              key={art.id}
              href={`/${categorySlug}/${art.slug}`}
              className="group border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest hover:border-outline hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="aspect-video overflow-hidden bg-surface-variant">
                <img
                  src={art.cover_image_url || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d'}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex flex-col gap-2.5 grow">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-on-surface-variant">
                  <span className="text-primary font-bold uppercase tracking-wide">{category.name}</span>
                  <span>·</span>
                  <span>{art.published_at}</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5"><Clock size={9} /> {art.read_time_mins} min</span>
                </div>
                <h3 className="font-serif font-bold text-sm leading-snug text-on-surface group-hover:text-primary transition-colors line-clamp-2 grow">
                  {art.title}
                </h3>
                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[9px]">
                      {art.author_letter}
                    </div>
                    <span className="text-[11px] text-on-surface-variant">{art.author_name}</span>
                  </div>
                  <ArrowUpRight size={13} className="text-outline group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-outline-variant rounded-lg space-y-3">
          <BookOpen className="mx-auto text-outline-variant" size={32} />
          <div className="text-sm font-bold text-on-surface">No articles yet in {category.name}</div>
          <p className="text-xs text-on-surface-variant max-w-xs mx-auto">Stay tuned — our publishers are working on it.</p>
        </div>
      )}
    </div>
  )
}
