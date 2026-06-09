// E:\Projects\Works\Expliq\src\lib\supabase\middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Get user auth session
  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // 2. Protect publisher and admin dashboards
  if (path.startsWith('/publisher') || path.startsWith('/admin')) {
    if (!user) {
      // Redirect to sign in page
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Fetch user's role from the public users table
    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const userRole = dbUser?.role || 'reader'

    if (path.startsWith('/admin') && userRole !== 'admin') {
      // Admin pages require admin role
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (path.startsWith('/publisher') && userRole !== 'publisher' && userRole !== 'admin') {
      // Publisher pages require publisher or admin role
      return NextResponse.redirect(new URL('/account', request.url))
    }
  }

  return supabaseResponse
}
