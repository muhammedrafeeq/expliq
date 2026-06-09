// E:\Projects\Works\Expliq\src\lib\actions\articles.ts
"use server"

import { createClient } from '@/lib/supabase/server'
import { Block } from '@/lib/types/blocks'
import { revalidatePath } from 'next/cache'

interface SaveDraftParams {
  articleId: string
  blocks: Block[]
  title: string
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/&/g, '-and-')         // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '')             // Trim - from end
}

function calculateReadTime(blocks: Block[]): number {
  let wordCount = 0
  blocks.forEach(block => {
    if (block.type === 'paragraph' || block.type === 'heading' || block.type === 'quote' || block.type === 'callout') {
      wordCount += (block.content || '').split(/\s+/).filter(Boolean).length
    } else if (block.type === 'list') {
      block.items.forEach(item => {
        wordCount += item.split(/\s+/).filter(Boolean).length
      })
    } else if (block.type === 'affiliate') {
      wordCount += (block.product_name + ' ' + block.description).split(/\s+/).filter(Boolean).length
    }
  })
  return Math.max(1, Math.ceil(wordCount / 200))
}

export async function saveDraftAction({ articleId, blocks, title }: SaveDraftParams) {
  const supabase = await createClient()

  // Verify ownership
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: article } = await supabase
    .from('articles')
    .select('author_id')
    .eq('id', articleId)
    .single()

  if (!article || (article.author_id !== user.id && user.email !== 'admin')) {
    throw new Error('Unauthorized ownership check failed')
  }

  const baseSlug = slugify(title) || `draft-${articleId.slice(0, 8)}`
  const readTimeMins = calculateReadTime(blocks)

  // Extract plain text excerpt (first 180 characters of first paragraph block)
  let excerpt = ''
  const firstParagraph = blocks.find(b => b.type === 'paragraph') as any
  if (firstParagraph && firstParagraph.content) {
    // Strip basic HTML tags for plaintext excerpt
    excerpt = firstParagraph.content.replace(/<[^>]*>/g, '').slice(0, 180) + '...'
  }

  const { error } = await supabase
    .from('articles')
    .update({
      title,
      slug: baseSlug,
      excerpt: excerpt || 'No excerpt available.',
      content: { version: 1, blocks },
      read_time_mins: readTimeMins,
      updated_at: new Date().toISOString()
    })
    .eq('id', articleId)

  if (error) {
    throw new Error('Failed to save draft')
  }

  return { success: true }
}

export async function createDraftAction(categoryId?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Must be signed in to create drafts')

  const newArticleId = crypto.randomUUID()
  const initialBlocks: Block[] = [
    { id: crypto.randomUUID(), type: 'heading', level: 2, content: 'Why AI tools matter in India' },
    { id: crypto.randomUUID(), type: 'paragraph', content: 'India has over 200M knowledge workers...' }
  ]

  const { data, error } = await supabase
    .from('articles')
    .insert({
      id: newArticleId,
      title: 'Untitled Draft',
      slug: `untitled-draft-${newArticleId.slice(0, 8)}`,
      excerpt: 'Draft article draft contents.',
      content: { version: 1, blocks: initialBlocks },
      category_id: categoryId || null,
      author_id: user.id,
      status: 'draft',
      read_time_mins: 1
    })
    .select()
    .single()

  if (error) {
    throw new Error('Failed to create draft')
  }

  return data
}

export async function submitForReviewAction(articleId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('articles')
    .update({
      status: 'pending',
      updated_at: new Date().toISOString()
    })
    .eq('id', articleId)
    .eq('author_id', user.id)

  if (error) throw new Error('Failed to submit for review')
  return { success: true }
}

export async function publishArticleAction(articleId: string, categorySlug: string, slug: string) {
  const supabase = await createClient()

  // Enforce admin check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: dbUser } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (dbUser?.role !== 'admin') throw new Error('Only admins can publish articles')

  const { error } = await supabase
    .from('articles')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', articleId)

  if (error) throw new Error('Failed to publish article')

  // Revalidate routes to trigger static rebuild (ISR)
  revalidatePath('/')
  revalidatePath(`/${categorySlug}`)
  revalidatePath(`/${categorySlug}/${slug}`)
  revalidatePath('/search')

  return { success: true }
}

export async function rejectArticleAction(articleId: string, rejectionNote: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: dbUser } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (dbUser?.role !== 'admin') throw new Error('Only admins can reject articles')

  const { error } = await supabase
    .from('articles')
    .update({
      status: 'rejected',
      rejection_note: rejectionNote,
      updated_at: new Date().toISOString()
    })
    .eq('id', articleId)

  if (error) throw new Error('Failed to reject article')
  return { success: true }
}
