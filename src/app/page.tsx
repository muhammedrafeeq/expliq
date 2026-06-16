import { createClient } from '@/lib/supabase/server'
import { NewsletterForm } from '@/components/layout/NewsletterForm'
import {
  ArrowUpRight, Clock, BookOpen, Cpu, Smartphone, TrendingUp,
  Newspaper, GraduationCap, Flame, Search,
  Briefcase, Rocket, Banknote, GitBranch, CheckSquare, Shield, Palette, Cloud, Globe
} from 'lucide-react'
import { MarqueeStrip } from '@/components/layout/MarqueeStrip'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://expliq.in' },
}

// ── Category meta ─────────────────────────────────────────────────────────────
const CATEGORY_META: Record<string, { icon: React.ComponentType<any>; color: string; image: string }> = {
  'ai-tools': {
    icon: Cpu, color: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
  },
  'devices': {
    icon: Smartphone, color: '#3B82F6',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
  },
  'career': {
    icon: TrendingUp, color: '#10B981',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
  },
  'tech-news': {
    icon: Newspaper, color: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
  },
  'student': {
    icon: GraduationCap, color: '#EF4444',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80',
  },
  'tutorials': {
    icon: BookOpen, color: '#0EA5E9',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
  },
  'freelancing': {
    icon: Briefcase, color: '#EC4899',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=600&q=80',
  },
  'startup': {
    icon: Rocket, color: '#F97316',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
  },
  'finance': {
    icon: Banknote, color: '#14B8A6',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
  },
  'open-source': {
    icon: GitBranch, color: '#6366F1',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=600&q=80',
  },
  'productivity': {
    icon: CheckSquare, color: '#84CC16',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80',
  },
  'security': {
    icon: Shield, color: '#F43F5E',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
  },
  'design': {
    icon: Palette, color: '#A78BFA',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80',
  },
  'cloud': {
    icon: Cloud, color: '#FB923C',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
  },
  'remote': {
    icon: Globe, color: '#2DD4BF',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function ArticleCard({ art, showExcerpt = false }: { art: any; showExcerpt?: boolean }) {
  return (
    <Link
      href={`/${art.category.slug}/${art.slug}`}
      className="group border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest hover:border-outline hover:shadow-md transition-all duration-200 flex flex-col"
    >
      <div className="aspect-video overflow-hidden bg-surface-variant">
        <img
          src={art.cover_image_url}
          alt={art.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col gap-2 grow">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-on-surface-variant">
          <span className="text-primary font-bold uppercase tracking-wide">{art.category.name}</span>
          <span>·</span>
          <span>{art.published_at}</span>
          <span>·</span>
          <span className="flex items-center gap-0.5"><Clock size={9} /> {art.read_time_mins} min</span>
        </div>
        <h3 className="font-serif font-bold text-sm leading-snug text-on-surface group-hover:text-primary transition-colors line-clamp-2 grow">
          {art.title}
        </h3>
        {showExcerpt && (
          <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{art.excerpt}</p>
        )}
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
  )
}

function SectionHeader({ title, href, count }: { title: string; href: string; count?: number }) {
  return (
    <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-5">
      <div className="flex items-center gap-2">
        <h2 className="font-serif font-bold text-lg text-on-surface">{title}</h2>
        {count !== undefined && (
          <span className="text-[10px] font-bold text-on-surface-variant bg-surface-variant px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      <Link href={href} className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
        View all <ArrowUpRight size={11} />
      </Link>
    </div>
  )
}

// ── Data helpers ───────────────────────────────────────────────────────────────
function normaliseArticle(art: any) {
  return {
    id: art.id,
    title: art.title,
    slug: art.slug,
    excerpt: art.excerpt,
    cover_image_url: art.cover_image_url || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    category: { name: art.category?.name || 'General', slug: art.category?.slug || 'general' },
    author_name: art.author?.name || 'Writer',
    author_letter: (art.author?.name || 'W').slice(0, 2).toUpperCase(),
    read_time_mins: art.read_time_mins || 5,
    published_at: art.published_at ? formatDate(art.published_at) : 'Recently',
  }
}

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch all published articles in one query
  const { data: allArticlesRaw = [] } = await supabase
    .from('articles')
    .select('*, category:category_id(name, slug), author:author_id(name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50)

  const allArticles = (allArticlesRaw ?? []).map(normaliseArticle)

  // Fetch categories
  const { data: dbCategories = [] } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const featured = allArticles[0]
  const trending = allArticles.slice(0, 5)  // top 5 latest as "trending"
  const latestSix = allArticles.slice(1, 7)

  // Group articles by category (up to 3 per category)
  const byCategory: Record<string, any[]> = {}
  for (const art of allArticles) {
    const s = art.category.slug
    if (!byCategory[s]) byCategory[s] = []
    if (byCategory[s].length < 3) byCategory[s].push(art)
  }

  const categories = (dbCategories ?? []).map((cat: any) => ({
    ...cat,
    ...(CATEGORY_META[cat.slug] || { icon: BookOpen, color: '#6B7280', image: '' }),
  }))

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://expliq.in'
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Expliq',
    url: BASE_URL,
    description: "India's go-to source for technology tutorials, career tips, AI tools, device reviews, and student earnings.",
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <div className="max-w-page-max-width mx-auto px-gutter py-10 space-y-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="text-center pt-2 pb-0 space-y-5">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/8 border border-primary/20 px-3 py-1.5 rounded-full">
          <Flame size={10} /> India's Tech & Career Platform
        </div>
        <h1 className="font-serif font-bold text-4xl md:text-5xl text-on-surface tracking-tight leading-tight">
          Learn. Build. Earn.
        </h1>
        <p className="text-sm text-on-surface-variant max-w-lg mx-auto leading-relaxed">
          In-depth guides on AI tools, devices, career growth, and digital earning strategies — built for India's next generation.
        </p>
        {/* Search bar */}
        <form action="/search" method="GET" className="flex items-center max-w-md mx-auto mt-2">
          <div className="relative w-full">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
            <input
              type="text"
              name="q"
              placeholder="Search articles, tutorials, topics…"
              className="w-full pl-9 pr-28 py-2.5 text-sm bg-surface-container border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/60 transition-colors"
              suppressHydrationWarning
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
        {/* Popular searches */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wide">Popular:</span>
          {['AI Tools', 'Fiverr', '5G Phones', 'Remote Jobs', 'Claude vs ChatGPT'].map(tag => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="text-[11px] font-medium text-on-surface-variant border border-outline-variant px-2.5 py-1 rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Marquee headline strip ───────────────────────────────────────── */}
      <div className="-mx-gutter">
        <MarqueeStrip items={allArticles} />
      </div>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-bold text-lg text-on-surface">Browse Topics</h2>
          <span className="text-xs text-on-surface-variant">{categories.length} categories</span>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat: any) => {
            const Icon = cat.icon || BookOpen
            return (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group relative overflow-hidden flex flex-col justify-end h-28 sm:h-36 md:h-40 rounded-xl border border-outline-variant hover:border-outline hover:shadow-md transition-all duration-300 active:scale-[0.98]"
              >
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/10 group-hover:from-black/90 transition-all duration-300" />
                <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white group-hover:bg-white/20 transition-all duration-300">
                  <Icon className="w-3 h-3" strokeWidth={2} />
                </div>
                <div className="relative z-10 p-2.5 md:p-3">
                  <span className="font-serif font-bold text-xs sm:text-sm text-white leading-snug block">{cat.name}</span>
                  <span className="text-[9px] text-white/70 hidden sm:block mt-0.5 line-clamp-1">{cat.description}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Featured article ─────────────────────────────────────────────── */}
      {featured && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Flame size={14} className="text-primary" />
            <h2 className="font-serif font-bold text-lg text-on-surface">Editor's Pick</h2>
          </div>
          <Link
            href={`/${featured.category.slug}/${featured.slug}`}
            className="group block border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest hover:border-outline hover:shadow-lg transition-all duration-200"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 aspect-video md:aspect-auto md:min-h-72 overflow-hidden">
                <img src={featured.cover_image_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-on-surface-variant">
                  <span className="text-primary font-bold uppercase tracking-wide">{featured.category.name}</span>
                  <span>·</span><span>{featured.published_at}</span>
                  <span>·</span><span className="flex items-center gap-0.5"><Clock size={9} /> {featured.read_time_mins} min</span>
                </div>
                <h2 className="font-serif font-bold text-2xl md:text-3xl text-on-surface leading-snug group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-sm text-on-surface-variant line-clamp-3 leading-relaxed">{featured.excerpt}</p>
                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {featured.author_letter}
                    </div>
                    <span className="text-xs text-on-surface-variant">{featured.author_name}</span>
                  </div>
                  <span className="text-xs font-semibold text-primary flex items-center gap-1">
                    Read article <ArrowUpRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── Trending strip ───────────────────────────────────────────────── */}
      {trending.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-primary" />
            <h2 className="font-serif font-bold text-lg text-on-surface">Trending This Week</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
            {trending.map((art, i) => (
              <Link
                key={art.id}
                href={`/${art.category.slug}/${art.slug}`}
                className="group snap-start shrink-0 w-64 border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest hover:border-outline hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="h-36 overflow-hidden bg-surface-variant relative">
                  <img src={art.cover_image_url} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
                <div className="p-3 flex flex-col gap-1.5 grow">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-primary">{art.category.name}</span>
                  <h3 className="font-serif font-bold text-xs leading-snug text-on-surface group-hover:text-primary transition-colors line-clamp-3 grow">
                    {art.title}
                  </h3>
                  <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                    <Clock size={8} /> {art.read_time_mins} min read
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Latest articles ──────────────────────────────────────────────── */}
      {latestSix.length > 0 && (
        <section>
          <SectionHeader title="Latest Insights" href="/ai-tools" count={latestSix.length} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestSix.map((art) => <ArticleCard key={art.id} art={art} />)}
          </div>
        </section>
      )}

      {/* ── Per-category sections ────────────────────────────────────────── */}
      {categories.map((cat: any) => {
        const arts = byCategory[cat.slug]
        if (!arts || arts.length === 0) return null
        const Icon = cat.icon || BookOpen
        return (
          <section key={cat.slug}>
            <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                  <Icon size={14} />
                </div>
                <h2 className="font-serif font-bold text-lg text-on-surface">{cat.name}</h2>
                <span className="text-[10px] font-bold text-on-surface-variant bg-surface-variant px-2 py-0.5 rounded-full">{arts.length} articles</span>
              </div>
              <Link href={`/${cat.slug}`} className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                View all <ArrowUpRight size={11} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {arts.map((art) => <ArticleCard key={art.id} art={art} showExcerpt />)}
            </div>
          </section>
        )
      })}

      {/* ── Newsletter ───────────────────────────────────────────────────── */}
      <section>
        <NewsletterForm layout="card" source="homepage_bottom" />
      </section>

    </div>
  )
}
