// E:\Projects\Works\Expliq\src\app\admin\page.tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { robots: { index: false, follow: false } }

import { createClient } from '@/lib/supabase/server'
import { publishArticleAction, rejectArticleAction } from '@/lib/actions/articles'
import { FileCheck, ShieldAlert, Award, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Server Action triggers inside the form
async function handlePublish(formData: FormData) {
  "use server"
  const id = formData.get('articleId') as string
  const category = formData.get('categorySlug') as string || 'ai-tools'
  const slug = formData.get('slug') as string || 'default-slug'
  
  try {
    await publishArticleAction(id, category, slug)
    revalidatePath('/admin')
  } catch {
    // silently fail — revalidatePath will show updated state
  }
}

async function handleReject(formData: FormData) {
  "use server"
  const id = formData.get('articleId') as string
  const note = formData.get('note') as string || 'Quality standards not met'

  try {
    await rejectArticleAction(id, note)
    revalidatePath('/admin')
  } catch {
    // silently fail — revalidatePath will show updated state
  }
}

export default async function AdminPanel() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: pendingArticles = [] } = await supabase
    .from('articles')
    .select('*, category_id(name, slug), author_id(name)')
    .eq('status', 'pending')

  const { data: payoutRequests = [] } = await supabase
    .from('payout_requests')
    .select('*, publisher_id(upi_id, tier)')
    .eq('status', 'pending')

  return (
    <div className="max-w-page-max-width mx-auto px-gutter py-12 space-y-10">
      <div>
        <h1 className="font-serif font-bold text-2xl md:text-3xl text-on-surface">Admin Control Console</h1>
        <p className="text-xs text-on-surface-variant">Review queue, elevate publisher tiers, and manage payouts.</p>
      </div>

      {/* Grid Sections */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left: Pending submissions list */}
        <div className="lg:col-span-2 space-y-5">
          <h3 className="font-serif font-bold text-lg text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
            <FileCheck size={18} className="text-primary" />
            <span>Pending Submissions ({(pendingArticles ?? []).length})</span>
          </h3>

          {(pendingArticles ?? []).length > 0 ? (
            <div className="space-y-4">
              {(pendingArticles ?? []).map((art) => (
                <div key={art.id} className="border border-outline-variant rounded-lg p-5 bg-surface-container-lowest space-y-4 shadow-sm">
                  <div className="flex justify-between items-center text-[10px] uppercase font-mono font-bold text-outline">
                    <span>{art.category_id?.name || 'AI Tools'}</span>
                    <span>By {art.author_id?.name || 'Publisher'}</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-on-surface">{art.title}</h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{art.excerpt}</p>

                  <div className="flex flex-wrap gap-2.5 pt-2 border-t border-outline-variant/30 justify-end">
                    {/* Reject form */}
                    <form action={handleReject} className="flex gap-2">
                      <input type="hidden" name="articleId" value={art.id} />
                      <input
                        type="text"
                        name="note"
                        placeholder="Rejection reason..."
                        required
                        className="text-xs bg-white border border-outline-variant rounded px-2.5 py-1 text-on-surface focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="border border-error text-error text-[10px] font-bold px-3 py-1.5 rounded hover:bg-error/5 transition-all"
                      >
                        Reject
                      </button>
                    </form>

                    {/* Publish form */}
                    <form action={handlePublish}>
                      <input type="hidden" name="articleId" value={art.id} />
                      <input type="hidden" name="categorySlug" value={art.category_id?.slug || 'ai-tools'} />
                      <input type="hidden" name="slug" value={art.slug} />
                      <button
                        type="submit"
                        className="bg-primary hover:bg-primary-container text-on-primary text-[10px] font-bold px-4 py-1.5 rounded transition-all shadow-sm"
                      >
                        Approve & Publish
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-outline-variant rounded-lg bg-surface-container-low text-xs text-on-surface-variant">
              <CheckCircle2 size={24} className="mx-auto text-outline-variant mb-2" />
              <span>Review queue is empty!</span>
            </div>
          )}
        </div>

        {/* Right: Payout request list */}
        <div className="space-y-5">
          <h3 className="font-serif font-bold text-lg text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
            <ShieldAlert size={18} className="text-secondary" />
            <span>Payout Queue ({(payoutRequests ?? []).length})</span>
          </h3>

          {(payoutRequests ?? []).length > 0 ? (
            <div className="space-y-3">
              {(payoutRequests ?? []).map((req) => (
                <div key={req.id} className="border border-outline-variant rounded-lg p-4 bg-surface-container-low space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-on-surface">
                    <span>{req.publisher || 'Author'}</span>
                    <span className="text-primary font-mono">₹{req.amount.toFixed(2)}</span>
                  </div>
                  <div className="text-on-surface-variant font-mono">UPI: {req.upi_id || req.publisher_id?.upi_id}</div>
                  
                  <div className="flex justify-end pt-2">
                    <button className="bg-on-surface hover:bg-on-surface-variant text-surface text-[10px] font-bold px-3 py-1 rounded transition-colors">
                      Mark Reconciled
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-outline-variant rounded-lg bg-surface-container-low text-xs text-on-surface-variant">
              <AlertCircle size={24} className="mx-auto text-outline-variant mb-2" />
              <span>No pending payout releases.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
