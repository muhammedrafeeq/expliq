// E:\Projects\Works\Expliq\src\app\publisher\page.tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { robots: { index: false, follow: false } }

import { createClient } from '@/lib/supabase/server'
import { createDraftAction } from '@/lib/actions/articles'
import { redirect } from 'next/navigation'
import { FileText, Plus, IndianRupee, Eye, Award, CheckCircle, RefreshCcw } from 'lucide-react'
import Link from 'next/link'

// Quick helper to auto-submit draft creation
async function handleCreateDraft() {
  "use server"
  const draft = await createDraftAction()
  redirect(`/publisher/editor/${draft.id}`)
}

export default async function PublisherDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('publisher_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const stats = {
    totalViews: 0,
    balance: Number(profile?.available_balance || 0),
    tier: profile ? profile.tier.charAt(0).toUpperCase() + profile.tier.slice(1) : 'Reader',
    commission: profile?.commission_pct ?? 0,
    qualityScore: Number(profile?.quality_score || 0),
  }

  const { data: articles = [] } = await supabase
    .from('articles')
    .select('*')
    .eq('author_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="max-w-page-max-width mx-auto px-gutter py-12 space-y-10">
      {/* Dashboard Welcome & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-on-surface">Publisher Console</h1>
          <p className="text-xs text-on-surface-variant">Write guides, monitor ad revenue shares, and request payouts.</p>
        </div>
        
        {/* Server Action trigger form for draft creation */}
        <form action={handleCreateDraft}>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Plus size={14} />
            <span>Write New Article</span>
          </button>
        </form>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-low border border-outline-variant p-5 rounded-lg space-y-2">
          <div className="flex justify-between text-outline">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Views</span>
            <Eye size={14} />
          </div>
          <div className="text-2xl font-bold font-mono text-on-surface">{stats.totalViews.toLocaleString()}</div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-5 rounded-lg space-y-2">
          <div className="flex justify-between text-outline">
            <span className="text-[10px] font-bold uppercase tracking-wider">Ad Balance</span>
            <IndianRupee size={14} />
          </div>
          <div className="text-2xl font-bold font-mono text-primary">₹{stats.balance.toFixed(2)}</div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-5 rounded-lg space-y-2">
          <div className="flex justify-between text-outline">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Tier</span>
            <Award size={14} />
          </div>
          <div className="text-xl font-bold text-secondary">{stats.tier} ({stats.commission}%)</div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-5 rounded-lg space-y-2">
          <div className="flex justify-between text-outline">
            <span className="text-[10px] font-bold uppercase tracking-wider">Quality Score</span>
            <CheckCircle size={14} />
          </div>
          <div className="text-2xl font-bold font-mono text-tertiary">{stats.qualityScore.toFixed(1)} / 5.0</div>
        </div>
      </div>

      {/* Drafts & Articles Manager */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-on-surface flex items-center gap-2">
          <FileText size={18} className="text-primary" />
          <span>Your Articles</span>
        </h3>

        <div className="border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest">
          <table className="min-w-full divide-y divide-outline-variant select-none">
            <thead className="bg-surface-container-high text-xs text-outline font-bold uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Views</th>
                <th className="px-6 py-3 text-right">Last Saved</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant bg-surface text-sm">
              {(articles ?? []).map((art) => (
                <tr key={art.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-bold text-on-surface line-clamp-1 max-w-xs">{art.title}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      art.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : art.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : art.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-zinc-150 text-zinc-600'
                    }`}>
                      {art.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-on-surface-variant">
                    {art.view_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-on-surface-variant">
                    {new Date(art.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/publisher/editor/${art.id}`}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Edit Workspace
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
