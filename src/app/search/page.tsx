// E:\Projects\Works\Expliq\src\app\search\page.tsx
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Search',
  description: 'Search Expliq for articles, tutorials, and tools.',
  robots: { index: false, follow: true },
}

import { createClient } from '@/lib/supabase/server'
import { SearchBar } from './SearchBar'
import { Clock, Search, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

const MOCK_SEARCH_ARTICLES = [
  { id: 'm1', title: 'The Architecture of Silence: Why Minimalism Scaling Matters', excerpt: 'In an era of cognitive overload, systematic design can restore focus.', cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmGmR74CZaf8E_qRn-CY9DIqH3g41R0Cfi3o4SuWcmlpLQPVcSsYVOna8T6fnNPIDHopagdzBqpQtZR1J_QIjmgUonfSdo1OcW0DluBxainKuaCaigeBwrczVYRWjCgnvVm424UlAZLX76zPuDgadMfBlQT6fkJvCIedvvABkcQv6b5rJakJ8JOc9UJHCLq295qGuVtKTAMb70qSADL_rJMLxcP0jhMhEy9Ly3EdF9WNfD7r1sIZtshELlCZEuDc00czp11F-gTMlr', slug: 'architecture-of-silence-minimalism', category: { name: 'AI Tools', slug: 'ai-tools' }, read_time_mins: 12 },
  { id: 'm2', title: 'Mastering CSS Container Queries for Editorial Layouts', excerpt: 'Build truly responsive components that adapt to their container width.', cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3zFUMaaMq-yJoR44S2evcU1Gt30cpLEgYETJJy8lIDsgnWPSMQXNaTrzCJBKUrclU-RSSciKO-jtK4jyD4HxNOoPqbx7fFTBgKmCwoVZKhVZ0v45Oxn23pcaSNqY0TSSoZF2s8IrnJI-x_vrgKQM_sAbXxyNVIXBzeOHMe63My88eiUqk0QS3WCIBTNP-GYLZD3wUOzWtZiyBb3QypyltAynnL8bFTCztwR011nIRBhKIgpcVLuSL9KZloCJmtP57f3XbJVXUbz1u', slug: 'mastering-css-container-queries', category: { name: 'Career', slug: 'career' }, read_time_mins: 8 },
  { id: 'm3', title: 'Top AI Tools Every Developer Should Use in 2026', excerpt: 'Copilot, Cursor, Claude and other AI coding tools with real workflows.', cover_image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80', slug: 'ai-tools-for-developers', category: { name: 'Tutorials', slug: 'tutorials' }, read_time_mins: 22 },
  { id: 'm4', title: 'Server-Side Rendering vs Static Generation in 2026', excerpt: 'Trade-offs between dynamic performance and edge caching for content platforms.', cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA7CDhdeQaxcJ2qsugwKoq0djs55d-6U_C1RKLCneE6_WjC_rmCJkjgGp1Ck1pXrnXMkxNGCl7epvFVMgemybMtzgJyZkZlwAJaQ7D6KWbCYUzpi1zw3rKIUzT0jqc17L8uiTZgVMA33daq5TiVgyKG6H1uXwqbgUuVORFzGiuco-rVgJdTcjN4ZHW4vu6Q5F19_cIfTwY2GxC_swJi7ty5JJRXvWxW5FoQSVRvYhFHJy1-CR2AA7Ami6lQmT0vTpYF1penqLmyrVY', slug: 'ssr-vs-static-generation', category: { name: 'Devices', slug: 'devices' }, read_time_mins: 10 },
  { id: 'm5', title: 'How to Start Freelancing as a Student and Earn Your First ₹10,000', excerpt: 'Step-by-step guide to finding clients and delivering your first project.', cover_image_url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80', slug: 'freelancing-for-students', category: { name: 'Student Earning', slug: 'student' }, read_time_mins: 18 },
  { id: 'm6', title: 'Build a REST API with Node.js & Express from Scratch', excerpt: 'Design, build, and deploy a production-ready REST API with JWT auth.', cover_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14431b9?auto=format&fit=crop&w=600&q=80', slug: 'build-rest-api-nodejs', category: { name: 'Tutorials', slug: 'tutorials' }, read_time_mins: 35 },
]

export default async function SearchPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const query = resolvedParams.q || ''

  let results: any[] = []

  if (query.trim()) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('articles')
        .select('*, category_id(name, slug), author_id(name)')
        .eq('status', 'published')
        .textSearch('search_vector', query, { config: 'english', type: 'websearch' })
        .limit(12)

      if (!error && data && data.length > 0) {
        results = data.map((art: any) => ({
          id: art.id,
          title: art.title,
          excerpt: art.excerpt,
          cover_image_url: art.cover_image_url,
          slug: art.slug,
          category: { name: art.category_id?.name || 'Article', slug: art.category_id?.slug || 'general' },
          read_time_mins: art.read_time_mins || 5,
        }))
      }
    } catch {
      // DB unavailable — fall through to mock search below
    }

    // Mock fallback: simple keyword filter
    if (results.length === 0) {
      const q = query.toLowerCase()
      results = MOCK_SEARCH_ARTICLES.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.name.toLowerCase().includes(q)
      )
    }
  }

  return (
    <div className="max-w-page-max-width mx-auto px-gutter py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-serif font-bold text-3xl md:text-4xl text-on-surface">Search The Platform</h1>
        <p className="text-xs text-on-surface-variant max-w-md mx-auto">
          Query articles, AI guides, upskilling templates, and student earning lists.
        </p>
      </div>

      <SearchBar />

      {query ? (
        <div className="space-y-6">
          <div className="text-xs text-on-surface-variant font-mono">
            SEARCH RESULTS FOR "{query.toUpperCase()}" ({results.length} MATCHES FOUND)
          </div>

          {results.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((art) => (
                <Link
                  key={art.id}
                  href={`/${art.category.slug}/${art.slug}`}
                  className="group border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest hover:border-outline hover:shadow-md transition-all duration-200 flex flex-col"
                >
                  <div className="aspect-video bg-surface-variant overflow-hidden">
                    <img
                      src={art.cover_image_url || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d'}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex flex-col grow gap-2.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant">
                      <span className="text-primary uppercase tracking-wide">{art.category.name}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {art.read_time_mins} min</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-on-surface leading-snug group-hover:text-primary transition-colors line-clamp-2 grow">
                      {art.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-outline-variant rounded-lg bg-surface-container-low space-y-3">
              <Search className="mx-auto text-outline-variant animate-pulse" size={36} />
              <div className="text-sm font-bold text-on-surface">No articles matched your criteria</div>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                Try searching for different keywords like "Gemini", "Minimalism", "Scaler", "CSS", or "Salary".
              </p>
            </div>
          )}
        </div>
      ) : (
        // Initial empty state
        <div className="max-w-md mx-auto text-center py-12 space-y-4">
          <BookOpen className="mx-auto text-primary" size={32} />
          <h3 className="font-bold text-sm text-on-surface">Ready to Search?</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Enter search terms above to query India-centric salary surveys, gadget breakdowns, upskilling guides, and AI checklists.
          </p>
        </div>
      )}
    </div>
  )
}
