import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://expliq.in'

const STATIC_CATEGORIES = ['ai-tools', 'devices', 'career', 'tech-news', 'student']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/tutorials`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/tools`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ...STATIC_CATEGORIES.map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
  ]

  let articlePages: MetadataRoute.Sitemap = []
  try {
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, updated_at, published_at, category:category_id(slug)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (articles) {
      articlePages = articles.map((art: any) => ({
        url: `${BASE_URL}/${art.category?.slug || 'general'}/${art.slug}`,
        lastModified: new Date(art.updated_at || art.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch {
    // silently skip if DB is unavailable
  }

  let tutorialPages: MetadataRoute.Sitemap = []
  try {
    const { data: tutorials } = await supabase
      .from('tutorials')
      .select('slug, updated_at')
      .eq('status', 'published')

    if (tutorials) {
      tutorialPages = tutorials.map((t: any) => ({
        url: `${BASE_URL}/tutorials/${t.slug}`,
        lastModified: new Date(t.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    }
  } catch {
    // silently skip
  }

  return [...staticPages, ...articlePages, ...tutorialPages]
}
