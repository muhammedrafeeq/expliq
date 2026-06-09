// E:\Projects\Works\Expliq\src\app\api\affiliate\click\route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const partner = searchParams.get('partner') || 'unknown'
  const articleId = searchParams.get('article')
  const url = searchParams.get('url')

  if (!url) {
    return new NextResponse('Missing redirect URL', { status: 400 })
  }

  try {
    const supabase = await createClient()

    // Insert tracking log
    await supabase.from('affiliate_clicks').insert({
      partner,
      article_id: articleId || null,
      clicked_at: new Date().toISOString()
    })
  } catch {
    // non-critical — redirect still happens
  }

  // Redirect to target URL
  return NextResponse.redirect(new URL(url))
}
