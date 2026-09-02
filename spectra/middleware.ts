import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = request.nextUrl

  if (pathname === '/') {
    return NextResponse.redirect(new URL(session ? '/dashboard' : '/login', request.url))
  }

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (pathname === '/login' || pathname === '/signup') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/', '/login', '/signup', '/dashboard/:path*', '/onboarding/:path*'],
}
