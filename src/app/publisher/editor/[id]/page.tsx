// E:\Projects\Works\Expliq\src\app\publisher\editor\[id]\page.tsx
import { createClient } from '@/lib/supabase/server'
import { Editor } from '@/components/editor/Editor'
import { Block, ArticleDocument } from '@/lib/types/blocks'
import { notFound } from 'next/navigation'

interface EditorPageProps {
  params: Promise<{ id: string }>
}

export default async function PublisherEditorPage({ params }: EditorPageProps) {
  const resolvedParams = await params
  const articleId = resolvedParams.id

  const supabase = await createClient()
  let initialDocument: ArticleDocument = {
    version: 1,
    blocks: [
      { id: crypto.randomUUID(), type: 'heading', level: 2, content: 'Starting My Tech Journey in India' },
      { id: crypto.randomUUID(), type: 'paragraph', content: 'Type your paragraphs here...' }
    ]
  }
  let initialTitle = 'Untitled Draft'
  let categorySlug = 'ai-tools'

  try {
    const { data: article } = await supabase
      .from('articles')
      .select('*, category_id(slug)')
      .eq('id', articleId)
      .single()

    if (article) {
      if (article.content) {
        initialDocument = article.content as ArticleDocument
      }
      initialTitle = article.title
      categorySlug = (article.category_id as any)?.slug || 'ai-tools'
    }
  } catch (err) {
    console.error('Draft not found or DB disconnected, using fallback editor setup:', err)
  }

  return (
    <div className="bg-background min-h-screen">
      <Editor
        articleId={articleId}
        initialDocument={initialDocument}
        initialTitle={initialTitle}
        categorySlug={categorySlug}
        authorRole="publisher"
      />
    </div>
  )
}
